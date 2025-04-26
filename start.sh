#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== LangChain Tools Demo - Startup Script ===${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Function to start a service in a new terminal
start_service() {
    local service_name=$1
    local service_dir=$2
    local start_command=$3
    
    echo -e "${BLUE}Starting $service_name...${NC}"
    cd "$service_dir" || { echo "Error: Directory $service_dir not found!"; exit 1; }
    
    # Check if packages are installed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for $service_name..."
        npm install
    fi
    
    # Start the service
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && $start_command\""
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $(pwd) && $start_command; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $(pwd) && $start_command; bash" &
        else
            echo "No supported terminal found. Please manually run: cd $(pwd) && $start_command"
        fi
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows with Git Bash or similar
        start cmd.exe /k "cd $(pwd) && $start_command"
    else
        echo "Unsupported OS. Please manually run: cd $(pwd) && $start_command"
    fi
    
    cd - > /dev/null
}

# Start backend service
start_service "Backend" "backend" "npm run dev"

# Give backend a moment to start
sleep 2

# Start frontend service
start_service "Frontend" "frontend" "npm run dev"

echo -e "${GREEN}Services started successfully!${NC}"
echo -e "Backend running at: ${BLUE}http://localhost:3000${NC}"
echo -e "Frontend should be accessible at: ${BLUE}http://localhost:5173${NC}"
echo -e "MCP service running at: ${BLUE}http://localhost:3001${NC}"
echo ""
echo "Press Ctrl+C in each terminal window to stop the services" 