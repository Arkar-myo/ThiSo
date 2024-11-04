'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { Search, Music, Heart } from 'lucide-react'

export default function HowItWorks() {
  const { language } = useLanguage()
  const t = translations[language]

  const steps = [
    {
      icon: Search,
      title: t.searchStep,
      description: t.searchStepDescription,
    },
    {
      icon: Music,
      title: t.playStep,
      description: t.playStepDescription,
    },
    {
      icon: Heart,
      title: t.saveStep,
      description: t.saveStepDescription,
    },
  ]

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t.howItWorks}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t.howItWorksDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 shadow-sm hover:bg-primary/20 transition-colors duration-200">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-base max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
