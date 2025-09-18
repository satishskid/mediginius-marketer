import React, { useState, useEffect, useCallback } from 'react';
import { ApiKeys, ContentGenerationParams, GeneratedContentSet, ChannelType } from './types';
import { APP_NAME, MEDICAL_DISCLAIMER, DEFAULT_API_KEYS, API_KEY_STORAGE_KEY, CHANNEL_OPTIONS } from './constants';
import { ApiKeyWallet } from './components/ApiKeyWallet';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Planner } from './components/Planner';
import { generateSingleChannelWithGemini, generateImageWithImagen, checkDefaultGeminiEnvKey } from './services/geminiService';
import { generateMockContent } from './services/mockApiService';
import { Spinner } from './components/ui/Spinner';
import { AlertTriangle, Info } from 'lucide-react';
import { GuidedBYOKApp } from './components/guided/GuidedBYOKApp';
import { ContentGenerationService } from './services/byok/ContentGenerationService';

const AppContent: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isApiKeySetupDone, setIsApiKeySetupDone] = useState<boolean>(false);
  const [isDefaultGeminiEnvKeyAvailable, setIsDefaultGeminiEnvKeyAvailable] = useState<boolean>(false);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentSet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(false);

  useEffect(() => {
    const defaultEnvKey = checkDefaultGeminiEnvKey();
    setIsDefaultGeminiEnvKeyAvailable(!!defaultEnvKey);

    const storedKeys = localStorage.getItem(API_KEY_STORAGE_KEY);
    let activeApiKeys: ApiKeys = { ...DEFAULT_API_KEYS };

    if (storedKeys) {
      try {
        const parsedKeys = JSON.parse(storedKeys) as Partial<ApiKeys>; // Use Partial to avoid issues with missing geminiApiKey initially
        activeApiKeys = { ...activeApiKeys, ...parsedKeys };
      } catch (e) {
        console.error("Failed to parse stored API keys", e);
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    }
    
    // If a default env key is available and user hasn't provided one, use it.
    // However, user-provided key in localStorage takes precedence if `activeApiKeys.geminiApiKey` is already set from there.
    if (defaultEnvKey && !activeApiKeys.geminiApiKey) {
      activeApiKeys.geminiApiKey = defaultEnvKey; 
    }
    setApiKeys(activeApiKeys);

    // Setup is considered done if user has provided any key, or if a default Gemini key is available.
    if (activeApiKeys.geminiApiKey || activeApiKeys.groqApiKey || activeApiKeys.openRouterApiKey || activeApiKeys.stabilityApiKey) {
        setIsApiKeySetupDone(true);
    } else {
        setIsApiKeySetupDone(false); // No keys at all, force to wallet
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
        geminiApiKey: finalGeminiKey || null, // Ensure it's null if truly empty
    };

    setApiKeys(newApiKeys);
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(newApiKeys));
    
    if (newApiKeys.geminiApiKey || newApiKeys.groqApiKey || newApiKeys.openRouterApiKey || newApiKeys.stabilityApiKey) {
        setIsApiKeySetupDone(true);
    } else {
        setIsApiKeySetupDone(false); // If all keys are cleared, show wallet again
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

      // Image generation using Imagen (which uses the Gemini key)
      if (apiKeys.geminiApiKey && results[ChannelType.IMAGE_PROMPT] && !results[ChannelType.IMAGE_PROMPT].error && results[ChannelType.IMAGE_PROMPT].content) {
        try {
          const imagePromptText = results[ChannelType.IMAGE_PROMPT].content;
          const imageBase64 = await generateImageWithImagen(imagePromptText, apiKeys.geminiApiKey);
          results[ChannelType.GENERATED_IMAGE] = { channel: ChannelType.GENERATED_IMAGE, content: imageBase64 };
        } catch (e: any) {
          console.error(`Error generating image with Imagen:`, e);
          results[ChannelType.GENERATED_IMAGE] = { 
            channel: ChannelType.GENERATED_IMAGE, 
            content: 'Image generation failed.', 
            error: e.message || 'Failed to generate image.' 
          };
        }
      } else if (apiKeys.geminiApiKey) { // If Gemini key was there but prompt failed or was empty
        results[ChannelType.GENERATED_IMAGE] = { 
          channel: ChannelType.GENERATED_IMAGE, 
          content: 'Image generation skipped.', 
          error: results[ChannelType.IMAGE_PROMPT]?.error ? `Skipped due to image prompt error: ${results[ChannelType.IMAGE_PROMPT.toString()].error}` : 'Skipped because image prompt was not generated or Gemini key missing.'
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

  const handleCampaignComplete = useCallback(async (campaign: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create ContentGenerationParams from the campaign data
      const contentParams: ContentGenerationParams = {
        specialty: campaign.client.specialty,
        location: `${campaign.client.location.city}, ${campaign.client.location.state}`,
        targetAudience: campaign.audience.label,
        topic: campaign.intent.title,
        tone: campaign.intent.description.substring(0, 50)
      };

      // Use ContentGenerationService to generate content
      const contentService = new ContentGenerationService();
      const result = await contentService.generateCampaignContent(
        {
          client: campaign.client,
          audience: campaign.audience,
          intent: campaign.intent
        },
        apiKeys,
        ['instagram', 'facebook', 'whatsapp'] // Default platforms
      );

      if (result.success && result.content.length > 0) {
        // Convert the result to GeneratedContentSet format
        const generatedResults: GeneratedContentSet = {};
        result.content.forEach(item => {
          generatedResults[item.platform] = {
            channel: item.platform as ChannelType,
            content: item.content,
            error: undefined,
            metadata: { generatedBy: 'guided' }
          };
        });
        setGeneratedContent(generatedResults);
      } else {
        setError(result.errors.join(', ') || 'Failed to generate content');
      }
    } catch (err: any) {
      console.error('Campaign content generation failed:', err);
      setError(err.message || 'Failed to generate campaign content');
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
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400">
            {APP_NAME}
          </h1>
          <p className="mt-2 text-slate-400 text-lg">AI-Powered Content for Indian Healthcare Marketers</p>
          <p className="mt-1 text-xs text-slate-400">
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 font-semibold">GreyBrain.ai</span>
          </p>
        </div>
      </header>

      {/* Introductory Section */}
      <div className="w-full max-w-4xl mb-8 p-8 border border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-300 mb-4">
            🩺 Welcome to MediGenius AI
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Your intelligent assistant for creating professional healthcare marketing content tailored for Indian medical practices
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-sky-300 flex items-center">
              <span className="mr-2">🎯</span> What is MediGenius?
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              MediGenius generates customized marketing content for healthcare professionals across multiple channels - from Instagram posts to Google Business updates, blog ideas to video scripts - all tailored to your medical specialty and local audience.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-300 flex items-center">
              <span className="mr-2">🚀</span> How to Use
            </h3>
            <div className="text-slate-400 text-sm space-y-2">
              <p><span className="text-sky-400 font-medium">1.</span> Add your Google Gemini API key below (free from Google AI Studio)</p>
              <p><span className="text-sky-400 font-medium">2.</span> Fill in your specialty, location, and target audience</p>
              <p><span className="text-sky-400 font-medium">3.</span> Get AI-generated content for all major platforms instantly!</p>
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
                <button 
                    onClick={resetApiKeySetup} 
                    className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                    Edit API Keys
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-slate-700/50 p-1 rounded-lg flex">
                    <button
                      onClick={() => setIsGuidedMode(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        !isGuidedMode
                          ? 'bg-sky-500 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                      }`}
                    >
                      Quick Generate
                    </button>
                    <button
                      onClick={() => setIsGuidedMode(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        isGuidedMode
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                      }`}
                    >
                      Guided Campaign
                    </button>
                  </div>
                </div>

                {isGuidedMode ? (
                  <GuidedBYOKApp
                    onCampaignComplete={handleCampaignComplete}
                    onBackToMain={() => setIsGuidedMode(false)}
                  />
                ) : (
                  <GeneratorForm onSubmit={handleGenerateContent} isLoading={isLoading} />
                )}
              </div>
              <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm">
                <Planner />
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
            Built with ❤️ by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 font-semibold">GreyBrain.ai</span>
          </p>
        </div>
      </footer>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <>
      {/* You will add Supabase Auth logic here later */}
      <AppContent />
    </>
  );
};

export default App;
