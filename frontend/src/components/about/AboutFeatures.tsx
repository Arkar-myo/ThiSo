'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { Database, Edit3, Globe2, Users2 } from 'lucide-react'

export default function AboutFeatures() {
    const { language } = useLanguage()
    const t = translations[language]

    const features = [
        {
            icon: <Database className="h-6 w-6" />,
            title: t.extensiveSongDatabase,
            description: t.extensiveSongDatabaseDescription
        },
        {
            icon: <Edit3 className="h-6 w-6" />,
            title: t.chordproEditor,
            description: t.chordproEditorDescription
        },
        {
            icon: <Globe2 className="h-6 w-6" />,
            title: t.multilingualSupport,
            description: t.multilingualSupportDescription
        },
        {
            icon: <Users2 className="h-6 w-6" />,
            title: t.communityFeatures,
            description: t.communityFeaturesDescription
        }
    ]

    return (
        <section className="space-y-12">
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                {t.whatWeOffer}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
                {features.map((feature, index) => (
                    <div key={index} className="group p-6 rounded-xl transition-all hover:bg-accent/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
} 