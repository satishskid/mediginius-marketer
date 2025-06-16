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
    "Please replace 'YOUR_CLERK_PUBLISHABLE_KEY' in index.tsx (and index.html) " +
    "with your actual key from dashboard.clerk.com for authentication to work."
  );
  // Optional: Display a message to the user on the page itself
  const rootElementError = document.getElementById('root');
  if (rootElementError) {
    rootElementError.innerHTML = '<div style="padding: 20px; text-align: center; background-color: #ffcccc; border: 1px solid red; color: black;">' +
                                 '<h1>Clerk Configuration Error</h1>' +
                                 '<p>The Clerk Publishable Key is missing or invalid. Please contact the site administrator or check the console.</p>' +
                                 '</div>';
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const renderApp = () => {
  // Ensure the error message is cleared if we proceed to render
  if (rootElement.firstChild && rootElement.firstChild.textContent?.includes('Clerk Configuration Error')) {
    rootElement.innerHTML = ''; // Clear the error message
  }
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
};

// Wait for Clerk to be fully initialized and ready
// The 'clerk-loaded' custom event is dispatched from index.html
const clerkLoadedHandler = () => {
  if (window.Clerk && window.Clerk.loaded) { // Double check if Clerk reports itself as loaded
     renderApp();
  } else {
    // This case should ideally not be hit if 'clerk-loaded' is dispatched correctly
    // after window.Clerk.load() promise resolves.
    console.warn("Clerk-loaded event fired, but window.Clerk.loaded is false. Retrying or investigate further.");
    // Fallback or retry logic can be added here if necessary.
    // For now, we'll still attempt to render.
    renderApp(); 
  }
};

// Listen for the custom event dispatched from index.html
document.addEventListener('clerk-loaded', clerkLoadedHandler, { once: true });

// Fallback: If Clerk is already loaded by the time this script runs (e.g., cached)
// This check might be redundant if the event listener is robust, but can be a safeguard.
if (window.Clerk?.loaded && PUBLISHABLE_KEY !== 'YOUR_CLERK_PUBLISHABLE_KEY') {
   // Check if the event was already dispatched and handled
   // This is tricky; usually, the event listener is the primary mechanism.
   // If renderApp hasn't been called yet, call it.
   // To avoid double rendering, ensure renderApp is idempotent or guarded.
   console.log("Clerk was already loaded, attempting to render app if not already done.");
   // A simple guard: only call if root has no children or just the error message
   if (!rootElement.firstChild || rootElement.firstChild.textContent?.includes('Clerk Configuration Error')) {
       clerkLoadedHandler(); // Use the same handler
   }
}
