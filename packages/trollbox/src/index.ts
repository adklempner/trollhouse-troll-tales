
export { default as Trollbox } from './components/TrollboxWrapper';
export { default as TrollboxCore } from './components/Trollbox';
export { default as TrollboxProvider } from './components/TrollboxProvider';
export { default as EmojiPicker } from './components/EmojiPicker';
export * from './services/wakuService';
export * from './services/walletService';
export * from './services/ensService';

// Auto-import styles for convenience
if (typeof document !== 'undefined') {
  try {
    require('../dist/trollbox.css');
  } catch (e) {
    // CSS not found, user may need to import manually
    console.warn('waku-trollbox: Auto-import of CSS failed. You may need to manually import "waku-trollbox/dist/trollbox.css"');
  }
}
