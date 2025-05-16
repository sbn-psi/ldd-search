import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDisplayName } from '../utils/format';
import { data } from '../data';
import { rawContent } from '../raw-content';
import DataDescription from './DataDescription';

// Find all root classes (element_flag: true and selected)
function getRootClasses(selectedClasses) {
  return Object.entries(data.classes)
    .filter(([className, classData]) => classData.element_flag && selectedClasses[className])
    .map(([className]) => className);
}

function ReviewClass({ className, selectedClasses, selectedAttributes, attributeValues, level = 0 }) {
  const classData = data.classes[className];
  if (!classData) return null;
  if (!selectedClasses[className]) return null;

  // List selected attributes for this class
  const attrs = (classData.attributes || []).filter(
    attrName => selectedAttributes[`${className}.${attrName}`]
  );

  // List selected nested classes
  const nested = classData.nested_classes
    ? Object.keys(classData.nested_classes).filter(
        nestedClass => selectedClasses[nestedClass]
      )
    : [];

  return (
    <div style={{ marginLeft: level * 24, marginTop: 8 }}>
      <div style={{ fontStyle: 'italic', fontSize: '1.1em', marginBottom: 4 }}>
        {formatDisplayName(className)}
      </div>
      <div>
        {attrs.map(attrName => (
          <div key={attrName} style={{ marginBottom: 2 }}>
            <span style={{ fontWeight: 'bold' }}>{formatDisplayName(attrName)}:</span>{' '}
            <span>{formatAttributeValue(className, attrName, attributeValues)}</span>
          </div>
        ))}
      </div>
      {nested.map(nestedClass => (
        <ReviewClass
          key={nestedClass}
          className={nestedClass}
          selectedClasses={selectedClasses}
          selectedAttributes={selectedAttributes}
          attributeValues={attributeValues}
          level={level + 1}
        />
      ))}
    </div>
  );
}

function formatAttributeValue(className, attrName, attributeValues) {
  let val = attributeValues?.[`${className}.${attrName}`];
  if(Array.isArray(val)) {
    val = val.filter(v => v !== 'other').map(v => formatDisplayName(v)).join(', ');
  } else if (val) {
    val = formatDisplayName(val);
  }
  const other = attributeValues?.[`${className}.${attrName}.other`];
  if(val && other) {
    return `${val}, ${other}`;
  }
  return val || other || '';
}

const ReviewPage = ({
  selectedClasses,
  selectedAttributes,
  attributeValues,
  onBack,
  onReset,
  shareUrl
}) => {
  const rootClasses = getRootClasses(selectedClasses);

  return (
    <div className="review-page">
      <div className="review-content">
        <h2>Review Your Selections</h2>
        <div className="review-sections">
          {rootClasses.map(className => (
            <ReviewClass
              key={className}
              className={className}
              selectedClasses={selectedClasses}
              selectedAttributes={selectedAttributes}
              attributeValues={attributeValues}
            />
          ))}
        </div>
      </div>

      <DataDescription
        selectedClasses={selectedClasses}
        selectedAttributes={selectedAttributes}
        attributeValues={attributeValues}
      />

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
            onClick={e => e.target.select()}
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

export default ReviewPage; 