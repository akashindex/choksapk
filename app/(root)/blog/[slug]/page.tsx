import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import SiteSettings from '@/models/SiteSettings';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Twitter, ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const path = `/blog/${slug}`;

    await dbConnect();
    const post = await BlogPost.findOne({ slug, status: 'published' });

    if (!post) return { title: 'Article Not Found' };

    return await getMetadataForPath(path, {
        title: `${post.title} | Premium Insights`,
        description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 160),
    });
}

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const settings = await SiteSettings.findOne();
    const uiDesign = settings?.uiDesign || 'vip';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = await BlogPost.findOne({ slug: slug, status: 'published' }) as any;

    if (!post) notFound();

    return (
        <div className={`min-h-screen py-16 md:py-32 transition-colors duration-500 ${uiDesign === 'vip' ? 'bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent)]' : 'bg-background'}`}>
            <article className="container mx-auto px-4 max-w-4xl">
                <div className="mb-16">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-12 hover:gap-3 transition-all">
                        <ArrowLeft size={14} /> Back to Journal
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-8 uppercase tracking-widest font-black text-[9px]">
                        {post.tags?.map((tag: string) => (
                            <span key={tag} className="px-4 py-1.5 bg-primary/10 text-primary rounded-full">{tag}</span>
                        ))}
                    </div>

                    <h1 className={`font-black text-foreground uppercase tracking-tighter italic leading-[1.1] mb-10 ${uiDesign === 'vip' ? 'text-4xl md:text-7xl' : 'text-3xl md:text-5xl'}`}>
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 py-6 border-y border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-primary" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={12} className="text-primary" />
                            Editorial Team
                        </div>
                        <div className="ml-auto hidden md:flex items-center gap-4">
                            <span className="text-[8px] opacity-50">Share Protocol:</span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:text-primary transition-colors"><Facebook size={14} /></button>
                                <button className="p-2 hover:text-primary transition-colors"><Twitter size={14} /></button>
                                <button className="p-2 hover:text-primary transition-colors"><Share2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {post.featuredImage && (
                    <div className={`w-full aspect-video overflow-hidden mb-16 shadow-2xl ring-1 ring-border/50 ${uiDesign === 'vip' ? 'rounded-[3.5rem]' : 'rounded-3xl'}`}>
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <div
                        className={`description-content text-foreground leading-relaxed prose prose-invert max-w-none selection:bg-primary/30 selection:text-primary ${uiDesign === 'vip' ? 'prose-p:text-lg' : 'prose-p:text-base'}`}
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />
                </div>

                <div className="mt-32 pt-16 border-t border-border/50 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 bg-primary/10 flex items-center justify-center text-primary mb-8 ${uiDesign === 'vip' ? 'rounded-[2rem]' : 'rounded-3xl'}`}>
                        <Share2 size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter italic mb-4">Strategic Distribution</h3>
                    <p className="text-muted-foreground font-medium mb-10 max-w-sm">Spread these insights across your professional network to optimize your collective ROI.</p>
                    <div className="flex gap-4">
                        <button className={`px-10 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-2xl shadow-primary/20 ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'}`}>Share Story</button>
                        <Link href="/blog" className={`px-10 py-4 bg-muted text-foreground border border-border font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'}`}>All Insights</Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
