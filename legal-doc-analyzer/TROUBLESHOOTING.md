# Troubleshooting: STATUS_STACK_BUFFER_OVERRUN Error

## Issue
When opening `http://localhost:5173`, the browser shows:
- "Couldn't open this page"
- Error code: `STATUS_STACK_BUFFER_OVERRUN`

## Root Cause
This error typically occurs when:
1. WASM module requires more stack memory than available
2. Chrome's security features are blocking WebAssembly execution
3. Memory limits are exceeded during WASM initialization

## Solutions (Try in Order)

### Solution 1: Increase Chrome's Stack Size

1. **Close Chrome completely**
2. **Open Chrome with increased stack size:**

   **Windows:**
   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --js-flags="--stack-size=2048"
   ```

   Or create a desktop shortcut with this target

3. **Navigate to** `http://localhost:5173`

### Solution 2: Use a Simpler Test First

Let's test if the SDK can initialize at all:

1. **Temporarily rename the current App.tsx:**
   ```bash
   cd src
   move App.tsx App.backup.tsx
   move App.test.tsx App.tsx
   ```

2. **Restart the dev server:**
   ```bash
   npm run dev
   ```

3. **Check the browser console (F12)** for detailed error messages

### Solution 3: Enable Required Chrome Flags

1. **Open Chrome and go to:**
   ```
   chrome://flags
   ```

2. **Enable these flags:**
   - `#enable-webassembly` - Enabled
   - `#enable-webassembly-baseline` - Enabled
   - `#enable-webassembly-lazy-compilation` - Enabled

3. **Restart Chrome** and try again

### Solution 4: Check Browser Console

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. **Take a screenshot** of any error messages
4. Go to **Network** tab
5. Check if `.wasm` files are loading

Look for:
- Failed network requests (red entries)
- JavaScript errors
- CORS errors
- Memory errors

### Solution 5: Try a Different Model

The `smollm2-360m-instruct` model might be too large. Let's try a smaller one:

1. **Edit** `src/hooks/useRunAnywhere.ts`
2. **Change line 6:**
   ```typescript
   const MODEL_ID = 'smollm2-135m-instruct'; // Smaller model
   ```

### Solution 6: Disable Security Features (Development Only)

**WARNING: Only for local development testing!**

1. **Close Chrome completely**
2. **Launch Chrome with disabled security:**

   **Windows:**
   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\temp\chrome-dev" --js-flags="--stack-size=2048"
   ```

3. **Try** `http://localhost:5173` again

### Solution 7: Use Microsoft Edge Instead

Edge often handles WASM better:

1. **Close Chrome**
2. **Open Microsoft Edge**
3. **Navigate to** `http://localhost:5173`

### Solution 8: Check System Resources

1. **Close other applications** to free memory
2. **Check Task Manager** (Ctrl+Shift+Esc)
   - Ensure you have at least 4GB RAM available
   - Close unnecessary Chrome tabs

3. **Restart the dev server:**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

### Solution 9: Clear Browser Cache

1. **Open Chrome DevTools** (F12)
2. **Right-click the refresh button**
3. **Select** "Empty Cache and Hard Reload"

Or:
1. Go to `chrome://settings/clearBrowserData`
2. Select "Cached images and files"
3. Click "Clear data"

### Solution 10: Check Vite Dev Server

The dev server might be having issues:

1. **Stop the server** (Ctrl+C)
2. **Clear node modules cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

3. **Restart:**
   ```bash
   npm run dev
   ```

## Debugging Steps

### 1. Check Console Output

When you run `npm run dev`, you should see:
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

If you see errors here, the problem is with Vite, not the browser.

### 2. Test WASM File Access

Open in browser:
```
http://localhost:5173/node_modules/@runanywhere/web-llamacpp/wasm/racommons-llamacpp.wasm
```

You should see the file download or open. If you get 404, the WASM files aren't being served.

### 3. Check Headers

In DevTools Network tab:
1. Reload the page
2. Click on the main document request
3. Check Response Headers for:
   - `Cross-Origin-Opener-Policy: same-origin`
   - `Cross-Origin-Embedder-Policy: credentialless`

## Alternative: Use Production Build

Sometimes the production build works better:

```bash
npm run build
npm run preview
```

Then open `http://localhost:4173`

## Getting Help

If none of these work, please provide:

1. **Chrome version:**
   - Open `chrome://version`
   - Copy the version number

2. **Console errors:**
   - Press F12
   - Copy all red error messages

3. **Network tab:**
   - Take a screenshot of failed requests

4. **System info:**
   - RAM available
   - Operating system
   - Node.js version (`node --version`)

## Common Error Messages

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and reinstall

### "CORS error"
- The Vite config should handle this
- Check `vite.config.ts` has the headers

### "WebAssembly is not defined"
- Your browser doesn't support WASM
- Update Chrome to latest version

### "Out of memory"
- Close other applications
- Restart your computer
- Try a smaller model

## Still Not Working?

If you've tried everything and it still doesn't work, we can:

1. Create a **simpler version** without WASM first
2. Use a **mock AI** for testing the UI
3. Deploy to **Vercel/Netlify** and test there (sometimes works better)
4. Switch to a **different AI SDK** (like Transformers.js)

Let me know what errors you see in the console and we'll debug from there!
