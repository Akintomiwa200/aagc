import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SermonsController } from './sermons.controller';
import { SermonsService } from './sermons.service';
import { Sermon, SermonSchema } from './schemas/sermon.schema';
import { WebSocketModule } from '../websocket/websocket.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sermon.name, schema: SermonSchema }]),
    forwardRef(() => WebSocketModule),
    NotificationsModule,
  ],
  controllers: [SermonsController],
  providers: [SermonsService],
  exports: [SermonsService],
})
export class SermonsModule { }



