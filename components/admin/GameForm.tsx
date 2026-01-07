'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GameForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        provider: initialData?.provider || '',
        category: initialData?.category || 'slots',
        thumbnail: initialData?.thumbnail || '',
        downloadUrl: initialData?.downloadUrl || initialData?.demoUrl || '',
        referralUrl: initialData?.referralUrl || '',
        rating: initialData?.rating ?? 4.5,
        version: initialData?.version || '1.0.0',
        requirements: initialData?.requirements || 'Android 6.0+',
        downloadCount: initialData?.downloadCount || '100,000+',
        fileSize: initialData?.fileSize || '45 MB',
        description: initialData?.description || '',
        isFeatured: initialData?.isFeatured || false,
        isActive: initialData?.isActive ?? true,
        gallery: initialData?.gallery || [],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const generateSlug = () => {
        const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            const json = await res.json();
            if (json.url) {
                setFormData(prev => ({ ...prev, thumbnail: json.url }));
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setLoading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const data = new FormData();
                data.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: data });
                const json = await res.json();
                return json.url;
            });

            const urls = await Promise.all(uploadPromises);
            const validUrls = urls.filter(url => !!url);
            setFormData(prev => ({
                ...prev,
                gallery: [...prev.gallery, ...validUrls]
            }));
        } catch (err) {
            console.error("Gallery Upload failed", err);
        } finally {
            setLoading(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_: string, i: number) => i !== index)
        }));
    };

    const handleAIOptimize = async (mode: 'humanize' | 'seo' | 'matrix') => {
        if (!formData.description && mode !== 'matrix') {
            alert('Please enter some text in the description first.');
            return;
        }

        if (mode === 'matrix' && !formData.title) {
            alert('Identity Title is required for SEO Matrix.');
            return;
        }

        setLoading(true);
        try {
            // Predict slug if not editing existing game
            let currentSlug = formData.slug;
            if (!currentSlug && formData.title) {
                currentSlug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            const endpoint = mode === 'matrix' ? '/api/seo/generate' : '/api/ai/optimize';
            const body = mode === 'matrix'
                ? { title: formData.title, description: formData.description, slug: currentSlug }
                : { text: formData.description, mode };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (mode === 'matrix') {
                if (data.savedRoute) {
                    alert(`✅ SEO Matrix Route Created!\n\nTarget Route: ${data.savedRoute.route}\nSEO Title: ${data.savedRoute.title}\nSEO Keywords: ${data.savedRoute.keywords || 'N/A'}`);
                } else if (data.optimizedData) {
                    alert('SEO Data Generated (Route NOT saved - slug missing):\n' + JSON.stringify(data.optimizedData, null, 2));
                }
            } else {
                if (data.optimizedDescription || data.optimizedText) {
                    setFormData(prev => ({
                        ...prev,
                        description: data.optimizedDescription || data.optimizedText
                    }));
                }
            }

            if (data.error) {
                alert(`AI Error: ${data.error}`);
            }
        } catch (err) {
            console.error('AI Optimization failed', err);
            alert('AI processing failed. Check connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = initialData ? `/api/games/${initialData._id}` : '/api/games';
        const method = initialData ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            router.refresh();
            router.push('/admin/games');
        } else {
            alert('Failed to save');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Identity Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} onBlur={generateSlug} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" required placeholder="e.g. Neon Rush" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Access Slug</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" required placeholder="neon-rush" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Source Provider</label>
                    <input name="provider" value={formData.provider} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" required placeholder="e.g. NetEnt" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Inventory Class</label>
                    <div className="relative">
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-black uppercase tracking-widest appearance-none cursor-pointer">
                            <option value="general">General Asset</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Visual Asset (URL)</label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="flex-1 bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium" placeholder="https://cdn.example.com/asset.png" required />
                    <label className="cursor-pointer bg-foreground text-background font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-foreground/10">
                        Upload Asset
                        <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                    </label>
                </div>
                {formData.thumbnail && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-[2rem] inline-block border border-border group overflow-hidden">
                        <img src={formData.thumbnail} alt="Preview" className="h-24 w-auto object-contain transition-transform group-hover:scale-110" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Asset Repository (Download URL)</label>
                    <input name="downloadUrl" value={formData.downloadUrl} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium" placeholder="https://storage.choksapk.com/assets/game.zip" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Master Referral (Affiliate Link)</label>
                    <input name="referralUrl" value={formData.referralUrl} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium" placeholder="https://partner.xyz/ref/user" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Rating</label>
                    <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Version</label>
                    <input name="version" value={formData.version} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" placeholder="1.0.0" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Requirements</label>
                    <input name="requirements" value={formData.requirements} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" placeholder="Android 6.0+" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Downloads</label>
                    <input name="downloadCount" value={formData.downloadCount} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" placeholder="500,000+" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">File Size</label>
                    <input name="fileSize" value={formData.fileSize} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" placeholder="39.65 MB" />
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between ml-1">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Visual Evidence (Image Gallery)</label>
                    <label className="cursor-pointer text-[8px] font-black uppercase tracking-widest bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                        Add screenshots
                        <input type="file" hidden multiple onChange={handleGalleryUpload} accept="image/*" />
                    </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {formData.gallery.map((url: string, index: number) => (
                        <div key={index} className="relative aspect-video bg-muted/50 rounded-xl border border-border group overflow-hidden">
                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    ))}
                    {formData.gallery.length === 0 && (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-border rounded-2xl">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-30 italic">No visual protocols added to this asset's gallery</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between ml-1">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Product Description (Rich Text)</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleAIOptimize('humanize')}
                            className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Humanize AI'}
                        </button>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleAIOptimize('seo')}
                            className="text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Optimizing...' : 'SEO Optimize'}
                        </button>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleAIOptimize('matrix')}
                            className="text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Generating...' : 'SEO Matrix AI'}
                        </button>
                    </div>
                </div>
                <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden min-h-[300px] prose prose-invert max-w-none">
                    <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        modules={{
                            toolbar: [
                                [{ 'header': [2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'clean']
                            ],
                        }}
                        className="h-full border-none"
                    />
                </div>
                <style jsx global>{`
                    .ql-toolbar.ql-snow {
                        border: none !important;
                        border-bottom: 1px solid var(--border) !important;
                        background: rgba(var(--muted), 0.2);
                        padding: 1rem !important;
                    }
                    .ql-container.ql-snow {
                        border: none !important;
                        font-family: inherit !important;
                        font-size: 0.875rem !important;
                    }
                    .ql-editor {
                        min-height: 250px;
                        padding: 1.5rem !important;
                        color: var(--foreground);
                    }
                    .ql-editor.ql-blank::before {
                        color: var(--muted-foreground) !important;
                        font-style: normal !important;
                        opacity: 0.5;
                    }
                `}</style>
            </div>

            <div className="flex gap-10 relative z-10 p-6 bg-muted/30 rounded-3xl border border-border">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="peer hidden" />
                        <div className="w-6 h-6 border-2 border-border rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">Spotlight Item</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="peer hidden" />
                        <div className="w-6 h-6 border-2 border-border rounded-lg peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                            <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Authorized Status</span>
                </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary hover:opacity-95 active:scale-[0.98] text-primary-foreground px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 transition-all disabled:opacity-50 relative z-10">
                {loading ? 'Processing Protocol...' : 'Secure Data Entry'}
            </button>
        </form>
    )
}
