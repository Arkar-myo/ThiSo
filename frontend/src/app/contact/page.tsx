'use client'

import { MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
    const { language } = useLanguage()
    const t = translations[language]

    return (
        <section className="w-full">
            <div className="container mx-auto px-4 pt-20 pb-12">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 mb-4">
                        <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {t.contactUs}
                    </h1>
                    <p className="text-muted-foreground max-w-[700px]">
                        {t.contactDescription}
                    </p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">{t.name}</label>
                        <Input id="name" placeholder={t.namePlaceholder} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">{t.email}</label>
                        <Input id="email" type="email" placeholder={t.emailPlaceholder} />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">{t.message}</label>
                        <Textarea id="message" placeholder={t.messagePlaceholder} rows={5} />
                    </div>
                    <Button type="submit" className="w-full">{t.sendMessage}</Button>
                </form>
            </div>
        </section>
    )
}
