# Architecture Documentation

## Overview

The Private Legal Document Analyzer is a fully offline, privacy-first web application that uses on-device AI to analyze legal documents. All processing happens in the browser using WebAssembly, ensuring that sensitive legal documents never leave the user's device.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    React Frontend                       │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  Document    │  │   Analysis   │  │     Chat     │ │ │
│  │  │   Upload     │  │  Components  │  │  Interface   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │           │                 │                 │         │ │
│  │           └─────────────────┼─────────────────┘         │ │
│  │                             │                           │ │
│  │                             ▼                           │ │
│  │                  ┌────────────────────┐                │ │
│  │                  │  Document Analyzer │                │ │
│  │                  └────────────────────┘                │ │
│  │                             │                           │ │
│  │                             ▼                           │ │
│  │                  ┌────────────────────┐                │ │
│  │                  │  RunAnywhere SDK   │                │ │
│  │                  └────────────────────┘                │ │
│  │                             │                           │ │
│  └─────────────────────────────┼───────────────────────────┘ │
│                                │                             │
│  ┌─────────────────────────────▼───────────────────────────┐ │
│  │            WebAssembly Runtime Layer                    │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  LlamaCPP    │  │   PDF.js     │  │    OPFS      │ │ │
│  │  │    WASM      │  │    Worker    │  │   Storage    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │         SmolLM2-360M Model (cached in OPFS)        │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer (React + TypeScript)

#### Core Components

1. **App.tsx** - Main application orchestrator
   - Manages application state
   - Coordinates component interactions
   - Handles document analysis workflow

2. **LoadingScreen.tsx** - Initial model loading
   - Displays download progress
   - Shows privacy features
   - Handles initialization errors

3. **DocumentUpload.tsx** - Document input interface
   - PDF file upload with drag-and-drop
   - Text paste option
   - PDF text extraction using PDF.js

4. **PrivacyBadge.tsx** - Privacy indicator
   - Shows "processing locally" status
   - Displays when analysis is running
   - Reinforces privacy message

5. **Summary.tsx** - Plain language summary
   - Displays AI-generated summary
   - Easy-to-read formatting

6. **RiskDashboard.tsx** - Risk visualization
   - Circular risk score (1-10)
   - Color-coded severity
   - Risk breakdown charts

7. **RedFlags.tsx** - Risk details display
   - Lists identified risks
   - Severity indicators (🔴🟡🟢)
   - Explanations for each flag

8. **ChatInterface.tsx** - Q&A interface
   - Message history
   - Real-time responses
   - Suggested questions

### Business Logic Layer

#### Hooks

**useRunAnywhere.ts**
- `useRunAnywhere()` - SDK initialization and model management
  - Registers LlamaCPP backend
  - Downloads and loads model
  - Tracks download progress
  - Handles errors

- `useTextGeneration()` - Text generation wrapper
  - Simplified interface for LLM calls
  - Error handling
  - Configurable parameters

- `useStreamingGeneration()` - Streaming text generation
  - Real-time token streaming
  - Chunk-by-chunk processing
  - Loading state management

#### Utilities

**pdfExtractor.ts**
- `extractTextFromPDF()` - Client-side PDF parsing
  - Uses PDF.js library
  - Extracts text from all pages
  - Returns clean text content

- `truncateText()` - Context window management
  - Limits text to model's context window
  - Preserves important content

**documentAnalyzer.ts**
- `generateSummary()` - Creates plain language summary
  - Optimized prompts
  - Low temperature for consistency
  - ~400 token limit

- `detectRedFlags()` - Identifies risky clauses
  - Structured prompt for parsing
  - Extracts severity levels
  - Categorizes issues

- `calculateRiskScore()` - Computes overall risk
  - Weighted scoring system
  - High risk = 3 points
  - Medium risk = 2 points
  - Low risk = 1 point
  - Scale: 1-10

- `analyzeDocument()` - Full analysis orchestrator
  - Calls all analysis functions
  - Reports progress
  - Returns complete analysis

- `answerQuestion()` - Q&A handler
  - Context-aware responses
  - Document-specific answers

## Data Flow

### Document Upload Flow

```
User selects PDF
    ↓
DocumentUpload component
    ↓
PDF.js extracts text
    ↓
Text sent to App component
    ↓
App triggers analysis
    ↓
documentAnalyzer.analyzeDocument()
    ↓
[Parallel processing]
    ├─ generateSummary()
    ├─ detectRedFlags()
    └─ calculateRiskScore()
    ↓
Results displayed in UI components
```

### Chat Q&A Flow

```
User types question
    ↓
ChatInterface component
    ↓
answerQuestion(question, documentText)
    ↓
RunAnywhere SDK (TextGeneration.generate)
    ↓
LlamaCPP WASM inference
    ↓
Answer streamed back
    ↓
Displayed in chat
```

## AI Model Integration

### RunAnywhere SDK Architecture

The app uses the RunAnywhere Web SDK which provides:

1. **Model Management**
   - Automatic model downloading
   - OPFS storage for persistence
   - Version management

2. **LlamaCPP Backend**
   - Compiled to WebAssembly
   - Multi-threaded when headers allow
   - CPU and WebGPU support

3. **Inference Engine**
   - Streaming token generation
   - Context window management
   - Temperature/sampling controls

### Model: SmolLM2-360M-Instruct

- **Size**: ~30-50MB (GGUF format)
- **Context Window**: 8192 tokens
- **Speed**: ~10-30 tokens/second (browser)
- **Strengths**: Fast, lightweight, good for summarization

## Privacy & Security Architecture

### Data Isolation

1. **No Network Calls During Analysis**
   - All AI inference happens locally
   - No API keys required
   - No telemetry sent

2. **Sandboxed Storage**
   - Models stored in OPFS
   - Isolated from other websites
   - Automatic cleanup by browser

