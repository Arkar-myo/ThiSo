import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Music, Moon, Sun, Globe, Menu, X } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [language, setLanguage] = useState("EN")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleTheme = () => setIsDarkMode(!isDarkMode)
    const toggleLanguage = () => setLanguage(language === "EN" ? "ES" : "EN")
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
                <Link className="flex items-center justify-center" href="/">
                    <Music className="h-6 w-6" />
                    <span className="ml-2 text-lg font-semibold">ThiSo</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Change language">
                        <Globe className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium">{language}</span>
                    <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </header>
            {isMenuOpen && (
                <nav className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
                    <div className="text-center">
                        <Link className="block text-2xl font-semibold my-4 hover:text-gray-600 dark:hover:text-gray-300" href="/" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link className="block text-2xl font-semibold my-4 hover:text-gray-600 dark:hover:text-gray-300" href="/songs" onClick={toggleMenu}>
                            Songs
                        </Link>
                        <Link className="block text-2xl font-semibold my-4 hover:text-gray-600 dark:hover:text-gray-300" href="/about" onClick={toggleMenu}>
                            About
                        </Link>
                        <Link className="block text-2xl font-semibold my-4 hover:text-gray-600 dark:hover:text-gray-300" href="/contact" onClick={toggleMenu}>
                            Contact
                        </Link>
                    </div>
                </nav>
            )}
            <main className="flex-1">
                <section className="w-full py-12 md:py-24  lg:py-32">
                    <div className="container px-4 md:px-6 max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
                            Contact Us
                        </h1>
                        <p className="text-lg mb-8">
                            Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                                <Input id="name" placeholder="Your name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <Input id="email" type="email" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                <Textarea id="message" placeholder="Your message" rows={5} />
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </div>
                </section>
            </main>
            <footer className={`py-6 w-full shrink-0 px-4 md:px-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>© 2024 ThiSo. All rights reserved.</p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className={`text-xs hover:underline underline-offset-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} href="#">
                            Terms of Service
                        </Link>
                        <Link className={`text-xs hover:underline underline-offset-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} href="#">
                            Privacy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}