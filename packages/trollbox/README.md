
# waku-trollbox

A decentralized chat component built with React, Web3 wallet integration, and Waku messaging protocol.

## Features

- 🧌 Real-time decentralized messaging via Waku protocol
- 🔗 Web3 wallet integration (MetaMask and compatible wallets)
- 🏷️ ENS name resolution for user display names
- ✅ Message signing and verification
- 🎨 Fully customizable with Tailwind CSS
- 📱 Responsive design with resizable chat window
- 🔒 Privacy-focused with no central server dependency
- 🔐 End-to-end encryption using domain-derived symmetric keys

## Installation

```bash
npm install waku-trollbox
```

## Requirements

**Important**: This package requires Tailwind CSS to be installed and configured in your project for styling to work properly.

### Required dependencies in your project:
- React 16.8+
- Tailwind CSS
- A Web3 wallet (MetaMask recommended)

### Installing Tailwind CSS

If you don't have Tailwind CSS installed, follow these steps:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then configure your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/waku-trollbox/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And add these directives to your CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

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

## Configuration

The trollbox automatically generates:
- A unique content topic based on your domain for isolated chat rooms
- A symmetric encryption key derived from your domain for secure messaging

## Styling

The component uses Tailwind CSS classes extensively. The main color scheme uses:
- `emerald-600` for primary actions
- `gray-50` for backgrounds
- `white` for cards and inputs

You can customize the appearance by overriding these classes or by wrapping the component in a container with custom CSS.

## API

### Components

- `Trollbox` - Complete trollbox with providers (recommended)
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
1. Ensure Tailwind CSS is installed and configured
2. Check that your `tailwind.config.js` includes the trollbox files in the content array
3. Verify that Tailwind directives are included in your CSS

### Connection Issues

If messages aren't sending:
1. Check browser console for Waku connection errors
2. Ensure you have a stable internet connection
3. Try refreshing the page to reconnect to Waku network

## License

MIT
