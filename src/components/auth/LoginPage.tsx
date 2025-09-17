import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to MediGenius</h2>
          <p className="mt-2 text-gray-600">Please sign in to continue</p>
        </div>
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "bg-white shadow-lg rounded-lg p-6",
              headerTitle: "text-2xl font-bold text-center",
              formButtonPrimary: "w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            },
          }}
        />
      </div>
    </div>
  );
};
