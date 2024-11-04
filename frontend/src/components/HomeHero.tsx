'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import SearchBar from './SearchBar'
import { Music } from 'lucide-react'

export default function HomeHero() {
  const { language } = useLanguage()
  const t = translations[language]
  const router = useRouter()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/song-list?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center pt-20 pb-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-background to-background" />
      
      {/* Content Container */}
      <div className="container relative px-4 mx-auto">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-6 md:space-y-8">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/5 shadow-sm animate-fade-in">
            <Music className="h-5 w-5 text-primary" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in-up">
            {t.findLyricsAndChords}
          </h1>
          
          {/* Subheading */}
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-up delay-100">
            {t.searchDatabase}
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-xl mx-auto pt-4 md:pt-6 animate-fade-in-up delay-200">
            <SearchBar 
              onSearch={handleSearch} 
              className="shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
