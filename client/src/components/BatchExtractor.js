import React, { useState } from 'react';
import axios from 'axios';
import './BatchExtractor.css';

function BatchExtractor() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      setError('Some files are not valid images and were skipped');
    }

    setImages(validFiles);
    
    // Generate previews
    const newPreviews = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({ name: file.name, preview: reader.result });
        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    setError(null);
    setResults(null);
  };

  const handleExtractBatch = async () => {
    if (images.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post('/api/extract-text-batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = () => {
    if (!results) return;

    const allText = results.data
      .map((result) => `--- ${result.filename} ---\n${result.text || '[No text found]'}\n`)
      .join('\n');

    const element = document.createElement('a');
    const file = new Blob([allText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'batch-extracted-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setImages([]);
    setPreviews([]);
    setResults(null);
    setError(null);
  };

  return (
    <div className="batch-extractor">
      <div className="container">
        {!results ? (
          <>
            <div className="upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="batch-input"
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                  disabled={loading}
                />
                <label htmlFor="batch-input" className="upload-label">
                  <span className="icon">📁</span>
                  <span className="text">
                    {images.length > 0
                      ? `${images.length} image${images.length !== 1 ? 's' : ''} selected`
                      : 'Click to upload or drag and drop multiple images'}
                  </span>
                  <span className="subtext">PNG, JPG, WEBP, TIFF - Max 10 images</span>
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              {previews.length > 0 && (
                <div className="previews-grid">
                  {previews.map((item, index) => (
                    <div key={index} className="preview-item">
                      <img src={item.preview} alt={item.name} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="extract-button"
                onClick={handleExtractBatch}
                disabled={images.length === 0 || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  '🚀 Extract All'
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="result-section">
              <div className="result-header">
                <h2>✅ Batch Processing Complete</h2>
                <div className="summary">
                  <div className="summary-item">
                    <span className="label">Total:</span>
                    <span className="value">{results.summary.total}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Successful:</span>
                    <span className="value success">{results.summary.successful}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Failed:</span>
                    <span className="value error">{results.summary.failed}</span>
                  </div>
                </div>
              </div>

              <div className="results-list">
                {results.data.map((result, index) => (
                  <div key={index} className={`result-item ${result.success ? 'success' : 'failed'}`}>
                    <div className="result-title">
                      <span className="icon">{result.success ? '✅' : '❌'}</span>
                      <span className="filename">{result.filename}</span>
                      {result.success && result.confidence && (
                        <span className="confidence">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {result.success ? (
                      <div className="text-content">
                        <p>{result.text || 'No text found'}</p>
                      </div>
                    ) : (
                      <div className="error-content">
                        <p>{result.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button className="action-btn download-btn" onClick={handleDownloadAll}>
                  ⬇️ Download All
                </button>
                <button className="action-btn reset-btn" onClick={handleReset}>
                  🔄 New Batch
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BatchExtractor;
