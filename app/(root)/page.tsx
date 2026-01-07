import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import SiteSettings from '@/models/SiteSettings';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';
import { Shield, Zap, Globe, Crown, Star, ArrowRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/', {
        title: 'Premium Assets & Strategic Referrals',
        description: 'The definitive repository for verified high-performance assets and strategic referral protocols. Join our elite network today.'
    });
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    let featuredGames: any[] = [];
    let latestGames: any[] = [];
    let settings: any = null;

    try {
        await dbConnect();

        // Fetch settings
        settings = await SiteSettings.findOne();

        // Fetch Featured Games (Editor's Choice) - 4 games
        featuredGames = await Game.find({ isFeatured: true, isActive: true }).limit(4);

        // Fetch Latest Games (New Arrivals) - 8 games for a more Amazon-like feel
        latestGames = await Game.find({ isActive: true }).sort({ createdAt: -1 }).limit(8);
    } catch (error) {
        console.error("Homepage DB Error:", error);
    }

    const siteName = settings?.siteName || 'CHOKS APK';
    const siteTagline = settings?.siteTagline || 'Premium Asset Distribution Protocol';
    const uiDesign = settings?.uiDesign || 'vip';

    return (
        <div className={`bg-background selection:bg-primary/20 ${uiDesign === 'vip' ? 'bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent)]' : ''}`}>
            {/* Hero Section */}
            <section className={`relative flex items-center justify-center overflow-hidden border-b border-border/50 ${uiDesign === 'vip' ? 'min-h-[500px] md:h-[650px]' :
                uiDesign === 'modern' ? 'min-h-[400px] md:h-[550px] py-20' :
                    'min-h-[300px] md:h-[450px] py-12'
                }`}>
                <div className={`absolute inset-0 bg-grid-white/[0.02] ${uiDesign === 'classic' ? 'bg-[size:20px_20px]' : 'bg-[size:40px_40px]'}`}></div>
                <div className={`absolute inset-0 ${uiDesign === 'vip' ? 'bg-gradient-to-tr from-background via-background/80 to-primary/5' :
                    uiDesign === 'modern' ? 'bg-gradient-to-b from-primary/5 to-background' :
                        'bg-background/95'
                    }`}></div>

                {/* Floating Elements - Only for VIP */}
                {uiDesign === 'vip' && (
                    <>
                        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
                    </>
                )}

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

                    <h1 className={`font-black text-foreground mb-6 uppercase tracking-tighter leading-[0.9] ${uiDesign === 'vip' ? 'text-4xl sm:text-6xl md:text-8xl italic' :
                        uiDesign === 'modern' ? 'text-3xl sm:text-5xl md:text-7xl' :
                            'text-2xl sm:text-4xl md:text-6xl'
                        }`}>
                        {siteName} <span className="text-primary not-italic">{uiDesign === 'classic' ? 'Pro' : 'ELITE'}</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">RESOURCES</span>
                    </h1>

                    <p className={`text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium ${uiDesign === 'vip' ? 'text-sm md:text-xl' : 'text-xs md:text-base'
                        }`}>
                        {siteTagline}. Access verified high-performance gaming assets and secure referral protocols designed for strategic growth.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                        <Link href="/games" className={`group flex items-center justify-center gap-3 px-10 py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-widest transition-all ${uiDesign === 'vip' ? 'rounded-2xl shadow-2xl shadow-primary/20' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'}`}>
                            Explore Vault <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/about" className={`px-10 py-4 bg-muted hover:bg-muted/80 text-foreground font-black text-xs uppercase tracking-widest transition-all border border-border ${uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'}`}>
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>


            {/* Featured Games */}
            <section className="container mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                            <Star size={10} fill="currentColor" /> PREMIUM PICKS
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter italic leading-none">Editor's Choice</h2>
                    </div>
                    <Link href="/games" className="text-xs font-black text-muted-foreground hover:text-primary tracking-[0.2em] uppercase transition-colors flex items-center gap-2 border-b border-muted-foreground/20 italic pb-1">
                        View All Assets <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {featuredGames.map((game, i) => (
                        <Link href={`/game/${game.slug}`} key={game._id.toString()} className={`group relative block bg-card rounded-[2rem] overflow-hidden border border-border hover:border-primary transition-all animate-in fade-in slide-in-from-bottom-8 duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                                {game.thumbnail ? (
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground italic font-black uppercase tracking-widest text-[10px]">No Preview</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">ACCESS DATABASE</div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-foreground text-sm font-black truncate uppercase tracking-tight mb-1">{game.title}</h4>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{game.provider}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* New Arrivals Horizontal Scroll Area */}
            <section className="bg-muted/30 py-24 border-y border-border/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-0.5 w-12 bg-primary"></div>
                        <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight italic">Newly Sanitized Protocols</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {latestGames.map(game => (
                            <Link href={`/game/${game.slug}`} key={game._id.toString()} className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary transition-all shadow-sm">
                                <div className="aspect-square bg-muted relative overflow-hidden">
                                    {game.thumbnail && <img src={game.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />}
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">NEW</div>
                                </div>
                                <div className="p-5">
                                    <h4 className="text-foreground text-[11px] font-black truncate uppercase tracking-tight">{game.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );

}
