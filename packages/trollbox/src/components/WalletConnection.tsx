import React, { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { walletService, WalletInfo } from '../services/walletService';
import { ensService } from '../services/ensService';
import { useToast } from '../hooks/use-toast';

interface WalletConnectionProps {
  onWalletChange: (wallet: WalletInfo | null) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onWalletChange }) => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentWallet = walletService.getWallet();
    if (currentWallet) {
      setWallet(currentWallet);
      onWalletChange(currentWallet);
      ensService.getDisplayName(currentWallet.address, walletService.formatAddress)
        .then(name => setDisplayName(name));
    }
  }, [onWalletChange]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const connectedWallet = await walletService.connectWallet();
      setWallet(connectedWallet);
      onWalletChange(connectedWallet);
      
      const name = await ensService.getDisplayName(
        connectedWallet.address, 
        walletService.formatAddress
      );
      setDisplayName(name);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${name}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    setWallet(null);
    setDisplayName('');
    onWalletChange(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (wallet) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-emerald-50 rounded border">
        <Wallet className="w-4 h-4 text-emerald-600" />
        <span className="text-sm text-emerald-700 font-medium">
          {displayName || walletService.formatAddress(wallet.address)}
        </span>
        <Button
          onClick={handleDisconnect}
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-emerald-600 hover:bg-emerald-100"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant="outline"
      size="sm"
      className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};

export default WalletConnection;
