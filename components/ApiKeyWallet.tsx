
import React, { useState, useEffect } from 'react';
import { ApiKeys } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { KeyRound, ShieldCheck, Info } from 'lucide-react';

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
          <KeyRound className="mr-2 h-6 w-6 text-sky-400" /> 🎯 Quick Setup - Add Your API Keys
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
              Great! Your Gemini API is configured and ready to generate amazing content.
              You can optionally provide your own key below to override the default.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-blue-500/10 border border-blue-400 text-blue-300 rounded-lg flex items-start">
            <Info className="h-5 w-5 mr-2 mt-0.5 text-blue-400 shrink-0" />
            <div className="text-sm">
              <p className="mb-2">🎯 <strong>Quick Setup:</strong> Add your Google Gemini API key to start creating professional medical marketing content!</p>
              <p className="text-xs text-blue-200">✨ Don't have a key? Get one free at <a href="https://aistudio.google.com" target="_blank" className="underline hover:text-blue-100">Google AI Studio</a></p>
            </div>
          </div>
        )}

        <Input
          label={`🔑 Google Gemini API Key ${isGeminiKeyFromEnvAvailable ? '(Optional Override)' : '(Free from Google AI Studio)'}`}
          type="password"
          name="geminiApiKey"
          value={keys.geminiApiKey || ''}
          onChange={handleChange}
          placeholder="Enter your Google Gemini API key"
          autoComplete="off"
        />

        <Input
          label="⚡ Groq API Key (Optional, for lightning-fast text)"
          type="password"
          name="groqApiKey"
          value={keys.groqApiKey}
          onChange={handleChange}
          placeholder="Enter your Groq API key (optional)"
          autoComplete="off"
        />
        <Input
          label="🌐 OpenRouter API Key (Optional, access multiple AI models)"
          type="password"
          name="openRouterApiKey"
          value={keys.openRouterApiKey}
          onChange={handleChange}
          placeholder="Enter your OpenRouter API key (optional)"
          autoComplete="off"
        />
        <Input
          label="🎨 Stability API Key (Optional, alternative image generation)"
          type="password"
          name="stabilityApiKey"
          value={keys.stabilityApiKey}
          onChange={handleChange}
          placeholder="Enter your Stability AI API key (optional)"
          autoComplete="off"
        />
        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg">
            🚀 Start Creating Amazing Content
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