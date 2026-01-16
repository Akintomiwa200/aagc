import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class PushNotificationsService {
    private expo: Expo;
    private readonly logger = new Logger(PushNotificationsService.name);

    constructor() {
        this.expo = new Expo();
    }

    async sendPushNotification(pushToken: string, title: string, body: string, data?: any) {
        if (!Expo.isExpoPushToken(pushToken)) {
            this.logger.error(`Push token ${pushToken} is not a valid Expo push token`);
            return;
        }

        const messages: ExpoPushMessage[] = [{
            to: pushToken,
            sound: 'default',
            title,
            body,
            data,
        }];

        try {
            const chunks = this.expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
                const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                this.logger.log('Push notification sent successfully');
                // NOTE: In a production app, you would want to handle the tickets
                // and potentially remove invalid tokens.
            }
        } catch (error) {
            this.logger.error('Error sending push notification', error);
        }
    }

    async sendBroadcastPushNotification(pushTokens: string[], title: string, body: string, data?: any) {
        const messages: ExpoPushMessage[] = [];
        for (const pushToken of pushTokens) {
            if (Expo.isExpoPushToken(pushToken)) {
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    title,
                    body,
                    data,
                });
            }
        }

        try {
            const chunks = this.expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
                await this.expo.sendPushNotificationsAsync(chunk);
            }
            this.logger.log(`Broadcasted push notification to ${pushTokens.length} users`);
        } catch (error) {
            this.logger.error('Error broadcasting push notifications', error);
        }
    }
}
