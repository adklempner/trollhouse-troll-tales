
import React, { useEffect } from 'react';
import { TrollboxProvider } from './TrollboxProvider';
import Trollbox from './Trollbox';

const TrollboxWrapper: React.FC = () => {
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
      <Trollbox />
    </TrollboxProvider>
  );
};

export default TrollboxWrapper;
