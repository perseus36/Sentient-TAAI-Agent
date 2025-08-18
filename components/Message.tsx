'use client'

import { useState, useEffect } from 'react'

interface MessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'
  const [mounted, setMounted] = useState(false)
  const [formattedTime, setFormattedTime] = useState('--:--')
  
  useEffect(() => {
    setMounted(true)
    if (message.timestamp) {
      try {
        const time = new Date(message.timestamp)
        if (!isNaN(time.getTime())) {
          setFormattedTime(time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }))
        }
      } catch (e) {
        console.error('Timestamp format error:', e)
      }
    }
  }, [message.timestamp])
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="max-w-4xl mx-auto flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
            : 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg'
        }`}>
          {isUser ? (
            // Modern User Logo
            <div className="relative group">
              <span className="text-white font-mono text-sm font-extrabold tracking-widest px-2 py-1 bg-gray-800 rounded-md">USER</span>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
          ) : (
            // Modern TAAI Agent Logo
            <div className="relative group">
              <span className="text-white font-mono text-sm font-extrabold tracking-widest px-2 py-1 bg-gray-800 rounded-md">TAAI</span>
              <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          <div className="text-xs text-text-secondary mt-2">
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  )
}
