import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { SocketProvider } from '../context/SocketContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { theme } = useTheme();

    useEffect(() => {
        // Hide splash screen after a delay
        const timer = setTimeout(() => {
            SplashScreen.hideAsync();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: theme === 'dark' ? '#000000' : '#F9FAFB',
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="event/[id]"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Event Details',
                    }}
                />
                <Stack.Screen
                    name="bible"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Bible',
                    }}
                />
                <Stack.Screen
                    name="giving"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Giving',
                    }}
                />
                <Stack.Screen
                    name="sermons"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Sermons',
                    }}
                />
                <Stack.Screen
                    name="notes"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Notes',
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Settings',
                    }}
                />
                <Stack.Screen
                    name="gallery"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Gallery',
                    }}
                />
                <Stack.Screen
                    name="about"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'About',
                    }}
                />
                <Stack.Screen
                    name="first-timer"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'First Timer',
                    }}
                />
                <Stack.Screen
                    name="live-meet"
                    options={{
                        presentation: 'fullScreenModal',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="notifications"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Notifications',
                    }}
                />
                <Stack.Screen
                    name="profile/edit"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Edit Profile',
                    }}
                />
                <Stack.Screen
                    name="friends"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Friends',
                    }}
                />
                <Stack.Screen
                    name="friend-requests"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Friend Requests',
                    }}
                />
                <Stack.Screen
                    name="login"
                    options={{
                        presentation: 'card',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="register"
                    options={{
                        presentation: 'card',
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <SocketProvider>
                <RootLayoutNav />
            </SocketProvider>
        </ThemeProvider>
    );
}
