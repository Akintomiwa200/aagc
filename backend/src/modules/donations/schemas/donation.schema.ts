import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonationDocument = Donation & Document;

@Schema({ timestamps: true })
export class Donation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: 'Tithe' | 'Offering' | 'Seed' | 'Building' | 'Other';

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'Pending' })
  status: 'Pending' | 'Successful' | 'Failed';

  @Prop()
  paymentMethod?: string;

  @Prop()
  transactionId?: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

