"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MusicIcon, Menu, User as UserIcon, LogOut, Home, Music2, Info, Mail, Edit3 } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
import LoginSignupDialog from '../app/login/LoginSignupDialog'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/services/userService'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { useLanguage } from '@/contexts/LanguageContext'
import { translations, TranslationKey } from '@/utils/translations'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const { language } = useLanguage()
    const { user, setUser } = useAuth()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleCloseDropdownMenu = () => {
            setIsMenuOpen(false);
        };

        window.addEventListener('closeDropdownMenu', handleCloseDropdownMenu);
        return () => {
            window.removeEventListener('closeDropdownMenu', handleCloseDropdownMenu);
        };
    }, []);

    const handleLogout = () => {
        logout()
        setUser(null)
        router.push('/')
    }

    const t = (key: TranslationKey): string => {
        const translation = translations[language][key];
        return typeof translation === 'string' ? translation : String(translation);
    }

    const UserMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {user?.username}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const NavItems: React.FC = () => (
        <TooltipProvider delayDuration={0}>
            <div className="flex items-center gap-6">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors" 
                            href="/"
                        >
                            <Home className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('home')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors" 
                            href="/song-list"
                        >
                            <Music2 className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('songs')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors" 
                            href="/about"
                        >
                            <Info className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('about')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors" 
                            href="/contact"
                        >
                            <Mail className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('contact')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors" 
                            href="/chordpro-editor"
                        >
                            <Edit3 className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('chordproEditor')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-background'
            } `}>
            <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <Link className="flex items-center justify-center" href="/">
                    <MusicIcon className="h-6 w-6 mr-2" />
                    <span className="font-bold">ThiSo</span>
                </Link>
                <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
                    <NavItems />
                    <LanguageToggle />
                    {user ? <UserMenu /> : <LoginSignupDialog />}
                </nav>
                <div className="flex lg:hidden items-center gap-2">
                    <LanguageToggle />
                    {user ? (
                        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuItem asChild>
                                    <Link href="/">{t('home')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/song-list">{t('songs')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/about">{t('about')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/contact">{t('contact')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/chordpro-editor">{t('chordproEditor')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center gap-2">
                                        <UserIcon className="h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuItem asChild>
                                    <Link href="/">{t('home')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/song-list">{t('songs')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/about">{t('about')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/contact">{t('contact')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/chordpro-editor">{t('chordproEditor')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="p-0 focus:bg-transparent"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <LoginSignupDialog className="w-full h-full" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
