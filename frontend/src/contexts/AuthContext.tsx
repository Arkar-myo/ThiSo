'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  User, 
  verifyToken, 
  initializeAuth, 
  login as loginService, 
  register as registerService,
  LoginDto,
  RegisterDto
} from '@/services/userService'

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsLoading(false)
          return
        }

        initializeAuth()
        const userData = await verifyToken()
        setUser(userData)
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    login: async (email: string, password: string) => {
      const credentials: LoginDto = { email, password }
      const response = await loginService(credentials)
      setUser(response.user)
    },
    register: async (email: string, username: string, password: string) => {
      const userData: RegisterDto = { email, username, password }
      const response = await registerService(userData)
      setUser(response)
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
