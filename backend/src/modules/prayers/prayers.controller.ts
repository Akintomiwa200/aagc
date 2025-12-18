import { Controller, Get, Post, Put, Delete, Body, Param, Inject, forwardRef } from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { CreatePrayerDto, UpdatePrayerStatusDto } from './dto/create-prayer.dto';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Controller('prayers')
export class PrayersController {
  constructor(
    private readonly prayersService: PrayersService,
    @Inject(forwardRef(() => WebSocketGateway))
    private readonly websocketGateway: WebSocketGateway,
  ) {}

  @Post()
  async create(@Body() dto: CreatePrayerDto) {
    const prayer = await this.prayersService.create(dto);
    await this.websocketGateway.emitPrayerCreated(prayer);
    return prayer;
  }

  @Get()
  findAll() {
    return this.prayersService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.prayersService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prayersService.findOne(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePrayerStatusDto) {
    const prayer = await this.prayersService.updateStatus(id, dto);
    await this.websocketGateway.emitPrayerUpdated(prayer);
    return prayer;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.prayersService.delete(id);
    await this.websocketGateway.emitPrayerDeleted(id);
    return { message: 'Prayer request deleted successfully' };
  }
}
