import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DevotionalsService } from './devotionals.service';
import { CreateDevotionalDto, UpdateDevotionalDto } from './dto/create-devotional.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AppGateway } from '../websocket/websocket.gateway';
import { Inject, forwardRef } from '@nestjs/common';

@Controller('devotionals')
export class DevotionalsController {
  constructor(
    private readonly devotionalsService: DevotionalsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => AppGateway))
    private readonly websocketGateway: AppGateway,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('featuredImage'))
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Parse body data (may be string if multipart/form-data)
    const dto: CreateDevotionalDto = typeof body === 'string'
      ? JSON.parse(body)
      : body;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'aagc/devotionals',
      );
      dto.featuredImage = uploadResult.secure_url;
    }
    const created = await this.devotionalsService.create(dto);

    // Broadcast notification for new devotional
    if (created.status === 'published') {
      await this.notificationsService.broadcastNotification(
        'Daily Devotional',
        `Today's devotional "${created.title}" is ready for you.`
      );
      await this.websocketGateway.emitDevotionalCreated(created);
    }

    return created;
  }

  @Get()
  async findAll(@Query('status') status?: 'published' | 'draft') {
    return this.devotionalsService.findAll(status);
  }

  @Get('today')
  async getToday() {
    return this.devotionalsService.getToday();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.devotionalsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('featuredImage'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Parse body data (may be string if multipart/form-data)
    const dto: UpdateDevotionalDto = typeof body === 'string'
      ? JSON.parse(body)
      : body;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'aagc/devotionals',
      );
      dto.featuredImage = uploadResult.secure_url;
    }
    const updated = await this.devotionalsService.update(id, dto);
    await this.websocketGateway.emitDevotionalUpdated(updated);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.devotionalsService.delete(id);
    await this.websocketGateway.emitDevotionalDeleted(id);
    return result;
  }

  @Post(':id/like')
  async like(@Param('id') id: string) {
    return this.devotionalsService.like(id);
  }
}

