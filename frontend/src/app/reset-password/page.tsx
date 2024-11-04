'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import ResetPasswordDialog from '@/components/ResetPasswordDialog'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get('token')

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen">
      <ResetPasswordDialog
        isOpen={true}
        onClose={() => router.push('/login')}
        token={token}
      />
    </div>
  )
} 