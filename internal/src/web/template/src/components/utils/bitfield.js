// Bitfield helpers
export function encodeBitfield(selectedSet, allList) {
  return allList.map(name => (selectedSet[name] ? '1' : '0')).join('');
}

export function decodeBitfield(bitfield, allList) {
  const selected = {};
  for (let i = 0; i < bitfield.length; i++) {
    if (bitfield[i] === '1') selected[allList[i]] = true;
  }
  return selected;
}

export function encodePermissibleBitfield(selectedArr, allValues) {
  return allValues.map(val => (selectedArr && selectedArr.includes(val) ? '1' : '0')).join('');
}

export function decodePermissibleBitfield(bitfield, allValues) {
  const selected = [];
  for (let i = 0; i < bitfield.length; i++) {
    if (bitfield[i] === '1') selected.push(allValues[i]);
  }
  return selected;
}

// Compress the state data for QR code (bitfield version, index-based keys)
export const compressState = (state, mapping) => {
  const { classes, attributes, permissible_values, version } = mapping;
  // Classes as bitfield
  const c = encodeBitfield(state.selectedClasses, classes);
  // Attributes as bitfield: if any class has this attribute selected, set bit to 1
  const a = attributes.map(attrName => {
    return Object.keys(state.selectedAttributes).some(
      k => k.endsWith(`.${attrName}`) && state.selectedAttributes[k]
    ) ? '1' : '0';
  }).join('');
  // Permissible values and free text, use index-based keys
  const v = {};
  // For each selected class and attribute, store values by index
  classes.forEach((className, cIdx) => {
    attributes.forEach((attrName, aIdx) => {
      const key = `${className}.${attrName}`;
      const idxKey = `${cIdx}.${aIdx}`;
      const arr = state.attributeValues[key];
      if (arr !== undefined && arr !== null && arr !== '') {
        if (permissible_values[attrName]) {
          v[idxKey] = encodePermissibleBitfield(arr, permissible_values[attrName]);
          // If 'other' is selected, store the text as well
          if (arr.includes('other')) {
            const otherText = state.attributeValues[`${key}.other`];
            if (otherText) {
              v[`${idxKey}.other`] = otherText;
            }
          }
        } else {
          // Free text
          v[idxKey] = arr;
        }
      }
    });
  });
  return {
    v,
    c,
    a,
    ver: version
  };
};

// Expand compressed state back to full state (bitfield version, index-based keys)
export const expandCompressedState = (compressed, mapping) => {
  const { classes, attributes, permissible_values } = mapping;
  // Classes from bitfield (all, including nested)
  const selectedClasses = decodeBitfield(compressed.c, classes);
  // Attributes: for each selected class, for each attribute, if bit is set, set selectedAttributes[Class.Attribute]
  const attrBits = compressed.a;
  const selectedAttributes = {};
  const attrBitArr = attrBits.split('');
  for (let aIdx = 0; aIdx < attrBitArr.length; aIdx++) {
    if (attrBitArr[aIdx] === '1') {
      const attrName = attributes[aIdx];
      Object.keys(selectedClasses).forEach(className => {
        selectedAttributes[`${className}.${attrName}`] = true;
      });
    }
  }
  // Attribute values
  const attributeValues = {};
  Object.keys(compressed.v).forEach(idxKey => {
    const match = idxKey.match(/^(\d+)\.(\d+)(\.other)?$/);
    if (!match) return;
    const cIdx = parseInt(match[1], 10);
    const aIdx = parseInt(match[2], 10);
    const isOther = match[3] === '.other';
    const className = classes[cIdx];
    const attrName = attributes[aIdx];
    const key = `${className}.${attrName}`;
    if (isOther) {
      attributeValues[`${key}.other`] = compressed.v[idxKey];
      // Also ensure 'other' is included in the array for this attribute if not already
      if (Array.isArray(attributeValues[key])) {
        if (!attributeValues[key].includes('other')) {
          attributeValues[key].push('other');
        }
      } else if (attributeValues[key]) {
        attributeValues[key] = [attributeValues[key], 'other'];
      } else {
        attributeValues[key] = ['other'];
      }
    } else {
      const value = compressed.v[idxKey];
      if (permissible_values[attrName]) {
        attributeValues[key] = decodePermissibleBitfield(value, permissible_values[attrName]);
      } else {
        attributeValues[key] = value;
      }
    }
  });
  return {
    selectedClasses,
    selectedAttributes,
    attributeValues
  };
}; 