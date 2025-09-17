import React, { useState } from 'react';
import { ApiKeyStorage } from './ApiKeyStorage';

interface ApiKeySetupProps {
  onKeyConfigured: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeyConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError(null);

    try {
      const isValid = await ApiKeyStorage.validateApiKey(apiKey);
      
      if (isValid) {
        ApiKeyStorage.storeApiKey(apiKey);
        onKeyConfigured();
      } else {
        setError('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setError('Failed to validate API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">API Key Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your Gemini API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your API Key"
            required
          />
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isValidating}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Save API Key'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Your API key will be securely stored in your browser and only used for making requests to the Gemini API.
      </p>
    </div>
  );
};
