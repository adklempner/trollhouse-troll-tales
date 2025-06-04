
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

export interface WakuMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
  walletAddress?: string;
  signature?: string;
}

const bootstrapNodes: string[] = [
  "/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ",
  "/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmNaeL4p3WEYzC9mgXBmBWSgWjPHRvatZTXnp8Jgv3iKsb",
  "/dns4/waku-42-1.bloxy.one/tcp/8000/wss/p2p/16Uiu2HAmV8y1exLbqWVQjytwsuTKXK4n3QvLUa4zAWF71nshejYo",
]

const networkConfig = { clusterId: 42, shards: [0] }

let wakuDispatcherPromise: Promise<Dispatcher>
let initializing = false

const generateContentTopic = (): string => {
  const domain = window.location.hostname;
  const hash = CryptoJS.SHA256(domain).toString();
  return `/trollbox/1/${hash}/json`;
};

const generateSymmetricKey = (): Uint8Array => {
  const domain = window.location.hostname;
  // Create a deterministic key from domain name using PBKDF2
  const salt = 'trollbox-encryption-salt';
  const hash = CryptoJS.SHA256(domain+salt).toString();
  return utf8ToBytes(hash).slice(0, 32)
};

class WakuService {
  private dispatcher: Dispatcher | null = null;
  private messageHandlers: ((message: WakuMessage) => void)[] = [];

  getDispatcher = async (): Promise<Dispatcher> => {
    if (initializing) return wakuDispatcherPromise
    initializing = true

    wakuDispatcherPromise = new Promise(async (resolve, reject) => {
      try {
        console.log("Initializing Dispatcher instance");
        const node: LightNode = await createLightNode({
          networkConfig: networkConfig,
          defaultBootstrap: false,
          bootstrapPeers: bootstrapNodes,
          numPeersToUse: 3
        });
        
        await node.start();

        const contentTopic = generateContentTopic();
        const symmetricKey = generateSymmetricKey();
        console.log("Generated content topic:", contentTopic);
        console.log("Generated symmetric key for encryption");

        await node.waitForPeers([Protocols.Store, Protocols.Filter, Protocols.LightPush]);
        const store = new Store(`podex`)
        
        this.dispatcher = new Dispatcher(
          node as any,
          contentTopic,
          true,
          store
        );
        console.log()
        this.dispatcher.registerKey(symmetricKey, KeyType.Symmetric, true);
        
        this.dispatcher.on("trollbox-message", async (message: WakuMessage, _signer: Signer, _3: DispatchMetadata): Promise<void> => {
          console.log('Received encrypted message:', message)
          this.messageHandlers.forEach(handler => handler(message));
        })

        await this.dispatcher.start()
        await this.dispatcher.dispatchQuery()
        
        console.log("Initializing Waku...");
        console.log("Waku initialized successfully with encryption");
        resolve(this.dispatcher);
      } catch (error) {
        console.error("Failed to initialize Waku:", error);
        reject(error);
      }
    });

    return wakuDispatcherPromise;
  };

  onMessage(handler: (message: WakuMessage) => void) {
    this.messageHandlers.push(handler);
    
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  async sendMessage(message: WakuMessage) {
    const dispatcher = await this.getDispatcher();
    if (!dispatcher) {
      console.warn('Waku dispatcher not initialized, message not sent');
      return;
    }

    try {
      const result = await dispatcher.emitTo(dispatcher.encoder!,'trollbox-message', message, undefined, generateSymmetricKey(), true);
      console.log('Encrypted message sent:', result)
      if (!result) throw new Error('Failed to send message via Waku');
      console.log('Message sent via Waku with encryption:', message);
    } catch (error) {
      console.error('Failed to send message via Waku:', error);
    }
  }
}

export const wakuService = new WakuService();
