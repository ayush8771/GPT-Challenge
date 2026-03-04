# Private Legal Document Analyzer

A fully offline, privacy-first web application that analyzes legal documents using on-device AI. Built with RunAnywhere Web SDK - no data ever leaves your browser.

## Features

- **Document Upload** - Upload PDF files or paste plain text of legal documents
- **Plain Language Summary** - Get easy-to-understand summaries of complex legal text
- **Red Flag Detection** - Automatically identifies risky, unfair, or unusual clauses with severity levels:
  - 🔴 High Risk
  - 🟡 Medium Risk
  - 🟢 Standard
- **Interactive Q&A** - Ask specific questions about your document and get instant answers
- **Risk Score Dashboard** - Visual breakdown of document risk (1-10 scale) with safe vs risky sections
- **100% Private** - All processing happens locally in your browser using WebAssembly
- **Fully Offline** - Works completely offline after the model is downloaded once

## Privacy & Security

- ✅ No server communication during document analysis
- ✅ All AI inference runs in your browser via WebAssembly
- ✅ Documents never leave your device
- ✅ Model files stored in browser's sandboxed OPFS storage
- ✅ Works offline after initial model download

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **AI SDK**: RunAnywhere Web SDK (@runanywhere/web-llamacpp)
- **LLM Model**: SmolLM2-360M-Instruct (lightweight, fast, runs in-browser)
- **PDF Processing**: PDF.js (client-side PDF text extraction)
- **Styling**: Custom CSS with dark theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome 96+ or Edge 96+ recommended)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### First Run

On first launch, the app will download the SmolLM2-360M model (~30-50MB). This happens once and the model is cached in your browser for future use.

## Usage

1. **Upload a Document**
   - Click "Upload PDF" and select a PDF file, or
   - Click "Paste Text" and paste the document text directly

2. **Wait for Analysis** (1-2 minutes)
   - The app will generate a summary
   - Detect potential red flags
   - Calculate an overall risk score

3. **Review Results**
   - Read the plain language summary
   - Check the risk score dashboard
   - Review identified red flags with explanations

4. **Ask Questions**
   - Use the chat interface to ask specific questions
   - Examples: "Can they terminate me without notice?", "What are my payment obligations?"

## Project Structure

```
src/
├── components/
│   ├── DocumentUpload.tsx      # PDF upload and text paste interface
│   ├── LoadingScreen.tsx       # Model loading screen with progress
│   ├── PrivacyBadge.tsx        # Privacy indicator badge
│   ├── Summary.tsx             # Document summary display
│   ├── RiskDashboard.tsx       # Risk score visualization
│   ├── RedFlags.tsx            # Red flags list with severity
│   └── ChatInterface.tsx       # Q&A chat interface
├── hooks/
│   └── useRunAnywhere.ts       # RunAnywhere SDK integration hooks
├── utils/
│   ├── pdfExtractor.ts         # PDF text extraction utilities
│   └── documentAnalyzer.ts     # Document analysis logic
├── types.ts                     # TypeScript type definitions
├── App.tsx                      # Main application component
├── main.tsx                     # React entry point
└── index.css                    # Global styles
```

## Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` folder. The Vite config automatically copies WASM files to the output directory.

## Deployment

### Vercel

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "credentialless" }
      ]
    }
  ]
}
```

Then deploy:
```bash
npx vercel
```

### Netlify

Create `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Embedder-Policy = "credentialless"
```

### Important: Cross-Origin Isolation

The app requires Cross-Origin Isolation headers for optimal performance (multi-threaded WASM):
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`

Without these headers, the app will work but in slower single-threaded mode.

## Configuration

### Using a Different Model

To use a different model, update `MODEL_ID` in `src/hooks/useRunAnywhere.ts`:

```typescript
const MODEL_ID = 'smollm2-360m-instruct'; // Change to your preferred model
```

Available lightweight models:
- `smollm2-360m-instruct` (default, ~30MB)
- `smollm2-135m-instruct` (smaller, ~15MB)
- `qwen2.5-0.5b-instruct` (~500MB)

### Adjusting Analysis Parameters

Edit `src/utils/documentAnalyzer.ts` to customize:
- Token limits (`maxTokens`)
- Temperature (creativity vs consistency)
- System prompts (AI behavior)
- Red flag detection criteria

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 96+     | ✅ Fully supported |
| Edge    | 96+     | ✅ Fully supported |
| Firefox | 119+    | ⚠️ Supported (no WebGPU) |
| Safari  | 17+     | ⚠️ Limited OPFS support |

## Troubleshooting

### Model Download Issues

If the model fails to download:
1. Check your internet connection
2. Clear browser cache and reload
3. Try a different browser (Chrome/Edge recommended)

### "SharedArrayBuffer is not defined"

This means the Cross-Origin Isolation headers are not set correctly. The app will still work but in single-threaded mode (slower performance).

### PDF Extraction Fails

Some PDFs with complex formatting or scanned images may not extract text properly. Try:
1. Using the "Paste Text" option instead
2. Converting the PDF to plain text first
3. Using a different PDF file

### Analysis is Very Slow

The SmolLM2-360M model is optimized for in-browser use, but analysis can take 1-2 minutes for longer documents. This is normal for on-device AI.

## License

MIT

## Acknowledgments

- Built with [RunAnywhere SDK](https://docs.runanywhere.ai/)
- Uses [PDF.js](https://mozilla.github.io/pdf.js/) for PDF processing
- Powered by [SmolLM2](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct) model
