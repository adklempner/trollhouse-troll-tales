
import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}

class WalletService {
  private wallet: WalletInfo | null = null;

  async connectWallet(): Promise<WalletInfo> {
    if (!window.ethereum) {
      throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      this.wallet = { address, provider, signer };
      return this.wallet;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.wallet.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  getWallet(): WalletInfo | null {
    return this.wallet;
  }

  isConnected(): boolean {
    return this.wallet !== null;
  }

  disconnect(): void {
    this.wallet = null;
  }

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

export const walletService = new WalletService();
