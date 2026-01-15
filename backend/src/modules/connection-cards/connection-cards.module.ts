import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionCardsController } from './connection-cards.controller';
import { ConnectionCardsService } from './connection-cards.service';
import { ConnectionCard, ConnectionCardSchema } from './schemas/connection-card.schema';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ConnectionCard.name, schema: ConnectionCardSchema }]),
        forwardRef(() => WebSocketModule),
    ],
    controllers: [ConnectionCardsController],
    providers: [ConnectionCardsService],
    exports: [ConnectionCardsService],
})
export class ConnectionCardsModule { }
