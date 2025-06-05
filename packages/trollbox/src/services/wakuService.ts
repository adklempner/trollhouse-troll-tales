
/**
 * WakuService - A service for handling encrypted peer-to-peer messaging using the Waku protocol
 * 
 * This service provides a high-level interface for:
 * - Establishing connections to the Waku network
 * - Sending and receiving encrypted messages
 * - Managing message handlers
 * - Generating deterministic content topics and encryption keys
 * 
 * The service uses symmetric encryption for all messages, with keys derived from the
 * application context (domain or appId) to ensure messages are only readable by
 * instances of the same application.
 * 
 * @module services/wakuService
 */

import { Dispatcher, DispatchMetadata, KeyType, Signer, Store } from "waku-dispatcher";
import {
  createLightNode,
  LightNode,
  utf8ToBytes,
} from "@waku/sdk";
import {
  Protocols
} from "@waku/interfaces"
import CryptoJS from 'crypto-js';

/**
 * Structure of a message sent through the Waku network
 * @interface WakuMessage
 * @property {string} id - Unique identifier for the message
 * @property {string} text - The message content
 * @property {number} timestamp - Unix timestamp when the message was created
 * @property {string} author - Display name of the message author
 * @property {string} [walletAddress] - Optional Ethereum wallet address of the author
 * @property {string} [signature] - Optional cryptographic signature for message verification
 */
export interface WakuMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
  walletAddress?: string;
  signature?: string;
}

/**
 * Bootstrap nodes for connecting to the Waku network
 * These are hardcoded nodes that help new peers discover other nodes in the network
 * 
 * TODO: Consider making this configurable via environment variables for different environments
 * TODO: Add health checking to automatically remove unresponsive bootstrap nodes
 */
const bootstrapNodes: string[] = [
  "/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ",
  "/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmNaeL4p3WEYzC9mgXBmBWSgWjPHRvatZTXnp8Jgv3iKsb",
  "/dns4/waku-42-1.bloxy.one/tcp/8000/wss/p2p/16Uiu2HAmV8y1exLbqWVQjytwsuTKXK4n3QvLUa4zAWF71nshejYo",
]

/**
 * Network configuration for Waku
 * - clusterId: Identifies the network partition (42 is commonly used for test networks)
 * - shards: Array of shard indices for content-based sharding
 */
const networkConfig = { clusterId: 42, shards: [0] }

// Promise that resolves to the Waku Dispatcher instance
// Used to ensure only one initialization occurs at a time
let wakuDispatcherPromise: Promise<Dispatcher>

// Flag to prevent multiple simultaneous initialization attempts
let initializing = false

/**
 * Generates a deterministic content topic for Waku messages
 * 
 * Content topics are used to categorize messages in the Waku network.
 * This function creates a unique topic based on the application context,
 * ensuring messages from different applications don't interfere.
 * 
 * @param {string} [appId] - Optional application identifier. If not provided, uses the current domain
 * @returns {string} A content topic in the format `/trollbox/1/{hash}/json`
 * 
 * @example
 * // Using default (current domain)
 * generateContentTopic() // "/trollbox/1/a1b2c3.../json"
 * 
 * // Using custom appId
 * generateContentTopic("my-app") // "/trollbox/1/d4e5f6.../json"
 */
const generateContentTopic = (appId?: string): string => {
  const source = appId || window.location.hostname;
  const hash = CryptoJS.SHA256(source).toString();
  return `/trollbox/1/${hash}/json`;
};

/**
 * Generates a symmetric encryption key for message encryption
 * 
 * This function creates a deterministic 32-byte key that's used for
 * encrypting and decrypting messages. The key is derived from either:
 * 1. A provided encryption key (padded/truncated to 32 bytes)
 * 2. The current domain + salt (for domain-specific encryption)
 * 
 * @param {string} [encryptionKey] - Optional custom encryption key
 * @returns {Uint8Array} A 32-byte symmetric key for AES encryption
 * 
 * @example
 * // Domain-based key (automatic)
 * const key = generateSymmetricKey(); // Derived from window.location.hostname
 * 
 * // Custom key
 * const key = generateSymmetricKey("my-secret-key"); // Padded to 32 bytes
 * 
 * TODO: Consider using PBKDF2 or similar key derivation function for better security
 * TODO: Add key rotation mechanism for enhanced security
 */
