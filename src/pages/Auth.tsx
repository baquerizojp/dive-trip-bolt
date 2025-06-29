
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
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
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-t-lg">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="p-6">
                <SignIn 
                  appearance={{
                    elements: {
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'w-full',
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700'
                    }
                  }}
                  routing="path"
                  path="/auth"
                />
              </TabsContent>
              
              <TabsContent value="signup" className="p-6">
                <SignUp 
                  appearance={{
                    elements: {
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'w-full',
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700'
                    }
                  }}
                  routing="path"
                  path="/auth"
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
