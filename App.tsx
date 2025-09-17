import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ApiKeys } from './types';
import { DEFAULT_API_KEYS, API_KEY_STORAGE_KEY } from './constants';
import { RouteGuard } from './components/auth/RouteGuard';
import { LoginPage } from './components/auth/LoginPage';
import { ApiKeySetup } from './components/auth/ApiKeySetup';
import { MainApp } from './components/MainApp';

const App: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isApiKeysConfigured, setIsApiKeysConfigured] = useState<boolean>(false);

  useEffect(() => {
    const storedKeys = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKeys) {
      try {
        const parsedKeys = JSON.parse(storedKeys) as Partial<ApiKeys>;
        if (parsedKeys.geminiApiKey) {
          setApiKeys({ ...DEFAULT_API_KEYS, ...parsedKeys });
          setIsApiKeysConfigured(true);
        }
      } catch (e) {
        console.error("Failed to parse stored API keys", e);
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    }
  }, []);

  const handleApiKeysSubmitted = (keys: ApiKeys) => {
    setApiKeys(keys);
    setIsApiKeysConfigured(true);
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(keys));
  };

  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/setup"
            element={
              <RouteGuard>
                <ApiKeySetup
                  onKeysSubmitted={handleApiKeysSubmitted}
                  existingKeys={apiKeys}
                />
              </RouteGuard>
            }
          />
          <Route
            path="/"
            element={
              <RouteGuard>
                {!isApiKeysConfigured ? (
                  <Navigate to="/setup" replace />
                ) : (
                  <MainApp
                    apiKeys={apiKeys}
                    onUpdateApiKeys={handleApiKeysSubmitted}
                  />
                )}
              </RouteGuard>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
