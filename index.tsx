/// <reference path="./global.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from "@clerk/clerk-react";

// IMPORTANT: Get Clerk Publishable Key from environment variable or fallback
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Zmxvd2luZy13aWxkY2F0LTY2LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'YOUR_CLERK_PUBLISHABLE_KEY') {
  console.error(
    "Clerk Publishable Key is not set or is a placeholder! " +
    "Please replace 'YOUR_CLERK_PUBLISHABLE_KEY' in index.tsx " +
    "with your actual key from dashboard.clerk.com for authentication to work."
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
