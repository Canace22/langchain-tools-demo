# langchain-tools-demo
langchain tools demo

## Features

### Response Analysis Page
- View comprehensive response statistics including total responses, average response time, and success rate
- Interactive data table with filtering and pagination
- Export functionality for response data
- Detailed view for individual responses
- Real-time status monitoring with visual indicators

### Ant Design X Components (Element Plus Implementation)
The project includes a recreation of Ant Design X components using Element Plus:

#### Common Components
- **Bubble**: Versatile message bubble component with multiple styling options and tail positioning
- **Conversations**: Complete conversation component with support for user/AI messages, typing indicators, and action buttons
  - Now supports hiding user avatars while keeping AI avatars visible for a cleaner interface
  - Added Markdown rendering with syntax highlighting for code blocks in AI messages

#### Wake Components
- **Welcome**: Customizable welcome screen component with title, description, icon/image, and example suggestions
  - Redesigned with a modern horizontal layout matching Ant Design X visual style
  - Supports custom avatar/logo display and personalized welcome message

#### Express Components
- **Sender**: Message input component with support for text entry, uploads, and keyboard shortcuts
  - Uses Enter to send messages and Shift+Enter for line breaks
  - Provides visual feedback for loading states and character limits

#### Confirm Components
- **ThoughtChain**: Component for displaying AI reasoning process with collapsible steps and code snippets

To view the demos, navigate to `/antx-demo` in the application.

## Recent Updates
- Replaced custom chat components with Ant Design X (AntX) components in the Chat.vue file
- Integrated AntxConversations for message display and AntxSender for message input
- Improved chat UI with standardized components for better user experience
- Added option to show only AI avatars in chat conversations for a cleaner interface
- Updated keyboard shortcuts in the Sender component: now uses Enter to send messages and Shift+Enter for line breaks
- Added Markdown rendering support with syntax highlighting for AI messages in conversations
- Redesigned the Welcome component with Ant Design X branding and improved layout

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