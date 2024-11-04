"use client";

import React from 'react'
import { Button } from "@/components/ui/button"
import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "my" : "en")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      aria-label="Change language"
      className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{language === "en" ? "EN" : "MM"}</span>
    </Button>
  )
}

export default LanguageToggle
