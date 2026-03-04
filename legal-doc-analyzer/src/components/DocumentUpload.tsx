import React, { useState } from 'react';
import { extractTextFromPDF, isPDF } from '../utils/pdfExtractor';
import './DocumentUpload.css';

interface DocumentUploadProps {
  onDocumentLoaded: (text: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentLoaded }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      if (!isPDF(file)) {
        throw new Error('Please upload a PDF file');
      }

      const text = await extractTextFromPDF(file);
      
      if (!text || text.trim().length < 100) {
        throw new Error('Could not extract enough text from PDF. Please try a different file.');
      }

      onDocumentLoaded(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
      console.error('PDF processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (pastedText.trim().length < 100) {
      setError('Please paste at least 100 characters of text');
      return;
    }

    setError(null);
    onDocumentLoaded(pastedText);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      if (!isPDF(file)) {
        throw new Error('Please upload a PDF file');
      }

      const text = await extractTextFromPDF(file);
      
      if (!text || text.trim().length < 100) {
        throw new Error('Could not extract enough text from PDF. Please try a different file.');
      }

      onDocumentLoaded(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="document-upload">
      <div className="upload-tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload PDF
        </button>
        <button
          className={`tab ${activeTab === 'paste' ? 'active' : ''}`}
          onClick={() => setActiveTab('paste')}
        >
          Paste Text
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div
          className="upload-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="upload-label">
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                <p>Processing PDF...</p>
              </>
            ) : (
              <>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="upload-title">Drop your PDF here or click to browse</p>
                <p className="upload-subtitle">Contracts, NDAs, rental agreements, terms of service</p>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="paste-area">
          <textarea
            className="paste-textarea"
            placeholder="Paste the text of your legal document here..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={15}
          />
          <button
            className="submit-btn"
            onClick={handleTextSubmit}
            disabled={pastedText.trim().length < 100}
          >
            Analyze Document
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};
