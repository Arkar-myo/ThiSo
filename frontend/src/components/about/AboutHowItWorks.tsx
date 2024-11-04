'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'

export default function AboutHowItWorks() {
    const { language } = useLanguage()
    const t = translations[language]

    return (
        <section className="space-y-8">
            <h2 className="text-2xl font-bold sm:text-3xl text-center">
                {t.howItWorks}
            </h2>
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">1. {t.searchStep}</h3>
                    <p className="text-muted-foreground">{t.searchStepDescription}</p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">2. {t.playStep}</h3>
                    <p className="text-muted-foreground">{t.playStepDescription}</p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">3. {t.saveStep}</h3>
                    <p className="text-muted-foreground">{t.saveStepDescription}</p>
                </div>
            </div>
        </section>
    )
} 