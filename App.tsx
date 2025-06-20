import React, { useState, useEffect, useCallback } from 'react';
import { ApiKeys, ContentGenerationParams, GeneratedContentSet, ChannelType } from './types';
import { APP_NAME, MEDICAL_DISCLAIMER, DEFAULT_API_KEYS, API_KEY_STORAGE_KEY, CHANNEL_OPTIONS } from './constants';
import { ApiKeyWallet } from './components/ApiKeyWallet';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HelpGuide } from './components/HelpGuide';
import { ApiStatusChecker } from './components/ApiStatusChecker';
import { generateSingleChannelWithGemini, generateImageWithImagen, checkDefaultGeminiEnvKey } from './services/geminiService';
import { generateMockContent } from './services/mockApiService';
import { generateFreeImage, generatePlaceholderImage } from './services/freeImageService';
import { Spinner } from './components/ui/Spinner';
import { AlertTriangle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isApiKeySetupDone, setIsApiKeySetupDone] = useState<boolean>(false);
  const [isDefaultGeminiEnvKeyAvailable, setIsDefaultGeminiEnvKeyAvailable] = useState<boolean>(false);
  const [showApiStatusChecker, setShowApiStatusChecker] = useState<boolean>(false);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentSet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const defaultEnvKey = checkDefaultGeminiEnvKey();
    setIsDefaultGeminiEnvKeyAvailable(!!defaultEnvKey);

    const storedKeys = localStorage.getItem(API_KEY_STORAGE_KEY);
    let activeApiKeys = { ...DEFAULT_API_KEYS };

    if (storedKeys) {
      try {
        const parsedKeys = JSON.parse(storedKeys) as Partial<ApiKeys>;
        activeApiKeys = { ...activeApiKeys, ...parsedKeys };
      } catch (e) {
        console.error("Failed to parse stored API keys", e);
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    }
    
    // If a default env key is available and user hasn't provided one, use it.
    if (defaultEnvKey && !activeApiKeys.geminiApiKey) {
      activeApiKeys.geminiApiKey = defaultEnvKey; 
    }
    setApiKeys(activeApiKeys);

    // Setup is considered done if user has provided any key, or if a default Gemini key is available.
    if (activeApiKeys.geminiApiKey || activeApiKeys.groqApiKey || activeApiKeys.openRouterApiKey || activeApiKeys.stabilityApiKey) {
        setIsApiKeySetupDone(true);
    } else {
        setIsApiKeySetupDone(false);
    }
  }, []);

  const handleApiKeysSave = useCallback((keysFromWallet: ApiKeys) => {
    // keysFromWallet contains what user entered.
    // If user clears Gemini key input, keysFromWallet.geminiApiKey might be empty.
    // In that case, if default env key is available, we can fall back to it.
    let finalGeminiKey = keysFromWallet.geminiApiKey;
    if (!finalGeminiKey && isDefaultGeminiEnvKeyAvailable) {
        const defaultEnvKey = checkDefaultGeminiEnvKey();
        if(defaultEnvKey) finalGeminiKey = defaultEnvKey;
    }

    const newApiKeys: ApiKeys = {
        ...keysFromWallet,
        geminiApiKey: finalGeminiKey || null,
    };

    setApiKeys(newApiKeys);
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(newApiKeys));
    
    if (newApiKeys.geminiApiKey || newApiKeys.groqApiKey || newApiKeys.openRouterApiKey || newApiKeys.stabilityApiKey) {
        setIsApiKeySetupDone(true);
    } else {
        setIsApiKeySetupDone(false);
    }
    setError(null); 
  }, [isDefaultGeminiEnvKeyAvailable]);

  const handleGenerateContent = useCallback(async (params: ContentGenerationParams) => {
    // A Gemini key (user-provided or default env) OR other keys must be present.
    if (!apiKeys.geminiApiKey && !apiKeys.groqApiKey && !apiKeys.openRouterApiKey) {
        setError("Crucial API keys are missing. Please provide a Gemini API key in the API Wallet, or Groq/OpenRouter keys for limited functionality.");
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    const results: GeneratedContentSet = {};
    const textChannels = CHANNEL_OPTIONS.filter(opt => opt.value !== ChannelType.GENERATED_IMAGE);

    try {
      const textGenerationPromises = textChannels.map(async (channelOpt) => {
        const channel = channelOpt.value;
        let content = '';
        let apiError: string | undefined = undefined;
        const userProvidedGeminiKey = apiKeys.geminiApiKey; // Use the key from state

        try {
          // Prioritize Gemini for its specific channels or if it's the only key available
          if (userProvidedGeminiKey && 
              (channel === ChannelType.BLOG_IDEA || 
               channel === ChannelType.VIDEO_SCRIPT || 
               channel === ChannelType.IMAGE_PROMPT ||
               (!apiKeys.groqApiKey && !apiKeys.openRouterApiKey) // Use Gemini if no mock alternatives
              )
          ) {
            content = await generateSingleChannelWithGemini(params, channel, userProvidedGeminiKey);
          }
          // Fallback to mock/other APIs if Gemini not designated or not available for the channel type
          else if ((apiKeys.groqApiKey || apiKeys.openRouterApiKey) && 
                   (channel === ChannelType.INSTAGRAM || channel === ChannelType.FACEBOOK || channel === ChannelType.WHATSAPP || channel === ChannelType.GOOGLE_BUSINESS || channel === ChannelType.AD_COPY)) {
            content = await generateMockContent(params, channel, apiKeys.groqApiKey || apiKeys.openRouterApiKey);
          }
          // If Gemini is available and preferred but other keys also exist for mockable channels (e.g. ad_copy)
          // ensure Gemini is still used if it's explicitly for that channel.
          else if (userProvidedGeminiKey && (channel === ChannelType.AD_COPY || channel === ChannelType.INSTAGRAM || channel === ChannelType.FACEBOOK || channel === ChannelType.WHATSAPP || channel === ChannelType.GOOGLE_BUSINESS)){
            content = await generateSingleChannelWithGemini(params, channel, userProvidedGeminiKey);
          }
           else {
            throw new Error(`No suitable API key available for ${channel}. User-provided Gemini Key: ${userProvidedGeminiKey ? 'Yes' : 'No'}.`);
          }
        } catch (e: any) {
          console.error(`Error generating text content for ${channel}:`, e);
          apiError = e.message || `Failed to generate content for ${channel}.`;
          content = `Could not generate content for ${channel}. ${apiError}`;
        }
        results[channel] = { channel, content, error: apiError };
      });

      await Promise.all(textGenerationPromises);

      // Image generation with multiple fallbacks
      if (results[ChannelType.IMAGE_PROMPT] && !results[ChannelType.IMAGE_PROMPT].error && results[ChannelType.IMAGE_PROMPT].content) {
        const imagePromptText = results[ChannelType.IMAGE_PROMPT].content;
        let imageBase64: string;
        let imageGenerationMethod = '';
        
        try {
          // Try Imagen first if Gemini key is available
          if (apiKeys.geminiApiKey) {
            try {
              imageBase64 = await generateImageWithImagen(imagePromptText, apiKeys.geminiApiKey);
              imageGenerationMethod = 'Google Imagen';
            } catch (imagenError: any) {
              console.warn(`Imagen failed, trying free alternatives:`, imagenError);
              // Fallback to free image generation
              imageBase64 = await generateFreeImage(imagePromptText, {
                unsplashKey: apiKeys.unsplashApiKey,
                preferStock: false,
                style: 'realistic'
              });
              imageGenerationMethod = 'Free AI Generation';
            }
          } else {
            // No Gemini key, use free alternatives directly
            try {
              imageBase64 = await generateFreeImage(imagePromptText, {
                unsplashKey: apiKeys.unsplashApiKey,
                preferStock: false,
                style: 'realistic'
              });
              imageGenerationMethod = 'Free AI Generation';
            } catch (freeError: any) {
              console.warn(`Free image generation failed, using placeholder:`, freeError);
              // Final fallback: placeholder image
              imageBase64 = generatePlaceholderImage(imagePromptText);
              imageGenerationMethod = 'Placeholder';
            }
          }
          
          results[ChannelType.GENERATED_IMAGE] = { 
            channel: ChannelType.GENERATED_IMAGE, 
            content: imageBase64,
            metadata: { generatedBy: imageGenerationMethod }
          };
        } catch (e: any) {
          console.error(`All image generation methods failed:`, e);
          // Create placeholder as absolute fallback
          const placeholderBase64 = generatePlaceholderImage(imagePromptText);
          results[ChannelType.GENERATED_IMAGE] = { 
            channel: ChannelType.GENERATED_IMAGE, 
            content: placeholderBase64,
            error: 'Used placeholder image - consider adding API keys for better image generation',
            metadata: { generatedBy: 'Placeholder (Fallback)' }
          };
        }
      } else {
        // No image prompt generated or prompt failed
        results[ChannelType.GENERATED_IMAGE] = { 
          channel: ChannelType.GENERATED_IMAGE, 
          content: generatePlaceholderImage('No image prompt available'),
          error: results[ChannelType.IMAGE_PROMPT]?.error || 'Image prompt was not generated',
          metadata: { generatedBy: 'Placeholder (No Prompt)' }
        };
      }
      setGeneratedContent(results);
    } catch (e: any) {
      console.error("Content generation process failed:", e);
      setError(e.message || "An unexpected error occurred during content generation process.");
    } finally {
      setIsLoading(false);
    }
  }, [apiKeys]);

  const resetApiKeySetup = () => {
    setIsApiKeySetupDone(false); // This will show the ApiKeyWallet
  };
  
  // Show API key wallet if setup isn't done OR if all essential keys are missing.
  const showApiKeyWallet = !isApiKeySetupDone || (!apiKeys.geminiApiKey && !apiKeys.groqApiKey && !apiKeys.openRouterApiKey);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-5xl py-6 mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-sky-300">
            {APP_NAME}
          </h1>
          <p className="mt-2 text-slate-400 text-lg">AI-Powered Content for Indian Healthcare Marketers</p>
          <p className="mt-1 text-xs text-slate-400">
            Powered by <span className="text-orange-400 font-semibold">GreyBrain.ai</span>
          </p>
        </div>
      </header>

      {/* Introductory Section */}
      <div className="w-full max-w-4xl mb-8 p-8 border border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-300 mb-4">
            🩺 Welcome to MediGenius AI
          </h2>
          <p className="text-lg text-white leading-relaxed font-medium">
            Your intelligent assistant for creating professional healthcare marketing content tailored for Indian medical practices
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-sky-300 flex items-center">
              <span className="mr-2">🎯</span> What is MediGenius?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              MediGenius generates customized marketing content for healthcare professionals across multiple channels - from Instagram posts to Google Business updates, blog ideas to video scripts and images - all tailored to your medical specialty and local audience. <strong className="text-white">Images are generated for free</strong> using AI, with premium options available.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-300 flex items-center">
              <span className="mr-2">🚀</span> How to Use
            </h3>
            <div className="text-slate-300 text-sm space-y-2 font-medium">
              <p><span className="text-sky-400 font-medium">1.</span> Add your Google Gemini API key below (free from Google AI Studio) - <em className="text-slate-400">optional for basic use</em></p>
              <p><span className="text-sky-400 font-medium">2.</span> Fill in your specialty, location, and target audience</p>
              <p><span className="text-sky-400 font-medium">3.</span> Get AI-generated content + images for all major platforms instantly!</p>
            </div>
          </div>
        </div>
        
        <div className="border border-slate-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-200">
            ✨ <strong className="text-white">Premium Plans Coming Soon:</strong> No API keys required, advanced templates, scheduling integration, and priority support!
            <span className="block mt-1 text-xs text-slate-300">
              Want early access? Update your API keys now and get notified when premium features launch.
            </span>
          </p>
        </div>
      </div>

      {!isDefaultGeminiEnvKeyAvailable && !apiKeys.geminiApiKey && ( // Show only if no default AND no user-provided Gemini key
        <div className="w-full max-w-3xl p-6 mb-6 border border-slate-600/30 rounded-xl flex items-start backdrop-blur-sm">
          <Info className="h-6 w-6 mr-3 mt-1 text-sky-400 shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-2">🔑 Quick API Setup</h3>
            <p className="text-sm leading-relaxed text-slate-200">
              Get your free Google Gemini API key to start generating professional medical marketing content. 
              <span className="block mt-2 text-slate-300">
                📱 <strong className="text-white">Need help?</strong> <a href="https://aistudio.google.com" target="_blank" className="underline hover:text-sky-300 transition-colors text-sky-400">Get your key here</a> - it's completely free!
              </span>
            </p>
          </div>
        </div>
      )}
      
      {error && (
         <div className="w-full max-w-3xl p-4 mb-6 bg-red-500/20 border border-red-600 text-red-200 rounded-lg flex items-start">
            <AlertTriangle className="h-6 w-6 mr-3 mt-1 text-red-400 shrink-0" />
            <div>
                <h3 className="font-semibold text-red-300">Error</h3>
                <p className="text-sm">{error}</p>
            </div>
        </div>
      )}

      <main className="w-full max-w-5xl space-y-8">
        {showApiKeyWallet ? (
          <ApiKeyWallet 
            onSave={handleApiKeysSave} 
            initialKeys={apiKeys} 
            isGeminiKeyFromEnvAvailable={isDefaultGeminiEnvKeyAvailable} 
          />
        ) : (
          <>
            <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  💡 <strong>Tip:</strong> Premium plans coming soon - no API keys needed!
                </div>
                <div className="flex space-x-4">
                  <button 
                      onClick={() => setShowApiStatusChecker(!showApiStatusChecker)} 
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                      {showApiStatusChecker ? 'Hide System Check' : 'System Check'}
                  </button>
                  <button 
                      onClick={resetApiKeySetup} 
                      className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                  >
                      Edit API Keys
                  </button>
                </div>
            </div>
            
            {showApiStatusChecker && (
              <div className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm mb-8">
                <ApiStatusChecker apiKeys={apiKeys} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm">
                <GeneratorForm onSubmit={handleGenerateContent} isLoading={isLoading} />
              </div>
              <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm">
                <HelpGuide />
              </div>
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10">
            <Spinner />
            <p className="mt-4 text-sky-300">Generating brilliant marketing content...</p>
          </div>
        )}

        {generatedContent && !isLoading && (
          <ResultsDisplay contentSet={generatedContent} />
        )}
      </main>

      <footer className="w-full max-w-5xl mt-12 py-6 text-center text-slate-500">
        <div className="p-4 mb-6 border border-slate-600/30 rounded-lg text-sm flex items-start backdrop-blur-sm">
          <Info className="h-5 w-5 mr-3 mt-0.5 text-sky-400 shrink-0" />
          <p className="text-slate-300">{MEDICAL_DISCLAIMER}</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-xs text-slate-500">
            Built with ❤️ by <span className="text-orange-400 font-semibold">GreyBrain.ai</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
