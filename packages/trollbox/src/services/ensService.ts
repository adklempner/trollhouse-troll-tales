/**
 * ENSService - A service for resolving Ethereum Name Service (ENS) names
 * 
 * This service provides:
 * - ENS name resolution from Ethereum addresses
 * - Caching mechanism to reduce RPC calls
 * - Fallback display name formatting
 * - Persistent cache storage in localStorage
 * 
 * ENS names are human-readable names (like 'alice.eth') that map to
 * Ethereum addresses. This service performs reverse lookups to get
 * the ENS name associated with an address.
 * 
 * @module services/ensService
 */

import { ethers } from 'ethers';

/**
 * Cache structure for storing ENS lookups
 * @interface ENSCache
 * @property {string} [address] - Ethereum address as key
 * @property {string|null} [address].name - Resolved ENS name or null if none exists
 * @property {number} [address].timestamp - Unix timestamp of when the lookup was performed
 */
interface ENSCache {
  [address: string]: {
    name: string | null;
    timestamp: number;
  };
}

/**
 * Service class for ENS name resolution with caching
 * 
 * Implements a caching layer to minimize RPC calls and improve performance.
 * Cache is persisted to localStorage and survives page refreshes.
 */
class ENSService {
  /**
   * In-memory cache of ENS lookups
   * @private
   */
  private cache: ENSCache = {};
  
  /**
   * Cache duration in milliseconds (24 hours)
   * After this duration, cached entries are considered stale
   * @private
   * @readonly
   */
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  /**
   * LocalStorage key for persisting the cache
   * @private
   * @readonly
   */
  private readonly CACHE_KEY = 'ens_cache';

  constructor() {
    // Load cached ENS names from localStorage on initialization
    this.loadCache();
  }

  /**
   * Loads the ENS cache from localStorage
   * 
   * Called on service initialization to restore previously cached lookups.
   * Handles parsing errors gracefully by initializing an empty cache.
   * 
   * @private
   */
  private loadCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        this.cache = JSON.parse(cached);
        // TODO: Validate cache structure and remove invalid entries
      }
    } catch (error) {
      console.warn('Failed to load ENS cache:', error);
      this.cache = {};
    }
  }

  /**
   * Persists the current cache to localStorage
   * 
   * Called after each new ENS lookup to ensure cache persistence.
   * Handles storage quota errors gracefully.
   * 
   * @private
   * 
   * TODO: Implement cache size limits and eviction policy
   * TODO: Add compression for large caches
   */
  private saveCache(): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Failed to save ENS cache:', error);
      // TODO: Implement fallback storage mechanism or cache cleanup
    }
  }

  /**
   * Checks if a cached ENS entry is still valid
   * 
   * An entry is considered valid if:
   * 1. It exists in the cache
   * 2. It hasn't exceeded the cache duration (24 hours)
   * 
   * @param {string} address - Ethereum address to check
   * @returns {boolean} True if cache entry is valid, false otherwise
   * @private
   */
  private isCacheValid(address: string): boolean {
    const cached = this.cache[address];
    if (!cached) return false;
    
    const now = Date.now();
    const age = now - cached.timestamp;
    return age < this.CACHE_DURATION;
  }

  /**
   * Resolves an ENS name for a given Ethereum address
   * 
   * This method:
   * 1. Checks the cache for a valid entry
   * 2. If not cached or stale, queries the Ethereum mainnet
   * 3. Caches the result (including null results to prevent repeated failed lookups)
   * 4. Persists the cache to localStorage
   * 
   * @param {string} address - Ethereum address to resolve
   * @returns {Promise<string|null>} ENS name if found, null otherwise
   * 
   * @example
   * const ensName = await ensService.getENSName('0x1234...');
   * // Returns: 'alice.eth' or null
   * 
   * TODO: Add support for custom RPC endpoints
   * TODO: Implement request batching for multiple addresses
   * TODO: Add retry logic with exponential backoff
   */
  async getENSName(address: string): Promise<string | null> {
    // Check cache first to avoid unnecessary RPC calls
    if (this.isCacheValid(address)) {
      console.log('ENS cache hit for', address, this.cache[address].name);
      return this.cache[address].name;
    }

    try {
      // Use Tenderly's public RPC endpoint for mainnet
      // TODO: Make RPC endpoint configurable
      const provider = new ethers.JsonRpcProvider('https://gateway.tenderly.co/public/mainnet');
      console.log('Resolving ENS for', address);
      
      // Perform reverse ENS lookup
      const ensName = await provider.lookupAddress(address);
      console.log('ENS resolved:', ensName);
      
      // Cache the successful result
      this.cache[address] = {
        name: ensName,
        timestamp: Date.now()
      };
      
      this.saveCache();
      return ensName;
    } catch (error) {
      console.warn('Failed to resolve ENS name for', address, error);
      
      // Cache the failure to prevent repeated failed lookups
      // This is important for addresses without ENS names
      this.cache[address] = {
        name: null,
        timestamp: Date.now()
      };
      
      this.saveCache();
      return null;
    }
  }

  /**
   * Gets a display name for an address, with ENS resolution and fallback
   * 
   * This is a convenience method that:
   * 1. Attempts to resolve the ENS name
   * 2. Falls back to a formatted address if no ENS name exists
   * 
   * @param {string} address - Ethereum address to get display name for
   * @param {Function} fallbackFormatter - Function to format address if no ENS name
   * @returns {Promise<string>} ENS name or formatted address
   * 
   * @example
   * const displayName = await ensService.getDisplayName(
   *   '0x1234567890123456789012345678901234567890',
   *   (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
   * );
   * // Returns: 'alice.eth' or '0x1234...7890'
   * 
   * TODO: Add avatar resolution support
   */
  async getDisplayName(address: string, fallbackFormatter: (addr: string) => string): Promise<string> {
    const ensName = await this.getENSName(address);
    const displayName = ensName || fallbackFormatter(address);
    console.log('Display name for', address, ':', displayName);
    return displayName;
  }
}

/**
 * Singleton instance of the ENSService
 * 
 * Usage:
 * import { ensService } from './services/ensService';
 * 
 * // Get ENS name
 * const name = await ensService.getENSName('0x1234...');
 * 
 * // Get display name with fallback
 * const displayName = await ensService.getDisplayName(
 *   '0x1234...',
 *   (addr) => addr.slice(0, 8)
 * );
 * 
 * Performance considerations:
 * - First lookup for an address will take ~100-500ms (RPC call)
 * - Subsequent lookups are instant (cache hit)
 * - Cache persists for 24 hours
 * - Failed lookups are also cached to prevent repeated attempts
 */
export const ensService = new ENSService();
