import React, { useState } from 'react';
import axios from 'axios';
import './SingleExtractor.css';

function SingleExtractor() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
      setResult(null);
    }
  };

  const handleExtract = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post('/api/extract-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      alert('Text copied to clipboard!');
    }
  };

  const handleDownloadText = () => {
    if (result?.text) {
      const element = document.createElement('a');
      const file = new Blob([result.text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'extracted-text.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="single-extractor">
      <div className="container">
        {!result ? (
          <>
            <div className="upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="image-input"
                  onChange={handleImageChange}
                  accept="image/*"
                  disabled={loading}
                />
                <label htmlFor="image-input" className="upload-label">
                  <span className="icon">📁</span>
                  <span className="text">
                    {image ? image.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="subtext">PNG, JPG, WEBP, TIFF up to 10MB</span>
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              {preview && (
                <div className="preview-section">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              )}

              <button
                className="extract-button"
                onClick={handleExtract}
                disabled={!image || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Extracting...
                  </>
                ) : (
                  '🚀 Extract Text'
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="result-section">
              <div className="result-header">
                <h2>✅ Extraction Complete</h2>
                <p className="file-info">File: {result.filename}</p>
              </div>

              <div className="text-result">
                <h3>Extracted Text:</h3>
                <div className="text-content">
                  <p>{result.text || 'No text found in the image'}</p>
                </div>

                {result.confidence && (
                  <div className="confidence">
                    Confidence: {(result.confidence * 100).toFixed(2)}%
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <button className="action-btn copy-btn" onClick={handleCopyText}>
                  📋 Copy Text
                </button>
                <button className="action-btn download-btn" onClick={handleDownloadText}>
                  ⬇️ Download
                </button>
                <button className="action-btn reset-btn" onClick={handleReset}>
                  🔄 New Image
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SingleExtractor;
