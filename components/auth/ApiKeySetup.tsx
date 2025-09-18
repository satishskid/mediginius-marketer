import React, { useState } from 'react';
import { ApiKeys } from '../../types';

interface ApiKeySetupProps {
  onKeysSubmitted: (keys: ApiKeys) => void;
  existingKeys?: ApiKeys;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({
  onKeysSubmitted,
  existingKeys
}) => {
  // Placeholder for Supabase Auth logic
  const [apiKeys, setApiKeys] = useState<ApiKeys>(existingKeys || {
    geminiApiKey: '',
    groqApiKey: '',
    openRouterApiKey: '',
    unsplashApiKey: ''
  });

  const [showKeys, setShowKeys] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onKeysSubmitted(apiKeys);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API Key Setup</h2>
        <p className="text-slate-400">
          Configure your API keys to get started. At minimum, you'll need a Gemini API key.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gemini API Key */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gemini API Key
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showKeys ? "text" : "password"}
              value={apiKeys.geminiApiKey}
              onChange={(e) => setApiKeys({ ...apiKeys, geminiApiKey: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter your Gemini API key"
              required
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Get your key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">Google AI Studio</a>
          </p>
        </div>

        {/* Optional API Keys */}
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-medium text-slate-300 mb-4">Optional API Keys</h3>
          
          {/* Groq API Key */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Groq API Key (Optional)
            </label>
            <input
              type={showKeys ? "text" : "password"}
              value={apiKeys.groqApiKey}
              onChange={(e) => setApiKeys({ ...apiKeys, groqApiKey: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter your Groq API key"
            />
          </div>

          {/* OpenRouter API Key */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OpenRouter API Key (Optional)
            </label>
            <input
              type={showKeys ? "text" : "password"}
              value={apiKeys.openRouterApiKey}
              onChange={(e) => setApiKeys({ ...apiKeys, openRouterApiKey: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter your OpenRouter API key"
            />
          </div>

          {/* Unsplash API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Unsplash API Key (Optional)
            </label>
            <input
              type={showKeys ? "text" : "password"}
              value={apiKeys.unsplashApiKey}
              onChange={(e) => setApiKeys({ ...apiKeys, unsplashApiKey: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter your Unsplash API key"
            />
          </div>
        </div>

        {/* Show/Hide Keys Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showKeys"
            checked={showKeys}
            onChange={() => setShowKeys(!showKeys)}
            className="rounded border-slate-600 text-sky-500 focus:ring-sky-500"
          />
          <label htmlFor="showKeys" className="text-sm text-slate-300">
            Show API keys
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Save API Keys
        </button>
      </form>

      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Security Note</h4>
        <p className="text-xs text-slate-400">
          Your API keys are stored securely in your browser's local storage and are never sent to our servers.
          They are only used to make direct API calls to the respective services.
        </p>
      </div>
    </div>
  );
};
