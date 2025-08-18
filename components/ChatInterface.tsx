'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import Message from './Message'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onChatSelect?: (sessionId: string) => void
  currentSessionId?: string
}

export default function ChatInterface({ onChatSelect, currentSessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [initialized, setInitialized] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [thinkingMessage, setThinkingMessage] = useState('')
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Thinking messages for better UX
  const thinkingMessages = [
    "Analyzing technical indicators...",
    "Processing chart patterns...",
    "Calculating support/resistance levels...",
    "Evaluating market trends...",
    "Reviewing technical analysis concepts...",
    "Preparing detailed explanation...",
    "Analyzing market structure...",
    "Processing technical data..."
  ]

  // Function to start new chat
  const startNewChat = () => {
    // Create new session
    const newSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      messageCount: 0
    }
    
    // Add to sessions
    const savedSessions = localStorage.getItem('chat-sessions')
    let updatedSessions = [newSession]
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions)
        updatedSessions = [newSession, ...sessions]
      } catch (e) {
        console.error('Error parsing saved sessions:', e)
      }
    }
    
    localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions))
    localStorage.setItem('current-session-id', newSession.id)
    
    // Show welcome screen
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I am TAAI Agent, here to help you with technical analysis. What topic would you like to learn about?',
      timestamp: new Date()
    }])
    
    // Clear old messages
    localStorage.removeItem('chat-messages')
    
    // Notify parent component
    if (onChatSelect) {
      onChatSelect(newSession.id)
    }
  }

  // Load messages for a specific chat session
  const loadChatSession = (sessionId: string) => {
    try {
      const savedMessages = localStorage.getItem(`chat-messages-${sessionId}`)
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } else {
        // If no saved messages, show welcome message
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'Hello! I am TAAI Agent, here to help you with technical analysis. What topic would you like to learn about?',
          timestamp: new Date()
        }])
      }
    } catch (e) {
      console.error('Error loading chat session:', e)
      // Fallback to welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Hello! I am TAAI Agent, here to help you with technical analysis. What topic would you like to learn about?',
        timestamp: new Date()
      }])
    }
  }

  // Update timestamps after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize messages and chat session
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted && !initialized) {
      // Check current chat session
      const currentSession = localStorage.getItem('current-session-id')
      if (!currentSession) {
        // Create new session if first time opening
        const newSession = {
          id: Date.now().toString(),
          title: 'New Chat',
          timestamp: new Date(),
          messageCount: 0
        }
        localStorage.setItem('current-session-id', newSession.id)
        localStorage.setItem('chat-sessions', JSON.stringify([newSession]))
        
        // Show welcome screen
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'Hello! I am TAAI Agent, here to help you with technical analysis. What topic would you like to learn about?',
          timestamp: new Date()
        }])
      } else {
        // Load existing chat session
        loadChatSession(currentSession)
      }
      
      setInitialized(true)
    }
  }, [mounted, initialized])

  // Handle chat session switching
  useEffect(() => {
    if (currentSessionId && mounted) {
      loadChatSession(currentSessionId)
    }
  }, [currentSessionId, mounted])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Animated thinking message
  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0
      const interval = setInterval(() => {
        setThinkingMessage(thinkingMessages[messageIndex])
        messageIndex = (messageIndex + 1) % thinkingMessages.length
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [isLoading])

  // Save messages to localStorage and update chat session when messages change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      const currentSession = localStorage.getItem('current-session-id')
      if (currentSession) {
        // Save messages for current session
        localStorage.setItem(`chat-messages-${currentSession}`, JSON.stringify(messages))
        
        // Only add to chat sessions if there are actual user messages (not just welcome message)
        const hasUserMessages = messages.length > 1 // More than just the welcome message
        
        if (hasUserMessages) {
          // Update chat session
          const savedSessions = localStorage.getItem('chat-sessions')
          if (savedSessions) {
            try {
              const sessions = JSON.parse(savedSessions)
              const updatedSessions = sessions.map((session: any) => {
                if (session.id === currentSession) {
                  return {
                    ...session,
                    title: messages[1]?.content?.substring(0, 50) + '...' || 'New Chat',
                    messageCount: messages.length - 1, // Don't count first welcome message
                    lastMessage: messages[messages.length - 1]?.content
                  }
                }
                return session
              })
              localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions))
            } catch (e) {
              console.error('Error updating chat session:', e)
            }
          }
        }
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // If this is the first user message, create the chat session entry
    if (messages.length === 1) {
      const currentSession = localStorage.getItem('current-session-id')
      if (currentSession) {
        const newSession = {
          id: currentSession,
          title: inputValue.substring(0, 50) + '...',
          timestamp: new Date(),
          messageCount: 1
        }
        
        // Add to chat sessions
        const savedSessions = localStorage.getItem('chat-sessions')
        let updatedSessions = [newSession]
        if (savedSessions) {
          try {
            const sessions = JSON.parse(savedSessions)
            updatedSessions = [newSession, ...sessions]
          } catch (e) {
            console.error('Error parsing saved sessions:', e)
          }
        }
        localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions))
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get API response')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setThinkingMessage('')
    }
  }

  return (
    <div className="chat-area">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 1 && !isLoading ? (
          // Welcome screen
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="text-center max-w-2xl">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                TAAI Agent
              </h1>
              <p className="text-base text-text-secondary mb-4">
                (Technical Analysis AI Agent)
              </p>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Hello! I am TAAI Agent, here to help you with technical analysis. 
                What topic would you like to learn about?
              </p>
              
                             {/* Example questions */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <button
                   onClick={() => setInputValue("How is the RSI indicator used?")}
                   className="example-card"
                 >
                   <div className="example-card-icon">📊</div>
                   <div className="example-card-title">RSI Indicator</div>
                   <div className="example-card-description">How to determine overbought/oversold levels?</div>
                 </button>
                 
                 <button
                   onClick={() => setInputValue("What are Fibonacci levels?")}
                   className="example-card"
                 >
                   <div className="example-card-icon">📈</div>
                   <div className="example-card-title">Fibonacci</div>
                   <div className="example-card-description">How are retracement levels calculated?</div>
                 </button>
                 
                 <button
                   onClick={() => setInputValue("How is trend analysis performed?")}
                   className="example-card"
                 >
                   <div className="example-card-icon">🎯</div>
                   <div className="example-card-title">Trend Analysis</div>
                   <div className="example-card-description">How do we identify uptrends and downtrends?</div>
                 </button>
                 
                 <button
                   onClick={() => setInputValue("Tell me about the MACD indicator")}
                   className="example-card"
                 >
                   <div className="example-card-icon">⚡</div>
                   <div className="example-card-title">MACD</div>
                   <div className="example-card-description">How do we read momentum and trend changes?</div>
                 </button>
               </div>
              
              <div className="text-xs text-text-secondary">
                💡 Click on example questions to get started immediately or write your own question
              </div>
            </div>
          </div>
        ) : (
          // Normal chat screen
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="message assistant-message">
                <div className="max-w-4xl mx-auto flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg flex items-center justify-center flex-shrink-0">
                    <div className="relative group">
                      <span className="text-white font-mono text-sm font-extrabold tracking-widest px-2 py-1 bg-gray-800 rounded-md">TAAI</span>
                      <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                      <span className="text-sm text-text-secondary font-medium">TAAI Agent is thinking...</span>
                    </div>
                    <div className="text-sm text-text-secondary italic">
                      {thinkingMessage}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="input-container">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write your technical analysis question..."
              className="chat-input pr-12"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white transition-all duration-300 hover:scale-110 disabled:scale-100 shadow-md hover:shadow-lg"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs text-text-secondary mt-2">
          TAAI Agent - Not investment advice
        </div>
      </div>
    </div>
  )
}
