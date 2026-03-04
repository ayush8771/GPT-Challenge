import { useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Initializing...')
  const [error, setError] = useState<string | null>(null)

  const testInit = async () => {
    try {
      setStatus('Testing basic initialization...')
      
      // Test 1: Check if modules are available
      setStatus('Importing modules...')
      const { RunAnywhere } = await import('@runanywhere/web')
      const { LlamaCPP } = await import('@runanywhere/web-llamacpp')
      
      setStatus('Modules imported successfully!')
      await new Promise(r => setTimeout(r, 1000))
      
      // Test 2: Register backend
      setStatus('Registering LlamaCPP backend...')
      await LlamaCPP.register()
      
      setStatus('Backend registered successfully!')
      await new Promise(r => setTimeout(r, 1000))
      
      // Test 3: Initialize SDK
      setStatus('Initializing RunAnywhere...')
      await RunAnywhere.initialize({
        apiKey: 'ra-dev',
      })
      
      setStatus('SDK initialized successfully! ✅')
      
    } catch (err) {
      console.error('Test failed:', err)
      setError(err instanceof Error ? err.message : String(err))
      setStatus('Failed ❌')
    }
  }

  // Auto-start test
  useState(() => {
    testInit()
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>RunAnywhere SDK Test</h1>
      </header>
      <main className="app-main">
        <div className="container">
          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '2rem', 
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '2rem auto'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Status:</h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: error ? 'var(--risk-high)' : 'var(--accent-primary)',
              marginBottom: '1rem'
            }}>
              {status}
            </p>
            
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--risk-high)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1rem',
                wordBreak: 'break-word'
              }}>
                <strong>Error:</strong>
                <pre style={{ 
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem'
                }}>
                  {error}
                </pre>
              </div>
            )}
            
            <div style={{ marginTop: '2rem' }}>
              <button 
                onClick={testInit}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Retry Test
              </button>
            </div>
            
            <div style={{ 
              marginTop: '2rem', 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)' 
            }}>
              <p><strong>Instructions:</strong></p>
              <ul style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
                <li>Open browser DevTools (F12)</li>
                <li>Check the Console tab for detailed logs</li>
                <li>Check the Network tab to see if WASM files load</li>
                <li>Look for any error messages</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
