
import React from 'react';
import { Toaster } from '../ui/toaster';

interface TrollboxProviderProps {
  children: React.ReactNode;
}

export const TrollboxProvider: React.FC<TrollboxProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};