const generateSymmetricKey = (encryptionKey?: string): Uint8Array => {
  if (encryptionKey) {
    // Ensure the key is exactly 32 bytes (256 bits) for AES-256
    return utf8ToBytes(encryptionKey.padEnd(32, '0').slice(0, 32));
  }
  
  const domain = window.location.hostname;
  // Create a deterministic key from domain name
  // Note: This is a simple approach - consider using PBKDF2 for production
  const salt = 'trollbox-encryption-salt';
  const hash = CryptoJS.SHA256(domain+salt).toString();
  return utf8ToBytes(hash).slice(0, 32)
};

/**
 * Main service class for Waku network interactions
 * 
 * This class manages:
 * - Waku node initialization and connection
 * - Message encryption/decryption
 * - Message sending and receiving
 * - Handler registration for incoming messages
 * 
 * The service follows a singleton pattern and maintains a single connection
 * to the Waku network per application instance.
 */
class WakuService {
  /**
   * The Waku Dispatcher instance that handles message routing
   * @private
   */
  private dispatcher: Dispatcher | null = null;
  
  /**
   * Array of callback functions to be called when messages are received
   * @private
   */
  private messageHandlers: ((message: WakuMessage) => void)[] = [];

  /**
   * Initializes or retrieves the Waku Dispatcher instance
   * 
   * This method:
   * 1. Creates a light Waku node if not already initialized
   * 2. Connects to bootstrap peers
   * 3. Sets up encryption with a symmetric key
   * 4. Registers message handlers
   * 5. Optionally queries for historical messages
   * 
   * @param {string} [appId] - Optional application identifier for content topic generation
   * @param {string} [encryptionKey] - Optional custom encryption key
   * @param {boolean} [ephemeral=false] - If true, skips querying for historical messages
   * @returns {Promise<Dispatcher>} The initialized Waku Dispatcher
   * 
   * @example
   * // Initialize with defaults
   * const dispatcher = await wakuService.getDispatcher();
   * 
   * // Initialize with custom app ID and encryption
   * const dispatcher = await wakuService.getDispatcher("my-app", "secret-key");
   * 
   * // Initialize in ephemeral mode (no history)
   * const dispatcher = await wakuService.getDispatcher(undefined, undefined, true);
   * 
   * TODO: Add connection retry logic with exponential backoff
   * TODO: Implement connection state monitoring and automatic reconnection
   */
  getDispatcher = async (appId?: string, encryptionKey?: string, ephemeral = false): Promise<Dispatcher> => {
    // Return existing promise if initialization is in progress
    if (initializing) return wakuDispatcherPromise
    initializing = true

    wakuDispatcherPromise = new Promise(async (resolve, reject) => {
      try {
        console.log("Initializing Dispatcher instance");
        
        // Create a light node that connects to the Waku network
        // Light nodes are resource-efficient and suitable for browser/mobile environments
        const node: LightNode = await createLightNode({
          networkConfig: networkConfig,
          defaultBootstrap: false, // Use our custom bootstrap nodes
          bootstrapPeers: bootstrapNodes,
          numPeersToUse: 3 // Connect to 3 peers for redundancy
        });
        
        // Start the Waku node
        await node.start();

        // Generate deterministic topic and encryption key based on context
        const contentTopic = generateContentTopic(appId);
        const symmetricKey = generateSymmetricKey(encryptionKey);
        console.log("Generated content topic:", contentTopic);
        console.log("Generated symmetric key for encryption");

        // Wait for the node to connect to peers supporting required protocols
        // Store: For retrieving historical messages
        // Filter: For subscribing to new messages
        // LightPush: For sending messages
        await node.waitForPeers([Protocols.Store, Protocols.Filter, Protocols.LightPush]);
        
        // Initialize local storage for message persistence
        // TODO: Consider making the store name configurable
        const store = new Store(`podex`)
        
        // Create the dispatcher that manages message routing and encryption
        this.dispatcher = new Dispatcher(
          node as any, // Type casting due to interface mismatch
          contentTopic,
          !ephemeral, // Enable persistence unless in ephemeral mode
          store
        );
        
        // Register the symmetric key for message encryption/decryption
        // The third parameter (true) indicates this is the default key
        this.dispatcher.registerKey(symmetricKey, KeyType.Symmetric, true);
        
        // Set up the message handler for incoming messages
        this.dispatcher.on("trollbox-message", async (message: WakuMessage, _signer: Signer, _3: DispatchMetadata): Promise<void> => {
          console.log('Received encrypted message:', message)
          // Notify all registered handlers about the new message
          this.messageHandlers.forEach(handler => handler(message));
        }, false, true, undefined, false); // Parameters: requireSignature=false, decrypt=true, signer=undefined, verifySignature=false

        // Start the dispatcher
        await this.dispatcher.start()
        
        // Query for historical messages unless in ephemeral mode
        if (!ephemeral) {
          console.log("Dispatching a query:)")
          await this.dispatcher.dispatchQuery()
        }
        
        console.log("Initializing Waku...");
        console.log(`Waku initialized successfully with encryption (ephemeral: ${ephemeral})`);
        resolve(this.dispatcher);
      } catch (error) {
        console.error("Failed to initialize Waku:", error);
        reject(error);
      }
    });

    return wakuDispatcherPromise;
  };

