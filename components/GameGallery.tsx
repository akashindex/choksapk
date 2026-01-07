'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GameGalleryProps {
    images: string[];
    uiDesign: 'vip' | 'modern' | 'classic';
    title: string;
}

export default function GameGallery({ images, uiDesign, title }: GameGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToIndex = (index: number) => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({
            left: width * index,
            behavior: 'smooth'
        });
        setActiveIndex(index);
    };

    const next = () => {
        const nextIndex = (activeIndex + 1) % images.length;
        scrollToIndex(nextIndex);
    };

    const prev = () => {
        const prevIndex = (activeIndex - 1 + images.length) % images.length;
        scrollToIndex(prevIndex);
    };

    // Update active index on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!scrollContainerRef.current) return;
            const width = scrollContainerRef.current.offsetWidth;
            const newIndex = Math.round(scrollContainerRef.current.scrollLeft / width);
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        };

        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    if (!images || images.length === 0) return null;

    return (
        <section className={`transition-all relative group/gallery overflow-hidden ${uiDesign === 'vip' ? 'bg-card/50 backdrop-blur-md border-primary/10 rounded-none md:rounded-[3rem] shadow-xl' :
            uiDesign === 'modern' ? 'bg-card border-border rounded-none md:rounded-3xl shadow-sm' :
                'bg-background border-border rounded-none md:rounded-xl'
            } border-x-0 md:border-x border-y md:border-y-border p-0 md:p-12 mb-8 md:mb-0`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 md:mb-8 gap-4 px-4 md:px-0 mt-6 md:mt-0">
                <h2 className="text-sm md:text-2xl font-black text-foreground uppercase tracking-tighter italic flex items-center gap-3">
                    <span className="w-8 h-1.5 bg-primary rounded-full hidden md:block"></span>
                    Visual Evidence
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all ${uiDesign === 'vip' ? 'bg-primary/10 hover:bg-primary border border-primary/20 text-primary hover:text-white rounded-lg md:rounded-xl' : 'bg-muted hover:bg-border rounded-full'}`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={next}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all ${uiDesign === 'vip' ? 'bg-primary/10 hover:bg-primary border border-primary/20 text-primary hover:text-white rounded-lg md:rounded-xl' : 'bg-muted hover:bg-border rounded-full'}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Main Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-0 md:rounded-[2rem] border-y md:border border-border bg-[#0a0a0a]"
                >
                    {images.map((img, i) => (
                        <div key={i} className="min-w-full snap-center aspect-[9/16] md:aspect-video relative group overflow-hidden flex items-center justify-center">
                            <img
                                src={img}
                                alt={`${title} Screenshot ${i + 1}`}
                                className="w-full h-full object-contain transition-all duration-700 md:group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-4 md:mt-8 pb-6 md:pb-0">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            className={`transition-all duration-300 ${activeIndex === i
                                ? (uiDesign === 'vip' ? 'w-8 bg-primary h-1.5 md:h-2 rounded-full' : 'w-6 bg-primary h-1.5 md:h-2 rounded-full')
                                : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50 rounded-full'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
