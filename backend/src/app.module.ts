import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { SermonsModule } from './modules/sermons/sermons.module';
import { PrayersModule } from './modules/prayers/prayers.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { DonationsModule } from './modules/donations/donations.module';
import { DevotionalsModule } from './modules/devotionals/devotionals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/aagc'),
    UsersModule,
    AuthModule,
    EventsModule,
    SermonsModule,
    PrayersModule,
    DonationsModule,
    DevotionalsModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
