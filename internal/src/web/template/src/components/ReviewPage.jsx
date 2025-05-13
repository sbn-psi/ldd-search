import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDisplayName } from '../utils/format';
import { data } from '../data';
import { rawContent } from '../raw-content';

const ReviewPage = ({ 
  selectedClasses, 
  selectedAttributes, 
  attributeValues, 
  onBack, 
  onReset, 
  shareUrl 
}) => {
  const getSelectedValues = (className, attrName) => {
    const values = attributeValues[`${className}.${attrName}`];
    if (!values) return null;
    
    if (Array.isArray(values)) {
      return values.map(value => {
        if (value === 'other') {
          const otherText = attributeValues[`${className}.${attrName}.other`];
          return otherText ? `Other: ${otherText}` : 'Other';
        }
        return formatDisplayName(value);
      }).join(', ');
    }
    
    return values;
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

export default ReviewPage; 