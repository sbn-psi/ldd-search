import React, { useState } from 'react';
import './App.css';
import { data } from './data';

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

function App() {
  const [selectedClasses, setSelectedClasses] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [attributeValues, setAttributeValues] = useState({});
  const [currentClass, setCurrentClass] = useState(null);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDS Search LDD Form</h1>
      </header>
      
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
    </div>
  );
}

export default App; 