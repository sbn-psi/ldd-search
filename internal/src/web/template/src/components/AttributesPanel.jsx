import React, { useEffect, useRef, useState } from 'react';
import NestedClass from './NestedClass';
import MultiValueInput from './MultiValueInput';
import { data } from '../data';
import { formatDisplayName } from '../utils/format';

function AttributesPanel({
  selectedClasses,
  selectedAttributes,
  attributeValues,
  onClassSelect,
  onAttributeSelect,
  onValueChange
}) {
  const classRefs = useRef({});
  const [lastAddedClass, setLastAddedClass] = useState(null);
  const prevSelectedClasses = useRef(selectedClasses);
  const [expandedAttributes, setExpandedAttributes] = useState(selectedAttributes);

  // Track newly added classes and scroll to them
  useEffect(() => {
    const newClasses = Object.entries(selectedClasses)
      .filter(([className, isSelected]) => 
        isSelected && !prevSelectedClasses.current[className]
      );

    if (newClasses.length > 0) {
      const [className] = newClasses[0];
      setLastAddedClass(className);
      
      const element = classRefs.current[className];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    prevSelectedClasses.current = selectedClasses;
  }, [selectedClasses]);

  useEffect(() => {
    if(Object.keys(expandedAttributes).length === 0) {
      setExpandedAttributes(selectedAttributes);
    }
  }, [selectedAttributes]);

  // Check if an attribute has any selected values
  const hasSelectedValues = (className, attrName) => {
    const values = attributeValues[`${className}.${attrName}`];
    if (Array.isArray(values)) {
      return values.length > 0;
    }
    return !!values;
  };

  const handleAttributeHeaderClick = (className, attrName, e) => {
    e.stopPropagation();
    const isSelected = selectedAttributes[`${className}.${attrName}`];
    const hasValues = hasSelectedValues(className, attrName);
    
    if (isSelected) {
      if (hasValues) {
        // If has values, toggle expansion
        setExpandedAttributes(prev => ({
          ...prev,
          [`${className}.${attrName}`]: !prev[`${className}.${attrName}`]
        }));
      } else {
        // If no values, unselect
        onAttributeSelect(className, attrName);
        setExpandedAttributes(prev => ({
          ...prev,
          [`${className}.${attrName}`]: false
        }));
      }
    } else {
      // If not selected, select and expand
      onAttributeSelect(className, attrName);
      setExpandedAttributes(prev => ({
        ...prev,
        [`${className}.${attrName}`]: true
      }));
    }
  };

  const handleAttributeChange = (className, attrName, e) => {
    e.stopPropagation();
    onAttributeSelect(className, attrName);
    if (e.target.checked) {
      setExpandedAttributes(prev => ({
        ...prev,
        [`${className}.${attrName}`]: true
      }));
    }
  };

  return (
    <div className="attributes-panel">
      {Object.entries(data.classes)
        .filter(([className, classData]) => selectedClasses[className] && classData.element_flag === true)
        .map(([className, classData]) => (
          <div 
            key={className} 
            className="class-attributes"
            ref={el => classRefs.current[className] = el}
          >
            <h2>{formatDisplayName(className)}</h2>
            
            {/* Display direct attributes */}
            {classData.attributes && classData.attributes.map(attrName => {
              const attrData = data.attributes[attrName];
              if (!attrData) return null;
              
              const isSelected = selectedAttributes[`${className}.${attrName}`];
              const isExpanded = expandedAttributes[`${className}.${attrName}`];
              const hasValues = hasSelectedValues(className, attrName);
              
              return (
                <div key={attrName} className={`attribute-item ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}>
                  <div 
                    className="attribute-header"
                    onClick={(e) => handleAttributeHeaderClick(className, attrName, e)}
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
                  
                  {isSelected && isExpanded && attrData.permissible_values && (
                    <div className="permissible-values">
                      {Object.entries(attrData.permissible_values)
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
                    </div>
                  )}
                  
                  {isSelected && isExpanded && !attrData.permissible_values && (
                    <MultiValueInput
                      className={className}
                      attrName={attrName}
                      attrData={attrData}
                      value={attributeValues[`${className}.${attrName}`]}
                      onValueChange={onValueChange}
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
