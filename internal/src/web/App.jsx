import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import mapping from './web_form_mapping.json';

import { data } from './data';
import { rawContent } from './raw-content';  // Import the raw content

// Get base URL from environment variable or default to current origin
const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;

const formatDisplayName = (name) => {
  return name.replace(/_/g, ' ');
};

// Recursive component to handle nested classes
const NestedClass = ({ className, classData, level, selectedClasses, selectedAttributes, attributeValues, onClassSelect, onAttributeSelect, onValueChange }) => {
  const isSelected = selectedClasses[className] || false;
  
  return (
    <div className={`class-item nested-class ${isSelected ? 'selected' : ''}`}>
      <div 
        className="class-header"
        onClick={(e) => {
          e.stopPropagation();
          onClassSelect(className);
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
          />
          <span className="class-name">{formatDisplayName(className)}</span>
          <span className="class-description">{classData.definition}</span>
        </label>
      </div>
      
      {isSelected && (
        <div className={`class-content level-${level}`}>
          {/* Display attributes */}
          {classData.attributes && classData.attributes.map(attrName => {
            const attrData = data.attributes[attrName];
            if (!attrData) return null;
            
            const isAttrSelected = selectedAttributes[`${className}.${attrName}`];
            
            return (
              <div key={attrName} className={`attribute-item ${isAttrSelected ? 'selected' : ''}`}>
                <div 
                  className="attribute-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAttributeSelect(className, attrName);
                  }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={isAttrSelected || false}
                      readOnly
                    />
                    <span className="attribute-name">{formatDisplayName(attrName)}</span>
                    <span className="attribute-description">{attrData.definition}</span>
                  </label>
                </div>
                
                {isAttrSelected && attrData.permissible_values && (
                  <div className="permissible-values">
                    {Object.entries(attrData.permissible_values)
                      .filter(([value, description]) => value.toLowerCase() !== "other")
                      .map(([value, description]) => {
                      const isChecked = attributeValues[`${className}.${attrName}`]?.includes(value) || false;
                      return (
                      <div key={value} className="value-option">
                        <label>
                          <input
                            type="checkbox"
                            name={`${className}.${attrName}`}
                            value={value}
                            checked={isChecked}
                            onChange={(e) => onValueChange(className, attrName, value, e.target.checked)}
                          />
                          <span className="value-name">{formatDisplayName(value)}</span>
                          <span className="value-description">{description}</span>
                        </label>
                      </div>
                    )})}
                    <div className="value-option">
                      <label>
                        <input
                          type="checkbox"
                          name={`${className}.${attrName}`}
                          value="other"
                          checked={attributeValues[`${className}.${attrName}`]?.includes("other") || false}
                          onChange={(e) => onValueChange(className, attrName, "other", e.target.checked)}
                        />
                        <span className="value-name">Other</span>
                        <input
                          type="text"
                          value={attributeValues[`${className}.${attrName}`]?.includes("other") ? (attributeValues[`${className}.${attrName}.other`] || "") : ""}
                          onChange={(e) => onValueChange(className, attrName, "other", true, e.target.value)}
                          disabled={!attributeValues[`${className}.${attrName}`]?.includes("other")}
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                {isAttrSelected && !attrData.permissible_values && (
                  <input
                    type="text"
                    value={attributeValues[`${className}.${attrName}`] || ""}
                    onChange={(e) => onValueChange(className, attrName, e.target.value)}
                    placeholder="Enter value"
                  />
                )}
              </div>
            );
          })}
          
          {/* Display nested classes */}
          {classData.nested_classes && Object.entries(classData.nested_classes).map(([nestedClassName, nestedClassData]) => (
            <NestedClass
              key={nestedClassName}
              className={nestedClassName}
              classData={data.classes[nestedClassName]}
              level={level + 1}
              selectedClasses={selectedClasses}
              selectedAttributes={selectedAttributes}
              attributeValues={attributeValues}
              onClassSelect={onClassSelect}
              onAttributeSelect={onAttributeSelect}
              onValueChange={onValueChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Bitfield helpers
function encodeBitfield(selectedSet, allList) {
  return allList.map(name => (selectedSet[name] ? '1' : '0')).join('');
}

function decodeBitfield(bitfield, allList) {
  const selected = {};
  for (let i = 0; i < bitfield.length; i++) {
    if (bitfield[i] === '1') selected[allList[i]] = true;
  }
  return selected;
}

function encodePermissibleBitfield(selectedArr, allValues) {
  return allValues.map(val => (selectedArr && selectedArr.includes(val) ? '1' : '0')).join('');
}

function decodePermissibleBitfield(bitfield, allValues) {
  const selected = [];
  for (let i = 0; i < bitfield.length; i++) {
    if (bitfield[i] === '1') selected.push(allValues[i]);
  }
  return selected;
}

// Compress the state data for QR code (bitfield version, index-based keys)
const compressState = (state) => {
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
const expandCompressedState = (compressed) => {
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
    } else if (permissible_values[attrName]) {
      attributeValues[key] = decodePermissibleBitfield(compressed.v[idxKey], permissible_values[attrName]);
    } else {
      attributeValues[key] = compressed.v[idxKey];
    }
  });
  return {
    selectedClasses,
    selectedAttributes,
    attributeValues
  };
};

// New ReviewPage component
const ReviewPage = ({ selectedClasses, selectedAttributes, attributeValues, onBack, onReset, shareUrl }) => {
  const getSelectedValues = (className, attrName) => {
    const values = attributeValues[`${className}.${attrName}`];
    if (Array.isArray(values)) {
      return values.map(v => {
        if (v === 'other') {
          return `Other: ${attributeValues[`${className}.${attrName}.other`] || ''}`;
        }
        return formatDisplayName(v);
      }).join(', ');
    }
    return values || '';
  };

  return (
    <div className="review-page">
      <div className="review-content">
        <h2>Review Your Selections</h2>
        <div className="review-sections">
          {Object.entries(selectedClasses)
            .filter(([_, isSelected]) => isSelected)
            .map(([className, _]) => {
              const classData = data.classes[className];
              return (
                <div key={className} className="review-section">
                  <h3>{formatDisplayName(className)}</h3>
                  {classData.attributes && classData.attributes
                    .filter(attrName => selectedAttributes[`${className}.${attrName}`])
                    .map(attrName => {
                      const attrData = data.attributes[attrName];
                      return (
                        <div key={attrName} className="review-item">
                          <strong>{formatDisplayName(attrName)}:</strong>{' '}
                          {getSelectedValues(className, attrName)}
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
      </div>

      <div className="qr-section">
        <h3>Share Your Selections</h3>
        <p>Scan this QR code to share your selections:</p>
        <div className="qr-code">
          <QRCodeSVG
            value={shareUrl}
            size={256}
            level="H"
            margin={4}
            imageSettings={{
              src: `data:image/png;base64,${rawContent}`,
              height: 45,
              width: 80,
              excavate: true,
            }}
          />
        </div>
        <p className="share-url">Or copy this URL:</p>
        <div className="url-container">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            onClick={(e) => e.target.select()}
            className="share-url-input"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert('URL copied to clipboard!');
            }}
            className="copy-button"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="review-actions">
        <button onClick={onBack}>Back to Form</button>
        <button onClick={onReset} className="reset-button">Reset Form</button>
      </div>
    </div>
  );
};

function App() {
  const [workflowState, setWorkflowState] = useState('form');
  const [selectedClasses, setSelectedClasses] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [attributeValues, setAttributeValues] = useState({});
  const [currentClass, setCurrentClass] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Load state from URL parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compressedParam = params.get('compressed');
    if (compressedParam) {
      try {
        const decompressed = decompressFromEncodedURIComponent(compressedParam);
        const compressed = JSON.parse(decompressed);
        const expanded = expandCompressedState(compressed);
        setSelectedClasses(expanded.selectedClasses);
        setSelectedAttributes(expanded.selectedAttributes);
        setAttributeValues(expanded.attributeValues);
        if (Object.keys(expanded.selectedClasses || {}).length > 0) {
          setWorkflowState('form');
        }
      } catch (error) {
        console.error('Error parsing compressed state from URL:', error);
        setLoadError('Failed to load saved state. Starting with empty form.');
      }
    }
  }, []);

  const handleClassSelect = (className) => {
    setSelectedClasses(prev => {
      const newState = {
        ...prev,
        [className]: !prev[className]
      };
      // If unchecking the current class, clear it
      if (className === currentClass && !newState[className]) {
        setCurrentClass(null);
      }
      return newState;
    });
    // Only set as current class if being checked
    if (!selectedClasses[className]) {
      setCurrentClass(className);
    }
  };

  const handleAttributeSelect = (className, attributeName) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [`${className}.${attributeName}`]: !prev[`${className}.${attributeName}`]
    }));
  };

  const handleValueChange = (className, attributeName, value, isChecked, otherValue) => {
    if (data.attributes[attributeName]?.permissible_values) {
      // For permissible values (checkboxes)
      setAttributeValues(prev => {
        const key = `${className}.${attributeName}`;
        let values = prev[key] || [];
        
        if (value === "other" && otherValue !== undefined) {
          // Handle "Other" text input
          return {
            ...prev,
            [`${key}.other`]: otherValue
          };
        }
        
        // Add or remove the value from the array
        if (isChecked) {
          if (!values.includes(value)) {
            values = [...values, value];
          }
        } else {
          values = values.filter(v => v !== value);
        }
        
        return {
          ...prev,
          [key]: values
        };
      });
    } else {
      // For text inputs (free text)
      setAttributeValues(prev => ({
        ...prev,
        [`${className}.${attributeName}`]: value
      }));
    }
  };

  const handleReview = () => {
    setWorkflowState('review');
  };

  const handleBack = () => {
    setWorkflowState('form');
  };

  const handleReset = () => {
    setSelectedClasses({});
    setSelectedAttributes({});
    setAttributeValues({});
    setCurrentClass(null);
    setWorkflowState('form');
  };

  // Function to prepare state for QR code and share URL (lz-string compressed, bitfield)
  const getCompressedShareUrl = () => {
    const compressed = compressState({
      selectedClasses,
      selectedAttributes,
      attributeValues
    });
    const compressedString = JSON.stringify(compressed);
    console.log(compressedString);
    const encoded = compressToEncodedURIComponent(compressedString);
    return `${BASE_URL}?compressed=${encoded}`;
  };

  const renderContent = () => {
    if (workflowState === 'review') {
      const shareUrl = getCompressedShareUrl();
      return (
        <ReviewPage
          selectedClasses={selectedClasses}
          selectedAttributes={selectedAttributes}
          attributeValues={attributeValues}
          onBack={handleBack}
          onReset={handleReset}
          shareUrl={shareUrl}
        />
      );
    }

    return (
      <div className="form-container">
        <div className="classes-panel">
          <h2>Classes</h2>
          {Object.entries(data.classes)
            .filter(([_, classData]) => classData.element_flag === true)
            .map(([className, classData]) => (
              <div key={className} className={`class-item ${selectedClasses[className] ? 'selected' : ''}`}>
                <div 
                  className="class-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClassSelect(className);
                  }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedClasses[className] || false}
                      readOnly
                    />
                    <span className="class-name">{formatDisplayName(className)}</span>
                    <span className="class-description">{classData.definition}</span>
                  </label>
                </div>
              </div>
            ))}
        </div>

        <div className="attributes-panel">
          {Object.entries(data.classes)
            .filter(([className, classData]) => selectedClasses[className] && classData.element_flag === true)
            .map(([className, classData]) => (
              <div key={className} className="class-attributes">
                <h2>{formatDisplayName(className)}</h2>
                
                {/* Display direct attributes */}
                {classData.attributes && classData.attributes.map(attrName => {
                  const attrData = data.attributes[attrName];
                  if (!attrData) return null;
                  
                  const isSelected = selectedAttributes[`${className}.${attrName}`];
                  
                  return (
                    <div key={attrName} className={`attribute-item ${isSelected ? 'selected' : ''}`}>
                      <div 
                        className="attribute-header"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAttributeSelect(className, attrName);
                        }}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={isSelected || false}
                            readOnly
                          />
                          <span className="attribute-name">{formatDisplayName(attrName)}</span>
                          <span className="attribute-description">{attrData.definition}</span>
                        </label>
                      </div>
                      
                      {isSelected && attrData.permissible_values && (
                        <div className="permissible-values">
                          {Object.entries(attrData.permissible_values)
                            .filter(([value, description]) => value.toLowerCase() !== "other")
                            .map(([value, description]) => {
                              const isChecked = attributeValues[`${className}.${attrName}`]?.includes(value) || false;
                              return (
                              <div key={value} className="value-option">
                              <label>
                                <input
                                  type="checkbox"
                                  name={`${className}.${attrName}`}
                                  value={value}
                                  checked={isChecked}
                                  onChange={(e) => handleValueChange(className, attrName, value, e.target.checked)}
                                />
                                <span className="value-name">{formatDisplayName(value)}</span>
                                <span className="value-description">{description}</span>
                              </label>
                            </div>
                          )})}
                          <div className="value-option">
                            <label>
                              <input
                                type="checkbox"
                                name={`${className}.${attrName}`}
                                value="other"
                                checked={attributeValues[`${className}.${attrName}`]?.includes("other") || false}
                                onChange={(e) => handleValueChange(className, attrName, "other", e.target.checked)}
                              />
                              <span className="value-name">Other</span>
                              <input
                                type="text"
                                value={attributeValues[`${className}.${attrName}`]?.includes("other") ? (attributeValues[`${className}.${attrName}.other`] || "") : ""}
                                onChange={(e) => handleValueChange(className, attrName, "other", true, e.target.value)}
                                disabled={!attributeValues[`${className}.${attrName}`]?.includes("other")}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {isSelected && !attrData.permissible_values && (
                        <input
                          type="text"
                          value={attributeValues[`${className}.${attrName}`] || ""}
                          onChange={(e) => handleValueChange(className, attrName, e.target.value)}
                          placeholder="Enter value"
                        />
                      )}
                    </div>
                  );
                })}
                
                {/* Display nested classes */}
                {classData.nested_classes && Object.entries(classData.nested_classes).map(([nestedClassName, nestedClassData]) => (
                  <NestedClass
                    key={nestedClassName}
                    className={nestedClassName}
                    classData={data.classes[nestedClassName]}
                    level={1}
                    selectedClasses={selectedClasses}
                    selectedAttributes={selectedAttributes}
                    attributeValues={attributeValues}
                    onClassSelect={handleClassSelect}
                    onAttributeSelect={handleAttributeSelect}
                    onValueChange={handleValueChange}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDS Findability Form</h1>
        <div className="workflow-navigation">
          <div className="workflow-status">
            {workflowState === 'form' ? 'Describe Your Data' : 'Review Your Selections'}
          </div>
          <div className="workflow-actions">
            {workflowState === 'form' ? (
              <button 
                onClick={handleReview}
                disabled={Object.keys(selectedClasses).length === 0}
                className="review-button"
              >
                Review Selections
              </button>
            ) : (
              <>
                <button onClick={handleBack} className="back-button">
                  Back to Form
                </button>
                <button onClick={handleReset} className="reset-button">
                  Reset Form
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="App-content">
        {loadError && (
          <div className="error-message">
            {loadError}
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default App; 