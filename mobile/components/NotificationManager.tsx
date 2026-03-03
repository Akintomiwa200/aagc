import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'sonner-native';

// expo-notifications remote push is not supported in Expo Go (SDK 53+).
// We detect Expo Go via Constants.appOwnership and skip push registration.
const IS_EXPO_GO =
    Constants.appOwnership === 'expo' ||
    Constants.appOwnership === 'guest' ||
    (Constants as any).executionEnvironment === 'storeClient';

type NotificationsModule = typeof import('expo-notifications');
let notificationsModule: NotificationsModule | null = null;

const getNotificationsModule = async (): Promise<NotificationsModule | null> => {
    if (IS_EXPO_GO) return null;
    if (notificationsModule) return notificationsModule;
    notificationsModule = await import('expo-notifications');
    return notificationsModule;
};

export const NotificationManager: React.FC = () => {
    const { user } = useAuth();
    const notificationListener = useRef<{ remove: () => void } | null>(null);
    const responseListener = useRef<{ remove: () => void } | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        let cancelled = false;

        const setupPushNotifications = async () => {
            const Notifications = await getNotificationsModule();
            if (!Notifications || cancelled) return;

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                }),
            });

            if (user?.id) {
                const token = await registerForPushNotificationsAsync(Notifications);
                if (!token || cancelled) return;
                apiService.updatePushToken(user.id, token).catch(err => {
                    console.error('Failed to update push token in backend:', err);
                });
            }

            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification Received:', notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification Response:', response);
            });
        };

        // Push token registration — skip entirely in Expo Go
        setupPushNotifications().catch(err => {
            console.error('Push notification setup failed:', err);
        });

        // --- REAL-TIME SOCKET LISTENERS (works in all environments) ---
        if (socket) {
            socket.on('new-notification', (data: any) => {
                console.log('Real-time notification via socket:', data);
                toast(data.title || 'New Notification', {
                    description: data.message || 'You have a new update from Apostolic Army Global.',
                });
            });

            socket.on('friend-request', (data: any) => {
                toast.info('New Friend Request', {
                    description: `${data.senderName} wants to connect with you.`,
                });
            });

            socket.on('live-update', (data: any) => {
                toast.info('Live Now', {
                    description: data.message || 'A live session has started!',
                });
            });
        }

        return () => {
            cancelled = true;
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
            if (socket) {
                socket.off('new-notification');
                socket.off('friend-request');
                socket.off('live-update');
            }
        };
    }, [user, socket]);

    return null;
};

async function registerForPushNotificationsAsync(Notifications: NotificationsModule): Promise<string | undefined> {
    let token: string | undefined;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                (Constants as any)?.easConfig?.projectId;

            if (!projectId) {
                console.log('EAS Project ID not found. Push tokens may not be available.');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log('Push Token:', token);
        } catch (e) {
            console.error('Error getting push token:', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}
