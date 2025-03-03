import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Get client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  // If no client ID is available, create a mock provider that just renders children
  if (!GOOGLE_CLIENT_ID) {
    return (
      <div data-testid="mock-google-provider">
        {children}
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
