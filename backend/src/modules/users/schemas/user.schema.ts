import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  fullName?: string;

  @Prop()
  avatar?: string;

  @Prop({ enum: ['admin', 'staff', 'member'], default: 'member' })
  role: 'admin' | 'staff' | 'member';

  @Prop({ enum: ['local', 'google', 'apple'], default: 'local' })
  provider?: string;

  @Prop({ default: 0 })
  points?: number;

  @Prop({ default: 0 })
  streak?: number;

  @Prop()
  lastActiveDate?: string;

  @Prop({ type: [String], default: [] })
  badges?: string[];

  @Prop()
  bio?: string;

  @Prop()
  location?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  joinedDate?: string;

  @Prop({ default: 'active' })
  status?: 'active' | 'inactive';

  @Prop({ type: [String], default: [] })
  groups?: string[];

  @Prop({ type: [{ type: String, ref: 'User' }], default: [] })
  friends?: string[];

  @Prop()
  pushToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);




