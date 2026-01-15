import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LiveStreamDocument = LiveStream & Document;

@Schema({ timestamps: true })
export class LiveStream {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    streamUrl: string;

    @Prop({ default: false })
    isLive: boolean;

    @Prop()
    thumbnailUrl: string;

    @Prop()
    scheduledStartTime: Date;
}

export const LiveStreamSchema = SchemaFactory.createForClass(LiveStream);
