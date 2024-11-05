'use client'

import { Info, Users, Target, Zap, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { motion } from 'framer-motion'

export default function AboutPage() {
    const { language } = useLanguage()
    const t = translations[language]

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4 py-16 sm:py-24">
                {/* Hero Section */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mb-16 sm:mb-24"
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
                        <Info className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                        {t.aboutUs}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        <FeatureCard
                            icon={<Users className="h-10 w-10 text-primary" />}
                            title="For Everyone"
                            description={t.aboutParagraph1}
                        />
                        <FeatureCard
                            icon={<Target className="h-10 w-10 text-primary" />}
                            title='Easy to Access'
                            description={t.aboutParagraph2}
                        />
                        <FeatureCard
                            icon={<Zap className="h-10 w-10 text-primary" />}
                            title='feature 3'
                            description={t.aboutParagraph3}
                        />
                    </div>
                </motion.div>
                <motion.div
                    className="mt-24"
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-primary">{t.ourMission}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {t.missionPoints.map((point, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start bg-card rounded-lg p-6 shadow-md"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                <p className="ml-4 text-lg text-muted-foreground">{point}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: any) {
    return (
        <motion.div
            className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-3">{title}</h3>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    )
}