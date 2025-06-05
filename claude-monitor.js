#!/usr/bin/env node

/**
 * Claude Code Multi-Instance Monitor
 * Real-time monitoring dashboard for collaborative coding sessions
 * 
 * Usage: node claude-monitor.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

// Instance configurations
const instances = [
  { id: 'A', name: 'Feature Dev', color: colors.green, icon: '🚀' },
  { id: 'B', name: 'Bug Fixes', color: colors.blue, icon: '🐛' },
  { id: 'C', name: 'UI/UX', color: colors.yellow, icon: '🎨' },
  { id: 'D', name: 'Documentation', color: colors.magenta, icon: '📝' }
];

// Status indicators
const statusIcons = {
  available: '⚪',
  in_progress: '🔵',
  completed: '✅',
  blocked: '🔴',
  reviewing: '👀',
  testing: '🧪'
};

// Mock data for demonstration (in real usage, this would read from TASKS.md)
let instanceStates = {
  A: {
    status: 'completed',
    task: 'Add Message Persistence (#1)',
    files: ['storageService.ts', 'ChatWindow.tsx'],
    linesAdded: 234,
    linesRemoved: 12,
    startTime: Date.now() - 1800000, // 30 min ago
    lastActivity: Date.now() - 60000 // 1 min ago
  },
  B: {
    status: 'in_progress',
    task: 'Implement Room/Channel Support (#2)',
    files: ['wakuService.ts', 'RoomSelector.tsx'],
    linesAdded: 156,
    linesRemoved: 45,
    startTime: Date.now() - 900000, // 15 min ago
    lastActivity: Date.now() - 5000 // 5 sec ago
  },
  C: {
    status: 'in_progress',
    task: 'Improve Mobile Experience (#4)',
    files: ['ChatWindow.tsx', 'index.css'],
    linesAdded: 78,
    linesRemoved: 23,
    startTime: Date.now() - 600000, // 10 min ago
    lastActivity: Date.now() - 30000 // 30 sec ago
  },
  D: {
    status: 'blocked',
    task: 'Add User Profiles (#3)',
    files: ['UserProfile.tsx (planned)'],
    linesAdded: 45,
    linesRemoved: 0,
    startTime: Date.now() - 1200000, // 20 min ago
    lastActivity: Date.now() - 180000 // 3 min ago
  }
};

// Activity log
const activityLog = [];

// Clear screen
function clearScreen() {
  console.clear();
  process.stdout.write('\x1b[H');
}

// Format time duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// Draw ASCII art header
function drawHeader() {
  console.log(colors.cyan + '╔═══════════════════════════════════════════════════════════════════════════════════════════════╗' + colors.reset);
  console.log(colors.cyan + '║' + colors.reset + '                              ' + colors.bold + '🧌 TROLLHOUSE COLLABORATIVE SESSION 🧌' + colors.reset + '                           ' + colors.cyan + '║' + colors.reset);
  console.log(colors.cyan + '║' + colors.reset + '                                                                                               ' + colors.cyan + '║' + colors.reset);
  console.log(colors.cyan + '║' + colors.reset + '  ' + colors.dim + '┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐' + colors.reset + '          ' + colors.bold + 'Claude Code Multi-Instance Monitor' + colors.reset + '           ' + colors.cyan + '║' + colors.reset);
  console.log(colors.cyan + '║' + colors.reset + '  ' + colors.dim + '│  A  │ │  B  │ │  C  │ │  D  │' + colors.reset + '                                                         ' + colors.cyan + '║' + colors.reset);
  console.log(colors.cyan + '║' + colors.reset + '  ' + colors.dim + '└─────┘ └─────┘ └─────┘ └─────┘' + colors.reset + '                                                         ' + colors.cyan + '║' + colors.reset);
  console.log(colors.cyan + '╚═══════════════════════════════════════════════════════════════════════════════════════════════╝' + colors.reset);
  console.log();
}

// Draw instance panel
function drawInstance(instance, state) {
  const width = 90;
  const statusIcon = statusIcons[state.status] || '❓';
  const timeSinceStart = formatDuration(Date.now() - state.startTime);
  const timeSinceActivity = formatDuration(Date.now() - state.lastActivity);
  
  // Header
  console.log(instance.color + '┌' + '─'.repeat(width) + '┐' + colors.reset);
  console.log(instance.color + '│' + colors.reset + ' ' + instance.icon + ' ' + colors.bold + `Instance ${instance.id} - ${instance.name}` + colors.reset + ' ' + statusIcon + ' '.repeat(width - 30 - instance.name.length) + instance.color + '│' + colors.reset);
  console.log(instance.color + '├' + '─'.repeat(width) + '┤' + colors.reset);
  
  // Task info
  console.log(instance.color + '│' + colors.reset + ' Task: ' + colors.yellow + state.task + colors.reset + ' '.repeat(width - 7 - state.task.length) + instance.color + '│' + colors.reset);
  
  // Progress bar
  const progress = state.status === 'completed' ? 100 : 
                  state.status === 'blocked' ? 20 :
                  Math.floor((Date.now() - state.startTime) / 60000); // Mock progress based on time
  const progressBar = drawProgressBar(progress, 40);
  console.log(instance.color + '│' + colors.reset + ' Progress: ' + progressBar + ` ${progress}%` + ' '.repeat(width - 55) + instance.color + '│' + colors.reset);
  
  // Files and stats
  const filesStr = state.files.join(', ');
  console.log(instance.color + '│' + colors.reset + ' Files: ' + colors.gray + filesStr + colors.reset + ' '.repeat(width - 8 - filesStr.length) + instance.color + '│' + colors.reset);
  console.log(instance.color + '│' + colors.reset + ' Changes: ' + colors.green + `+${state.linesAdded}` + colors.reset + ' / ' + colors.red + `-${state.linesRemoved}` + colors.reset + '  |  Duration: ' + timeSinceStart + '  |  Last active: ' + colors.dim + timeSinceActivity + ' ago' + colors.reset + ' '.repeat(20) + instance.color + '│' + colors.reset);
  
  console.log(instance.color + '└' + '─'.repeat(width) + '┘' + colors.reset);
}

// Draw progress bar
function drawProgressBar(percentage, width) {
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  const bar = colors.green + '█'.repeat(filled) + colors.gray + '░'.repeat(empty) + colors.reset;
  return `[${bar}]`;
}

// Draw activity feed
function drawActivityFeed() {
  console.log();
  console.log(colors.magenta + '┌─ Live Activity Feed ' + '─'.repeat(69) + '┐' + colors.reset);
  
  // Generate some mock activities
  const activities = [
    { time: '12:34:15', instance: 'A', color: colors.green, message: 'Completed message persistence implementation' },
    { time: '12:33:42', instance: 'B', color: colors.blue, message: 'Started working on room selector component' },
    { time: '12:33:10', instance: 'C', color: colors.yellow, message: 'Fixed touch target size for mobile buttons' },
    { time: '12:32:55', instance: 'D', color: colors.magenta, message: '⚠️  Blocked - waiting for wakuService updates from Instance B' },
    { time: '12:32:20', instance: 'A', color: colors.green, message: 'Running tests for storage service implementation...' }
  ];
  
  activities.forEach(activity => {
    console.log(colors.magenta + '│' + colors.reset + ' ' + colors.gray + `[${activity.time}]` + colors.reset + ' ' + activity.color + `Instance ${activity.instance}` + colors.reset + ': ' + activity.message + ' '.repeat(Math.max(0, 90 - activity.message.length - 20)) + colors.magenta + '│' + colors.reset);
  });
  
  console.log(colors.magenta + '└' + '─'.repeat(90) + '┘' + colors.reset);
}

// Draw statistics dashboard
function drawStats() {
  console.log();
  console.log(colors.cyan + '┌─ Session Metrics ' + '─'.repeat(72) + '┐' + colors.reset);
  
  // Calculate totals
  const totalLinesAdded = Object.values(instanceStates).reduce((sum, state) => sum + state.linesAdded, 0);
  const totalLinesRemoved = Object.values(instanceStates).reduce((sum, state) => sum + state.linesRemoved, 0);
  const completedTasks = Object.values(instanceStates).filter(s => s.status === 'completed').length;
  const inProgressTasks = Object.values(instanceStates).filter(s => s.status === 'in_progress').length;
  const blockedTasks = Object.values(instanceStates).filter(s => s.status === 'blocked').length;
  
  console.log(colors.cyan + '│' + colors.reset + ' Tasks: ' + colors.green + `${completedTasks} completed` + colors.reset + ' | ' + colors.blue + `${inProgressTasks} in progress` + colors.reset + ' | ' + colors.red + `${blockedTasks} blocked` + colors.reset + ' | ' + colors.gray + '2 available' + colors.reset + ' '.repeat(21) + colors.cyan + '│' + colors.reset);
  console.log(colors.cyan + '│' + colors.reset + ' Code Changes: ' + colors.green + `+${totalLinesAdded} lines` + colors.reset + ' | ' + colors.red + `-${totalLinesRemoved} lines` + colors.reset + ' | Net: ' + colors.bold + `+${totalLinesAdded - totalLinesRemoved}` + colors.reset + ' '.repeat(30) + colors.cyan + '│' + colors.reset);
  console.log(colors.cyan + '│' + colors.reset + ' Git Activity: ' + colors.yellow + '7 commits' + colors.reset + ' | ' + colors.magenta + '15 files modified' + colors.reset + ' | ' + colors.blue + '2 PRs ready' + colors.reset + ' '.repeat(25) + colors.cyan + '│' + colors.reset);
  
  console.log(colors.cyan + '└' + '─'.repeat(90) + '┘' + colors.reset);
}

// Draw collaboration graph
function drawCollaborationGraph() {
  console.log();
  console.log(colors.bold + 'Collaboration Network:' + colors.reset);
  console.log();
  console.log('     ' + colors.green + '[A]' + colors.reset + ' ←─────→ ' + colors.blue + '[B]' + colors.reset);
  console.log('      │           │');
  console.log('      │           │');
  console.log('      ↓           ↓');
  console.log('     ' + colors.yellow + '[C]' + colors.reset + ' ←─────→ ' + colors.magenta + '[D]' + colors.reset + colors.red + ' (blocked)' + colors.reset);
  console.log();
}

// Main display function
function display() {
  clearScreen();
  drawHeader();
  
  // Draw each instance
  instances.forEach(instance => {
    drawInstance(instance, instanceStates[instance.id]);
    console.log();
  });
  
  drawActivityFeed();
  drawStats();
  drawCollaborationGraph();
  
  // Footer
  console.log();
  console.log(colors.gray + 'Last updated: ' + new Date().toLocaleTimeString() + colors.reset);
  console.log(colors.gray + 'Press Ctrl+C to exit | Press R to refresh | Press H for help' + colors.reset);
}

// Simulate activity updates
function simulateActivity() {
  // Randomly update instance activities
  const instanceIds = Object.keys(instanceStates);
  const randomInstance = instanceIds[Math.floor(Math.random() * instanceIds.length)];
  
  instanceStates[randomInstance].lastActivity = Date.now();
  instanceStates[randomInstance].linesAdded += Math.floor(Math.random() * 10);
  instanceStates[randomInstance].linesRemoved += Math.floor(Math.random() * 3);
  
  // Occasionally change status
  if (Math.random() < 0.1) {
    const statuses = ['in_progress', 'testing', 'reviewing'];
    const currentState = instanceStates[randomInstance];
    if (currentState.status !== 'completed' && currentState.status !== 'blocked') {
      currentState.status = statuses[Math.floor(Math.random() * statuses.length)];
    }
  }
}

// Main loop
function main() {
  // Initial display
  display();
  
  // Update every 2 seconds
  setInterval(() => {
    simulateActivity();
    display();
  }, 2000);
  
  // Handle keyboard input
  process.stdin.setRawMode(true);
  process.stdin.on('data', (key) => {
    if (key[0] === 3) { // Ctrl+C
      process.exit();
    } else if (key.toString() === 'r' || key.toString() === 'R') {
      display();
    } else if (key.toString() === 'h' || key.toString() === 'H') {
      console.log('\nHelp: Monitor shows real-time status of all Claude instances');
      setTimeout(display, 2000);
    }
  });
}

// Check if we're running in a terminal
if (process.stdout.isTTY) {
  main();
} else {
  console.log('This monitor requires an interactive terminal');
  process.exit(1);
}