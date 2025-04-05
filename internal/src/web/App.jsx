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
    <div className={`class-item nested-class`}>
      <label className={`class-header`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onClassSelect(className)}
        />
        <span className="class-name">{formatDisplayName(className)}</span>
        <span className="class-description">{classData.definition}</span>
      </label>
      
      {isSelected && (
        <div className={`class-content level-${level}`}>
          {/* Display attributes */}
          {classData.attributes && classData.attributes.map(attrName => {
            const attrData = data.attributes[attrName];
            if (!attrData) return null;
            
            const isAttrSelected = selectedAttributes[`${className}.${attrName}`];
            
            return (
              <div key={attrName} className="attribute-item">
                <div className="attribute-header">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAttrSelected || false}
                      onChange={() => onAttributeSelect(className, attrName)}
                    />
                    <span className="attribute-name">{formatDisplayName(attrName)}</span>
                    <span className="attribute-description">{attrData.definition}</span>
                  </label>
                </div>
                
                {isAttrSelected && attrData.permissible_values && (
                  <div className="permissible-values">
                    {Object.entries(attrData.permissible_values).map(([value, description]) => (
                      <div key={value} className="value-option">
                        <label>
                          <input
                            type="radio"
                            name={`${className}.${attrName}`}
                            value={value}
                            checked={attributeValues[`${className}.${attrName}`] === value}
                            onChange={(e) => onValueChange(className, attrName, e.target.value)}
                          />
                          <span className="value-name">{formatDisplayName(value)}</span>
                          <span className="value-description">{description}</span>
                        </label>
                      </div>
                    ))}
                    <div className="other-option">
                      <label>
                        <input
                          type="radio"
                          name={`${className}.${attrName}`}
                          value="other"
                          checked={attributeValues[`${className}.${attrName}`] === "other"}
                          onChange={(e) => onValueChange(className, attrName, e.target.value)}
                        />
                        Other:
                      </label>
                      <input
                        type="text"
                        value={attributeValues[`${className}.${attrName}`] === "other" ? "" : attributeValues[`${className}.${attrName}`] || ""}
                        onChange={(e) => onValueChange(className, attrName, e.target.value)}
                        disabled={attributeValues[`${className}.${attrName}`] !== "other"}
                      />
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

  const handleValueChange = (className, attributeName, value) => {
    setAttributeValues(prev => ({
      ...prev,
      [`${className}.${attributeName}`]: value
    }));
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
              <div key={className} className="class-item">
                <div className="class-header">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedClasses[className] || false}
                      onChange={() => handleClassSelect(className)}
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
                    <div key={attrName} className="attribute-item">
                      <div className="attribute-header">
                        <label>
                          <input
                            type="checkbox"
                            checked={isSelected || false}
                            onChange={() => handleAttributeSelect(className, attrName)}
                          />
                          <span className="attribute-name">{formatDisplayName(attrName)}</span>
                          <span className="attribute-description">{attrData.definition}</span>
                        </label>
                      </div>
                      
                      {isSelected && attrData.permissible_values && (
                        <div className="permissible-values">
                          {Object.entries(attrData.permissible_values).map(([value, description]) => (
                            <div key={value} className="value-option">
                              <label>
                                <input
                                  type="radio"
                                  name={`${className}.${attrName}`}
                                  value={value}
                                  checked={attributeValues[`${className}.${attrName}`] === value}
                                  onChange={(e) => handleValueChange(className, attrName, e.target.value)}
                                />
                                <span className="value-name">{formatDisplayName(value)}</span>
                                <span className="value-description">{description}</span>
                              </label>
                            </div>
                          ))}
                          <div className="other-option">
                            <label>
                              <input
                                type="radio"
                                name={`${className}.${attrName}`}
                                value="other"
                                checked={attributeValues[`${className}.${attrName}`] === "other"}
                                onChange={(e) => handleValueChange(className, attrName, e.target.value)}
                              />
                              Other:
                            </label>
                            <input
                              type="text"
                              value={attributeValues[`${className}.${attrName}`] === "other" ? "" : attributeValues[`${className}.${attrName}`] || ""}
                              onChange={(e) => handleValueChange(className, attrName, e.target.value)}
                              disabled={attributeValues[`${className}.${attrName}`] !== "other"}
                            />
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