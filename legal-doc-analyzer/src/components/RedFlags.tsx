import React from 'react';
import type { RedFlag, RiskLevel } from '../types';
import './RedFlags.css';

interface RedFlagsProps {
  redFlags: RedFlag[];
}

export const RedFlags: React.FC<RedFlagsProps> = ({ redFlags }) => {
  const getRiskEmoji = (severity: RiskLevel) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  const getRiskColor = (severity: RiskLevel) => {
    switch (severity) {
      case 'high': return 'var(--risk-high)';
      case 'medium': return 'var(--risk-medium)';
      case 'low': return 'var(--risk-low)';
    }
  };

  const getSeverityLabel = (severity: RiskLevel) => {
    switch (severity) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Standard';
    }
  };

  return (
    <div className="red-flags-section">
      <h2 className="section-title">Red Flags & Concerns</h2>
      
      {redFlags.length === 0 ? (
        <div className="no-flags">
          <p>✅ No significant red flags detected in this document.</p>
        </div>
      ) : (
        <div className="flags-list">
          {redFlags.map((flag) => (
            <div key={flag.id} className="flag-card" style={{ borderLeftColor: getRiskColor(flag.severity) }}>
              <div className="flag-header">
                <div className="flag-severity">
                  <span className="flag-emoji">{getRiskEmoji(flag.severity)}</span>
                  <span className="flag-severity-label" style={{ color: getRiskColor(flag.severity) }}>
                    {getSeverityLabel(flag.severity)}
                  </span>
                </div>
                <span className="flag-category">{flag.category}</span>
              </div>
              
              <div className="flag-text">
                "{flag.text}"
              </div>
              
              <div className="flag-explanation">
                <strong>Why this matters:</strong> {flag.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
