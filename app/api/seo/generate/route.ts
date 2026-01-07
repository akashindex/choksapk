import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import SEOMetadata from '@/models/SEOMetadata';

export async function POST(req: NextRequest) {
    try {
        const { title, description, slug } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        await dbConnect();
        const settings = await SiteSettings.findOne();
        const apiKey = (settings?.geminiKey || process.env.GEMINI_API_KEY || '').trim();

        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
        }

        const prompt = `
            You are an SEO expert. I have a game/app entry with the following details:
            Title: ${title}
            Description (Context): ${description || 'No description provided'}

            Tasks:
            1. Generate a high-CTR Meta Title (max 60 chars).
            2. Generate a compelling Meta Description (max 160 chars).
            3. Generate a list of comma-separated Keywords (high volume, relevant).
            
            Return ONLY a valid JSON object with the following structure:
            {
                "title": "Optimized Meta Title",
                "description": "Optimized Meta Description",
                "keywords": "keyword1, keyword2, keyword3"
            }
        `;

        const modelName = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7 }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `API error: ${response.statusText}`);
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error('No content returned from AI');

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

        let seoData;
        try {
            seoData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 500 });
        }

        // If slug is provided, we automatically SAVE/UPSERT the route metadata
        let savedRoute = null;
        if (slug) {
            const routePath = `/game/${slug}`;
            savedRoute = await SEOMetadata.findOneAndUpdate(
                { route: routePath },
                {
                    route: routePath,
                    title: seoData.title,
                    description: seoData.description,
                    keywords: seoData.keywords,
                    isActive: true
                },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({
            optimizedData: seoData,
            savedRoute: savedRoute
        });

    } catch (error: any) {
        console.error('SEO AI Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
