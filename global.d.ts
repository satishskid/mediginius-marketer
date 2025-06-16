
// This file is used to declare global types, specifically augmenting the Window interface.

interface ClerkInstance {
  loaded: boolean;
  // Add other properties or methods of the Clerk object if you access them directly via window.Clerk
  // For example:
  // openSignIn: (options?: any) => void;
  // signOut: (options?: any) => Promise<void>;
  // user?: any; // etc.
}

declare global {
  interface Window {
    Clerk?: ClerkInstance;
  }
}

// Export an empty object to make this file a module, ensuring 'declare global' works as expected.
// This is a common practice for .d.ts files that only contain global declarations.
export {};
