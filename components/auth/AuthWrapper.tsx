import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignIn,
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useWhitelist } from '../../services/whitelistService';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { isWhitelisted } = useWhitelist(user?.primaryEmailAddress?.emailAddress || null);
  const navigate = useNavigate();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // If signed in but not whitelisted, show access denied
  if (user && !isWhitelisted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-4">
            Your email domain is not whitelisted for this application. Please contact the administrator for access.
          </p>
          <button
            onClick={() => window.location.href = 'mailto:admin@medigenius.ai?subject=Access Request'}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
          >
            Request Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
