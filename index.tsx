/// <reference path="./global.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from "@clerk/clerk-react";

// IMPORTANT: Get Clerk Publishable Key from environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Zmxvd2luZy13aWxkY2F0LTY2LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'your_clerk_publishable_key_here') {
  console.error(
    "Clerk Publishable Key is not properly configured! " +
    "Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables. " +
    "Current value:", PUBLISHABLE_KEY
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
