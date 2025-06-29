import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

export const useMobile = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    const checkPlatform = () => {
      const native = Capacitor.isNativePlatform();
      const currentPlatform = Capacitor.getPlatform();
      
      setIsNative(native);
      setPlatform(currentPlatform);

      // Configure status bar for mobile
      if (native) {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#2563eb' });
      }
    };

    checkPlatform();

    // Handle app URL opens (for OAuth redirects)
    if (Capacitor.isNativePlatform()) {
      const handleAppUrlOpen = (event: any) => {
        console.log('App opened with URL:', event.url);
        
        // Check if this is an OAuth redirect
        if (event.url && (event.url.includes('clerk') || event.url.includes('oauth'))) {
          // Navigate to the URL to let Clerk handle the OAuth callback
          window.location.href = event.url;
        }
      };

      App.addListener('appUrlOpen', handleAppUrlOpen);

      return () => {
        App.removeAllListeners();
      };
    }
  }, []);

  const hideKeyboard = () => {
    if (isNative) {
      Keyboard.hide();
    }
  };

  return {
    isNative,
    platform,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    hideKeyboard
  };
};