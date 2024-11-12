'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRouteProps } from '@/types'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname) {
      const redirectPath = encodeURIComponent(pathname)
      router.push(`/login?redirectTo=${redirectPath}`)
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
