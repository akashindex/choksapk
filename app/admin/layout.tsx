import Link from 'next/link';
import { LayoutDashboard, Gamepad2, FileText, Settings, Users, Search, Bell, HelpCircle, Store, LogOut, ExternalLink, ChevronDown, Activity, Download, ShieldCheck, Zap } from 'lucide-react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSiteSettings } from '@/lib/metadata';

import { ThemeToggle } from '@/components/ThemeToggle';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const token = (await cookies()).get('token')?.value;
    const payload = await verifyToken(token || '');

    const hasAccess = payload && (payload.role === 'admin' || payload.role === 'super_admin');

    if (!hasAccess) {
        redirect('/login');
    }

    const settings = await getSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';
    const siteName = settings?.siteName || 'choksapk';
    const logoUrl = settings?.logoUrl || '/earn-apk.png';

    return (
        <div className={`min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 ${uiDesign === 'vip' ? 'selection:bg-primary/30 selection:text-primary' : ''
            }`}>
            {/* Top Header - Permanent */}
            <header className={`border-b border-border flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-500 ${uiDesign === 'vip' ? 'h-20 bg-card/80 backdrop-blur-xl border-primary/10' :
                uiDesign === 'modern' ? 'h-16 bg-card' :
                    'h-16 bg-card shadow-sm'
                }`}>
                {/* Left: Store Switcher / Logo */}
                <div className="flex items-center gap-3 w-64">
                    <div className={`p-1 transition-all duration-500 ${uiDesign === 'vip' ? 'bg-primary rounded-xl shadow-lg shadow-primary/20' : 'bg-primary rounded'}`}>
                        <Store size={uiDesign === 'vip' ? 22 : 20} className="text-primary-foreground" />
                    </div>
                    <div>
                        <span className={`block font-black text-foreground leading-tight uppercase tracking-tighter italic ${uiDesign === 'vip' ? 'text-base' : 'text-sm'}`}>{siteName}</span>
                        <span className="block text-[8px] text-muted-foreground uppercase tracking-[0.2em] font-black">Management Node</span>
                    </div>
                    {uiDesign !== 'vip' && <ChevronDown size={14} className="text-muted-foreground ml-auto mr-4 cursor-pointer hover:text-primary transition-colors" />}
                </div>

                {/* Center: Global Search */}
                <div className="hidden md:flex flex-1 max-w-2xl px-8">
                    <div className="relative group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Query configuration matrix..."
                            className={`w-full bg-muted/50 border border-border py-2.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/50 ${uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'
                                }`}
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/" target="_blank" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary transition-all active:scale-95">
                        View Storefront <ExternalLink size={12} />
                    </Link>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <button className="text-muted-foreground hover:text-foreground relative transition-colors group">
                        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
                    </button>
                    <div className={`w-10 h-10 bg-muted flex items-center justify-center border border-border text-[10px] font-black text-muted-foreground transition-all duration-500 hover:border-primary/50 cursor-pointer ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-full'
                        }`}>
                        {payload?.name?.slice(0, 2).toUpperCase() || 'AD'}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className={`w-64 border-r border-border flex flex-col overflow-y-auto transition-all duration-500 bg-card ${uiDesign === 'vip' ? 'p-4 border-primary/5' : 'p-3'
                    }`}>
                    <div className="flex flex-col gap-1.5">
                        <p className="px-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 mt-4 opacity-50">Core Ops</p>
                        <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Command Center" uiDesign={uiDesign} />
                        <NavLink href="/admin/games" icon={<Gamepad2 size={18} />} label="Game Assets" uiDesign={uiDesign} />
                        <NavLink href="/admin/scraper" icon={<Download size={18} />} label="Asset Scraper" uiDesign={uiDesign} />

                        <p className="px-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 mt-8 opacity-50">Content & Marketing</p>
                        <NavLink href="/admin/blogs" icon={<FileText size={18} />} label="Blog Editor" uiDesign={uiDesign} />
                        <NavLink href="/admin/seo" icon={<Search size={18} />} label="SEO Matrix" uiDesign={uiDesign} />
                        <NavLink href="/admin/users" icon={<Users size={18} />} label="User Protocols" uiDesign={uiDesign} />

                        <p className="px-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 mt-8 opacity-50">Systems</p>
                        <NavLink href="/admin/settings" icon={<Settings size={18} />} label="Site Config" uiDesign={uiDesign} />
                    </div>

                    <div className="mt-auto pt-6 border-t border-border/50">
                        <LogoutButton />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 overflow-y-auto transition-colors duration-500 ${uiDesign === 'vip' ? 'bg-[#fafafa] dark:bg-[#0a0a0a] p-8 md:p-12' :
                    uiDesign === 'modern' ? 'bg-background p-6 md:p-8' :
                        'bg-background p-4 md:p-6'
                    }`}>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function NavLink({ href, icon, label, uiDesign }: { href: string; icon: React.ReactNode; label: string; uiDesign: string }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-all group relative overflow-hidden ${uiDesign === 'vip' ? 'hover:bg-primary/5 rounded-2xl' :
            uiDesign === 'modern' ? 'hover:bg-muted rounded-xl' :
                'hover:bg-muted rounded-md'
            }`}>
            <span className="group-hover:text-primary transition-colors flex-shrink-0">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            {uiDesign === 'vip' && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-4 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100"></div>
            )}
        </Link>
    );
}

