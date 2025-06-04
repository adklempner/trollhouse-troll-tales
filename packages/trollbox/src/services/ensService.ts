
import { ethers } from 'ethers';

interface ENSCache {
  [address: string]: {
    name: string | null;
    timestamp: number;
  };
}

class ENSService {
  private cache: ENSCache = {};
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000;
  private readonly CACHE_KEY = 'ens_cache';

  constructor() {
    this.loadCache();
  }

  private loadCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        this.cache = JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Failed to load ENS cache:', error);
      this.cache = {};
    }
  }

  private saveCache(): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Failed to save ENS cache:', error);
    }
  }

  private isCacheValid(address: string): boolean {
    const cached = this.cache[address];
    if (!cached) return false;
    
    const now = Date.now();
    return now - cached.timestamp < this.CACHE_DURATION;
  }

  async getENSName(address: string): Promise<string | null> {
    if (this.isCacheValid(address)) {
      console.log('ENS cache hit for', address, this.cache[address].name);
      return this.cache[address].name;
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      console.log('Resolving ENS for', address);
      const ensName = await provider.lookupAddress(address);
      console.log('ENS resolved:', ensName);
      
      this.cache[address] = {
        name: ensName,
        timestamp: Date.now()
      };
      
      this.saveCache();
      return ensName;
    } catch (error) {
      console.warn('Failed to resolve ENS name for', address, error);
      
      this.cache[address] = {
        name: null,
        timestamp: Date.now()
      };
      
      this.saveCache();
      return null;
    }
  }

  async getDisplayName(address: string, fallbackFormatter: (addr: string) => string): Promise<string> {
    const ensName = await this.getENSName(address);
    const displayName = ensName || fallbackFormatter(address);
    console.log('Display name for', address, ':', displayName);
    return displayName;
  }
}

export const ensService = new ENSService();
