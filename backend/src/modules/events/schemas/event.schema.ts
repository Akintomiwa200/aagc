import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date: string;

  @Prop()
  time?: string;

  @Prop()
  location?: string;

  @Prop()
  image?: string;

  @Prop()
  capacity?: number;

  @Prop({ default: 0 })
  registrations?: number;

  @Prop()
  registrationDeadline?: string;

  @Prop({ default: 'upcoming' })
  status?: 'upcoming' | 'ongoing' | 'completed';

  @Prop()
  type?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);