3. **Client-Side PDF Processing**
   - PDF.js runs in browser
   - No server upload required
   - Text extracted locally

### Cross-Origin Isolation

Required headers for optimal performance:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

These enable:
- SharedArrayBuffer for multi-threading
- Faster WASM execution
- Better performance

Without headers:
- Falls back to single-threaded mode
- Still works, just slower
- No functionality loss

## Performance Optimizations

### 1. Model Caching
- First download: ~30-50MB, 10-60 seconds
- Subsequent loads: Instant from OPFS

### 2. Text Truncation
- Limits context to 6000-8000 characters
- Preserves analysis quality
- Speeds up inference

### 3. Parallel Analysis
- Summary, red flags, and risk score generated sequentially
- Each step optimized for specific task

### 4. Streaming (Future Enhancement)
- Currently disabled for simplicity
- Can be enabled in ChatInterface
- Would show token-by-token responses

## Prompt Engineering

### Summary Generation Prompt
```
System: "You are a helpful legal assistant that explains complex 
         legal documents in simple terms."

User: "Summarize the following legal document in simple, 
       easy-to-understand English..."
```

Parameters:
- Temperature: 0.3 (consistent)
- Max tokens: 400
- Focus: Clarity and simplicity

### Red Flag Detection Prompt
```
System: "You are a legal expert who identifies risks and unfair 
         terms in contracts and legal documents."

User: "Analyze the following legal document and identify any risky, 
       unfair, or unusual clauses. For each issue found, provide..."
```

Parameters:
- Temperature: 0.4 (slightly creative)
- Max tokens: 600
- Structured output format

### Q&A Prompt
```
System: "You are a helpful legal assistant. Answer questions about 
         legal documents accurately and concisely."

User: "Based on the following legal document, answer this question: 
       {question}"
```

Parameters:
- Temperature: 0.3 (factual)
- Max tokens: 300
- Context: Full document text

## Error Handling

### Model Loading Errors
- Network failures during download
- Browser storage limits
- Incompatible browser versions
- Solution: Clear error messages, retry button

### Analysis Errors
- LLM generation failures
- Parsing errors
- Context window overflow
- Solution: User-friendly alerts, fallback behavior

### PDF Processing Errors
- Corrupted PDFs
- Scanned documents (no extractable text)
- Password-protected files
- Solution: Error messages, "Paste Text" alternative

## Future Enhancements

### Potential Improvements

1. **Streaming Responses**
   - Real-time token display
   - Better perceived performance
   - More engaging UX

2. **Larger Models**
   - Qwen2.5-1.5B for better accuracy
   - Optional for users with powerful devices

3. **Export Features**
   - PDF report generation
   - Markdown export
   - Save analysis results

4. **Advanced Analysis**
   - Clause extraction
   - Comparison with standard contracts
   - Risk mitigation suggestions

5. **Multi-Language Support**
   - Analyze documents in multiple languages
   - UI localization

6. **Document History**
   - Save analyzed documents locally
   - Compare multiple documents
   - Track changes over time

## Browser Compatibility Matrix

| Feature | Chrome 120+ | Edge 120+ | Firefox 119+ | Safari 17+ |
|---------|------------|-----------|--------------|------------|
| WebAssembly | ✅ | ✅ | ✅ | ✅ |
| SharedArrayBuffer | ✅ | ✅ | ⚠️ | ⚠️ |
| OPFS | ✅ | ✅ | ✅ | ⚠️ |
| WebGPU | ✅ | ✅ | ❌ | ❌ |
| Multi-threading | ✅ | ✅ | ⚠️ | ⚠️ |

Legend:
- ✅ Full support
- ⚠️ Limited/partial support
- ❌ Not supported

## Deployment Considerations

### Production Checklist

- ✅ Cross-Origin Isolation headers configured
- ✅ WASM files copied to dist/assets
- ✅ Correct MIME types for .wasm files
- ✅ Model files accessible
- ✅ Error boundary implemented
- ✅ Loading states handled
- ✅ Mobile responsive design

### Hosting Requirements

- Static file hosting (no server needed)
- HTTPS (required for WASM)
- Proper headers (COOP/COEP)
- ~100MB storage for model caching

### Recommended Platforms

1. **Vercel** - Easy setup, automatic headers
2. **Netlify** - Good performance, simple config
3. **Cloudflare Pages** - Fast CDN, good caching
4. **GitHub Pages** - Free, but manual header config

## Testing Strategy

### Manual Testing Checklist

- [ ] Model downloads successfully
- [ ] PDF upload works
- [ ] Text paste works
- [ ] Summary generates correctly
- [ ] Red flags detected
- [ ] Risk score calculated
- [ ] Chat Q&A responds
- [ ] Privacy badge shows status
- [ ] "Analyze New Document" resets state
- [ ] Errors handled gracefully
- [ ] Works offline after model download
- [ ] Mobile responsive

### Test Documents

Use various legal document types:
- Employment contracts
- Rental agreements
- Terms of service
- NDAs
- Service agreements

## Maintenance

### Regular Updates

1. **Dependencies**
   - Keep RunAnywhere SDK updated
   - Update PDF.js for security
   - Update React for performance

2. **Models**
   - Monitor for new model releases
   - Test compatibility
   - Update documentation

3. **Browser Support**
   - Test new browser versions
   - Update compatibility matrix
   - Adjust for API changes

## Conclusion

This architecture prioritizes:
- **Privacy**: No data leaves the browser
- **Performance**: Optimized for in-browser AI
- **Usability**: Simple, intuitive interface
- **Maintainability**: Clean code, clear separation of concerns
- **Extensibility**: Easy to add new features

The result is a production-ready, privacy-first legal document analyzer that runs entirely in the browser.
