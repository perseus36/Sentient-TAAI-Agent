'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UsernameContextType {
  username: string
  setUsername: (username: string) => void
  saveUsername: (username: string) => void
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined)

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState('')

  useEffect(() => {
    // Load username from localStorage on mount
    try {
      const savedUsername = localStorage.getItem('username')
      if (savedUsername) {
        setUsernameState(savedUsername)
      }
    } catch (e) {
      console.error('Error loading username:', e)
    }
  }, [])

  const saveUsername = (newUsername: string) => {
    try {
      localStorage.setItem('username', newUsername)
      setUsernameState(newUsername)
    } catch (e) {
      console.error('Error saving username:', e)
    }
  }

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername)
  }

  return (
    <UsernameContext.Provider value={{ username, setUsername, saveUsername }}>
      {children}
    </UsernameContext.Provider>
  )
}

export function useUsername() {
  const context = useContext(UsernameContext)
  if (context === undefined) {
    throw new Error('useUsername must be used within a UsernameProvider')
  }
  return context
}
