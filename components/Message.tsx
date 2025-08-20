'use client'

import { useState, useEffect } from 'react'
import { useUsername } from './UsernameContext'

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
  const { username } = useUsername()
  
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
    <div className={`message-container ${isUser ? 'user-container' : 'assistant-container'} mb-3`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start">

          {/* Message Content Section */}
          <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {/* Message Header */}
            <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-sm font-semibold ${
                isUser 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {isUser ? (username || 'You') : 'TAAI Agent'}
              </span>
              <span className="text-xs text-text-secondary ml-2">
                {formattedTime}
              </span>
            </div>

            {/* Message Bubble */}
            <div className={`inline-block max-w-full ${
              isUser 
                ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-text-primary rounded-2xl rounded-br-md shadow-lg border border-gray-200 dark:border-gray-600' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-text-primary rounded-2xl rounded-bl-md shadow-lg border border-gray-200 dark:border-gray-600'
            }`}>
              <div className="px-6 py-4">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
