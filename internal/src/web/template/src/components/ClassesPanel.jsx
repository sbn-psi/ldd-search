import React from 'react';
import { data } from '../data';
import { formatDisplayName } from '../utils/format';

function ClassesPanel({ selectedClasses, onClassSelect }) {
  return (
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
                onClassSelect(className);
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
  );
}

export default ClassesPanel;
