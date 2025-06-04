
import { WakuDispatcher } from 'waku-dispatcher';

export interface WakuMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}

class WakuService {
  private dispatcher: WakuDispatcher | null = null;
  private isInitialized = false;
  private messageHandlers: ((message: WakuMessage) => void)[] = [];

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.dispatcher = await WakuDispatcher.create();
      this.isInitialized = true;
      
      // Listen for incoming messages
      this.dispatcher.on('trollbox-message', (payload: WakuMessage) => {
        this.messageHandlers.forEach(handler => handler(payload));
      });
      
      console.log('Waku dispatcher initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Waku dispatcher:', error);
    }
  }

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
    if (!this.dispatcher || !this.isInitialized) {
      console.warn('Waku dispatcher not initialized, message not sent');
      return;
    }

    try {
      await this.dispatcher.emit('trollbox-message', message);
      console.log('Message sent via Waku:', message);
    } catch (error) {
      console.error('Failed to send message via Waku:', error);
    }
  }
}

// Singleton instance
export const wakuService = new WakuService();
