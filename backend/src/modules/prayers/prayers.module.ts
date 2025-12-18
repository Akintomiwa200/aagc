import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrayersController } from './prayers.controller';
import { PrayersService } from './prayers.service';
import { Prayer, PrayerSchema } from './schemas/prayer.schema';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prayer.name, schema: PrayerSchema }]),
    forwardRef(() => WebSocketModule),
  ],
  controllers: [PrayersController],
  providers: [PrayersService],
  exports: [PrayersService],
})
export class PrayersModule {}

