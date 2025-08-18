# TAAI Agent - Technical Analysis AI Assistant

A modern, AI-powered technical analysis assistant built with Next.js 14, designed specifically for future integration with Sentient Chat API. TAAI Agent provides expert guidance on technical analysis topics through an intuitive chat interface and serves as a foundation for building intelligent trading applications that will seamlessly connect to Sentient's advanced AI capabilities.

<!-- Updated by perseus36 -->

## ✨ Features

- 🤖 **AI-Powered Responses**: OpenAI GPT-3.5 Turbo integration for intelligent technical analysis guidance (temporary, will be replaced with Sentient Chat API)
- 💬 **Modern Chat Interface**: ChatGPT-style conversation experience with real-time responses
- 📊 **Technical Analysis Focus**: Specialized in indicators, patterns, trends, and market analysis
- 🌐 **Multi-Language Support**: Detects and responds in the user's language (Turkish/English)
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔒 **Secure API Handling**: Environment-based API key management
- 💾 **Chat History**: Automatic conversation storage and session management
- 🔄 **Sentient-Ready**: Built with modular architecture for easy Sentient Chat API integration

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **AI**: OpenAI GPT-3.5 Turbo API (temporary, will be replaced with Sentient Chat API)
- **Icons**: Lucide React
- **Architecture**: App Router (Next.js 13+) with modular API design
- **State Management**: React Hooks with localStorage

## 🔮 Sentient Chat Integration

This project is specifically designed for Sentient Chat API integration:

- **Current State**: Uses OpenAI as a temporary solution for development and testing
- **Future State**: Will seamlessly switch to Sentient Chat API endpoints for enhanced trading insights
- **Architecture**: Modular design allows easy API switching without code changes
- **Features**: Built to leverage Sentient's advanced AI capabilities for technical analysis
- **Migration**: Simple configuration change to activate Sentient Chat API
- **Purpose**: Designed to showcase how Sentient Chat API can enhance trading and technical analysis applications

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/perseus36/TAAI-Agent.git
cd TAAI-Agent
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
# Future: SENTIENT_API_KEY=your_sentient_api_key_here
# Future: SENTIENT_API_ENDPOINT=https://api.sentient.chat
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:3000`

## 💡 Usage

### Getting Started
1. **Welcome Screen**: View example questions and get familiar with the interface
2. **Ask Questions**: Type your technical analysis questions in the chat input
3. **Get Responses**: Receive detailed, educational explanations from TAAI Agent
4. **Chat History**: Your conversations are automatically saved and accessible

### Example Questions
- "How is the RSI indicator used?"
- "What are Fibonacci retracement levels?"
- "How do you perform trend analysis?"
- "Tell me about MACD indicator"
- "What are chart patterns and how to identify them?"

## 🔐 Security

### API Key Protection
- API keys are stored in environment variables (`.env` file)
- `.env` files are automatically excluded from Git commits
- No hardcoded API keys in the source code
- Secure environment variable handling

### Production Deployment
- Use hosting platform environment variables
- Never expose API keys in client-side code
- Implement rate limiting for production use

## 🎨 UI Components

### Design System
- **TAAI Logo**: Custom green gradient design with hover animations
- **Chat Bubbles**: Themed conversation interface with smooth transitions
- **Example Cards**: Interactive question suggestions with hover effects
- **Responsive Layout**: Sidebar navigation and main chat area

### Color Scheme
- **Primary**: Green gradient (#10b981 to #059669)
- **Secondary**: Gray tones for text and borders
- **Accent**: Blue for user interactions
- **Dark/Light**: Theme support with CSS variables

## 📁 Project Structure

```
TAAI-Agent/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (designed for Sentient integration)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ChatInterface.tsx  # Main chat component
│   ├── Message.tsx        # Individual message component
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── ThemeContext.tsx   # Theme management
├── lib/                    # Utility functions and API handlers
└── .env                    # Environment variables (not committed)
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **Railway**: Add environment variables in dashboard
- **Docker**: Use provided Dockerfile

## 🔮 Future Sentient Integration

### Phase 1: Current Development
- ✅ OpenAI integration for development and testing
- ✅ Modular API architecture
- ✅ Technical analysis chat interface
- ✅ Session management and history
- ✅ Trading-focused example questions

### Phase 2: Sentient API Integration
- 🔄 Replace OpenAI with Sentient Chat API
- 🔄 Implement Sentient-specific trading features
- 🔄 Add Sentient authentication
- 🔄 Optimize for Sentient's response format
- 🔄 Enhanced technical analysis capabilities

### Phase 3: Advanced Trading Features
- 🔄 Sentient-specific UI enhancements
- 🔄 Advanced trading conversation capabilities
- 🔄 Sentient analytics integration
- 🔄 Custom trading workflows
- 🔄 Real-time market data integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**Educational Purpose Only**: This application is designed for educational purposes only. The information provided does not constitute investment advice. Always consult with qualified financial professionals before making investment decisions.

## 🆘 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas
- **Documentation**: Check the code comments for technical details
- **Sentient Integration**: For questions about Sentient Chat API integration

---

**Built with ❤️ using Next.js and OpenAI (temporary) - Future: Sentient Chat API**

*This project is designed to showcase the power of Sentient Chat API integration for technical analysis and trading applications, serving as a foundation for building intelligent financial AI assistants.*
