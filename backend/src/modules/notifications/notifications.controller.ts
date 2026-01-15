import { Controller, Get, Post, Body, Query, Param, Inject, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        @Inject(forwardRef(() => AppGateway))
        private readonly appGateway: AppGateway,
    ) { }

    @Post()
    async create(@Body() dto: CreateNotificationDto) {
        const notification = await this.notificationsService.create(dto);
        this.appGateway.emitNotificationCreated(notification);
        return notification;
    }

    @Get()
    async findAll(@Query('userId') userId: string) {
        return this.notificationsService.findAll(userId);
    }

    @Post(':id/read')
    async markRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }
}
