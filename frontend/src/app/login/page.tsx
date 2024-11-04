'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import LoginSignupDialog from '@/app/login/LoginSignupDialog'

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo')

  useEffect(() => {
    if (user && redirectTo) {
      router.push(redirectTo)
    } else if (user) {
      router.back()
    }
  }, [user, router, redirectTo])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Please Login to Continue</h1>
      <LoginSignupDialog />
    </div>
  )
}
