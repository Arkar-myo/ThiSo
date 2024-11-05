'use client'

import { UserCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProfilePage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 mb-4">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t.profile}
          </h1>
          <p className="text-muted-foreground max-w-[700px]">
            {t.profileDescription}
          </p>
        </div>
        {/* Rest of the profile page content */}
      </div>
    </ProtectedRoute>
  )
}
