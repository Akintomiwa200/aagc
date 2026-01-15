import { Controller, Get, Post, Body, Inject, forwardRef } from '@nestjs/common';
import { ConnectionCardsService } from './connection-cards.service';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('connection-cards')
export class ConnectionCardsController {
    constructor(
        private readonly service: ConnectionCardsService,
        @Inject(forwardRef(() => AppGateway))
        private readonly appGateway: AppGateway,
    ) { }

    @Post()
    async create(@Body() dto: any) {
        const card = await this.service.create(dto);
        this.appGateway.emitConnectionCardCreated(card);
        return card;
    }

    @Get()
    async findAll() {
        return this.service.findAll();
    }
}
