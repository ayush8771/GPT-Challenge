import React from 'react';
import './Summary.css';

interface SummaryProps {
  summary: string;
}

export const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="summary-section">
      <h2 className="section-title">Plain Language Summary</h2>
      <div className="summary-content">
        <p>{summary}</p>
      </div>
    </div>
  );
};
