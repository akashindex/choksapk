import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import SiteSettings from '@/models/SiteSettings';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/blog', {
        title: 'Insights & Strategy | Professional Gaming Journal',
        description: 'Latest analysis, strategic updates, and industry insights from our master repository.'
    });
}

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
    await dbConnect();
    const settings = await SiteSettings.findOne();
    const uiDesign = settings?.uiDesign || 'vip';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 }) as any[];

    return (
        <div className={`min-h-screen py-20 transition-colors duration-500 ${uiDesign === 'vip' ? 'bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent)]' : 'bg-background'}`}>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-0.5 w-12 bg-primary"></div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Strategic Insights</span>
                    </div>
                    <h1 className={`font-black text-foreground uppercase tracking-tighter italic leading-none mb-8 ${uiDesign === 'vip' ? 'text-5xl md:text-8xl' : 'text-4xl md:text-6xl'}`}>
                        The <span className="text-primary not-italic">Journal</span>
                    </h1>
                    <p className={`text-muted-foreground font-medium leading-relaxed max-w-xl ${uiDesign === 'vip' ? 'text-lg' : 'text-base'}`}>
                        In-depth analysis, strategic updates, and professional insights from the world of premium assets.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {posts.map((post, i) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post._id.toString()}
                            className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${uiDesign === 'vip' ? 'rounded-[3rem]' : 'rounded-3xl'}`}
                        >
                            <div className={`aspect-[4/5] overflow-hidden relative mb-8 border border-border/50 ${uiDesign === 'vip' ? 'rounded-[2.5rem] shadow-2xl shadow-primary/5 hover:border-primary/30' : 'rounded-2xl shadow-lg'}`}>
                                {post.featuredImage ? (
                                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">No Preview Available</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                        Read Analysis <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>

                            <div className="px-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 rounded-full">{post.tags?.[0] || 'Uncategorized'}</span>
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5"><Calendar size={10} /> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-foreground mb-4 line-clamp-2 uppercase tracking-tight italic group-hover:text-primary transition-colors leading-tight">{post.title}</h2>
                                <p className="text-muted-foreground text-sm font-medium line-clamp-2 leading-relaxed opacity-80">{post.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-border/50 bg-card/50">
                        <Tag className="mx-auto mb-6 text-muted-foreground/30" size={48} />
                        <p className="text-muted-foreground font-black text-xl uppercase tracking-widest italic opacity-50">Journal sequence currently empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}
