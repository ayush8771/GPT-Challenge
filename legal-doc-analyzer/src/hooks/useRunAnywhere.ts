import { useState, useEffect, useCallback } from 'react';
import { RunAnywhere, ModelManager } from '@runanywhere/web';
import { LlamaCPP, TextGeneration } from '@runanywhere/web-llamacpp';
import type { ModelState } from '../types';

// Use a model that's confirmed to work with the SDK
const MODEL_ID = 'smollm2-360m-instruct';

/**
 * Hook to initialize and manage RunAnywhere SDK
 */
export function useRunAnywhere() {
  const [modelState, setModelState] = useState<ModelState>({
    isLoaded: false,
    isLoading: false,
    downloadProgress: 0,
    error: null,
  });

  const initializeSDK = useCallback(async () => {
    try {
      console.log('=== Starting SDK initialization ===');
      setModelState(prev => ({ ...prev, isLoading: true, error: null }));

      // Step 1: Register LlamaCPP backend
      console.log('Step 1: Registering LlamaCPP backend...');
      try {
        await LlamaCPP.register();
        console.log('✓ LlamaCPP registered successfully');
      } catch (regError) {
        console.error('✗ LlamaCPP registration error:', regError);
        throw new Error(`Failed to register LlamaCPP: ${regError instanceof Error ? regError.message : 'Unknown error'}`);
      }

      // Step 2: Initialize RunAnywhere SDK
      console.log('Step 2: Initializing RunAnywhere SDK...');
      try {
        await RunAnywhere.initialize({
          apiKey: 'ra-dev',
        });
        console.log('✓ RunAnywhere SDK initialized');
      } catch (initError) {
        console.error('✗ SDK initialization error:', initError);
        throw new Error(`Failed to initialize SDK: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
      }

      // Step 3: Set up progress listener
      console.log('Step 3: Setting up download progress listener...');
      let downloadStarted = false;
      const progressListener = RunAnywhere.events.on('model.downloadProgress', (event) => {
        if (event.modelId === MODEL_ID) {
          downloadStarted = true;
          const progress = Math.round(event.progress * 100);
          console.log(`Download progress: ${progress}%`);
          setModelState(prev => ({
            ...prev,
            downloadProgress: progress,
          }));
        }
      });

      // Step 4: Download model
      console.log(`Step 4: Downloading model "${MODEL_ID}"...`);
      console.log('This may take 30-60 seconds on first run...');
      
      try {
        await ModelManager.downloadModel(MODEL_ID);
        
        // If download events were triggered, wait a bit more
        if (downloadStarted) {
          console.log('Download completed, waiting for model to be saved to storage...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          console.log('Model was already downloaded, using cached version');
        }
        
        console.log('✓ Model ready in storage');
      } catch (downloadError) {
        console.error('✗ Model download error:', downloadError);
        progressListener();
        throw new Error(`Failed to download model: ${downloadError instanceof Error ? downloadError.message : 'Check your internet connection'}`);
      }

      // Step 5: Load model into inference engine
      console.log('Step 5: Loading model into inference engine...');
      console.log('This loads the model into memory for inference...');
      
      try {
        // Important: Use the exact same model ID and specify framework
        await TextGeneration.loadModel(MODEL_ID, 'llama.cpp');
        console.log('✓ Model loaded into inference engine');
      } catch (loadError) {
        console.error('✗ Model load error:', loadError);
        progressListener();
        
        // Provide more helpful error message
        const errorMsg = loadError instanceof Error ? loadError.message : 'Unknown error';
        if (errorMsg.includes('not found') || errorMsg.includes('-423')) {
          throw new Error('Model file not found in storage. Please refresh the page to retry the download.');
        }
        throw new Error(`Failed to load model: ${errorMsg}`);
      }

      // Clean up listener
      progressListener();

      console.log('=== SDK initialization complete! ===');
      setModelState({
        isLoaded: true,
        isLoading: false,
        downloadProgress: 100,
        error: null,
      });
    } catch (error) {
      console.error('=== SDK initialization failed ===');
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize SDK';
      setModelState({
        isLoaded: false,
        isLoading: false,
        downloadProgress: 0,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    // Delay initialization slightly to ensure browser is ready
    const timer = setTimeout(() => {
      initializeSDK();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [initializeSDK]);

  return { modelState, reinitialize: initializeSDK };
}

/**
 * Hook to generate text using the loaded model
 */
export function useTextGeneration() {
  const generateText = useCallback(async (
    prompt: string,
    options?: {
      systemPrompt?: string;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<string> => {
    try {
      const result = await TextGeneration.generate(prompt, {
        maxTokens: options?.maxTokens ?? 500,
        temperature: options?.temperature ?? 0.7,
        systemPrompt: options?.systemPrompt,
      });

      return result.text;
    } catch (error) {
      console.error('Text generation failed:', error);
      throw error;
    }
  }, []);

  return { generateText };
}

/**
 * Hook to generate streaming text
 */
export function useStreamingGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStream = useCallback(async (
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: {
      systemPrompt?: string;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<void> => {
    try {
      setIsGenerating(true);

      const { stream } = await TextGeneration.generateStream(prompt, {
        maxTokens: options?.maxTokens ?? 500,
        temperature: options?.temperature ?? 0.7,
        systemPrompt: options?.systemPrompt,
      });

      // Handle streaming tokens
      for await (const token of stream) {
        onChunk(token);
      }
    } catch (error) {
      console.error('Streaming generation failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateStream, isGenerating };
}
