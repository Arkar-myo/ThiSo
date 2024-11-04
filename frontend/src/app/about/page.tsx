'use client'

import { Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import AboutFeatures from '@/components/about/AboutFeatures'
import AboutHowItWorks from '@/components/about/AboutHowItWorks'
import AboutMission from '@/components/about/AboutMission'

export default function AboutPage() {
    const { language } = useLanguage()
    const t = translations[language]

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4 py-12 sm:py-16">
                {/* Hero Section */}
                <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-primary/10 mb-4">
                        <Info className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                        {t.aboutUs}
                    </h1>
                    <div className="prose prose-lg dark:prose-invert mx-auto space-y-4">
                        <p className="text-muted-foreground/90 leading-relaxed">{t.aboutParagraph1}</p>
                        <p className="text-muted-foreground/90 leading-relaxed">{t.aboutParagraph2}</p>
                        <p className="text-muted-foreground/90 leading-relaxed">{t.aboutParagraph3}</p>
                    </div>
                </div>
                
                {/* Content Sections */}
                <div className="space-y-16 sm:space-y-24">
                    <div className="bg-card rounded-xl p-6 sm:p-8 lg:p-10 shadow-lg">
                        <AboutFeatures />
                    </div>
                    <div className="bg-accent/5 rounded-xl p-6 sm:p-8 lg:p-10">
                        <AboutHowItWorks />
                    </div>
                    <div className="bg-card rounded-xl p-6 sm:p-8 lg:p-10 shadow-lg">
                        <AboutMission />
                    </div>
                </div>
            </div>
        </div>
    )
}
