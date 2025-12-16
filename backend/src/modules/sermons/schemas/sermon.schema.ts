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
  series?: string;

  @Prop()
  streamUrl?: string;

  @Prop()
  notesUrl?: string;

  @Prop({ required: true })
  preachedOn: string;
}

export const SermonSchema = SchemaFactory.createForClass(Sermon);



