
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { wakuService, WakuMessage } from '@/services/wakuService';
import { walletService, WalletInfo } from '@/services/walletService';
import { ensService } from '@/services/ensService';
import WalletConnection from './WalletConnection';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  author: string;
  walletAddress?: string;
  signature?: string;
  displayName?: string; // ENS name or formatted address
}

const Trollbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🧌 Welcome to the troll chat! Set a username or connect your wallet to start chatting!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      author: 'Bridge Troll'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [wakuStatus, setWakuStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 320, height: 384 });
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Waku service
    wakuService.getDispatcher().then(() => {
      setWakuStatus('connected');

      wakuService.onMessage(async (wakuMessage: WakuMessage) => {
        console.log('Received Waku message:', wakuMessage);
        const message: Message = {
          id: wakuMessage.id,
          text: wakuMessage.text,
          timestamp: new Date(wakuMessage.timestamp),
          author: wakuMessage.author,
          walletAddress: wakuMessage.walletAddress,
          signature: wakuMessage.signature
        };
        
        // Resolve ENS name if wallet address is available
        if (message.walletAddress) {
          console.log('Resolving ENS for message from:', message.walletAddress);
          message.displayName = await ensService.getDisplayName(
            message.walletAddress,
            walletService.formatAddress
          );
          console.log('ENS resolved to:', message.displayName);
        }
        
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
  }, []);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatRef.current) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newWidth = Math.max(280, dragStart.width - deltaX);
      const newHeight = Math.max(200, dragStart.height - deltaY);
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'nw-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, dragStart]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    });
    setIsResizing(true);
  };

  const handleWalletChange = async (newWallet: WalletInfo | null) => {
    setWallet(newWallet);
    if (newWallet) {
      console.log('Wallet connected:', newWallet.address);
      // Try to get ENS name for the connected wallet
      const displayName = await ensService.getDisplayName(
        newWallet.address,
        walletService.formatAddress
      );
      console.log('Wallet display name:', displayName);
      setUsername(displayName);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please set a username to send messages",
        variant: "destructive",
      });
      return;
    }

    const effectiveUsername = username.trim();
    const messageId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    const timestamp = new Date();
    
    let signature: string | undefined;

    // If wallet is connected, sign the message
    if (wallet) {
      setIsSigning(true);
      try {
        const messageToSign = `${newMessage}|${timestamp.getTime()}|${messageId}`;
        signature = await walletService.signMessage(messageToSign);
      } catch (error) {
        console.error('Failed to sign message:', error);
        toast({
          title: "Failed to Sign",
          description: "Could not sign message with wallet",
          variant: "destructive",
        });
        setIsSigning(false);
        return;
      }
      setIsSigning(false);
    }

    const message: Message = {
      id: messageId,
      text: newMessage,
      timestamp,
      author: effectiveUsername,
      walletAddress: wallet?.address,
      signature,
      displayName: effectiveUsername
    };

    // Add to local state immediately for responsive UI
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Send via Waku
    try {
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
      console.error('Failed to send message via Waku:', error);
      toast({
        title: "Failed to Send",
        description: "Could not send message to network",
        variant: "destructive",
      });
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
        <div 
          ref={chatRef}
          className="bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden relative"
          style={{ 
            width: `${dimensions.width}px`, 
            height: `${dimensions.height}px`,
            minWidth: '280px',
            minHeight: '200px'
          }}
        >
          {/* Resize Handle */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize flex items-center justify-center text-gray-400 hover:text-gray-600 z-10"
            onMouseDown={handleResizeStart}
          >
            <Grip className="w-3 h-3" />
          </div>

          {/* Header */}
          <div className="bg-emerald-600 text-white p-3 rounded-t-lg flex items-center justify-between flex-shrink-0">
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
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className="text-sm">
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                  <span className="font-medium text-emerald-600">
                    {message.displayName || message.author}
                  </span>
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
          <div className="p-3 border-t bg-white rounded-b-lg space-y-2 flex-shrink-0">
            <WalletConnection onWalletChange={handleWalletChange} />
            
            <div className="flex space-x-2">
              <Input
                placeholder="Your troll name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-sm flex-1"
              />
            </div>
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                placeholder={username.trim() ? "Type your message..." : "Set a username first..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-sm"
                disabled={!username.trim()}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={wakuStatus !== 'connected' || !username.trim() || isSigning}
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
