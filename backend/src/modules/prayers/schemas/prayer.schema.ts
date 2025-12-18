import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrayerDocument = Prayer & Document;

@Schema({ timestamps: true })
export class Prayer {
  @Prop({ required: true })
  name: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  request: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'ongoing' | 'answered';

  @Prop({ default: false })
  isAnonymous: boolean;
}

export const PrayerSchema = SchemaFactory.createForClass(Prayer);

