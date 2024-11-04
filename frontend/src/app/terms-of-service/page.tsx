'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'

const TermsOfService: React.FC = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">{t.termsOfService}</h1>
      <div className="space-y-8">
        {t.termsOfServiceSections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TermsOfService