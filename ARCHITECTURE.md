# Trollhouse Troll Tales - Architecture Guide

This document provides a high-level architecture overview to help multiple developers understand the system design and make consistent decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
├─────────────────────────────────────────────────────────────┤
│                    Component Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Landing   │  │   Trollbox  │  │  UI Library │         │
│  │    Page     │  │     Chat    │  │ (shadcn/ui) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Waku     │  │   Wallet    │  │     ENS     │         │
│  │   Service   │  │   Service   │  │   Service   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    External Services                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Waku     │  │  Ethereum   │  │     ENS     │         │
│  │   Network   │  │   Network   │  │   Registry  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Core Design Principles

### 1. Decentralization First
- No central server for chat data
- Peer-to-peer messaging via Waku
- Client-side encryption only
- User-controlled identity (wallets)

### 2. Privacy by Design
- End-to-end encryption by default
- No message persistence without consent
- Minimal metadata exposure
- Anonymous participation option

### 3. User Experience
- Works without Web3 wallet (read-only)
- Progressive enhancement with wallet
- Mobile-responsive design
- Intuitive troll-themed UI

## Component Architecture

### Landing Page (`/src/pages/`)
- Static marketing content
- Troll theme introduction
- Privacy education
- Community values

### Trollbox Package (`/trollbox/`)
**Standalone npm package for the chat functionality**

#### Components
- `ChatWindow.tsx` - Main container, window management
- `MessageList.tsx` - Message display, scrolling
- `MessageInput.tsx` - Text input, emoji picker
- `ChatHeader.tsx` - Connection status, controls

#### Services
- `wakuService.ts` - Waku protocol integration
- `walletService.ts` - Web3 wallet management  
- `ensService.ts` - ENS name resolution

#### State Management
- React hooks for local state
- LocalStorage for preferences
- No global state management (yet)

## Data Flow

### Message Sending Flow
```
User Input → Validation → Wallet Signing (optional) 
    ↓
Encryption → Waku Encoding → Network Broadcast
```

### Message Receiving Flow
```
Waku Subscription → Message Decoding → Decryption
    ↓
Validation → UI Update → Notification (if needed)
```

### Identity Flow
```
Wallet Connection → Address Retrieval → ENS Lookup
    ↓
Display Name Resolution → Cache Storage
```

## Key Technical Decisions

### 1. Symmetric Encryption
- **Why**: Simplicity and performance
- **How**: Deterministic key from content topic
- **Trade-off**: Less secure than asymmetric but easier

### 2. Content Topic Strategy
- **Format**: `/trollbox/1/${domain}/proto`
- **Why**: Isolates different deployments
- **Benefit**: Multiple communities can coexist

### 3. Singleton Services
- **Pattern**: Single instance per service
- **Why**: Resource efficiency, connection management
- **Implementation**: Static instance with lazy init

### 4. No Backend
- **Decision**: Pure frontend application
- **Why**: True decentralization, easier deployment
- **Trade-off**: Limited features (no push notifs, etc)

## Security Architecture

### Encryption
- **Algorithm**: AES-256 (via crypto-js)
- **Key Generation**: SHA-256 hash of content topic
- **Storage**: Keys never stored, always derived

### Authentication
- **Primary**: Web3 wallet signatures
- **Verification**: Client-side only
- **Identity**: Ethereum addresses + ENS names

### Privacy
- **IP Protection**: Via Waku relay
- **Metadata**: Minimal (timestamp, sender)
- **Persistence**: Optional, user-controlled

## Performance Considerations

### Current Optimizations
- Lazy loading of chat component
- Memoized ENS lookups with cache
- Debounced message input
- Single Waku connection

### Known Bottlenecks
- Message list not virtualized
- No pagination for history
- All messages in memory
- No image optimization

### Scaling Strategies
- Implement virtual scrolling
- Add message pagination
- Use IndexedDB for storage
- Optimize bundle splitting

## Development Workflow

### Package Structure
```
trollhouse-troll-tales/
├── src/                 # Main app
├── trollbox/           # Chat package
├── public/             # Static assets
└── package.json        # Workspace root
```

### Build Pipeline
1. TypeScript compilation
2. Vite bundling with Rollup
3. Tailwind CSS processing
4. Asset optimization

### Testing Strategy (TODO)
- Unit tests for services
- Component testing with React Testing Library
- Integration tests for Waku
- E2E tests with Playwright

## Extension Points

### Adding Features
1. **New Message Types**: Extend `ChatMessage` interface
2. **Custom Themes**: Modify Tailwind config
3. **Additional Services**: Follow singleton pattern
4. **UI Components**: Use shadcn/ui patterns

### Integration Points
- **Wallets**: Add to `walletService.ts`
- **Networks**: Update Waku bootstrap nodes
- **Storage**: Implement storage service
- **Analytics**: Add event tracking service

## Common Patterns

### Service Pattern
```typescript
class ServiceName {
  private static instance: ServiceName
  
  static getInstance(): ServiceName {
    if (!this.instance) {
      this.instance = new ServiceName()
    }
    return this.instance
  }
  
  private constructor() {
    // Initialize
  }
}
```

### Hook Pattern
```typescript
export const useServiceName = () => {
  const [state, setState] = useState()
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    }
  }, [])
  
  return { state, methods }
}
```

### Component Pattern
```typescript
interface ComponentProps {
  // Props
}

export const Component: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // Logic
  
  return (
    // JSX
  )
}
```

## Deployment Architecture

### Static Hosting
- Build outputs static files
- No server requirements
- CDN-friendly distribution
- Environment agnostic

### Configuration
- No environment variables (yet)
- Runtime configuration only
- Domain-based isolation
- Client-side feature flags

## Future Architecture Considerations

### Potential Enhancements
1. **Multi-room Support**: Modify content topics
2. **Federation**: Bridge to other protocols
3. **Plugins**: Extensible message types
4. **Mobile Apps**: React Native ports
5. **Desktop Apps**: Electron wrapper

### Scaling Considerations
1. **Sharding**: Split by content topics
2. **Caching**: CDN for static assets
3. **State Management**: Add Redux/Zustand
4. **Code Splitting**: Optimize bundles
5. **Web Workers**: Offload crypto

---

This architecture guide should help multiple developers understand the system design and make consistent implementation decisions during collaborative coding sessions.