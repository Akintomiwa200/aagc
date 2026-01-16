import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { SocketProvider } from '../context/SocketContext';
import CustomSplashScreen from '../components/CustomSplashScreen';
import { NotificationManager } from '../components/NotificationManager';
import { AuthProvider } from '../context/AuthContext';

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const segments = useSegments();

    const [isAppReady, setIsAppReady] = useState(false);
    const [showCustomSplash, setShowCustomSplash] = useState(true);
    const [initialRoute, setInitialRoute] = useState<'/onboarding' | '/login' | '/(drawer)/(tabs)' | null>(null);

    useEffect(() => {
        async function prepare() {
            try {
                // Check Auth / Onboarding status
                const userSession = await AsyncStorage.getItem('church_app_user');
                const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

                if (userSession && userSession !== 'null') {
                    setInitialRoute('/(drawer)/(tabs)');
                } else if (hasSeenOnboarding !== 'true') {
                    setInitialRoute('/onboarding');
                } else {
                    // Default to login for now, but the login screen will have a skip option
                    setInitialRoute('/login');
                }
            } catch (e) {
                console.warn(e);
                setInitialRoute('/login'); // Fallback
            } finally {
                setIsAppReady(true);
                // Hide the native splash screen immediately
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    const handleSplashAnimationComplete = () => {
        setShowCustomSplash(false);
        // Navigate to the determined route
        if (initialRoute) {
            router.replace(initialRoute);
        }
    };

    if (!isAppReady) {
        return null; // or a minimal native-like view if needed, but native splash covers this
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                {/* 
                  Define all screens here. 
                  Expo Router will match the URL to the screen. 
                */}
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />

                {/* Modals and other screens */}
                <Stack.Screen
                    name="event/[id]"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Event Details',
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
                    name="friend-requests"
                    options={{
                        presentation: 'card',
                        headerShown: true,
                        headerTitle: 'Friend Requests',
                    }}
                />
            </Stack>

            {/* Render Custom Splash Overlay if needed */}
            {showCustomSplash && (
                <CustomSplashScreen onAnimationComplete={handleSplashAnimationComplete} />
            )}
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <SocketProvider>
                    <NotificationManager />
                    <RootLayoutNav />
                </SocketProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
