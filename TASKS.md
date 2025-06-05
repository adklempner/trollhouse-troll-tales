# Task Coordination - Trollhouse Troll Tales

This file coordinates tasks between multiple Claude Code instances during live coding sessions.

## Task Assignment Protocol

1. **Before starting a task**: Mark it as "IN PROGRESS" with your instance ID
2. **After completing**: Mark as "COMPLETED" with timestamp
3. **If blocked**: Mark as "BLOCKED" with reason
4. **Avoid conflicts**: Don't work on files marked "IN PROGRESS" by others

## Instance Identification

Each Claude instance should identify itself at the start:
- Instance A: Feature development
- Instance B: Bug fixes and testing  
- Instance C: UI/UX improvements
- Instance D: Documentation and refactoring

## Current Tasks

### High Priority Tasks

#### 1. Add Message Persistence
**Status**: AVAILABLE
**Files**: `trollbox/src/services/storageService.ts` (new), `trollbox/src/components/ChatWindow.tsx`
**Description**: Implement optional message persistence using IndexedDB
```
- [ ] Create storage service
- [ ] Add persistence toggle in UI
- [ ] Implement message loading on startup
- [ ] Handle storage quota limits
```

#### 2. Implement Room/Channel Support
**Status**: AVAILABLE  
**Files**: `trollbox/src/services/wakuService.ts`, `trollbox/src/components/RoomSelector.tsx` (new)
**Description**: Allow users to join different chat rooms
```
- [ ] Modify content topic generation
- [ ] Create room selector UI
- [ ] Update message routing
- [ ] Add room persistence
```

#### 3. Add User Profiles
**Status**: AVAILABLE
**Files**: `trollbox/src/components/UserProfile.tsx` (new), `trollbox/src/services/profileService.ts` (new)
**Description**: Basic user profiles with avatars and bios
```
- [ ] Create profile modal
- [ ] Implement avatar selection
- [ ] Store profile in localStorage
- [ ] Display profiles in chat
```

### Medium Priority Tasks

#### 4. Improve Mobile Experience
**Status**: AVAILABLE
**Files**: `trollbox/src/components/ChatWindow.tsx`, `src/index.css`
**Description**: Optimize for mobile devices
```
- [ ] Fix keyboard layout issues
- [ ] Improve touch targets
- [ ] Add swipe gestures
- [ ] Optimize for small screens
```

#### 5. Add Message Reactions
**Status**: AVAILABLE
**Files**: `trollbox/src/components/MessageItem.tsx` (new), `trollbox/src/types/index.ts`
**Description**: Emoji reactions to messages
```
- [ ] Design reaction UI
- [ ] Implement reaction protocol
- [ ] Add reaction animations
- [ ] Handle reaction counts
```

#### 6. Implement Typing Indicators
**Status**: AVAILABLE
**Files**: `trollbox/src/services/wakuService.ts`, `trollbox/src/components/TypingIndicator.tsx` (new)
**Description**: Show when users are typing
```
- [ ] Create typing event protocol
- [ ] Add typing indicator UI
- [ ] Implement timeout logic
- [ ] Optimize for performance
```

### Bug Fixes

#### 7. Fix Connection Retry Logic
**Status**: AVAILABLE
**Files**: `trollbox/src/services/wakuService.ts`
**Description**: Improve connection stability
```
- [ ] Add exponential backoff
- [ ] Better error messages
- [ ] Connection state recovery
- [ ] Handle network changes
```

#### 8. Fix Message Ordering
**Status**: AVAILABLE
**Files**: `trollbox/src/components/ChatWindow.tsx`
**Description**: Ensure messages appear in correct order
```
- [ ] Sort by timestamp
- [ ] Handle clock skew
- [ ] Deduplicate messages
- [ ] Fix race conditions
```

### UI/UX Improvements

#### 9. Add Theme Customization
**Status**: AVAILABLE
**Files**: `src/App.tsx`, `src/lib/theme.ts` (new)
**Description**: Allow users to customize colors
```
- [ ] Create theme picker
- [ ] Store theme preference
- [ ] Add preset themes
- [ ] Support custom colors
```

#### 10. Improve Loading States
**Status**: AVAILABLE
**Files**: Various component files
**Description**: Better feedback during loading
```
- [ ] Add skeleton screens
- [ ] Improve progress indicators
- [ ] Add loading messages
- [ ] Handle timeout states
```

## Completed Tasks

### Example Format:
```
#### Task Name
**Status**: COMPLETED
**Completed by**: Instance A
**Timestamp**: 2024-XX-XX HH:MM
**Notes**: Any relevant implementation details
```

## Blocked Tasks

### Example Format:
```
#### Task Name
**Status**: BLOCKED
**Blocked by**: Dependency on Task #X
**Instance**: Instance B
**Notes**: Waiting for X to be completed first
```

## Code Style Guidelines

When working on tasks:
1. Follow existing TypeScript patterns
2. Use Tailwind CSS for styling
3. Keep components small and focused
4. Add JSDoc comments for complex logic
5. Update types when adding features

## Testing Checklist

Before marking a task complete:
- [ ] Feature works as expected
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Works on mobile
- [ ] Handles edge cases
- [ ] Code is documented

## Communication Protocol

### In-Code Comments
Use these prefixes for clarity:
- `// TODO(Instance-A):` - Task for specific instance
- `// FIXME:` - Bug that needs fixing
- `// NOTE:` - Important information
- `// HACK:` - Temporary solution

### Status Updates
Update this file when:
- Starting a new task
- Completing a task
- Encountering blockers
- Finding new bugs

## Session Notes

### Session Start Checklist
1. Pull latest changes
2. Check TASKS.md for updates
3. Claim your instance ID
4. Mark your first task
5. Begin development

### Session End Checklist
1. Commit all changes
2. Update task statuses
3. Document any blockers
4. Push to repository
5. Note discoveries in CLAUDE.md

---

**Remember**: Coordination is key! Check this file frequently to avoid conflicts.