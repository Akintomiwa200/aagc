import React, { useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationManager: React.FC = () => {
    const { user } = useAuth();
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (user?.id) {
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    apiService.updatePushToken(user.id, token).catch(err => {
                        console.error('Failed to update push token in backend:', err);
                    });
                }
            });
        }

        // --- REAL-TIME SOCKET LISTENERS ---
        if (socket) {
            socket.on('new-notification', (data) => {
                console.log('Real-time notification via socket:', data);
                Alert.alert(
                    data.title || 'New Notification',
                    data.message || 'You have a new update from Apostolic Army Global.',
                    [{ text: 'Dismiss' }, { text: 'View', onPress: () => {/* Navigate */ } }]
                );
            });

            socket.on('friend-request', (data) => {
                Alert.alert('New Friend Request', `${data.senderName} wants to connect with you.`);
            });

            socket.on('live-update', (data) => {
                Alert.alert('Live Now', data.message || 'A live session has started!');
            });
        }

        // Listener for when a notification is received in the foreground (Push)
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification Received:', notification);
        });

        // Listener for when a user interacts with a notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Response:', response);
            // Handle navigation here if necessary
        });

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

async function registerForPushNotificationsAsync() {
    let token;

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

        // Get the token with project ID
        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId ??
                'YOUR-PROJECT-ID-FALLBACK'; // Should be configured in app.json

            if (!projectId || projectId === 'your-project-id') {
                console.log('EAS Project ID not found. Push tokens may not be available.');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({
                projectId,
            })).data;
            console.log('Push Token:', token);
        } catch (e) {
            console.error('Error getting push token:', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}
