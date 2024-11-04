'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'

export default function AboutMission() {
    const { language } = useLanguage()
    const t = translations[language]

    return (
        <section className="space-y-8">
            <h2 className="text-2xl font-bold sm:text-3xl text-center">
                {t.ourMission}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground text-center mb-6">
                    {t.missionStatement}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-2xl mx-auto">
                    {t.missionPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </section>
    )
} 