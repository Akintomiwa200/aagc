import { Module, forwardRef } from '@nestjs/common';
import { AppGateway } from './websocket.gateway';
import { PrayersModule } from '../prayers/prayers.module';
import { EventsModule } from '../events/events.module';
import { SermonsModule } from '../sermons/sermons.module';
import { UsersModule } from '../users/users.module';
import { DonationsModule } from '../donations/donations.module';
import { GalleryModule } from '../gallery/gallery.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotesModule } from '../notes/notes.module';
import { ConnectionCardsModule } from '../connection-cards/connection-cards.module';
import { LiveStreamModule } from '../livestream/livestream.module';

@Module({
  imports: [
    forwardRef(() => PrayersModule),
    forwardRef(() => EventsModule),
    forwardRef(() => SermonsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => DonationsModule),
    forwardRef(() => GalleryModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => NotesModule),
    forwardRef(() => ConnectionCardsModule),
    forwardRef(() => LiveStreamModule),
  ],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class WebSocketModule { }
