import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RouteGuard } from './components/auth/RouteGuard';
import { LoginPage } from './components/auth/LoginPage';
import { ApiKeySetup } from './components/auth/ApiKeySetup';
import { MainApp } from './components/MainApp';
import { DEFAULT_API_KEYS } from './constants';
import { ApiKeys } from './types';

const App: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);

  const handleApiKeysSubmitted = (keys: ApiKeys) => {
    setApiKeys(keys);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/setup"
          element={
            <RouteGuard>
              <ApiKeySetup onKeysSubmitted={handleApiKeysSubmitted} existingKeys={apiKeys} />
            </RouteGuard>
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard>
              <MainApp apiKeys={apiKeys} onUpdateApiKeys={handleApiKeysSubmitted} />
            </RouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
