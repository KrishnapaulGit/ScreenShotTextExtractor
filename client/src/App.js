import React, { useState } from 'react';
import './App.css';
import SingleExtractor from './components/SingleExtractor';
import BatchExtractor from './components/BatchExtractor';

function App() {
  const [activeTab, setActiveTab] = useState('single');

  return (
    <div className="App">
      <header className="header">
        <h1>📸 Screenshot Text Extractor</h1>
        <p>Extract text from images using advanced OCR technology</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          Single Image
        </button>
        <button
          className={`tab-button ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => setActiveTab('batch')}
        >
          Batch Upload
        </button>
      </div>

      <div className="content">
        {activeTab === 'single' && <SingleExtractor />}
        {activeTab === 'batch' && <BatchExtractor />}
      </div>

      <footer className="footer">
        <p>© 2026 Screenshot Text Extractor - All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
