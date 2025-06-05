/**
 * WalletService - A service for managing Web3 wallet connections and operations
 * 
 * This service provides a unified interface for:
 * - Connecting to Web3 wallets (MetaMask, etc.)
 * - Signing messages for authentication
 * - Managing wallet state
 * - Formatting wallet addresses for display
 * 
 * The service follows a singleton pattern and maintains a single wallet
 * connection throughout the application lifecycle.
 * 
 * @module services/walletService
 */

import { ethers } from 'ethers';

/**
 * Information about a connected wallet
 * @interface WalletInfo
 * @property {string} address - The Ethereum address of the connected wallet
 * @property {ethers.BrowserProvider} provider - The Web3 provider instance
 * @property {ethers.JsonRpcSigner} signer - The signer instance for transaction signing
 */
export interface WalletInfo {
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}

/**
 * Service class for Web3 wallet interactions
 * 
 * Manages wallet connections, message signing, and wallet state.
 * This service is designed to work with browser-based wallets like MetaMask.
 */
class WalletService {
  /**
   * Currently connected wallet information
   * @private
   */
  private wallet: WalletInfo | null = null;

  /**
   * Connects to a Web3 wallet (MetaMask or similar)
   * 
   * This method:
   * 1. Checks for wallet availability
   * 2. Requests account access from the user
   * 3. Gets the signer and address
   * 4. Stores the wallet information
   * 
   * @returns {Promise<WalletInfo>} Information about the connected wallet
   * @throws {Error} If no wallet is installed or connection fails
   * 
   * @example
   * try {
   *   const wallet = await walletService.connectWallet();
   *   console.log('Connected to:', wallet.address);
   * } catch (error) {
   *   console.error('Failed to connect:', error);
   * }
   * 
   * TODO: Add support for WalletConnect and other wallet providers
   * TODO: Implement network switching/validation
   * TODO: Add event listeners for account/network changes
   */
  async connectWallet(): Promise<WalletInfo> {
    // Check if a Web3 wallet is available in the browser
    if (!window.ethereum) {
      throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
    }

    try {
      // Create a new provider instance using the browser's ethereum object
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request access to the user's accounts
      // This will prompt the user to connect their wallet if not already connected
      await provider.send('eth_requestAccounts', []);
      
      // Get the signer (used for signing transactions and messages)
      const signer = await provider.getSigner();
      
      // Get the wallet address
      const address = await signer.getAddress();

      // Store the wallet information for future use
      this.wallet = { address, provider, signer };
      return this.wallet;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Signs a message using the connected wallet
   * 
   * This is typically used for:
   * - Authentication (proving ownership of an address)
   * - Creating verifiable messages
   * - Signing data for smart contract interactions
   * 
   * @param {string} message - The message to sign
   * @returns {Promise<string>} The signature as a hex string
   * @throws {Error} If wallet is not connected or signing fails
   * 
   * @example
   * const message = 'Sign this to prove you own this wallet';
   * const signature = await walletService.signMessage(message);
   * // signature: '0x1234abcd...'
   * 
   * TODO: Add EIP-712 structured data signing support
   * TODO: Implement signature verification helper
   */
  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      // Use personal_sign method through ethers
      // This displays the message to the user for confirmation
      const signature = await this.wallet.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  /**
   * Gets the currently connected wallet information
   * 
   * @returns {WalletInfo | null} Wallet info if connected, null otherwise
   * 
   * @example
   * const wallet = walletService.getWallet();
   * if (wallet) {
   *   console.log('Current wallet:', wallet.address);
   * }
   */
  getWallet(): WalletInfo | null {
    return this.wallet;
  }

  /**
   * Checks if a wallet is currently connected
   * 
   * @returns {boolean} True if a wallet is connected, false otherwise
   * 
   * @example
   * if (walletService.isConnected()) {
   *   // Wallet is connected, can perform wallet operations
   * } else {
   *   // Need to connect wallet first
   * }
   */
  isConnected(): boolean {
    return this.wallet !== null;
  }

  /**
   * Disconnects the current wallet
   * 
   * Note: This only clears the local state. The wallet remains
   * connected to the site until the user manually disconnects
   * through their wallet interface.
   * 
   * TODO: Implement proper wallet disconnection using wallet APIs
   * TODO: Emit disconnect events for UI updates
   */
  disconnect(): void {
    this.wallet = null;
  }

  /**
   * Formats an Ethereum address for display
   * 
   * Shortens the address to show only the first 6 and last 4 characters.
   * This is a common pattern in Web3 UIs to save space while maintaining
   * address recognizability.
   * 
   * @param {string} address - The full Ethereum address
   * @returns {string} Formatted address (e.g., "0x1234...5678")
   * 
   * @example
   * const formatted = walletService.formatAddress('0x1234567890123456789012345678901234567890');
   * // Returns: "0x1234...7890"
   * 
   * TODO: Add ENS name resolution support
   */
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

/**
 * Singleton instance of the WalletService
 * 
 * Usage:
 * import { walletService } from './services/walletService';
 * 
 * // Connect wallet
 * const wallet = await walletService.connectWallet();
 * 
 * // Sign a message
 * const signature = await walletService.signMessage('Hello');
 * 
 * // Check connection status
 * if (walletService.isConnected()) {
 *   const address = walletService.getWallet()?.address;
 * }
 */
export const walletService = new WalletService();
