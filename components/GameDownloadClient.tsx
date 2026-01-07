'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ShieldCheck, Loader2, Link as LinkIcon } from 'lucide-react';

interface GameDownloadPageProps {
    game: {
        title: string;
        thumbnail: string;
        referralUrl: string;
    };
    uiDesign: string;
}

export default function GameDownloadClient({ game, uiDesign }: GameDownloadPageProps) {
    const [timeLeft, setTimeLeft] = useState(3);
    const [status, setStatus] = useState('Initializing Secure Hash...');
    const router = useRouter();

    useEffect(() => {
        if (timeLeft <= 0) {
            setStatus('Redirecting to Deployment Node...');
            const timer = setTimeout(() => {
                window.location.href = game.referralUrl;
            }, 1000);
            return () => clearTimeout(timer);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
            if (timeLeft === 3) setStatus('Verifying Asset Integrity...');
            if (timeLeft === 2) setStatus('Allocating Bandwidth...');
            if (timeLeft === 1) setStatus('Synchronizing Stream...');
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, game.referralUrl]);

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${uiDesign === 'vip' ? 'bg-[#050505] text-white' : 'bg-background text-foreground'
            }`}>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md space-y-12 text-center">
                {/* Asset Identity */}
                <div className="space-y-6">
                    <div className={`mx-auto w-32 h-32 md:w-48 md:h-48 overflow-hidden border-2 p-1 transition-all duration-700 animate-pulse ${uiDesign === 'vip' ? 'rounded-[2.5rem] border-primary shadow-2xl shadow-primary/20' : 'rounded-3xl border-border'
                        }`}>
                        <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover rounded-[2rem]" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic italic">
                            {game.title}
                        </h1>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
                            Deployment Protocol Active
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                <div className="space-y-8">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl font-black text-primary/20 animate-ping">
                                {timeLeft}
                            </span>
                        </div>
                        <Loader2 size={120} className="text-primary animate-spin opacity-20" strokeWidth={0.5} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-black italic">
                                {timeLeft}s
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-bold text-muted-foreground animate-pulse">
                            {status}
                        </p>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000 ease-linear shadow-[0_0_10px_var(--primary)]"
                                style={{ width: `${((3 - timeLeft) / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className={`inline-flex items-center gap-3 px-6 py-3 transition-colors ${uiDesign === 'vip' ? 'bg-primary/5 rounded-2xl border border-primary/10' : 'bg-muted rounded-xl border border-border'
                    }`}>
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Secure Channel</p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Verified Manifest 2.1</p>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed px-8">
                    If the download doesn't trigger automatically, please <span className="text-primary cursor-pointer hover:underline" onClick={() => window.location.href = game.referralUrl}>click here</span> to manually synchronize.
                </p>
            </div>
        </div>
    );
}
