import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PushNotificationsService } from './push-notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        private readonly pushNotificationsService: PushNotificationsService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) { }

    async create(dto: CreateNotificationDto) {
        const created = new this.notificationModel(dto);
        const saved = await created.save();

        // Send push notification if user has a token
        try {
            const user = await this.usersService.getProfile(dto.userId.toString());
            if (user && user.pushToken) {
                await this.pushNotificationsService.sendPushNotification(
                    user.pushToken,
                    dto.title,
                    dto.message,
                    dto.data
                );
            }
        } catch (error) {
            console.error('Failed to send push notification during creation:', error);
        }

        return saved;
    }

    async findAll(userId: string) {
        return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
    }

    async markAsRead(id: string) {
        const notification = await this.notificationModel.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true },
        ).lean();
        if (!notification) throw new NotFoundException('Notification not found');
        return notification;
    }

    async delete(id: string) {
        const result = await this.notificationModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('Notification not found');
        return { message: 'Notification deleted' };
    }
}
