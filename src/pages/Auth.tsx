import React, { useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMobile } from '@/hooks/useMobile';
import { useSearchParams } from 'react-router-dom';

const Auth = () => {
  const { isNative } = useMobile();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'signin';

  // Handle OAuth redirects
  useEffect(() => {
    const handleOAuthRedirect = () => {
      // Check if we're returning from an OAuth redirect
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('__clerk_oauth_state')) {
        // Let Clerk handle the OAuth callback
        console.log('Handling OAuth redirect...');
      }
    };

    handleOAuthRedirect();
  }, []);

  const commonAppearance = {
    elements: {
      card: 'shadow-none border-none',
      headerTitle: 'hidden',
      headerSubtitle: 'hidden',
      socialButtonsBlockButton: 'w-full min-h-[44px]',
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 min-h-[44px]',
      formFieldInput: 'min-h-[44px]',
      footerActionLink: 'text-blue-600',
      // Ensure OAuth buttons work properly
      socialButtonsProviderIcon: 'w-5 h-5',
      socialButtonsBlockButtonText: 'text-sm font-medium'
    },
    layout: {
      socialButtonsPlacement: 'top' as const,
      showOptionalFields: false
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4 ${isNative ? 'safe-area-top safe-area-bottom' : ''}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🤿</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dive Trip Organizer</h1>
          <p className="text-gray-600">Sign in to manage your dive trips</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Tabs value={tab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-t-lg">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="p-6">
                <SignIn 
                  appearance={commonAppearance}
                  routing="path"
                  path="/auth"
                  signUpUrl="/auth?tab=signup"
                  afterSignInUrl="/"
                  redirectUrl="/"
                  // Force redirect mode for OAuth
                  forceRedirectUrl="/"
                />
              </TabsContent>
              
              <TabsContent value="signup" className="p-6">
                <SignUp 
                  appearance={commonAppearance}
                  routing="path"
                  path="/auth"
                  signInUrl="/auth?tab=signin"
                  afterSignUpUrl="/"
                  redirectUrl="/"
                  // Force redirect mode for OAuth
                  forceRedirectUrl="/"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;