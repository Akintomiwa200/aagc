import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ timestamps: true })
export class FriendRequest {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    requesterId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipientId: Types.ObjectId;

    @Prop({ default: 'pending' })
    status: 'pending' | 'accepted' | 'rejected';
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
