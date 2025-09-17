import React from 'react';
import { SignIn } from "@clerk/clerk-react";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-4">
      <div className="max-w-md w-full mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">M</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to MediGenius</h1>
        <p className="text-slate-400">
          AI-Powered Healthcare Marketing Assistant
        </p>
      </div>

      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-xl shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-slate-700 hover:bg-slate-600 border-slate-600",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-400",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-700/50 border-slate-600 text-white",
              formButtonPrimary: "bg-sky-500 hover:bg-sky-600",
              footerActionLink: "text-sky-400 hover:text-sky-300",
            },
          }}
          redirectUrl="/setup"
          signUpUrl="/sign-up"
        />
      </div>

      <div className="mt-8 text-center text-sm text-slate-400">
        <p>Protected by industry-standard encryption</p>
        <p className="mt-1">Healthcare compliant & secure</p>
      </div>
    </div>
  );
};
