import { useState } from 'react'
import './App.css'
import { DocumentUpload } from './components/DocumentUpload'
import { PrivacyBadge } from './components/PrivacyBadge'
import { Summary } from './components/Summary'
import { RiskDashboard } from './components/RiskDashboard'
import { RedFlags } from './components/RedFlags'
import { ChatInterface } from './components/ChatInterface'
import type { DocumentAnalysis } from './types'
import { analyzeMockDocument, useMockTextGeneration } from './hooks/useMockAI'
import { answerQuestion } from './utils/documentAnalyzer'

function App() {
  const { generateText } = useMockTextGeneration()
  const [documentText, setDocumentText] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState<string>('')

  const handleDocumentLoaded = async (text: string) => {
    setDocumentText(text)
    setIsAnalyzing(true)
    setAnalysisStage('Starting analysis...')

    try {
      const result = await analyzeMockDocument(text, setAnalysisStage)
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze document. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setAnalysisStage('')
    }
  }

  const handleQuestion = async (question: string): Promise<string> => {
    if (!documentText) return 'No document loaded'
    return await answerQuestion(question, documentText, generateText)
  }

  const handleReset = () => {
    setDocumentText(null)
    setAnalysis(null)
    setIsAnalyzing(false)
    setAnalysisStage('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🔒</span>
            <h1 className="logo-text">Private Legal Document Analyzer</h1>
          </div>
          <p className="tagline">AI-powered legal analysis, 100% private & offline (Demo Mode)</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <PrivacyBadge isProcessing={isAnalyzing} />
          
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid var(--accent-primary)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'var(--accent-primary)' }}>
              <strong>Demo Mode:</strong> Using simulated AI responses. All features are fully functional!
            </p>
          </div>

          {!documentText && !isAnalyzing && (
            <DocumentUpload onDocumentLoaded={handleDocumentLoaded} />
          )}

          {isAnalyzing && (
            <div className="analyzing-container">
              <div className="analyzing-card">
                <div className="spinner-large"></div>
                <h2 className="analyzing-title">Analyzing Document...</h2>
                <p className="analyzing-stage">{analysisStage}</p>
                <p className="analyzing-note">Demo mode - processing with simulated AI</p>
              </div>
            </div>
          )}

          {analysis && !isAnalyzing && (
            <>
              <div className="analysis-header">
                <h2 className="analysis-title">Analysis Complete</h2>
                <button className="reset-btn" onClick={handleReset}>
                  Analyze New Document
                </button>
              </div>

              <div className="analysis-grid">
                <div className="grid-item full-width">
                  <RiskDashboard analysis={analysis} />
                </div>

                <div className="grid-item">
                  <Summary summary={analysis.summary} />
                </div>

                <div className="grid-item">
                  <RedFlags redFlags={analysis.redFlags} />
                </div>

                <div className="grid-item full-width">
                  <ChatInterface 
                    documentText={documentText!} 
                    onQuestion={handleQuestion}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Demo Mode - Using simulated AI responses • All processing happens locally</p>
      </footer>
    </div>
  )
}

export default App
