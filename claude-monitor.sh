#!/bin/bash

# Claude Code Multi-Instance Monitor
# A live dashboard for monitoring multiple Claude Code instances during collaborative coding

# Colors
RESET='\033[0m'
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'

# Status indicators
STATUS_IDLE="⚪"
STATUS_WORKING="🔵"
STATUS_COMPLETE="✅"
STATUS_BLOCKED="🔴"
STATUS_THINKING="🤔"

# Clear screen and set up terminal
clear_screen() {
    clear
    tput cup 0 0
}

# Draw the header
draw_header() {
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}                          ${BOLD}🧌 TROLLHOUSE COLLABORATIVE CODING SESSION 🧌${RESET}                     ${CYAN}║${RESET}"
    echo -e "${CYAN}║${RESET}                                   ${GRAY}Claude Code Multi-Instance Monitor${RESET}                       ${CYAN}║${RESET}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
}

# Function to display an instance
display_instance() {
    local instance_id=$1
    local status=$2
    local task=$3
    local progress=$4
    local files=$5
    local color=$6
    
    echo -e "${color}┌─────────────────────────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${color}│${RESET} ${BOLD}Instance $instance_id${RESET} $status                                                              ${color}│${RESET}"
    echo -e "${color}├─────────────────────────────────────────────────────────────────────────────────────┤${RESET}"
    echo -e "${color}│${RESET} Task: ${YELLOW}$task${RESET}"
    echo -e "${color}│${RESET} Progress: $progress"
    echo -e "${color}│${RESET} Files: ${GRAY}$files${RESET}"
    echo -e "${color}└─────────────────────────────────────────────────────────────────────────────────────┘${RESET}"
}

# Function to show activity log
show_activity_log() {
    echo -e "${PURPLE}┌─ Recent Activity ────────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${PURPLE}│${RESET} ${GRAY}[12:34:15]${RESET} ${GREEN}Instance A${RESET}: Completed message persistence implementation"
    echo -e "${PURPLE}│${RESET} ${GRAY}[12:33:42]${RESET} ${BLUE}Instance B${RESET}: Started working on room/channel support"
    echo -e "${PURPLE}│${RESET} ${GRAY}[12:33:10]${RESET} ${YELLOW}Instance C${RESET}: Fixed TypeScript error in ChatWindow.tsx"
    echo -e "${PURPLE}│${RESET} ${GRAY}[12:32:55]${RESET} ${RED}Instance D${RESET}: Blocked - waiting for Instance B's wakuService changes"
    echo -e "${PURPLE}│${RESET} ${GRAY}[12:32:20]${RESET} ${GREEN}Instance A${RESET}: Running tests for storage service..."
    echo -e "${PURPLE}└──────────────────────────────────────────────────────────────────────────────────────┘${RESET}"
}

# Function to show statistics
show_stats() {
    echo -e "${CYAN}┌─ Session Statistics ─────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${CYAN}│${RESET} Tasks Completed: ${GREEN}3${RESET}  │  In Progress: ${BLUE}4${RESET}  │  Blocked: ${RED}1${RESET}  │  Available: ${GRAY}2${RESET}"
    echo -e "${CYAN}│${RESET} Files Modified: ${YELLOW}12${RESET}  │  Lines Added: ${GREEN}+847${RESET}  │  Lines Removed: ${RED}-231${RESET}"
    echo -e "${CYAN}│${RESET} Session Duration: ${BOLD}00:45:23${RESET}  │  Commits: ${PURPLE}7${RESET}  │  Conflicts Resolved: ${YELLOW}2${RESET}"
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────────────┘${RESET}"
}

# Main display loop
while true; do
    clear_screen
    draw_header
    
    # Instance A - Feature Development
    display_instance "A - Feature Dev" \
        "$STATUS_COMPLETE" \
        "Add Message Persistence (#1)" \
        "[████████████████████] 100% Complete" \
        "storageService.ts, ChatWindow.tsx" \
        "$GREEN"
    
    echo ""
    
    # Instance B - Bug Fixes
    display_instance "B - Bug Fixes" \
        "$STATUS_WORKING" \
        "Implement Room/Channel Support (#2)" \
        "[████████████░░░░░░░░] 60% - Creating room selector UI" \
        "wakuService.ts, RoomSelector.tsx (new)" \
        "$BLUE"
    
    echo ""
    
    # Instance C - UI/UX
    display_instance "C - UI/UX" \
        "$STATUS_THINKING" \
        "Improve Mobile Experience (#4)" \
        "[██████░░░░░░░░░░░░░░] 30% - Analyzing touch targets" \
        "ChatWindow.tsx, index.css" \
        "$YELLOW"
    
    echo ""
    
    # Instance D - Documentation
    display_instance "D - Documentation" \
        "$STATUS_BLOCKED" \
        "Add User Profiles (#3)" \
        "[████░░░░░░░░░░░░░░░░] 20% - Waiting for wakuService updates" \
        "UserProfile.tsx (planned), profileService.ts (planned)" \
        "$RED"
    
    echo ""
    show_activity_log
    echo ""
    show_stats
    
    # Show timestamp
    echo -e "\n${GRAY}Last updated: $(date '+%Y-%m-%d %H:%M:%S')${RESET}"
    echo -e "${GRAY}Press Ctrl+C to exit${RESET}"
    
    # Wait before refresh
    sleep 2
done