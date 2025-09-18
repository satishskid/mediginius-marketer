import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://medginius.netlify.app/';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: SITE_URL,
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-4">
      <div className="max-w-md w-full mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">M</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to MediGenius</h1>
        <p className="text-slate-400">AI-Powered Healthcare Marketing Assistant</p>
      </div>
      <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-xl shadow-xl p-8 flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
        {message && <div className="text-center text-sky-300 mt-2">{message}</div>}
      </form>
      <div className="mt-8 text-center text-sm text-slate-400">
        <p>Protected by industry-standard encryption</p>
        <p className="mt-1">Healthcare compliant & secure</p>
      </div>
    </div>
  );
};
