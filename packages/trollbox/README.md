
# @your-org/trollbox

A decentralized chat component built with React, Web3 wallet integration, and Waku messaging protocol.

## Features

- 🧌 Real-time decentralized messaging via Waku protocol
- 🔗 Web3 wallet integration (MetaMask and compatible wallets)
- 🏷️ ENS name resolution for user display names
- ✅ Message signing and verification
- 🎨 Fully customizable with Tailwind CSS
- 📱 Responsive design with resizable chat window
- 🔒 Privacy-focused with no central server dependency

## Installation

```bash
npm install @your-org/trollbox
```

## Usage

```tsx
import { Trollbox } from '@your-org/trollbox';

function App() {
  return (
    <div className="App">
      <Trollbox />
    </div>
  );
}
```

## Requirements

- React 16.8+
- Tailwind CSS (for styling)
- A Web3 wallet (MetaMask recommended)

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind CSS is installed and configured in your project.

## Configuration

The trollbox automatically generates a unique content topic based on your domain, ensuring isolated chat rooms per website.

## API

### Services

The package exports several services that can be used independently:

```tsx
import { walletService, wakuService, ensService } from '@your-org/trollbox';

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

## License

MIT
