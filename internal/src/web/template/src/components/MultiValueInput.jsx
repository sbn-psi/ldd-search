import React, { useMemo, useState } from 'react';
import { formatDisplayName } from '../utils/format';

function normalizeValues(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value) {
    return [value];
  }
  return [];
}

function MultiValueInput({ className, attrName, attrData, value, onValueChange }) {
  const values = normalizeValues(value);
  const [draftValue, setDraftValue] = useState('');
  const examples = useMemo(() => Object.entries(attrData.examples || {}), [attrData.examples]);
  const selected = new Set(values);

  const updateValues = (nextValues) => {
    onValueChange(className, attrName, nextValues);
  };

  const addValue = (rawValue) => {
    const nextValue = rawValue.trim();
    if (!nextValue || selected.has(nextValue)) {
      return;
    }
    updateValues([...values, nextValue]);
    setDraftValue('');
  };

  const removeValue = (valueToRemove) => {
    updateValues(values.filter(item => item !== valueToRemove));
  };

  const toggleExample = (exampleValue, checked) => {
    if (checked) {
      addValue(exampleValue);
    } else {
      removeValue(exampleValue);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addValue(draftValue);
  };

  return (
    <div className="multi-value-input" onClick={event => event.stopPropagation()}>
      {values.length > 0 && (
        <div className="selected-values" aria-label={`${formatDisplayName(attrName)} selected values`}>
          {values.map(item => (
            <span key={item} className="selected-value">
              {formatDisplayName(item)}
              <button
                type="button"
                className="remove-value"
                onClick={() => removeValue(item)}
                aria-label={`Remove ${formatDisplayName(item)}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {examples.length > 0 && (
        <div className="example-values">
          {examples.map(([exampleValue, description]) => (
            <label key={exampleValue} className="value-option example-value">
              <input
                type="checkbox"
                checked={selected.has(exampleValue)}
                onChange={event => toggleExample(exampleValue, event.target.checked)}
              />
              <span className="value-name">{formatDisplayName(exampleValue)}</span>
              {description && <span className="value-description">{description}</span>}
            </label>
          ))}
        </div>
      )}

      <form className="custom-value-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draftValue}
          onChange={event => setDraftValue(event.target.value)}
          placeholder="Enter another value"
        />
        <button type="submit" disabled={!draftValue.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}

export default MultiValueInput;
