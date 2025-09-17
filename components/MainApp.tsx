import React, { useState, useCallback } from 'react';
import { ApiKeys, ContentGenerationParams, GeneratedContentSet, ChannelType } from '../types';
import { APP_NAME, DEFAULT_API_KEYS, CHANNEL_OPTIONS } from '../constants';
import { GeneratorForm } from './GeneratorForm';
import { ResultsDisplay } from './ResultsDisplay';
import { WhitelistManager } from './WhitelistManager';
import { useWhitelist } from '../services/whitelistService';
import { generateSingleChannelWithGemini } from '../services/geminiService';
import { generateMockContent } from '../services/mockApiService';
import { Spinner } from './ui/Spinner';
import { Shield } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { SettingsButton } from './guided/SettingsButton';

interface MainAppProps {
  apiKeys: ApiKeys;
  onUpdateApiKeys: (keys: ApiKeys) => void;
}

export const MainApp: React.FC<MainAppProps> = ({ apiKeys, onUpdateApiKeys }) => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentSet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isAdmin } = useWhitelist(user?.primaryEmailAddress?.emailAddress || null);

  const handleGenerateContent = useCallback(async (params: ContentGenerationParams) => {
    if (!apiKeys.geminiApiKey && !apiKeys.groqApiKey && !apiKeys.openRouterApiKey) {
      setError("No API keys available. Please provide a Gemini API key for best results, or Groq/OpenRouter keys for limited functionality.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const textChannels = CHANNEL_OPTIONS.filter(opt => opt.value !== ChannelType.GENERATED_IMAGE);
      const results: GeneratedContentSet = {};

      for (const channel of textChannels) {
        try {
          let content = '';
          if (apiKeys.geminiApiKey) {
            content = await generateSingleChannelWithGemini(params, channel.value, apiKeys.geminiApiKey);
          } else {
            content = await generateMockContent(params, channel.value);
          }
          results[channel.value] = content;
        } catch (err) {
          console.error(`Failed to generate content for ${channel.value}:`, err);
          results[channel.value] = `Error generating content: ${err.message}`;
        }
      }

      setGeneratedContent(results);
    } catch (e: any) {
      console.error("Content generation failed:", e);
      setError(e.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [apiKeys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-5xl py-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-sky-300">{APP_NAME}</h1>
          <p className="mt-2 text-slate-400 text-lg">AI-Powered Content for Indian Healthcare Marketers</p>
        </div>

        <div className="flex items-center space-x-4">
          {isAdmin && (
            <button
              onClick={() => {
                const adminPanel = document.getElementById('admin-panel');
                if (adminPanel) {
                  adminPanel.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
              title="Admin Dashboard"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </button>
          )}
          <SettingsButton apiKeys={apiKeys} />
        </div>
      </header>

      <main className="w-full max-w-5xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <GeneratorForm onSubmit={handleGenerateContent} isLoading={isLoading} />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10">
            <Spinner />
            <p className="mt-4 text-sky-300">Generating brilliant marketing content...</p>
          </div>
        )}

        {generatedContent && !isLoading && (
          <ResultsDisplay contentSet={generatedContent} />
        )}

        {isAdmin && (
          <div id="admin-panel" className="mt-12 pt-12 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-red-400 mb-6">Admin Panel</h2>
            <WhitelistManager />
          </div>
        )}
      </main>
    </div>
  );
};
