import React from 'react';
import { data } from '../data';
import { formatDisplayName } from '../utils/format';

const NestedClass = ({ 
  className, 
  classData, 
  level, 
  selectedClasses, 
  selectedAttributes, 
  attributeValues, 
  onClassSelect, 
  onAttributeSelect, 
  onValueChange 
}) => {
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

export default NestedClass; 