
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
- ⚙️ Configurable content topics and encryption keys

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

### Advanced Usage with Configuration

```tsx
import { Trollbox } from 'waku-trollbox';

function App() {
  return (
    <div className="App">
      <Trollbox 
        appId="my-custom-app"
        encryptionKey="my-secret-key-32-chars-long"
        ephemeral={true}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appId` | `string` | `window.location.hostname` | Custom identifier for generating content topic. Allows apps to have isolated chat rooms. |
| `encryptionKey` | `string` | Domain-derived key | Custom 32-character encryption key. If not provided, a key is derived from the domain. |
| `ephemeral` | `boolean` | `false` | Whether messages should be ephemeral (not stored) on the Waku network. When `true`, only live messages are shown. |

### Using Custom Props

#### App ID
Use `appId` to create isolated chat rooms for different applications:

```tsx
<Trollbox appId="my-game-lobby" />
```

Different `appId` values will create completely separate chat channels.

#### Encryption Key
Provide a custom encryption key for enhanced security:

```tsx
<Trollbox encryptionKey="your-32-character-secret-key-here" />
```

**Note**: The encryption key should be exactly 32 characters. If shorter, it will be padded; if longer, it will be truncated.

#### Ephemeral Messages
Enable ephemeral mode to only show live messages without storing them:

```tsx
<Trollbox ephemeral={true} />
```

This is useful for temporary chat sessions or privacy-focused applications.

### Advanced Usage with Provider Control

If you need more control over the toast notifications:

```tsx
import { TrollboxCore, TrollboxProvider } from 'waku-trollbox';

function App() {
  return (
    <div className="App">
      <TrollboxProvider>
        <TrollboxCore 
          appId="my-app"
          ephemeral={true}
        />
        {/* Your other components */}
      </TrollboxProvider>
    </div>
  );
}
```

## Configuration

### Default Behavior
Without any props, the trollbox automatically generates:
- A unique content topic based on your domain for isolated chat rooms
- A symmetric encryption key derived from your domain for secure messaging
- Persistent message storage on the Waku network

### Custom Configuration
With props, you can:
- Create isolated chat rooms using custom `appId`
- Use shared encryption keys across different domains
- Enable ephemeral messaging for privacy

## Security Features

- **Message Encryption**: All messages are encrypted using symmetric keys
- **Message Signing**: Wallet-connected users can sign messages for verification
- **ENS Integration**: Automatic resolution of Ethereum Name Service addresses
- **Isolated Channels**: Each app/domain gets its own isolated chat channel
- **Configurable Privacy**: Choose between persistent and ephemeral messaging

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

### Different Chat Rooms

If you want separate chat rooms for different parts of your app:
```tsx
// Lobby chat
<Trollbox appId="lobby" />

// Game chat  
<Trollbox appId="game-room-123" />
```

## License

MIT
