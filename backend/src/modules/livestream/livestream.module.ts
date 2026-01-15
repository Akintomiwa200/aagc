import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveStreamController } from './livestream.controller';
import { LiveStreamService } from './livestream.service';
import { LiveStream, LiveStreamSchema } from './schemas/livestream.schema';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: LiveStream.name, schema: LiveStreamSchema }]),
        forwardRef(() => WebSocketModule),
    ],
    controllers: [LiveStreamController],
    providers: [LiveStreamService],
    exports: [LiveStreamService],
})
export class LiveStreamModule { }
