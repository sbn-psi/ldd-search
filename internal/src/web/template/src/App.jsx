import React, { useState, useEffect } from 'react';
import './App.css';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import mapping from './web_form_mapping.json';
import { data } from './data';
import { rawContent } from './raw-content';
import ReviewPage from './components/ReviewPage';
import FormPage from './components/FormPage';
import { compressState, expandCompressedState } from './utils/bitfield';

function App() {
  const [workflowState, setWorkflowState] = useState('form');
  const [selectedClasses, setSelectedClasses] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [attributeValues, setAttributeValues] = useState({});
  const [currentClass, setCurrentClass] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Load state from URL parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compressedParam = params.get('data');
    if (compressedParam) {
      try {
        const decompressed = decompressFromEncodedURIComponent(compressedParam);
        const compressed = JSON.parse(decompressed);
        const expanded = expandCompressedState(compressed, mapping);
        setSelectedClasses(expanded.selectedClasses);
        setSelectedAttributes(expanded.selectedAttributes);
        setAttributeValues(expanded.attributeValues);
        if (Object.keys(expanded.selectedClasses || {}).length > 0) {
          setWorkflowState('form');
        }
      } catch (error) {
        console.error('Error parsing compressed state from URL:', error);
        setLoadError('Failed to load saved state. Starting with empty form.');
      }
    }
  }, []);

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

  const handleValueChange = (className, attributeName, value, isChecked) => {
    const key = `${className}.${attributeName}`;
    if (data.attributes[attributeName]?.permissible_values) {
      // For permissible values (checkboxes)
      setAttributeValues(prev => {
        let values = prev[key] || [];
        
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
      // For free text and YAML example suggestions
      setAttributeValues(prev => ({
        ...prev,
        [key]: Array.isArray(value) ? value : (value ? [value] : [])
      }));
    }
  };

  const handleReview = () => {
    setWorkflowState('review');
  };

  const handleBack = () => {
    setWorkflowState('form');
  };

  const handleReset = () => {
    setSelectedClasses({});
    setSelectedAttributes({});
    setAttributeValues({});
    setCurrentClass(null);
    setWorkflowState('form');
  };

  // Function to prepare state for QR code and share URL (lz-string compressed, bitfield)
  const getCompressedShareUrl = () => {
    const compressed = compressState({
      selectedClasses,
      selectedAttributes,
      attributeValues
    }, mapping);
    const compressedString = JSON.stringify(compressed);
    const encoded = compressToEncodedURIComponent(compressedString);
    const params = new URLSearchParams(window.location.search);
    params.set('data', encoded);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const renderContent = () => {
    if (workflowState === 'review') {
      const shareUrl = getCompressedShareUrl();
      return (
        <ReviewPage
          selectedClasses={selectedClasses}
          selectedAttributes={selectedAttributes}
          attributeValues={attributeValues}
          onBack={handleBack}
          onReset={handleReset}
          shareUrl={shareUrl}
        />
      );
    }

    return (
      <FormPage
        selectedClasses={selectedClasses}
        selectedAttributes={selectedAttributes}
        attributeValues={attributeValues}
        onClassSelect={handleClassSelect}
        onAttributeSelect={handleAttributeSelect}
        onValueChange={handleValueChange}
      />
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDS Findability Form</h1>
        <div className="workflow-navigation">
          <div className="workflow-status">
            {workflowState === 'form' ? 'Describe Your Data' : 'Review Your Selections'}
          </div>
          <div className="workflow-actions">
            {workflowState === 'form' ? (
              <button 
                onClick={handleReview}
                disabled={Object.keys(selectedClasses).length === 0}
                className="review-button"
              >
                Review Selections
              </button>
            ) : (
              <>
                <button onClick={handleBack} className="back-button">
                  Back to Form
                </button>
                <button onClick={handleReset} className="reset-button">
                  Reset Form
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="App-content">
        {loadError && (
          <div className="error-message">
            {loadError}
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
