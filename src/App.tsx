import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  useUser,
  UserButton 
} from '@clerk/clerk-react';
import { Shield } from 'lucide-react';
import Home from './components/Home';
import { AdminPanel } from '../components/AdminPanel';

// Admin role check using Clerk metadata
const useIsAdmin = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role === 'admin';
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 flex flex-col items-center p-4">
      <header className="w-full max-w-5xl py-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-sky-300">MediGenius</h1>
          <p className="mt-2 text-slate-400 text-lg">AI-Powered Content for Indian Healthcare Marketers</p>
          <p className="mt-1 text-xs text-slate-400">
            Powered by <span className="text-orange-400 font-semibold">GreyBrain.ai</span>
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              const adminPanel = document.getElementById('admin-panel');
              if (adminPanel) {
                adminPanel.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
            title="Admin Dashboard"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </button>
        )}
      </header>

      <main className="w-full max-w-5xl space-y-8">
        <Home />
        
        {isAdmin && (
          <div id="admin-panel" className="mt-12 pt-12 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-red-400 mb-6">Admin Panel</h2>
            <AdminPanel />
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    throw new Error('Missing Clerk publishable key');
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <AuthWrapper>
                <MainContent />
              </AuthWrapper>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
