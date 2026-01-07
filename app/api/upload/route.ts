import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        const isAdmin = payload && (payload.role === 'admin' || payload.role === 'super_admin');

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.'
            }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File too large. Maximum size is 5MB.'
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const fileExtension = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        try {
            // Ensure dir exists
            await mkdir(uploadDir, { recursive: true });

            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);

            const url = `/uploads/${filename}`;
            return NextResponse.json({ url, filename });
        } catch (fsError: any) {
            console.error('File system error:', fsError);

            // Check if running on Vercel (read-only filesystem)
            if (process.env.VERCEL) {
                return NextResponse.json({
                    error: 'File uploads are not supported on Vercel free tier. Please use a cloud storage service like Cloudinary, AWS S3, or Vercel Blob.',
                    isVercel: true
                }, { status: 500 });
            }

            throw fsError;
        }
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: error.message || 'Upload failed',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
