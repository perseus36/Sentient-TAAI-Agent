'use client'

import { Plus, MessageSquare, Settings, Sun, Moon, Clock, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
  lastMessage?: string
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onChatSelect?: (sessionId: string) => void
  currentSessionId?: string
}

export default function Sidebar({ isOpen, onToggle, onChatSelect, currentSessionId }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const { theme, toggleTheme } = useTheme()

  // Update timestamps after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load chat sessions from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      loadChatSessions()
    }
  }, [mounted])

  // Refresh chat sessions periodically and when currentSessionId changes
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        loadChatSessions()
      }, 2000) // Refresh every 2 seconds

      return () => clearInterval(interval)
    }
  }, [mounted, currentSessionId])

  const loadChatSessions = () => {
    try {
      const savedSessions = localStorage.getItem('chat-sessions')
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions)
        // Parse timestamps back to Date objects and filter out empty sessions
        const parsedSessions = sessions
          .map((session: any) => ({
            ...session,
            timestamp: new Date(session.timestamp)
          }))
          .filter((session: any) => session.messageCount > 0) // Only show sessions with actual messages
        
        setChatSessions(parsedSessions)
      }
    } catch (e) {
      console.error('Error loading chat sessions:', e)
    }
  }

  // Start new chat
  const startNewChat = () => {
    // Create new session
    const newSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      messageCount: 0
    }
    
    // Set current session ID but don't add to chat sessions yet
    // It will be added only when the user actually sends a message
    localStorage.setItem('current-session-id', newSession.id)
    
    // Clear current messages and reload
    localStorage.removeItem('chat-messages')
    window.location.reload()
  }

  // Switch to a specific chat session
  const switchToChat = (sessionId: string) => {
    if (onChatSelect) {
      onChatSelect(sessionId)
    }
    localStorage.setItem('current-session-id', sessionId)
  }

  // Delete a chat session
  const deleteChatSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const updatedSessions = chatSessions.filter(session => session.id !== sessionId)
      localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions))
      setChatSessions(updatedSessions)
      
      // If deleting current session, start new chat
      if (sessionId === currentSessionId) {
        startNewChat()
      }
    } catch (e) {
      console.error('Error deleting chat session:', e)
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return 'Today'
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return timestamp.toLocaleDateString()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-sidebar-bg border border-border-color rounded-lg hover:bg-message-bg transition-colors"
      >
        <MessageSquare className="w-5 h-5 text-text-primary" />
      </button>
    )
  }

  return (
    <div className="sidebar flex flex-col h-full">
      <div className="p-4">
                 {/* Logo */}
         <div className="flex justify-center mb-6">
           <div className="relative group">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg flex items-center justify-center flex-shrink-0">
               <span className="text-white font-mono text-sm font-extrabold tracking-widest px-2 py-1 bg-gray-800 rounded-md">TAAI</span>
             </div>
             <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
           </div>
         </div>
        
                 <button
           onClick={startNewChat}
           className="w-full flex items-center justify-center p-3 border border-border-color rounded-lg hover:bg-message-bg transition-colors text-text-primary mb-8"
         >
           <Plus className="w-4 h-4 mr-2" />
           New Chat
         </button>

         {/* Divider */}
         <div className="border-t border-border-color mb-6"></div>

         {/* Chat History Section */}
         {chatSessions.length > 0 && (
           <div className="flex-1 overflow-y-auto">
             <div className="flex items-center mb-3 text-text-secondary text-sm font-medium">
               <Clock className="w-4 h-4 mr-2" />
               Chat History
             </div>
            <div className="space-y-2">
              {chatSessions.map((session) => (
                                 <div
                   key={session.id}
                   onClick={() => switchToChat(session.id)}
                                       className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                      session.id === currentSessionId
                        ? 'bg-green-400 bg-opacity-20 border border-green-400 border-opacity-30'
                        : 'hover:bg-message-bg border border-transparent'
                    }`}
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex-1 min-w-0">
                       <div className="text-text-primary font-medium text-sm truncate">
                         {session.title}
                       </div>
                     </div>
                     <button
                       onClick={(e) => deleteChatSession(session.id, e)}
                       className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-all"
                       title="Delete chat"
                     >
                       <Trash2 className="w-3 h-3 text-red-400 hover:text-red-300" />
                     </button>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-y-auto">
        {/* Additional content can go here */}
      </div>
      
      <div className="p-4 border-t border-border-color mt-auto">
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center p-3 rounded-lg hover:bg-message-bg transition-colors text-text-primary"
          >
            <Settings className="w-4 h-4 mr-3" />
            <span>Settings</span>
          </button>
          
          {showSettings && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-sidebar-bg border border-border-color rounded-lg p-3 shadow-lg">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-message-bg transition-colors cursor-pointer"
                   onClick={toggleTheme}>
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 mr-3 text-text-primary" />
                  ) : (
                    <Sun className="w-4 h-4 mr-3 text-text-primary" />
                  )}
                  <span className="text-text-primary">Theme</span>
                </div>
                <div className="text-text-secondary text-sm">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
