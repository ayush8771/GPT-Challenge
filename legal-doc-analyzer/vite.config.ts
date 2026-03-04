import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dir = path.dirname(fileURLToPath(import.meta.url))

/**
 * Copies WASM binaries from @runanywhere npm packages into dist/assets/
 * for production builds. In dev mode Vite serves node_modules directly.
 */
function copyWasmPlugin(): Plugin {
  const llamacppWasm = path.resolve(__dir, 'node_modules/@runanywhere/web-llamacpp/wasm')

  return {
    name: 'copy-wasm',
    writeBundle(options) {
      const outDir = options.dir ?? path.resolve(__dir, 'dist')
      const assetsDir = path.join(outDir, 'assets')
      fs.mkdirSync(assetsDir, { recursive: true })

      // LlamaCpp WASM binaries (LLM/VLM)
      for (const file of [
        'racommons-llamacpp.wasm',
        'racommons-llamacpp.js',
        'racommons-llamacpp-webgpu.wasm',
        'racommons-llamacpp-webgpu.js',
      ]) {
        const src = path.join(llamacppWasm, file)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(assetsDir, file))
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyWasmPlugin()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  assetsInclude: ['**/*.wasm'],
  worker: { format: 'es' },
  optimizeDeps: {
    // CRITICAL: exclude WASM packages from pre-bundling so import.meta.url
    // resolves correctly for automatic WASM file discovery
    exclude: ['@runanywhere/web-llamacpp', '@runanywhere/web-onnx'],
  },
})
