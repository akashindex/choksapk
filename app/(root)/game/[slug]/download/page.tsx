import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import SiteSettings from '@/models/SiteSettings';
import { notFound } from 'next/navigation';
import GameDownloadClient from '@/components/GameDownloadClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const game = await Game.findOne({ slug, isActive: true });
    if (!game) return { title: 'Asset Not Found' };
    return {
        title: `Deploying ${game.title} | Protocol Active`,
        description: `Initializing secure download protocol for ${game.title}.`,
        robots: 'noindex, nofollow'
    };
}

export default async function DownloadPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    await dbConnect();
    const settings = await SiteSettings.findOne();
    const game = await Game.findOne({ slug, isActive: true });

    if (!game) notFound();

    const uiDesign = settings?.uiDesign || 'vip';

    const plainGame = {
        title: game.title,
        thumbnail: game.thumbnail,
        referralUrl: game.referralUrl || '#'
    };

    return <GameDownloadClient game={plainGame} uiDesign={uiDesign} />;
}
