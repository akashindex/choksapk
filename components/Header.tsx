'use client';
import Link from 'next/link';
import { Menu, Search, User, Globe, Shield, Activity, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

export default function Header() {
    const settings = useSiteSettings();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const uiDesign = settings?.uiDesign || 'vip';

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error('Suggestions Error:', error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
            setIsSearchFocused(false);
            setSuggestions([]);
        }
    };

    const siteName = settings?.siteName || 'CHOKS APK';
    const logoUrl = settings?.logoUrl || '/earn-apk.png';

    return (
        <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${uiDesign === 'vip' ? 'bg-background/80 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5' :
            uiDesign === 'modern' ? 'bg-background/95 backdrop-blur border-border' :
                'bg-background border-border shadow-sm'
            }`}>
            <div className={`container mx-auto px-4 flex items-center justify-between gap-4 md:gap-8 ${uiDesign === 'vip' ? 'h-20' : 'h-16'
                }`}>
                <Link href="/" className={`flex items-center gap-3 transition-transform active:scale-95 ${uiDesign === 'vip' ? 'text-lg md:text-2xl font-black text-primary uppercase tracking-tighter italic' :
                    uiDesign === 'modern' ? 'text-base md:text-xl font-bold text-foreground uppercase tracking-tight' :
                        'text-base md:text-lg font-bold text-foreground'
                    }`}>
                    <div className={`${uiDesign === 'vip' ? 'p-1.5 bg-primary/10 rounded-xl border border-primary/20 shadow-inner' : ''}`}>
                        <img src={logoUrl} alt="" className={`${uiDesign === 'vip' ? 'w-8 h-8 md:w-10 md:h-10' : 'w-7 h-7 md:w-8 md:h-8'} object-contain`} />
                    </div>
                    <span className="whitespace-nowrap">{siteName}</span>
                </Link>

                <nav className={`hidden lg:flex gap-8 items-center font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mr-auto`}>
                    {[
                        { label: 'Home', href: '/' },
                        { label: 'Route Vault', href: '/games', icon: <Shield size={10} className="text-primary/50" /> },
                        { label: 'Blog', href: '/blog', icon: <Globe size={10} className="text-primary/50" /> },
                        { label: 'About', href: '/about', icon: <Info size={10} className="text-primary/50" /> }
                    ].map((link) => (
                        <Link key={link.label} href={link.href} className="flex items-center gap-1.5 hover:text-primary transition-colors group relative py-2">
                            {uiDesign === 'vip' && link.icon}
                            {link.label}
                            {uiDesign === 'vip' && <span className="w-0 group-hover:w-full h-0.5 bg-primary absolute bottom-0 left-0 transition-all duration-300"></span>}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-md justify-end">
                    <form onSubmit={handleSearch} className="relative group flex items-center justify-end hidden sm:flex">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={isSearchFocused ? "Search Assets..." : ""}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className={`transition-all duration-500 ease-in-out font-black uppercase tracking-widest text-[9px] md:text-[10px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none h-10 ${isSearchFocused
                                ? 'w-full md:w-64 bg-muted/80 border-primary ring-4 ring-primary/10 pl-10 pr-4 border rounded-full'
                                : `w-10 bg-muted/30 border-transparent pl-10 pr-0 cursor-pointer hover:bg-muted/50 ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-full'}`
                                }`}
                        />
                        <button
                            type="submit"
                            onClick={(e) => {
                                if (!isSearchFocused) {
                                    e.preventDefault();
                                    searchInputRef.current?.focus();
                                }
                            }}
                            className={`absolute left-0 top-0 bottom-0 px-3 flex items-center justify-center transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground scale-110'}`}
                        >
                            <Search size={16} />
                        </button>

                        {/* Suggestions Dropdown */}
                        {isSearchFocused && searchQuery.length >= 2 && (suggestions.length > 0 || isLoadingSuggestions) && (
                            <div className={`absolute top-full right-0 mt-2 w-72 md:w-80 bg-card border border-border shadow-2xl overflow-hidden py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ${uiDesign === 'vip' ? 'rounded-[2rem]' : 'rounded-2xl'
                                }`}>
                                {isLoadingSuggestions ? (
                                    <div className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse italic">Scanning Core Database...</div>
                                ) : (
                                    suggestions.map((game) => (
                                        <button
                                            key={game.slug}
                                            onMouseDown={() => {
                                                router.push(`/game/${game.slug}`);
                                                setIsSearchFocused(false);
                                                setSearchQuery('');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors group"
                                        >
                                            <div className={`w-10 h-10 overflow-hidden bg-muted flex-shrink-0 border border-border group-hover:border-primary/50 transition-colors ${uiDesign === 'vip' ? 'rounded-xl' : 'rounded-lg'
                                                }`}>
                                                <img src={game.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-black text-foreground uppercase truncate group-hover:text-primary transition-colors">{game.title}</div>
                                                <div className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest truncate">{game.provider}</div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </form>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={`lg:hidden bg-card border-t border-border p-6 shadow-2xl animate-in slide-in-from-top duration-300 ${uiDesign === 'vip' ? 'rounded-b-[2.5rem]' : ''
                    }`}>
                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search Vault..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full bg-muted border border-border py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary transition-all ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'
                                }`}
                        />
                        <button type="submit" className="absolute left-0 top-0 bottom-0 px-4 flex items-center justify-center text-muted-foreground active:text-primary transition-colors">
                            <Search size={18} />
                        </button>
                    </form>
                    <div className="flex flex-col gap-5">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-3">
                            {uiDesign === 'vip' && <Globe size={14} className="text-primary/50" />} Home
                        </Link>
                        <Link href="/games" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-3">
                            {uiDesign === 'vip' && <Shield size={14} className="text-primary/50" />} Route Vault
                        </Link>
                        <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-3">
                            {uiDesign === 'vip' && <Globe size={14} className="text-primary/50" />} Blog
                        </Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-3">
                            {uiDesign === 'vip' && <Info size={14} className="text-primary/50" />} About
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
