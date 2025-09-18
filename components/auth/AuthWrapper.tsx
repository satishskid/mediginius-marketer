import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  // In the Supabase setup, RouteGuard handles session enforcement
  return <>{children}</>;
};
