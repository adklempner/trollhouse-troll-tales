
# waku-trollbox

A decentralized chat component built with React, Web3 wallet integration, and Waku messaging protocol.

## Features

- 🧌 Real-time decentralized messaging via Waku protocol
- 🔗 Web3 wallet integration (MetaMask and compatible wallets)
- 🏷️ ENS name resolution for user display names
- ✅ Message signing and verification
- 🎨 Self-contained styling (no external CSS dependencies)
- 📱 Responsive design with resizable chat window
- 🔒 Privacy-focused with no central server dependency
- 🔐 End-to-end encryption using domain-derived symmetric keys

## Installation

```bash
npm install waku-trollbox
```

**That's it!** No additional configuration required. The component comes with all necessary styles bundled.

## Requirements

- React 16.8+
- A Web3 wallet (MetaMask recommended)

## Usage

### Basic Usage (Recommended)

```tsx
import { Trollbox } from 'waku-trollbox';

function App() {
  return (
    <div className="App">
      <Trollbox />
    </div>
  );
}
```

The `Trollbox` component includes all necessary providers and styling.

### Advanced Usage

If you need more control over the toast notifications or want to use your own providers:

```tsx
import { TrollboxCore, TrollboxProvider } from 'waku-trollbox';

function App() {
  return (
    <div className="App">
      <TrollboxProvider>
        <TrollboxCore />
        {/* Your other components */}
      </TrollboxProvider>
    </div>
  );
}
```

### Manual CSS Import (Optional)

If the automatic CSS loading doesn't work in your setup, you can manually import the styles:

```tsx
import 'waku-trollbox/dist/trollbox.css';
import { Trollbox } from 'waku-trollbox';
```

## Configuration

The trollbox automatically generates:
- A unique content topic based on your domain for isolated chat rooms
- A symmetric encryption key derived from your domain for secure messaging

## Styling

The component comes with built-in styling that works out of the box. The main color scheme uses:
- Emerald green for primary actions
- Clean gray and white design
- Responsive design that works on all screen sizes

If you want to customize the appearance, you can override the CSS classes or wrap the component in a container with custom styles.

## API

### Components

- `Trollbox` - Complete trollbox with providers and styles (recommended)
- `TrollboxCore` - Core trollbox component without providers
- `TrollboxProvider` - Provider component for toast notifications

### Services

The package exports several services that can be used independently:

```tsx
import { walletService, wakuService, ensService } from 'waku-trollbox';

// Connect wallet
const wallet = await walletService.connectWallet();

// Send a message
await wakuService.sendMessage({
  id: 'unique-id',
  text: 'Hello world!',
  timestamp: Date.now(),
  author: 'username'
});

// Resolve ENS name
const displayName = await ensService.getDisplayName(address, fallbackFormatter);
```

## Security Features

- **Message Encryption**: All messages are encrypted using symmetric keys derived from your domain
- **Message Signing**: Wallet-connected users can sign messages for verification
- **ENS Integration**: Automatic resolution of Ethereum Name Service addresses
- **Isolated Channels**: Each domain gets its own isolated chat channel

## Troubleshooting

### Styling Issues

If the trollbox appears unstyled:
1. Try manually importing the CSS: `import 'waku-trollbox/dist/trollbox.css'`
2. Check that your bundler supports CSS imports
3. Ensure the package was installed correctly

### Connection Issues

If messages aren't sending:
1. Check browser console for Waku connection errors
2. Ensure you have a stable internet connection
3. Try refreshing the page to reconnect to Waku network

## License

MIT
