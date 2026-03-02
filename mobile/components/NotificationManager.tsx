import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'sonner-native';

// expo-notifications remote push is not supported in Expo Go (SDK 53+).
// We detect Expo Go via Constants.appOwnership and skip push registration.
const IS_EXPO_GO = Constants.appOwnership === 'expo';

if (!IS_EXPO_GO) {
    // Configure how notifications are handled when the app is foregrounded
    // Only set this up in dev builds / standalone apps where it actually works
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

export const NotificationManager: React.FC = () => {
    const { user } = useAuth();
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        // Push token registration — skip entirely in Expo Go
        if (!IS_EXPO_GO && user?.id) {
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    apiService.updatePushToken(user.id, token).catch(err => {
                        console.error('Failed to update push token in backend:', err);
                    });
                }
            });
        }

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

        // Push notification listeners — skip in Expo Go
        if (!IS_EXPO_GO) {
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification Received:', notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification Response:', response);
            });
        }

        return () => {
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

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
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
