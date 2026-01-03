import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DevotionalDocument = Devotional & Document;

@Schema({ timestamps: true })
export class Devotional {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  authorRole?: string;

  @Prop()
  authorBio?: string;

  @Prop({ required: true })
  date: string;

  @Prop()
  scripture?: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  reflection?: string;

  @Prop()
  application?: string;

  @Prop()
  prayer?: string;

  @Prop()
  featuredImage?: string;

  @Prop()
  category?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({
    type: {
      book: String,
      chapter: Number,
      verse: Number,
      endVerse: Number,
    },
    _id: false,
  })
  bibleReference?: {
    book: string;
    chapter: number;
    verse: number;
    endVerse?: number;
  };

  @Prop({ default: 'draft' })
  status?: 'published' | 'draft';

  @Prop({ default: 0 })
  likes?: number;

  @Prop({ default: 0 })
  views?: number;
}

export const DevotionalSchema = SchemaFactory.createForClass(Devotional);

