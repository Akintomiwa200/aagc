import { Controller, Get, Post, Body, Inject, forwardRef } from '@nestjs/common';
import { LiveStreamService } from './livestream.service';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('livestream')
export class LiveStreamController {
    constructor(
        private readonly service: LiveStreamService,
        @Inject(forwardRef(() => AppGateway))
        private readonly appGateway: AppGateway,
    ) { }

    @Get()
    async getLive() {
        return this.service.getLive();
    }

    @Post()
    async create(@Body() dto: any) {
        const stream = await this.service.create(dto);
        this.appGateway.emitLiveStreamUpdated(stream);
        return stream;
    }
}
