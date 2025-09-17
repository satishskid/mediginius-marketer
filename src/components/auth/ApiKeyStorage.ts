import { AES, enc } from 'crypto-js';

const STORAGE_KEY = 'medigenius_api_key';
const ENCRYPTION_KEY = 'medigenius_secure_storage'; // In production, this should be environment-specific

export const ApiKeyStorage = {
  storeApiKey: (apiKey: string): void => {
    try {
      const encryptedKey = AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
      localStorage.setItem(STORAGE_KEY, encryptedKey);
    } catch (error) {
      console.error('Error storing API key:', error);
      throw new Error('Failed to store API key securely');
    }
  },

  getApiKey: (): string | null => {
    try {
      const encryptedKey = localStorage.getItem(STORAGE_KEY);
      if (!encryptedKey) return null;
      
      const decryptedKey = AES.decrypt(encryptedKey, ENCRYPTION_KEY);
      return decryptedKey.toString(enc.Utf8);
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  },

  removeApiKey: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  validateApiKey: async (apiKey: string): Promise<boolean> => {
    try {
      // Make a test call to the Gemini API to validate the key
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:listModels', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
};
