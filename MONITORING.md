# Claude Code Monitoring Tools

This repository includes three different monitoring tools to visualize multiple Claude Code instances working collaboratively during live coding sessions.

## Available Monitors

### 1. Terminal Dashboard (Bash) - `claude-monitor.sh`

A colorful terminal-based monitor with ASCII art and ANSI colors.

**Usage:**
```bash
./claude-monitor.sh
```

**Features:**
- ASCII art header with troll theme
- Color-coded instance status panels
- Live activity feed
- Session statistics
- Updates every 2 seconds

**Requirements:**
- Bash shell
- Terminal with ANSI color support

### 2. Interactive Terminal Monitor (Node.js) - `claude-monitor.js`

A more sophisticated terminal monitor with interactive features.

**Usage:**
```bash
node claude-monitor.js
```

**Features:**
- Real-time progress bars
- Keyboard controls (R to refresh, H for help)
- Collaboration network visualization
- Simulated activity updates
- File change tracking

**Requirements:**
- Node.js installed
- Terminal with TTY support

### 3. Web Dashboard - `claude-dashboard.html`

A browser-based dashboard perfect for streaming or presentations.

**Usage:**
```bash
# Open directly in browser
open claude-dashboard.html

# Or serve with a local server
python -m http.server 8000
# Then visit http://localhost:8000/claude-dashboard.html
```

**Features:**
- Modern UI with gradients and animations
- Real-time progress animations
- Activity feed with timestamps
- Metrics cards showing totals
- Collaboration network diagram
- Responsive design

## Instance Status Indicators

All monitors use consistent status indicators:

- ⚪ **Available** - Instance is idle
- 🔵 **Working** - Instance is actively coding
- ✅ **Completed** - Task finished successfully
- 🔴 **Blocked** - Waiting on dependencies
- 🤔 **Thinking** - Analyzing or planning
- 🧪 **Testing** - Running tests
- 👀 **Reviewing** - Code review phase

## Instance Roles

- **Instance A** 🚀 - Feature Development
- **Instance B** 🐛 - Bug Fixes and Testing
- **Instance C** 🎨 - UI/UX Improvements
- **Instance D** 📝 - Documentation and Refactoring

## Customization

### Updating Task Status

To reflect real task status in the monitors:

1. **Terminal monitors**: Edit the instance states in the script
2. **Web dashboard**: Modify the JavaScript data or connect to a real-time data source

### Adding New Instances

1. Add instance configuration to the `instances` array
2. Create corresponding UI elements
3. Update the collaboration network

### Styling

- **Terminal**: Modify ANSI color codes
- **Web**: Update CSS variables and styles

## Integration Ideas

### Real-Time Updates

Connect monitors to actual development activity:

```javascript
// Example: Watch TASKS.md for changes
const fs = require('fs');
fs.watchFile('TASKS.md', (curr, prev) => {
  // Parse tasks and update display
});
```

### Git Integration

Show real git activity:

```bash
# Get recent commits
git log --oneline -n 5

# Get current branch status
git status --porcelain
```

### WebSocket Server

For truly live updates during sessions:

```javascript
// Server broadcasts updates
io.emit('instance-update', {
  instance: 'A',
  status: 'working',
  task: 'Implementing new feature',
  progress: 75
});
```

## Best Practices

1. **Start monitor before session** - Have it running before Claude instances begin
2. **Use web dashboard for streaming** - Better for screen sharing
3. **Terminal for local monitoring** - Less resource intensive
4. **Update regularly** - Keep task status current in TASKS.md

## Troubleshooting

### Terminal colors not showing
- Ensure your terminal supports ANSI colors
- Try `export TERM=xterm-256color`

### Node monitor not updating
- Check if terminal is TTY: `node -p "process.stdout.isTTY"`
- Try running directly in terminal, not through IDE

### Web dashboard not updating
- Open browser console for errors
- Ensure JavaScript is enabled
- Try a different browser

## Future Enhancements

- [ ] Real-time file watching
- [ ] Git commit integration
- [ ] Task completion notifications
- [ ] Performance metrics
- [ ] Test result integration
- [ ] Deploy dashboard to web server
- [ ] Mobile-responsive terminal view
- [ ] Export session statistics

---

These monitoring tools help visualize the collaborative power of multiple Claude Code instances working together on the Trollhouse project!