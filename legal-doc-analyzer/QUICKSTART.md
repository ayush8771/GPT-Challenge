# Quick Start Guide

## Getting Your App Running

Follow these steps to get the Private Legal Document Analyzer up and running:

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- RunAnywhere Web SDK packages
- PDF.js for PDF processing
- TypeScript and build tools

### 2. Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### 3. First Launch

On first launch, the app will:
1. Initialize the RunAnywhere SDK
2. Download the SmolLM2-360M model (~30-50MB)
3. Cache the model in your browser's storage

This download happens once. Future visits will load instantly from cache.

### 4. Test the App

You can test with:
- **Sample document**: Use the content from `SAMPLE_DOCUMENT.md`
- **Your own PDF**: Upload any legal document
- **Paste text**: Copy-paste any contract or agreement

### 5. Try These Features

1. **Upload a Document**
   - Drag and drop a PDF, or click to browse
   - Or paste text directly

2. **Wait for Analysis** (1-2 minutes)
   - Summary generation
   - Red flag detection
   - Risk score calculation

3. **Explore Results**
   - Read the plain language summary
   - Check identified red flags
   - View the risk score dashboard

4. **Ask Questions**
   - "Can they terminate me without notice?"
   - "What are my payment obligations?"
   - "Are there any penalties for early termination?"

## Development Tips

### Hot Module Replacement (HMR)

The app uses Vite HMR. Changes to React components will update instantly without page reload.

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

### Linting

Check code quality:
```bash
npm run lint
```

### Building for Production

Create optimized production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Common Development Issues

### Model Not Loading

If the model fails to load:
1. Check your internet connection (first download only)
2. Clear browser cache and reload
3. Try a different browser (Chrome/Edge recommended)

### TypeScript Errors

If you see TypeScript errors:
1. Run `npm run type-check` to see all errors
2. Check that all dependencies are installed
3. Restart your IDE/editor

### WASM Files Not Found (Production)

If WASM files don't load in production:
1. Check that the `copyWasmPlugin()` ran during build
2. Verify WASM files are in `dist/assets/`
3. Check server MIME types for `.wasm` files

### Performance Issues

If analysis is slow:
1. Ensure Cross-Origin headers are set (dev server has them)
2. Close other browser tabs to free memory
3. Try with shorter documents first

## Project Structure Reference

```
src/
├── components/          # React UI components
│   ├── DocumentUpload.tsx
│   ├── LoadingScreen.tsx
│   ├── PrivacyBadge.tsx
│   ├── Summary.tsx
│   ├── RiskDashboard.tsx
│   ├── RedFlags.tsx
│   └── ChatInterface.tsx
├── hooks/              # Custom React hooks
│   └── useRunAnywhere.ts
├── utils/              # Business logic
│   ├── pdfExtractor.ts
│   └── documentAnalyzer.ts
├── types.ts            # TypeScript types
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## Next Steps

1. **Customize the Analysis**
   - Edit prompts in `src/utils/documentAnalyzer.ts`
   - Adjust risk scoring logic
   - Add new analysis features

2. **Change the Model**
   - Update `MODEL_ID` in `src/hooks/useRunAnywhere.ts`
   - Try different models from RunAnywhere catalog

3. **Enhance the UI**
   - Modify component styles
   - Add new visualizations
   - Implement dark/light theme toggle

4. **Add Features**
   - Export analysis to PDF
   - Save document history
   - Compare multiple documents
   - Add more language support

## Resources

- **RunAnywhere Docs**: https://docs.runanywhere.ai/web/introduction
- **React Docs**: https://react.dev
- **Vite Docs**: https://vite.dev
- **PDF.js Docs**: https://mozilla.github.io/pdf.js/

## Getting Help

If you encounter issues:

1. Check the README.md for troubleshooting
2. Review ARCHITECTURE.md for technical details
3. Search RunAnywhere documentation
4. Check browser console for errors

## Happy Coding!

You now have a fully functional, privacy-first legal document analyzer. Customize it, enhance it, and make it your own!
