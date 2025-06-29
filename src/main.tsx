import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = "pk_test_c2hhcnAtbGlnZXItMjQuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      baseTheme: undefined,
      variables: {
        colorPrimary: '#2563eb',
        colorText: '#1f2937',
        colorTextSecondary: '#6b7280',
        colorBackground: '#ffffff',
        colorInputBackground: '#ffffff',
        colorInputText: '#1f2937',
        borderRadius: '0.5rem'
      }
    }}
    afterSignInUrl="/"
    afterSignUpUrl="/"
    signInUrl="/auth"
    signUpUrl="/auth"
    // Force redirect mode for OAuth on mobile
    signInForceRedirectUrl="/"
    signUpForceRedirectUrl="/"
  >
    <App />
  </ClerkProvider>
);