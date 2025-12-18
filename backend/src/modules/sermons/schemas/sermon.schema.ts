import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SermonDocument = Sermon & Document;

@Schema({ timestamps: true })
export class Sermon {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  speaker: string;

  @Prop()
  preacher?: string;

  @Prop()
  series?: string;

  @Prop()
  streamUrl?: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  notesUrl?: string;

  @Prop({ required: true })
  preachedOn: string;

  @Prop()
  date?: string;

  @Prop()
  scripture?: string;

  @Prop()
  description?: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  duration?: string;

  @Prop({ default: 'video' })
  type?: 'video' | 'audio';
}

export const SermonSchema = SchemaFactory.createForClass(Sermon);



