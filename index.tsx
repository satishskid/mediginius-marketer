/// <reference path="./global.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from "@clerk/clerk-react";

// IMPORTANT: Get Clerk Publishable Key from environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'your_clerk_publishable_key_here') {
  console.error(
    "❌ Clerk Publishable Key is not properly configured! " +
    "Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables. " +
    "Get your key from: https://dashboard.clerk.com/last-active?path=api-keys"
  );
  // Show user-friendly error message instead of crashing
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #1e293b, #0f172a); color: white; font-family: system-ui;">
      <div style="max-width: 500px; padding: 2rem; text-align: center; background: rgba(15, 23, 42, 0.8); border-radius: 1rem; border: 1px solid #334155;">
        <h1 style="color: #f87171; margin-bottom: 1rem;">⚠️ Configuration Required</h1>
        <p style="margin-bottom: 1rem; color: #cbd5e1;">MediGenius needs a Clerk authentication key to work properly.</p>
        <p style="margin-bottom: 1.5rem; color: #94a3b8; font-size: 0.9rem;">
          Please set the <code style="background: #334155; padding: 0.2rem 0.4rem; border-radius: 0.25rem;">VITE_CLERK_PUBLISHABLE_KEY</code> 
          environment variable in your Netlify dashboard.
        </p>
        <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" 
           style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: 500;">
          Get Clerk API Key →
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(errorDiv);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Only render the app if we have a valid Clerk key
if (PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here') {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  // The error message has already been shown above
  console.log("App not rendered due to missing Clerk publishable key");
}
