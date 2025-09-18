import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { WhitelistService } from '../../services/whitelistService';
import { Card } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      if (!data.session) {
        navigate('/login', { replace: true });
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/login', { replace: true });
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-slate-400">Loading...</div>;
  }
  if (!session) {
    return null;
  }

  // Allow SSO callback paths to pass through without redirect
  const isSSOCallback = window.location.pathname.includes('/login/sso-callback');
  if (isSSOCallback) {
    return null; // Let Clerk handle the callback
  }

  // Check for email verification
  const email = session.user.email;
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

  // Check whitelist
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
