import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Grip, Maximize, Minimize } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { wakuService, WakuMessage } from '../services/wakuService';
import { walletService, WalletInfo } from '../services/walletService';
import { ensService } from '../services/ensService';
import WalletConnection from './WalletConnection';
import EmojiPicker from './EmojiPicker';
import { useToast } from '../hooks/use-toast';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  author: string;
  walletAddress?: string;
  signature?: string;
  displayName?: string;
}

interface TrollboxProps {
  appId?: string;
  encryptionKey?: string;
  ephemeral?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

const Trollbox: React.FC<TrollboxProps> = ({ 
  appId,
  encryptionKey,
  ephemeral = true,
  primaryColor = 'emerald',
  accentColor = 'blue'
}) => {
  // Get stored values from localStorage or use defaults
  const getStoredIsOpen = () => {
    try {
      const stored = localStorage.getItem('trollbox-isOpen');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  };

  const getStoredUsername = () => {
    try {
      return localStorage.getItem('trollbox-username') || '';
    } catch {
      return '';
    }
  };

  const getStoredDimensions = () => {
    try {
      const stored = localStorage.getItem('trollbox-dimensions');
      return stored ? JSON.parse(stored) : { width: 320, height: 384 };
    } catch {
      return { width: 320, height: 384 };
    }
  };

  // Helper function to check if a color is a hex code
  const isHexColor = (color: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  // Helper function to get color classes based on the primary color
  const getColorClasses = (variant: 'button' | 'header' | 'header-hover' | 'button-hover' | 'unread-button' | 'unread-header') => {
    if (isHexColor(primaryColor)) {
      // For hex colors, we need to use inline styles
      return '';
    }

    const colorMap = {
      emerald: {
        button: 'bg-emerald-600',
        'button-hover': 'hover:bg-emerald-700',
        header: 'bg-emerald-600',
        'header-hover': 'hover:bg-emerald-700',
        'unread-button': 'bg-orange-600 hover:bg-orange-700',
        'unread-header': 'bg-orange-600'
      },
      blue: {
        button: 'bg-blue-600',
        'button-hover': 'hover:bg-blue-700',
        header: 'bg-blue-600',
        'header-hover': 'hover:bg-blue-700',
        'unread-button': 'bg-orange-600 hover:bg-orange-700',
        'unread-header': 'bg-orange-600'
      },
      purple: {
        button: 'bg-purple-600',
        'button-hover': 'hover:bg-purple-700',
        header: 'bg-purple-600',
        'header-hover': 'hover:bg-purple-700',
        'unread-button': 'bg-orange-600 hover:bg-orange-700',
        'unread-header': 'bg-orange-600'
      },
      red: {
        button: 'bg-red-600',
        'button-hover': 'hover:bg-red-700',
        header: 'bg-red-600',
        'header-hover': 'hover:bg-red-700',
        'unread-button': 'bg-orange-600 hover:bg-orange-700',
        'unread-header': 'bg-orange-600'
      },
      indigo: {
        button: 'bg-indigo-600',
        'button-hover': 'hover:bg-indigo-700',
        header: 'bg-indigo-600',
        'header-hover': 'hover:bg-indigo-700',
        'unread-button': 'bg-orange-600 hover:bg-orange-700',
        'unread-header': 'bg-orange-600'
      },
      yellow: {
        button: 'bg-yellow-600',
        'button-hover': 'hover:bg-yellow-700',
        header: 'bg-yellow-600',
        'header-hover': 'hover:bg-yellow-700',
        'unread-button': 'bg-orange-600 hover:bg-orange-700',
        'unread-header': 'bg-orange-600'
      }
    };

    return colorMap[primaryColor as keyof typeof colorMap]?.[variant] || colorMap.emerald[variant];
  };

  // Helper function to get inline styles for hex colors
  const getColorStyles = (variant: 'button' | 'header' | 'unread') => {
    if (!isHexColor(primaryColor)) return {};

    switch (variant) {
      case 'button':
      case 'header':
        return { backgroundColor: primaryColor };
      case 'unread':
        return { backgroundColor: '#ea580c' }; // orange-600
      default:
        return {};
    }
  };

  // Helper function to get accent color classes
  const getAccentColorClasses = (variant: 'message' | 'user-label') => {
    if (isHexColor(accentColor)) {
      return '';
    }

    const accentColorMap = {
      blue: {
        message: 'bg-blue-500 text-white border-blue-500',
        'user-label': 'text-blue-600'
      },
      green: {
        message: 'bg-green-500 text-white border-green-500',
        'user-label': 'text-green-600'
      },
      purple: {
        message: 'bg-purple-500 text-white border-purple-500',
        'user-label': 'text-purple-600'
      },
      red: {
        message: 'bg-red-500 text-white border-red-500',
        'user-label': 'text-red-600'
      },
      indigo: {
        message: 'bg-indigo-500 text-white border-indigo-500',
        'user-label': 'text-indigo-600'
      },
      yellow: {
        message: 'bg-yellow-500 text-white border-yellow-500',
        'user-label': 'text-yellow-600'
      }
    };

    return accentColorMap[accentColor as keyof typeof accentColorMap]?.[variant] || accentColorMap.blue[variant];
  };

  // Helper function to get inline styles for accent hex colors
  const getAccentColorStyles = (variant: 'message' | 'user-label') => {
    if (!isHexColor(accentColor)) return {};

    switch (variant) {
      case 'message':
        return { 
          backgroundColor: accentColor, 
          borderColor: accentColor,
          color: 'white'
        };
      case 'user-label':
        return { color: accentColor };
      default:
        return {};
    }
  };

  const [isOpen, setIsOpen] = useState(getStoredIsOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🧌 Welcome to the troll chat! Set a username or connect your wallet to start chatting! 🎉',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      author: 'Bridge Troll'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(getStoredUsername);
  const [wakuStatus, setWakuStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [dimensions, setDimensions] = useState(getStoredDimensions);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number>(Date.now());
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { toast } = useToast();

  // Store isOpen state in localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('trollbox-isOpen', JSON.stringify(isOpen));
    } catch (error) {
      console.warn('Failed to save trollbox state to localStorage:', error);
    }
  }, [isOpen]);

  // Store username in localStorage whenever it changes (but not when set from wallet)
  useEffect(() => {
    if (username && !wallet) {
      try {
        localStorage.setItem('trollbox-username', username);
      } catch (error) {
        console.warn('Failed to save username to localStorage:', error);
      }
    }
  }, [username, wallet]);

  // Store dimensions in localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('trollbox-dimensions', JSON.stringify(dimensions));
    } catch (error) {
      console.warn('Failed to save trollbox dimensions to localStorage:', error);
    }
  }, [dimensions]);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Check if user is at bottom of scroll
  const checkIfAtBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const atBottom = scrollHeight - scrollTop - clientHeight < 10; // 10px threshold
        setIsAtBottom(atBottom);
      }
    }
  };

  // Auto-scroll to bottom when trollbox opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100); // Small delay to ensure DOM is ready
    }
  }, [isOpen]);

  // Auto-scroll when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
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
      
      if (message.walletAddress) {
        console.log('Resolving ENS for message from:', message.walletAddress);
        message.displayName = await ensService.getDisplayName(
          message.walletAddress,
          walletService.formatAddress
        );
        console.log('ENS resolved to:', message.displayName);
      }
      
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        const newMessages = [...prev, message].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        // Check if this is a new message (not from current user and after last seen)
        if (message.timestamp.getTime() > lastSeenTimestamp && !isOpen) {
          setHasUnreadMessages(true);
        }
        
        return newMessages;
      });
    });

    wakuService.getDispatcher(appId, encryptionKey, ephemeral).then(() => {
      setWakuStatus('connected');
    }).catch(() => {
      setWakuStatus('disconnected');
    });
  }, [appId, encryptionKey, ephemeral, lastSeenTimestamp, isOpen]);

  // Mark messages as read when trollbox is opened or clicked
  useEffect(() => {
    if (isOpen) {
      setLastSeenTimestamp(Date.now());
      setHasUnreadMessages(false);
    }
  }, [isOpen]);

  const handleTrollboxClick = () => {
    if (isOpen && hasUnreadMessages) {
      setLastSeenTimestamp(Date.now());
      setHasUnreadMessages(false);
    }
  };

  // Helper function to check if a message is from the current user
  const isOwnMessage = (message: Message) => {
    if (wallet && message.walletAddress) {
      return wallet.address.toLowerCase() === message.walletAddress.toLowerCase();
    }
    return message.author === username;
  };

  // Get dynamic styles for maximized vs normal view
  const getContainerStyles = () => {
    if (isMaximized) {
      return {
        position: 'fixed' as const,
        top: '20px',
        left: '20px',
        right: '20px',
        bottom: '20px',
        width: 'auto',
        height: 'auto',
        zIndex: 1000,
      };
    }
    return {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      minWidth: '280px',
      minHeight: '200px'
    };
  };

  // Resize handling useEffect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatRef.current || isMaximized) return;
      
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
  }, [isResizing, dragStart, isMaximized]);

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    });
    setIsResizing(true);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleWalletChange = async (newWallet: WalletInfo | null) => {
    setWallet(newWallet);
    if (newWallet) {
      console.log('Wallet connected:', newWallet.address);
      const displayName = await ensService.getDisplayName(
        newWallet.address,
        walletService.formatAddress
      );
      console.log('Wallet display name:', displayName);
      setUsername(displayName);
    } else {
      // When wallet disconnects, restore stored username
      setUsername(getStoredUsername());
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

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last seen timestamp when user sends a message
    setLastSeenTimestamp(timestamp.getTime());

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

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
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
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-12 h-12 shadow-lg relative transition-all duration-300 ${
            hasUnreadMessages 
              ? getColorClasses('unread-button')
              : `${getColorClasses('button')} ${getColorClasses('button-hover')}`
          }`}
          style={{
            ...getColorStyles(hasUnreadMessages ? 'unread' : 'button')
          }}
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`} />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-bounce" />
          )}
        </Button>
      )}

      {isOpen && (
        <div 
          ref={chatRef}
          className="bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden relative"
          style={getContainerStyles()}
          onClick={handleTrollboxClick}
        >
          {!isMaximized && (
            <div
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize flex items-center justify-center text-gray-400 hover:text-gray-600 z-10"
              onMouseDown={handleResizeStart}
            >
              <Grip className="w-3 h-3" />
            </div>
          )}

          <div 
            className={`text-white p-3 rounded-t-lg flex items-center justify-between flex-shrink-0 transition-colors duration-300 ${
              hasUnreadMessages ? getColorClasses('unread-header') : getColorClasses('header')
            }`}
            style={{
              ...getColorStyles(hasUnreadMessages ? 'unread' : 'header')
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧌</span>
              <span className="font-medium">
                Trollbox (powered by Waku)
                {hasUnreadMessages && <span className="ml-1 text-yellow-300">●</span>}
              </span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} title={`Waku: ${wakuStatus}`} />
            </div>
            <div className="flex items-center space-x-1">
              <Button
                onClick={handleMaximize}
                variant="ghost"
                size="icon"
                className={`text-white h-8 w-8 ${
                  hasUnreadMessages ? 'hover:bg-orange-700' : getColorClasses('header-hover')
                }`}
                title={isMaximized ? "Restore window" : "Maximize window"}
              >
                {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className={`text-white h-8 w-8 ${
                  hasUnreadMessages ? 'hover:bg-orange-700' : getColorClasses('header-hover')
                }`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea 
            ref={scrollAreaRef}
            className="flex-1 bg-gray-50"
            onScrollCapture={checkIfAtBottom}
          >
            <div className="p-3 space-y-2">
              {messages.map((message) => {
                const isOwn = isOwnMessage(message);
                return (
                  <div key={message.id} className={`text-sm ${isOwn ? 'flex flex-col items-end' : ''}`}>
                    <div className={`flex items-center space-x-1 text-xs text-gray-500 mb-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <span 
                        className={`font-medium ${isOwn ? getAccentColorClasses('user-label') : 'text-gray-600'}`}
                        style={isOwn ? getAccentColorStyles('user-label') : {}}
                      >
                        {isOwn ? 'You' : (message.displayName || message.author)}
                      </span>
                      {message.walletAddress && (
                        <>
                          <span>•</span>
                          <span className="text-gray-500" title={message.walletAddress}>
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
                    <div 
                      className={`rounded p-2 border max-w-[80%] ${
                        isOwn 
                          ? getAccentColorClasses('message')
                          : 'bg-white border-gray-200 text-gray-800'
                      }`}
                      style={isOwn ? getAccentColorStyles('message') : {}}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="p-3 border-t bg-white rounded-b-lg space-y-2 flex-shrink-0">
            <WalletConnection onWalletChange={handleWalletChange} />
            
            <div className="flex space-x-2">
              <Input
                placeholder="Your troll name 👹"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-sm flex-1"
              />
            </div>
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                placeholder={username.trim() ? "Type your message... 💬" : "Set a username first... 🏷️"}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-sm"
                disabled={!username.trim()}
              />
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <Button 
                type="submit" 
                size="icon" 
                className={`${getColorClasses('button')} ${getColorClasses('button-hover')}`}
                style={getColorStyles('button')}
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
