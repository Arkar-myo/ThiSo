'use client'

import { useState } from 'react'
import { MessageCircle, Send, User, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
    const { language } = useLanguage()
    const t = translations[language]
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        // Here you would typically handle the form submission
        console.log('Form submitted')
    }

    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-primary/5 to-background py-16 pt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 bg-primary p-8 text-primary-foreground">
                            <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary-foreground/10 mb-4">
                                <MessageCircle className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight mb-4">
                                {t.contactUs}
                            </h1>
                            <p className="mb-6 text-primary-foreground/80">
                                {t.contactDescription}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2" />
                                    <span>contact@example.com</span>
                                </div>
                                <div className="flex items-center">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">{t.name}</label>
                                    <div className="relative">
                                        <Input id="name" placeholder={t.namePlaceholder} className="pl-10" />
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">{t.email}</label>
                                    <div className="relative">
                                        <Input id="email" type="email" placeholder={t.emailPlaceholder} className="pl-10" />
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">{t.message}</label>
                                    <Textarea id="message" placeholder={t.messagePlaceholder} rows={5} />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            submitting...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Send className="mr-2 h-4 w-4" />
                                            {t.sendMessage}
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}