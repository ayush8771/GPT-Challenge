import React from 'react';
import type { DocumentAnalysis } from '../types';
import './RiskDashboard.css';

interface RiskDashboardProps {
  analysis: DocumentAnalysis;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({ analysis }) => {
  const getRiskColor = (score: number) => {
    if (score >= 7) return 'var(--risk-high)';
    if (score >= 4) return 'var(--risk-medium)';
    return 'var(--risk-low)';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 7) return 'High Risk';
    if (score >= 4) return 'Moderate Risk';
    return 'Low Risk';
  };

  return (
    <div className="risk-dashboard">
      <h2 className="dashboard-title">Risk Assessment</h2>
      
      <div className="risk-score-container">
        <div className="risk-score-circle" style={{ borderColor: getRiskColor(analysis.riskScore) }}>
          <div className="risk-score-value" style={{ color: getRiskColor(analysis.riskScore) }}>
            {analysis.riskScore}
          </div>
          <div className="risk-score-max">/10</div>
        </div>
        <div className="risk-label" style={{ color: getRiskColor(analysis.riskScore) }}>
          {getRiskLabel(analysis.riskScore)}
        </div>
      </div>

      <div className="risk-breakdown">
        <div className="breakdown-item">
          <div className="breakdown-bar">
            <div 
              className="breakdown-fill risky" 
              style={{ width: `${(analysis.riskyCount / (analysis.riskyCount + analysis.safeCount)) * 100}%` }}
            />
          </div>
          <div className="breakdown-label">
            <span className="breakdown-count">{analysis.riskyCount}</span>
            <span className="breakdown-text">Risky Sections</span>
          </div>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-bar">
            <div 
              className="breakdown-fill safe" 
              style={{ width: `${(analysis.safeCount / (analysis.riskyCount + analysis.safeCount)) * 100}%` }}
            />
          </div>
          <div className="breakdown-label">
            <span className="breakdown-count">{analysis.safeCount}</span>
            <span className="breakdown-text">Standard Sections</span>
          </div>
        </div>
      </div>

      <div className="risk-summary">
        <p className="risk-summary-text">
          This document contains <strong>{analysis.redFlags.length} identified risks</strong>.
          Review the red flags below for detailed analysis.
        </p>
      </div>
    </div>
  );
};
