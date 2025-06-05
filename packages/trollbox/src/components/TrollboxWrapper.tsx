
import React from 'react';
import { TrollboxProvider } from './TrollboxProvider';
import Trollbox from './Trollbox';

const TrollboxWrapper: React.FC = () => {
  return (
    <TrollboxProvider>
      <Trollbox />
    </TrollboxProvider>
  );
};

export default TrollboxWrapper;
