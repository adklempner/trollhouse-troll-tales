
import { Dispatcher, DispatchMetadata, Signer, Store } from "waku-dispatcher";
import {
  createLightNode,
  waitForRemotePeer,
  createDecoder,
  LightNode,
  EConnectionStateEvents,
  createEncoder,
} from "@waku/sdk";
import {
  HealthStatus,
  HealthStatusChangeEvents,
  IWaku,
  Protocols
} from "@waku/interfaces"

export interface WakuMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}


const bootstrapNodes: string[] = [
  "/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ",
  "/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmNaeL4p3WEYzC9mgXBmBWSgWjPHRvatZTXnp8Jgv3iKsb",
  "/dns4/waku-42-1.bloxy.one/tcp/8000/wss/p2p/16Uiu2HAmV8y1exLbqWVQjytwsuTKXK4n3QvLUa4zAWF71nshejYo",
]

const networkConfig = { clusterId: 42, shards: [0] }

let wakuDispatcherPromise: Promise<Dispatcher>
let initializing = false
class WakuService {
  private dispatcher: Dispatcher | null = null;
  private messageHandlers: ((message: WakuMessage) => void)[] = [];

// Initialize Waku - this should be called during app startup
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

        const contentTopic = "/trollbox/1/chat/json"

        // Wait for connection to at least one peer
        await node.waitForPeers([Protocols.Store, Protocols.Filter, Protocols.LightPush]);
        const store = new Store(`podex`)
        
        // Create Waku Dispatcher with required parameters
        this.dispatcher = new Dispatcher(
          node,
          contentTopic,
          true,
          store
        );
        
        this.dispatcher.on("trollbox-message", async (message: WakuMessage, signer: Signer, _3: DispatchMetadata): Promise<void> => {
          console.log(message)
          this.messageHandlers.forEach(handler => handler(message));
        })
        
        await this.dispatcher.start()
        await this.dispatcher.dispatchLocalQuery()
        await this.dispatcher.dispatchQuery()
        
        console.log("Initializing Waku...");
        console.log("Waku initialized successfully");
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
    
    // Return cleanup function
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

      const result = await dispatcher.emitTo(dispatcher.encoder, 'trollbox-message', message, undefined, undefined, true);
      console.log(result)
      if (!result) throw new Error('Failed to send message via Waku');
      console.log('Message sent via Waku:', message);
    } catch (error) {
      console.error('Failed to send message via Waku:', error);
    }
  }
}

// Singleton instance
export const wakuService = new WakuService();
