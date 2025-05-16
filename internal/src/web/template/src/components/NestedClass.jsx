import React, { useState, useEffect } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const [expandedAttributes, setExpandedAttributes] = useState(Object.fromEntries(Object.entries(selectedAttributes).map(([key, value]) => [key.substring(key.indexOf('.') + 1), value || false])));
  
  // Check if any child classes or attributes are selected
  const hasSelectedChildren = () => {
    // Check nested classes
    if (classData.nested_classes) {
      for (const nestedClassName of Object.keys(classData.nested_classes)) {
        if (selectedClasses[nestedClassName]) return true;
      }
    }
    
    // Check attributes
    if (classData.attributes) {
      for (const attrName of classData.attributes) {
        if (selectedAttributes[`${className}.${attrName}`]) return true;
      }
    }
    
    return false;
  };

  // Check if an attribute has any selected values
  const hasSelectedValues = (attrName) => {
    const values = attributeValues[`${className}.${attrName}`];
    if (Array.isArray(values)) {
      return values.length > 0;
    }
    return !!values;
  };

  // Update expanded state when selection changes
  useEffect(() => {
    if (isSelected) {
      setIsExpanded(true);
    }
  }, [isSelected]);

  const handleHeaderClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      if (hasSelectedChildren()) {
        // If has selected children, toggle expansion
        setIsExpanded(!isExpanded);
      } else {
        // If no selected children, unselect
        onClassSelect(className);
        setIsExpanded(false);
      }
    } else {
      // If not selected, select and expand
      onClassSelect(className);
      setIsExpanded(true);
    }
  };

  const handleAttributeHeaderClick = (attrName, e) => {
    e.stopPropagation();
    const isSelected = selectedAttributes[`${className}.${attrName}`];
    const hasValues = hasSelectedValues(attrName);
    
    if (isSelected) {
      if (hasValues) {
        // If has values, toggle expansion
        setExpandedAttributes(prev => ({
          ...prev,
          [attrName]: !prev[attrName]
        }));
      } else {
        // If no values, unselect
        onAttributeSelect(className, attrName);
        setExpandedAttributes(prev => ({
          ...prev,
          [attrName]: false
        }));
      }
    } else {
      // If not selected, select and expand
      onAttributeSelect(className, attrName);
      setExpandedAttributes(prev => ({
        ...prev,
        [attrName]: true
      }));
    }
  };
  
  return (
    <div className={`class-item nested-class ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="class-header" onClick={handleHeaderClick}>
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
      
      {isSelected && isExpanded && (
        <div className={`class-content level-${level}`}>
          {/* Display attributes */}
          {classData.attributes && classData.attributes.map(attrName => {
            const attrData = data.attributes[attrName];
            if (!attrData) return null;
            
            const isAttrSelected = selectedAttributes[`${className}.${attrName}`];
            const isAttrExpanded = expandedAttributes[attrName];
            const hasValues = hasSelectedValues(attrName);
            
            return (
              <div key={attrName} className={`attribute-item ${isAttrSelected ? 'selected' : ''} ${isAttrExpanded ? 'expanded' : ''}`}>
                <div 
                  className="attribute-header"
                  onClick={(e) => handleAttributeHeaderClick(attrName, e)}
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
                
                {isAttrSelected && isAttrExpanded && attrData.permissible_values && (
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
                
                {isAttrSelected && isAttrExpanded && !attrData.permissible_values && (
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