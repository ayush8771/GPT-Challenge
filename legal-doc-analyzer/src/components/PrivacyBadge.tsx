import React from 'react';
import './PrivacyBadge.css';

interface PrivacyBadgeProps {
  isProcessing?: boolean;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ isProcessing = false }) => {
  return (
    <div className={`privacy-badge ${isProcessing ? 'processing' : ''}`}>
      <div className="badge-icon">🔒</div>
      <div className="badge-content">
        <div className="badge-title">
          {isProcessing ? 'Processing locally on your device' : 'Your document never leaves your device'}
        </div>
        <div className="badge-subtitle">
          {isProcessing ? 'All analysis happens in your browser' : '100% private and offline'}
        </div>
      </div>
      {isProcessing && <div className="pulse-dot" />}
    </div>
  );
};
