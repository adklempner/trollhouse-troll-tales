
export { default as Trollbox } from './components/TrollboxWrapper';
export { default as TrollboxCore } from './components/Trollbox';
export { default as TrollboxProvider } from './components/TrollboxProvider';
export { default as EmojiPicker } from './components/EmojiPicker';
export * from './services/wakuService';
export * from './services/walletService';
export * from './services/ensService';

// CSS import helper for manual import
export const importTrollboxCSS = () => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'waku-trollbox/dist/trollbox.css';
    document.head.appendChild(link);
  }
};