  /**
   * Registers a handler function to be called when messages are received
   * 
   * @param {Function} handler - Callback function that receives WakuMessage objects
   * @returns {Function} Unsubscribe function that removes the handler when called
   * 
   * @example
   * // Register a message handler
   * const unsubscribe = wakuService.onMessage((message) => {
   *   console.log('New message:', message.text);
   *   console.log('From:', message.author);
   * });
   * 
   * // Later, unsubscribe
   * unsubscribe();
   * 
   * TODO: Consider adding message filtering options (by author, timestamp, etc.)
   */
  onMessage(handler: (message: WakuMessage) => void) {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Sends an encrypted message through the Waku network
   * 
   * This method:
   * 1. Ensures the Waku node is initialized
   * 2. Encrypts the message with the symmetric key
   * 3. Broadcasts it to the network
   * 
   * @param {WakuMessage} message - The message object to send
   * @returns {Promise<void>}
   * 
   * @example
   * await wakuService.sendMessage({
   *   id: 'unique-id-123',
   *   text: 'Hello, Waku network!',
   *   timestamp: Date.now(),
   *   author: 'Alice',
   *   walletAddress: '0x1234...',
   *   signature: '0xabcd...'
   * });
   * 
   * TODO: Add message validation before sending
   * TODO: Implement retry mechanism for failed sends
   * TODO: Add delivery confirmation/acknowledgment system
   */
  async sendMessage(message: WakuMessage) {
    // Ensure dispatcher is initialized
    const dispatcher = await this.getDispatcher();
    if (!dispatcher) {
      console.warn('Waku dispatcher not initialized, message not sent');
      return;
    }

    try {
      // Send the message with encryption
      // Parameters: encoder, event type, payload, signer, encryption key, encrypt flag
      const result = await dispatcher.emitTo(
        dispatcher.encoder!,
        'trollbox-message', 
        message, 
        undefined, // No signer (anonymous messages)
        generateSymmetricKey(), // Use the same key for encryption
        true // Enable encryption
      );
      
      console.log('Encrypted message sent:', result)
      if (!result) throw new Error('Failed to send message via Waku');
      console.log('Message sent via Waku with encryption:', message);
    } catch (error) {
      console.error('Failed to send message via Waku:', error);
      // TODO: Implement proper error handling and retry logic
    }
  }
}

/**
 * Singleton instance of the WakuService
 * 
 * Usage:
 * import { wakuService } from './services/wakuService';
 * 
 * // Listen for messages
 * wakuService.onMessage((message) => {
 *   console.log('Received:', message);
 * });
 * 
 * // Send a message
 * await wakuService.sendMessage({...});
 */
export const wakuService = new WakuService();
