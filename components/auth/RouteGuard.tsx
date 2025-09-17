import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { WhitelistService } from '../../services/whitelistService';
import { Card } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isSignedIn, user } = useAuth();

  if (!isSignedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 flex flex-col justify-center items-center p-4">
        <Card className="max-w-md w-full backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Email Required</h2>
                <p className="text-slate-300 text-sm">
                  A verified email address is required to use this application. Please update your profile with a valid email.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const isWhitelisted = WhitelistService.isWhitelisted(email);
  if (!isWhitelisted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 flex flex-col justify-center items-center p-4">
        <Card className="max-w-md w-full backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-3 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Access Restricted</h2>
                <p className="text-slate-300 text-sm">
                  Your email address ({email}) is not whitelisted. Please contact an administrator to request access.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
