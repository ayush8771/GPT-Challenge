import React from 'react';
import type { ModelState } from '../types';
import './LoadingScreen.css';

interface LoadingScreenProps {
  modelState: ModelState;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ modelState }) => {
  const { downloadProgress, error } = modelState;

  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-card error">
          <div className="error-icon">❌</div>
          <h2>Initialization Failed</h2>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="lock-icon">🔒</div>
        <h1 className="loading-title">Private Legal Document Analyzer</h1>
        <p className="loading-subtitle">
          Loading on-device AI model...
        </p>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <div className="progress-text">{downloadProgress}%</div>
        </div>

        <div className="privacy-features">
          <div className="feature">
            <span className="feature-icon">✓</span>
            <span>Completely offline after download</span>
          </div>
          <div className="feature">
            <span className="feature-icon">✓</span>
            <span>No data sent to servers</span>
          </div>
          <div className="feature">
            <span className="feature-icon">✓</span>
            <span>Processing happens in your browser</span>
          </div>
        </div>

        {downloadProgress > 0 && downloadProgress < 100 && (
          <p className="download-note">
            Downloading model (first time only, ~30-50MB)...
          </p>
        )}
      </div>
    </div>
  );
};
