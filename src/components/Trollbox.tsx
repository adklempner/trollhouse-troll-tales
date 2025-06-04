
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { wakuService, WakuMessage } from '@/services/wakuService';
import { walletService, WalletInfo } from '@/services/walletService';
import WalletConnection from './WalletConnection';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  author: string;
  walletAddress?: string;
  signature?: string;
}

const Trollbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🧌 Welcome to the troll chat! Connect your wallet to start chatting!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      author: 'Bridge Troll'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [wakuStatus, setWakuStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Waku service
    wakuService.getDispatcher().then(() => {
      setWakuStatus('connected');

      wakuService.onMessage((wakuMessage: WakuMessage) => {
        const message: Message = {
          id: wakuMessage.id,
          text: wakuMessage.text,
          timestamp: new Date(wakuMessage.timestamp),
          author: wakuMessage.author,
          walletAddress: wakuMessage.walletAddress,
          signature: wakuMessage.signature
        };
        
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        });
      });
    }).catch(() => {
      setWakuStatus('disconnected');
    });

    //return cleanup;
  }, []);

  const handleWalletChange = (newWallet: WalletInfo | null) => {
    setWallet(newWallet);
    if (newWallet) {
      setUsername(walletService.formatAddress(newWallet.address));
      setIsUsernameSet(true);
    } else {
      setUsername('');
      setIsUsernameSet(false);
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to send messages",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);
    try {
      const displayName = username.trim() || walletService.formatAddress(wallet.address);
      const messageId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
      const timestamp = new Date();
      
      // Create message for signing
      const messageToSign = `${newMessage}|${timestamp.getTime()}|${messageId}`;
      const signature = await walletService.signMessage(messageToSign);

      const message: Message = {
        id: messageId,
        text: newMessage,
        timestamp,
        author: displayName,
        walletAddress: wallet.address,
        signature
      };

      // Add to local state immediately for responsive UI
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Send via Waku
      const wakuMessage: WakuMessage = {
        id: message.id,
        text: message.text,
        timestamp: message.timestamp.getTime(),
        author: message.author,
        walletAddress: message.walletAddress,
        signature: message.signature
      };

      await wakuService.sendMessage(wakuMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Failed to Send",
        description: "Could not sign and send message",
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = () => {
    switch (wakuStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg relative"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`} />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧌</span>
              <span className="font-medium">Trollbox</span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} title={`Waku: ${wakuStatus}`} />
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-emerald-700 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className="text-sm">
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                  <span className="font-medium text-emerald-600">{message.author}</span>
                  {message.walletAddress && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600" title={message.walletAddress}>
                        {walletService.formatAddress(message.walletAddress)}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.signature && (
                    <span className="text-green-600" title="Verified">✓</span>
                  )}
                </div>
                <div className="bg-white rounded p-2 border">
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-white rounded-b-lg space-y-2">
            <WalletConnection onWalletChange={handleWalletChange} />
            
            {!wallet && !isUsernameSet && (
              <form onSubmit={handleUsernameSubmit}>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Your troll name (optional)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-sm flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Set
                  </Button>
                </div>
              </form>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                placeholder={wallet ? "Type your message..." : "Connect wallet to chat..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-sm"
                disabled={!wallet}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={wakuStatus !== 'connected' || !wallet || isSigning}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trollbox;
