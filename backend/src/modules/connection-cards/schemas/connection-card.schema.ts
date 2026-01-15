import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConnectionCardDocument = ConnectionCard & Document;

@Schema({ timestamps: true })
export class ConnectionCard {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ default: 'visitor' })
    type: 'visitor' | 'first-timer' | 'member';

    @Prop()
    message: string;

    @Prop({ default: 'pending' })
    status: string;
}

export const ConnectionCardSchema = SchemaFactory.createForClass(ConnectionCard);
