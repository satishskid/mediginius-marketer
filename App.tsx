
import React, { useState, useEffect, useCallback } from 'react';
import { ApiKeys, ContentGenerationParams, GeneratedContentSet, ChannelType } from './types';
import { APP_NAME, MEDICAL_DISCLAIMER, DEFAULT_API_KEYS, API_KEY_STORAGE_KEY, CHANNEL_OPTIONS } from './constants';
import { ApiKeyWallet } from './components/ApiKeyWallet';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Planner } from './components/Planner';
import { generateContentWithGemini, generateImageWithImagen, checkDefaultGeminiEnvKey } from './services/geminiService';
import { generateMockContent } from './services/mockApiService';
import { Spinner } from './components/ui/Spinner';
import { AlertTriangle, Info, LogIn } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useAuth, SignIn, SignUp, RedirectToSignIn } from "@clerk/clerk-react";

const AppContent: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isApiKeySetupDone, setIsApiKeySetupDone] = useState<boolean>(false);
  const [isDefaultGeminiEnvKeyAvailable, setIsDefaultGeminiEnvKeyAvailable] = useState<boolean>(false);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentSet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return; 

    const defaultEnvKey = checkDefaultGeminiEnvKey();
    setIsDefaultGeminiEnvKeyAvailable(!!defaultEnvKey);

    const storedKeys = localStorage.getItem(API_KEY_STORAGE_KEY);
    let activeApiKeys = { ...DEFAULT_API_KEYS };

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

  }, [isSignedIn]);

  const handleApiKeysSave = useCallback((keysFromWallet: ApiKeys) => {
    if (!isSignedIn) return;
    
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
  }, [isDefaultGeminiEnvKeyAvailable, isSignedIn]);

  const handleGenerateContent = useCallback(async (params: ContentGenerationParams) => {
    if (!isSignedIn) return;

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
            content = await generateContentWithGemini(params, channel, userProvidedGeminiKey);
          }
          // Fallback to mock/other APIs if Gemini not designated or not available for the channel type
          else if ((apiKeys.groqApiKey || apiKeys.openRouterApiKey) && 
                   (channel === ChannelType.INSTAGRAM || channel === ChannelType.FACEBOOK || channel === ChannelType.WHATSAPP || channel === ChannelType.GOOGLE_BUSINESS || channel === ChannelType.AD_COPY)) {
            content = await generateMockContent(params, channel, apiKeys.groqApiKey || apiKeys.openRouterApiKey);
          }
          // If Gemini is available and preferred but other keys also exist for mockable channels (e.g. ad_copy)
          // ensure Gemini is still used if it's explicitly for that channel.
          else if (userProvidedGeminiKey && (channel === ChannelType.AD_COPY || channel === ChannelType.INSTAGRAM || channel === ChannelType.FACEBOOK || channel === ChannelType.WHATSAPP || channel === ChannelType.GOOGLE_BUSINESS)){
            content = await generateContentWithGemini(params, channel, userProvidedGeminiKey);
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
  }, [apiKeys, isSignedIn]);

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
        </div>
        <UserButton afterSignOutUrl={window.location.href} />
      </header>

      {!isDefaultGeminiEnvKeyAvailable && !apiKeys.geminiApiKey && ( // Show only if no default AND no user-provided Gemini key
        <div className="w-full max-w-3xl p-4 mb-6 bg-yellow-500/20 border border-yellow-600 text-yellow-200 rounded-lg flex items-start">
          <AlertTriangle className="h-6 w-6 mr-3 mt-1 text-yellow-400 shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-300">Google Gemini API Key Recommended</h3>
            <p className="text-sm">
              No default Google API key (API_KEY) was found in the application's environment, and you haven't provided one in the API Wallet.
              A Gemini key is crucial for generating high-quality text and images. Please provide one in the API Wallet for full functionality.
              You can still use the app with other API keys (Groq, OpenRouter) for some text content if provided.
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
            <div className="flex justify-end">
                <button 
                    onClick={resetApiKeySetup} 
                    className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                    Edit API Keys
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
                <GeneratorForm onSubmit={handleGenerateContent} isLoading={isLoading} />
              </div>
              <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
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
        <div className="p-4 mb-6 bg-sky-800/30 border border-sky-700 rounded-lg text-sm flex items-start">
          <Info className="h-5 w-5 mr-3 mt-0.5 text-sky-400 shrink-0" />
          <p>{MEDICAL_DISCLAIMER}</p>
        </div>
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved (concept).</p>
      </footer>
    </div>
  );
};


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  let CurrentPage;
  switch (route) {
    case '#/sign-in':
      CurrentPage = () => <div className="flex justify-center items-center min-h-screen p-4"><SignIn path="/sign-in" routing="hash" signUpPath="/sign-up" redirectUrl="#/" /></div>;
      break;
    case '#/sign-up':
      CurrentPage = () => <div className="flex justify-center items-center min-h-screen p-4"><SignUp path="/sign-up" routing="hash" signInPath="/sign-in" redirectUrl="#/" /></div>;
      break;
    case '#/':
    default:
      CurrentPage = () => (
        <>
          <SignedIn>
            <AppContent />
          </SignedIn>
          <SignedOut>
             {/* This will redirect to #/sign-in because of the path prop on SignIn */}
             <RedirectToSignIn redirectUrl="#/sign-in" />
          </SignedOut>
        </>
      );
  }
  
  return <CurrentPage />;
};

export default App;