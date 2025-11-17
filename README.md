# ChatGPT Export Splitter

A pure client-side React application that converts large ChatGPT export JSON files into individual text files for each conversation.

## Features

- 📁 **Pure Client-Side Processing** - No server required, everything runs in your browser
- 🚀 **Handles Large Files** - Efficiently processes exports up to 150MB+ using Web Workers
- 📦 **ZIP Download** - Automatically packages all conversations into a single ZIP file
- 🎯 **Clean Text Format** - Outputs simple "User:" and "ChatGPT:" formatted conversations
- 📱 **Mobile Friendly** - Responsive design works on all devices
- ⚡ **Real-time Progress** - Shows processing status and progress indicators

## How to Use

### 1. Export Your ChatGPT Data
1. Go to ChatGPT Settings → Data Controls → Export Data
2. Download your conversations.json file

### 2. Run the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Convert Your Export
1. Open the app at `http://localhost:5173/`
2. Select your ChatGPT export JSON file
3. Click "Convert / Export"
4. Wait for processing to complete
5. Download the generated ZIP file

## Output Format

Each conversation becomes a `.txt` file with this format:

```
User: Hello, how are you?
ChatGPT: Hello! I'm doing well, thank you for asking. How can I help you today?
User: Can you explain React?
ChatGPT: React is a popular JavaScript library for building user interfaces...
```

## Technical Details

- **Frontend**: React 18 + Vite
- **Processing**: Web Worker for non-blocking JSON parsing
- **ZIP Creation**: JSZip library for file packaging
- **File Naming**: Sanitized titles with duplicate handling
- **Text Cleaning**: Removes citations and extra whitespace

## Browser Compatibility

- Chrome 80+
- Firefox 76+
- Safari 14+
- Edge 80+

## File Structure

```
src/
├── App.jsx          # Main UI component
├── App.css          # Application styles
├── worker.js        # Web Worker for JSON processing
└── index.css        # Global styles
```

## Development

The application is built with modern React and uses:
- ES6+ JavaScript
- CSS Custom Properties
- Vite for fast development
- Web Workers for performance

## License

MIT License - Feel free to use and modify as needed.