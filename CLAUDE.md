# Claude Code Collaboration Guide - Trollhouse Troll Tales

This document provides context and guidelines for Claude Code instances working on this repository during live coding sessions.

## Project Overview

**Trollhouse Troll Tales** is a React-based decentralized chat application that reimagines internet trolls as digital freedom fighters. It features a privacy-focused "trollbox" powered by the Waku protocol for censorship-resistant messaging.

### Core Technologies
- **Frontend**: React 18.3.1 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Messaging**: Waku protocol (libp2p-based)
- **Web3**: ethers.js for wallet integration
- **Encryption**: Symmetric key encryption with crypto-js

## Project Structure

```
trollhouse-troll-tales/
├── src/                    # Main application source
│   ├── components/        # UI components (40+ shadcn/ui)
│   ├── pages/            # Landing page sections
│   ├── lib/              # Utilities and configs
│   └── App.tsx           # Main app entry
├── trollbox/             # Waku chat package
│   ├── src/
│   │   ├── components/   # Chat UI components
│   │   ├── services/     # Waku, wallet, ENS services
│   │   └── utils/        # Helper functions
│   └── package.json      # Package configuration
└── public/               # Static assets
```

## Key Features to Understand

1. **Decentralized Chat (Trollbox)**
   - Real-time messaging via Waku light nodes
   - End-to-end encryption
   - Web3 wallet authentication
   - ENS name resolution
   - Resizable/maximizable chat window

2. **Landing Page**
   - Hero section with troll theme
   - Privacy wisdom section
   - Community values
   - Animated elements

## Common Tasks & Guidelines

### 1. Working with Waku Integration

**Key Files**:
- `trollbox/src/services/wakuService.ts` - Main Waku service
- `trollbox/src/services/walletService.ts` - Wallet integration
- `trollbox/src/services/ensService.ts` - ENS resolution

**Important Patterns**:
```typescript
// Content topic format
const contentTopic = `/trollbox/1/${window.location.hostname}/proto`

// Symmetric key generation (deterministic)
const symmetricKey = generateSymmetricKey(contentTopic)
```

### 2. UI Component Development

**Component Location**: `src/components/ui/`

**Naming Convention**: 
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Types: PascalCase with `Type` suffix

**Style Guidelines**:
- Use Tailwind CSS classes
- Follow shadcn/ui patterns
- Maintain dark mode compatibility

### 3. Chat Features Enhancement

**Key Components**:
- `trollbox/src/components/ChatWindow.tsx` - Main chat UI
- `trollbox/src/components/MessageList.tsx` - Message display
- `trollbox/src/components/MessageInput.tsx` - Input handling

**State Management**:
- Messages stored in React state
- LocalStorage for preferences
- No Redux/Zustand currently

### 4. Testing Considerations

**Current State**: No tests implemented

**Testing Approach**:
- Unit tests for services
- Component tests for UI
- Integration tests for Waku
- E2E tests for user flows

## Collaboration Protocol

### For Multiple Claude Instances

1. **Task Coordination**:
   - Check `TASKS.md` for assigned work
   - Update task status when starting/completing
   - Avoid overlapping file edits

2. **Communication**:
   - Use comments in code for important notes
   - Update this file with new patterns discovered
   - Flag breaking changes clearly

3. **Git Workflow**:
   - Work on feature branches
   - Commit frequently with clear messages
   - Pull before pushing to avoid conflicts

### Common Commands

```bash
# Development
npm install          # Install dependencies
npm run dev         # Start dev server (port 5173)
npm run build       # Production build

# Trollbox package
cd trollbox
npm run build       # Build package
npm run dev         # Watch mode

# Type checking
npm run type-check  # Check TypeScript
```

## Current Limitations & Known Issues

1. **No Environment Variables** - All config is hardcoded
2. **No Tests** - Testing infrastructure not set up
3. **Limited Error Handling** - Some edge cases not covered
4. **Performance** - Message list not virtualized
5. **Mobile UX** - Some interactions need optimization

## Enhancement Opportunities

### High Priority
1. Add message persistence options
2. Implement room/channel support
3. Add media sharing capabilities
4. Improve mobile responsiveness
5. Add user profiles/avatars

### Medium Priority
1. Implement message reactions
2. Add typing indicators
3. Create admin tools
4. Add message search
5. Implement mentions

### Low Priority
1. Theme customization
2. Sound notifications
3. Desktop app version
4. Analytics dashboard
5. Moderation tools

## Development Tips

1. **Waku Connection**:
   - Test with multiple browser tabs
   - Check console for connection status
   - Verify bootstrap nodes are accessible

2. **Wallet Testing**:
   - Use MetaMask or similar
   - Test on different networks
   - Handle wallet disconnection

3. **Performance**:
   - Monitor message rendering
   - Check for memory leaks
   - Optimize re-renders

## Resources

- [Waku Documentation](https://waku.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## Emergency Contacts

If you encounter critical issues:
1. Check existing GitHub issues
2. Review recent commits for changes
3. Consult this documentation
4. Leave detailed notes for next session

---

**Last Updated**: Live coding session preparation
**Repository**: https://github.com/adklempner/trollhouse-troll-tales