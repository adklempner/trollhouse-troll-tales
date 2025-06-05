
import React, { useEffect } from 'react';
import { TrollboxProvider } from './TrollboxProvider';
import Trollbox from './Trollbox';

interface TrollboxWrapperProps {
  appId?: string;
  encryptionKey?: string;
  ephemeral?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

const TrollboxWrapper: React.FC<TrollboxWrapperProps> = (props) => {
  useEffect(() => {
    // Try to load the CSS from various possible locations
    const possiblePaths = [
      'waku-trollbox/dist/styles.css',
      'waku-trollbox/dist/trollbox.css',
      './node_modules/waku-trollbox/dist/styles.css',
      './node_modules/waku-trollbox/dist/trollbox.css'
    ];

    // Check if CSS is already loaded
    const existingLink = document.querySelector('link[href*="waku-trollbox"], link[href*="trollbox"]');
    if (existingLink) return;

    // Try to load CSS from the first available path
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    // Use the bundled CSS path that should be available
    link.href = 'waku-trollbox/dist/trollbox.css';
    
    link.onerror = () => {
      console.warn('Could not load waku-trollbox CSS. Please ensure Tailwind CSS is available in your project or manually import the CSS file.');
    };
    
    document.head.appendChild(link);
  }, []);

  return (
    <TrollboxProvider>
      <Trollbox {...props} />
    </TrollboxProvider>
  );
};

export default TrollboxWrapper;
