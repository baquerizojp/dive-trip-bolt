import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

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