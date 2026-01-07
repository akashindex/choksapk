import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        console.log('Updating game with body:', { ...body, description: body.description?.substring(0, 50) + '...' });
        const game = await Game.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });

        if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        return NextResponse.json({ game });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const game = await Game.findByIdAndDelete(id);

        if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        return NextResponse.json({ message: 'Game deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
    }
}
