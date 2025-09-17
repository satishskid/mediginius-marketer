import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ApiKeyStorage } from './ApiKeyStorage';
import { ApiKeySetup } from './ApiKeySetup';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    // Check if user has a valid API key
    const checkApiKey = async () => {
      const storedKey = ApiKeyStorage.getApiKey();
      if (storedKey) {
        const isValid = await ApiKeyStorage.validateApiKey(storedKey);
        setHasApiKey(isValid);
        if (!isValid) {
          ApiKeyStorage.removeApiKey();
        }
      } else {
        setHasApiKey(false);
      }
      setIsCheckingApiKey(false);
    };

    checkApiKey();
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded || isCheckingApiKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }

  if (!hasApiKey) {
    return <ApiKeySetup onKeyConfigured={() => setHasApiKey(true)} />;
  }

  return <>{children}</>;
};
