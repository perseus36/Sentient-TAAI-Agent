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
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'sentient'>('openai')
  
  // Force OpenAI as the only available provider for now
  useEffect(() => {
    setSelectedProvider('openai')
  }, [])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message immediately to avoid loading screen
  const [initialMessage] = useState<ChatMessage>({
    id: '1',
    role: 'assistant',
    content: '',
    timestamp: new Date()
  })

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
    setMessages([initialMessage])
    
    // Clear old messages for the new session
    localStorage.removeItem(`chat-messages-${newSession.id}`)
    
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
        setMessages([initialMessage])
      }
    } catch (e) {
      console.error('Error loading chat session:', e)
      // Fallback to welcome message
      setMessages([initialMessage])
    }
  }

  // Update timestamps after component mounts
  useEffect(() => {
    setMounted(true)
    // Set initial messages immediately
    setMessages([initialMessage])
    
    // Initialize chat session immediately if possible
    if (typeof window !== 'undefined') {
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
      } else {
        // Load existing chat session
        loadChatSession(currentSession)
      }
      setInitialized(true)
    }
  }, [initialMessage])

  // Handle chat session switching
  useEffect(() => {
    if (currentSessionId && mounted) {
      loadChatSession(currentSessionId)
      // Also update the current session ID in localStorage
      localStorage.setItem('current-session-id', currentSessionId)
    }
  }, [currentSessionId, mounted])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  const scrollToBottomIfNearBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px tolerance
      
      if (isNearBottom) {
        messagesContainerRef.current.scrollTop = scrollHeight
      }
    }
  }

  useEffect(() => {
    // Only auto-scroll if it's a new message (not initial load)
    if (messages.length > 1) {
      scrollToBottomIfNearBottom()
    }
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
      const endpoint = selectedProvider === 'openai' ? '/api/chat' : '/api/sentient'
      const response = await fetch(endpoint, {
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
    <div className="chat-area flex flex-col h-full">
      {/* Messages Container - Only scrollable when there are messages */}
      <div 
        ref={messagesContainerRef} 
        className={`flex-1 px-4 py-4 ${
          messages.length > 1 ? 'overflow-y-auto has-messages' : 'overflow-visible'
        }`}
      >
        {messages.length === 1 && !isLoading ? (
          // Empty welcome screen - no content
          <div></div>
        ) : (
          // Normal chat screen
          <>
            {messages
              .filter(message => message.content.trim())
              .map((message) => (
                <Message key={message.id} message={message} />
              ))}
                         {isLoading && (
               <div className="message assistant-message">
                 <div className="max-w-4xl mx-auto">
                   {/* Message Header */}
                   <div className="flex items-center space-x-3 mb-2">
                     <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                       TAAI Agent
                     </span>
                     <span className="text-xs text-text-secondary">
                       {new Date().toLocaleTimeString('en-US', { 
                         hour: '2-digit', 
                         minute: '2-digit',
                         hour12: true 
                       })}
                     </span>
                   </div>
                   
                   {/* Message Bubble */}
                   <div className="inline-block max-w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-text-primary rounded-2xl rounded-bl-md shadow-lg border border-gray-200 dark:border-gray-600">
                     <div className="px-6 py-4">
                       <div className="flex items-center space-x-3 mb-2">
                         <span className="text-sm text-text-secondary font-medium">TAAI Agent is thinking...</span>
                       </div>
                       <div className="text-sm text-text-secondary italic">
                         {thinkingMessage}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
       
      {/* Fixed Header and Input Section - Always visible */}
      <div className="flex-shrink-0">
        {/* TAAI Agent Header Above Input */}
        <div className="text-center mb-6">
          {messages.length === 1 && (
            <>
              <h1 className="text-4xl font-bold text-text-primary mb-2">
                TAAI Agent
              </h1>
              <p className="text-2xl text-text-secondary mb-3">
                (Technical Analysis AI Agent)
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                Hello! I am TAAI Agent, here to help you with technical analysis. What topic would you like to learn about?
              </p>
            </>
          )}
        </div>
        
        <div className="input-container mb-8">
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

                   {/* Provider Selection Toggle - Moved below the input */}
          <div className="max-w-4xl mx-auto mt-2">
           <div className="flex items-center justify-center space-x-2">
             <span className="text-sm text-text-secondary font-medium">AI Provider:</span>
             <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                               <button
                  type="button"
                  onClick={() => setSelectedProvider('openai')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedProvider === 'openai'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <img src="/gpt.png" alt="GPT" className="w-5 h-5 inline-block mr-2" />
                  OpenAI
                </button>
                               <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60 relative group"
                  title="Coming Soon - Sentient Framework will be available soon!"
                >
                  <img src="/sentient.png" alt="Sentient" className="w-5 h-5 inline-block mr-2" />
                  Sentient
                  {/* Coming Soon Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Coming Soon
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </button>
             </div>
           </div>
           
                   </div>

                                           {/* Example Questions - Moved below AI Provider */}
            {messages.length === 1 && (
              <div className="max-w-4xl mx-auto mt-6">
                <div className="text-center mb-4">
                  <span className="text-sm text-text-secondary font-medium">💡 Example Questions:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                
                {/* Help text moved below example questions */}
                <div className="text-center mt-4">
                  <span className="text-xs text-text-secondary">
                    💡 Click on example questions to get started immediately or write your own question
                  </span>
                </div>
              </div>
            )}
          
        </div>
      </div>
      
      {/* Disclaimer - Always visible at bottom */}
      <div className="flex-shrink-0 text-center text-xs text-text-secondary py-4 border-t border-border-color">
        Information provided by TAAI Agent is for informational purposes only and does not constitute investment advice.
      </div>
    </div>
  )
}
