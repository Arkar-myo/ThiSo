'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { Button } from './ui/button'
import Link from 'next/link'
import { FileEdit } from 'lucide-react'

export default function ContributeSection() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="bg-primary/5 bg-gradient-to-b from-muted/30 to-background py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 shadow-sm">
            <FileEdit className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t.contributeTitle}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.contributeDescription}
            </p>
          </div>
          <div className="pt-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/chordpro-editor">
                {t.startContributing}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
