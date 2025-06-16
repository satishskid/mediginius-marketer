
import React, { useState, useEffect } from 'react';
import { ApiKeys } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { KeyRound, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

interface ApiKeyWalletProps {
  onSave: (keys: ApiKeys) => void;
  initialKeys: ApiKeys;
  isGeminiKeyFromEnvAvailable: boolean; // Renamed for clarity
}

export const ApiKeyWallet: React.FC<ApiKeyWalletProps> = ({ onSave, initialKeys, isGeminiKeyFromEnvAvailable }) => {
  const [keys, setKeys] = useState<ApiKeys>(initialKeys);

  // Sync with initialKeys if they change (e.g. after env check in App.tsx)
  useEffect(() => {
    setKeys(initialKeys);
  }, [initialKeys]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeys({ ...keys, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(keys);
  };

  return (
    <Card
      title={
        <>
          <KeyRound className="mr-2 h-6 w-6 text-sky-400" /> API Key Wallet (BYOK)
        </>
      }
      className="max-w-xl mx-auto"
      titleClassName="flex items-center"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {isGeminiKeyFromEnvAvailable ? (
          <div className="p-4 bg-green-500/10 border border-green-600 text-green-300 rounded-lg flex items-start">
            <ShieldCheck className="h-5 w-5 mr-2 mt-0.5 text-green-400 shrink-0" />
            <p className="text-sm">
              An API_KEY for Gemini/Imagen was detected from the app's environment. It will be used by default.
              You can optionally override it below.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-500/10 border border-yellow-600 text-yellow-300 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-400 shrink-0" />
            <p className="text-sm">
              No default API_KEY for Gemini/Imagen found in the app's environment. Please provide your own Gemini API key below for full functionality.
            </p>
          </div>
        )}

        <Input
          label={`Google Gemini API Key ${isGeminiKeyFromEnvAvailable ? '(Optional Override)' : '(Required for Gemini/Imagen)'}`}
          type="password"
          name="geminiApiKey"
          value={keys.geminiApiKey || ''}
          onChange={handleChange}
          placeholder="Enter your Google Gemini API key"
          autoComplete="off"
        />

        <Input
          label="Groq API Key (Optional, for fast text)"
          type="password"
          name="groqApiKey"
          value={keys.groqApiKey}
          onChange={handleChange}
          placeholder="Enter your Groq API key"
          autoComplete="off"
        />
        <Input
          label="OpenRouter API Key (Optional, for versatile text)"
          type="password"
          name="openRouterApiKey"
          value={keys.openRouterApiKey}
          onChange={handleChange}
          placeholder="Enter your OpenRouter API key"
          autoComplete="off"
        />
        {/* Stability API key is less critical if Imagen is primary, but can be kept for completeness or future use */}
        <Input
          label="Stability API Key (Optional, alternative image models)"
          type="password"
          name="stabilityApiKey"
          value={keys.stabilityApiKey}
          onChange={handleChange}
          placeholder="Enter your Stability AI API key"
          autoComplete="off"
        />
        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg">
            Save API Keys & Proceed
          </Button>
        </div>
        <div className="p-3 bg-sky-800/30 border border-sky-700 text-sky-300 text-xs rounded-lg flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-sky-400"/>
            <span>
              Your API keys are stored in your browser's local storage and are used directly from your browser to call the respective AI services (BYOK model).
            </span>
        </div>
      </form>
    </Card>
  );
};