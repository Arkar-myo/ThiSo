import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Music, Moon, Sun, Globe, Menu, X } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-16">
                        <div className="space-y-8">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                About ThiSo
                            </h1>
                            <div className="space-y-6 text-lg text-muted-foreground">
                                <p>
                                    ThiSo is a comprehensive platform dedicated to helping musicians of all levels find, learn, and share their favorite songs. Our extensive database of lyrics and chords makes it easy for guitarists to discover, practice, and perform the music they love.
                                </p>
                                <p>
                                    Founded in 2024, our mission is to create an inclusive community where music enthusiasts can share their passion, contribute their knowledge, and help each other grow as musicians.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold sm:text-3xl">What We Offer</h2>
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Extensive Song Database</h3>
                                    <p className="text-muted-foreground">Access a growing collection of songs with accurate chord notations and lyrics, spanning various genres and difficulty levels.</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">ChordPro Editor</h3>
                                    <p className="text-muted-foreground">Create and edit songs using our intuitive ChordPro editor, making it easy to format and share your musical arrangements.</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Multilingual Support</h3>
                                    <p className="text-muted-foreground">Enjoy our platform in multiple languages, making music accessible to users worldwide.</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Community Features</h3>
                                    <p className="text-muted-foreground">Connect with fellow musicians, share arrangements, and contribute to our growing musical community.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">1. Find Your Song</h3>
                                    <p className="text-muted-foreground">Search our extensive database for your favorite songs or browse by genre, artist, or difficulty level.</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">2. Learn and Practice</h3>
                                    <p className="text-muted-foreground">Use our interactive features like auto-scroll, transpose, and font size adjustment to practice at your own pace.</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">3. Contribute and Share</h3>
                                    <p className="text-muted-foreground">Add new songs, improve existing arrangements, and share your knowledge with the community.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold sm:text-3xl">Our Mission</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-muted-foreground">
                                    At ThiSo, we believe that music should be accessible to everyone. Our mission is to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Provide accurate and easy-to-use musical resources</li>
                                    <li>Foster a supportive community of musicians</li>
                                    <li>Make learning and playing music more enjoyable</li>
                                    <li>Support musicians of all skill levels in their musical journey</li>
                                    <li>Preserve and share musical knowledge across cultures</li>
                                </ul>
                            </div>
                        </div>
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