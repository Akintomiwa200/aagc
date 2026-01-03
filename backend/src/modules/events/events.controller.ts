import { Body, Controller, Get, Param, Post, Put, Delete, Inject, forwardRef } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    @Inject(forwardRef(() => AppGateway))
    private readonly websocketGateway: AppGateway,
  ) { }

  @Get()
  list() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateEventDto) {
    const event = await this.eventsService.create(dto);
    await this.websocketGateway.emitEventCreated(event);
    return event;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    const event = await this.eventsService.update(id, dto);
    await this.websocketGateway.emitEventUpdated(event);
    return event;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.eventsService.delete(id);
    await this.websocketGateway.emitEventDeleted(id);
    return { message: 'Event deleted successfully' };
  }

  @Post(':id/register')
  async register(@Param('id') id: string) {
    const event = await this.eventsService.registerForEvent(id);
    await this.websocketGateway.emitEventUpdated(event);
    return event;
  }
}



