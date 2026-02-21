import { Controller, Get, Post, Patch, Body, Param, Inject, forwardRef } from '@nestjs/common';
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

    @Get('all')
    async findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    async create(@Body() dto: any) {
        const stream = await this.service.create(dto);
        this.appGateway.emitLiveStreamUpdated(stream);
        return stream;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: any) {
        const stream = await this.service.update(id, dto);
        this.appGateway.emitLiveStreamUpdated(stream);
        return stream;
    }

    @Patch(':id/go-live')
    async goLive(@Param('id') id: string) {
        const stream = await this.service.goLive(id);
        this.appGateway.emitLiveStreamUpdated(stream);
        return stream;
    }

    @Patch(':id/end')
    async endStream(@Param('id') id: string) {
        const stream = await this.service.endStream(id);
        this.appGateway.emitLiveStreamUpdated(stream);
        return stream;
    }
}
