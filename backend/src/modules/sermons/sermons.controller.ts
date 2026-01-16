import { Body, Controller, Get, Param, Post, Put, Delete, Inject, forwardRef } from '@nestjs/common';
import { SermonsService } from './sermons.service';
import { CreateSermonDto, UpdateSermonDto } from './dto/create-sermon.dto';
import { AppGateway } from '../websocket/websocket.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('sermons')
export class SermonsController {
  constructor(
    private readonly sermonsService: SermonsService,
    @Inject(forwardRef(() => AppGateway))
    private readonly websocketGateway: AppGateway,
    private readonly notificationsService: NotificationsService,
  ) { }

  @Get()
  list() {
    return this.sermonsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.sermonsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateSermonDto) {
    const sermon = await this.sermonsService.create(dto);
    await this.websocketGateway.emitSermonCreated(sermon);
    
    // Broadcast notification for new sermon
    await this.notificationsService.broadcastNotification(
        'New Sermon Posted',
        `A new sermon "${sermon.title}" by ${sermon.preacher} is now available.`
    );
    
    return sermon;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSermonDto) {
    const sermon = await this.sermonsService.update(id, dto);
    await this.websocketGateway.emitSermonUpdated(sermon);
    return sermon;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.sermonsService.delete(id);
    await this.websocketGateway.emitSermonDeleted(id);
    return { message: 'Sermon deleted successfully' };
  }
}



