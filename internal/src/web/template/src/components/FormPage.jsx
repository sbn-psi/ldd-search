import React from 'react';
import ClassesPanel from './ClassesPanel';
import AttributesPanel from './AttributesPanel';

function FormPage({
  selectedClasses,
  selectedAttributes,
  attributeValues,
  onClassSelect,
  onAttributeSelect,
  onValueChange,
  data
}) {
  return (
    <div className="form-container">
      <ClassesPanel
        selectedClasses={selectedClasses}
        onClassSelect={onClassSelect}
        data={data}
      />
      <AttributesPanel
        selectedClasses={selectedClasses}
        selectedAttributes={selectedAttributes}
        attributeValues={attributeValues}
        onClassSelect={onClassSelect}
        onAttributeSelect={onAttributeSelect}
        onValueChange={onValueChange}
        data={data}
      />
    </div>
  );
}

export default FormPage; 