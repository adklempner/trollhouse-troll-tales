
export { default as Trollbox } from './components/TrollboxWrapper';
export { TrollboxProvider } from './components/TrollboxProvider';
export { default as TrollboxCore } from './components/Trollbox';
export { walletService } from './services/walletService';
export { wakuService } from './services/wakuService';
export { ensService } from './services/ensService';
export type { WalletInfo } from './services/walletService';
export type { WakuMessage } from './services/wakuService';

// Auto-import styles for convenience
if (typeof document !== 'undefined') {
  try {
    require('../dist/trollbox.css');
  } catch (e) {
    // CSS not found, user may need to import manually
    console.warn('waku-trollbox: Auto-import of CSS failed. You may need to manually import "waku-trollbox/dist/trollbox.css"');
  }
}
