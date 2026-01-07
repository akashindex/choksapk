import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { isActive: true };
        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        const games = await Game.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ games });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        console.log('Creating game with body:', { ...body, description: body.description?.substring(0, 50) + '...' });
        const game = await Game.create(body);
        return NextResponse.json({ game }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
    }
}
