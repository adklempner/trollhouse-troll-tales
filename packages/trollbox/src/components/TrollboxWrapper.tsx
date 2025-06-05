
import React, { useEffect } from 'react';
import { TrollboxProvider } from './TrollboxProvider';
import Trollbox from './Trollbox';

interface TrollboxWrapperProps {
  appId?: string;
  encryptionKey?: string;
  ephemeral?: boolean;
}

const TrollboxWrapper: React.FC<TrollboxWrapperProps> = (props) => {
  useEffect(() => {
    // Dynamically import the CSS if it hasn't been loaded
    if (!document.querySelector('link[href*="waku-trollbox"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'node_modules/waku-trollbox/dist/styles.css';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <TrollboxProvider>
      <Trollbox {...props} />
    </TrollboxProvider>
  );
};

export default TrollboxWrapper;
