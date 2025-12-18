import { Module, forwardRef } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { PrayersModule } from '../prayers/prayers.module';
import { EventsModule } from '../events/events.module';
import { SermonsModule } from '../sermons/sermons.module';
import { UsersModule } from '../users/users.module';
import { DonationsModule } from '../donations/donations.module';

@Module({
  imports: [
    forwardRef(() => PrayersModule),
    forwardRef(() => EventsModule),
    forwardRef(() => SermonsModule),
    UsersModule,
    DonationsModule,
  ],
  providers: [WebSocketGateway],
  exports: [WebSocketGateway],
})
export class WebSocketModule {}

