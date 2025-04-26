# langchain-tools-demo
langchain tools demo

## Features

### Response Analysis Page
- View comprehensive response statistics including total responses, average response time, and success rate
- Interactive data table with filtering and pagination
- Export functionality for response data
- Detailed view for individual responses
- Real-time status monitoring with visual indicators

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Quick Start

For your convenience, we've provided scripts to start both frontend and backend services with a single command:

### On macOS/Linux:
```bash
# Make the script executable first
chmod +x start.sh
# Run the script
./start.sh
```

### On Windows:
```bash
start.bat
```

These scripts will:
- Check for npm installation
- Install dependencies if needed
- Start both frontend and backend services in separate terminal windows
- The frontend will be available at http://localhost:5173
- The backend API at http://localhost:3000
- The MCP service at http://localhost:3001
