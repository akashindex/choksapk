import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGame extends Document {
    title: string;
    slug: string;
    provider: string;
    category: 'slots' | 'table' | 'live' | 'general';
    thumbnail: string;
    description?: string;
    downloadUrl?: string; // Standardized from demoUrl
    referralUrl?: string;
    rating: number;
    version: string;
    requirements: string;
    downloadCount: string;
    fileSize: string;
    isFeatured: boolean;
    isActive: boolean;
    gallery: string[];
    createdAt: Date;
    updatedAt: Date;
}

const GameSchema: Schema<IGame> = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        provider: { type: String, required: true },
        category: { type: String, enum: ['slots', 'table', 'live', 'general'], required: true },
        thumbnail: { type: String, required: true },
        gallery: { type: [String], default: [] },
        description: { type: String },
        downloadUrl: { type: String },
        referralUrl: { type: String, default: '#' },
        rating: { type: Number, default: 4.5 },
        version: { type: String, default: '1.0.0' },
        requirements: { type: String, default: 'Android 6.0+' },
        downloadCount: { type: String, default: '100,000+' },
        fileSize: { type: String, default: '45 MB' },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Delete the model if it exists to ensure schema updates are applied
if (mongoose.models.Game) {
    delete (mongoose.models as any).Game;
}

const Game: Model<IGame> = mongoose.model<IGame>('Game', GameSchema);
export default Game;
