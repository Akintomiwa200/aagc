import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    imageUrl: string;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: 'published' })
    status: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
