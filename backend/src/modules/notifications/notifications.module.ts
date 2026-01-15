import { Module, forwardRef, Inject } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PushNotificationsService } from './push-notifications.service';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { WebSocketModule } from '../websocket/websocket.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        forwardRef(() => WebSocketModule),
        forwardRef(() => UsersModule),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, PushNotificationsService],
    exports: [NotificationsService, PushNotificationsService],
})
export class NotificationsModule { }
