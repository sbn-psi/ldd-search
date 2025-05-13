import React from 'react';
import NestedClass from './NestedClass';
import { data } from '../data';

function AttributesPanel({
  selectedClasses,
  selectedAttributes,
  attributeValues,
  onClassSelect,
  onAttributeSelect,
  onValueChange
}) {
  return (
    <div className="attributes-panel">
      {Object.entries(data.classes)
        .filter(([className, classData]) => selectedClasses[className] && classData.element_flag === true)
        .map(([className, classData]) => (
          <div key={className} className="class-attributes">
            <h2>{className.replace(/_/g, ' ')}</h2>
            
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
                      onAttributeSelect(className, attrName);
                    }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        readOnly
                      />
                      <span className="attribute-name">{attrName.replace(/_/g, ' ')}</span>
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
                              onChange={(e) => onValueChange(className, attrName, value, e.target.checked)}
                            />
                            <span className="value-name">{value.replace(/_/g, ' ')}</span>
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
                  
                  {isSelected && !attrData.permissible_values && (
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
                level={1}
                selectedClasses={selectedClasses}
                selectedAttributes={selectedAttributes}
                attributeValues={attributeValues}
                onClassSelect={onClassSelect}
                onAttributeSelect={onAttributeSelect}
                onValueChange={onValueChange}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default AttributesPanel; 