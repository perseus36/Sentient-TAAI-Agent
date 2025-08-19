'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string>('')

  // Load current session ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessionId = localStorage.getItem('current-session-id')
      if (savedSessionId) {
        setCurrentSessionId(savedSessionId)
      }
    }
  }, [])

  // Handle chat session selection from sidebar
  const handleChatSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    // Update current session ID in localStorage
    localStorage.setItem('current-session-id', sessionId)
  }

  return (
    <div className="chat-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onChatSelect={handleChatSelect}
        currentSessionId={currentSessionId}
      />
      <ChatInterface 
        onChatSelect={handleChatSelect}
        currentSessionId={currentSessionId}
      />
    </div>
  )
}
