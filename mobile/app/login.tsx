import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
// import * as Google from '@react-native-google-signin/google-signin'; // Latest native sign-in
import * as GoogleProvider from 'expo-auth-session/providers/google';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();

    // For Google Authentication:
    // 1. Create IDs at https://console.cloud.google.com/
    // 2. Add them to your .env file as EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, etc.
    // Verify keys are loaded
    React.useEffect(() => {
        if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
            console.warn('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
        }
    }, []);

    const [request, response, promptAsync] = GoogleProvider.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        // Use the Expo Auth Proxy manually to bypass Google's private IP restriction
        // This HTTPS URL is safe for Google and redirects back to Exp://
        redirectUri: 'https://auth.expo.io/@herkintormiwer/aagc-mobile',
    });

    React.useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const token = await apiService.getToken();
        if (token) {
            // Validate token or just redirect if present
            router.replace('/(drawer)/(tabs)');
        }
    };

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication) {
                handleMobileOAuth(authentication);
            }
        } else if (response?.type === 'error') {
            console.log('Auth Error Summary:', response.error);
            Alert.alert('Authentication Error', response.error?.message || 'Permission denied or configuration error');
        }
    }, [response]);

    const [googleLoading, setGoogleLoading] = useState(false);

    const handleMobileOAuth = async (authentication: any) => {
        setGoogleLoading(true);
        try {
            // Use accessToken to fetch user info from Google
            const { accessToken, idToken } = authentication;

            // Prefer idToken for backend verification if available, otherwise accessToken
            const tokenToSend = idToken || accessToken;

            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userInfo = await res.json();

            console.log('Sending token to backend:', { endpoint: '/auth/oauth/mobile', token: tokenToSend.substring(0, 10) + '...' });

            // Call our backend with the token and user info
            // Ensure apiService handles non-JSON errors gracefully or we catch it here
            const result = await apiService.mobileOAuth(
                'google',
                tokenToSend,
                userInfo.email,
                userInfo.name || userInfo.given_name,
                userInfo.picture
            ).catch(err => {
                console.error('Backend Mobile OAuth Error:', err);
                throw new Error('Backend authentication failed');
            });

            console.log('Backend response:', result);

            if (result.token) {
                router.replace('/(drawer)/(tabs)');
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            Alert.alert('Error', 'Google login failed. Please ensure your Client IDs are correct.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const androidId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
        const iosId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
        const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

        const isPlaceholder = (id?: string) => !id || id.includes('provide-your-');

        if (isPlaceholder(androidId) && isPlaceholder(iosId) && isPlaceholder(webId)) {
            Alert.alert(
                'Configuration Required',
                'Google Client IDs are not configured. Please create them in the Google Cloud Console and update your mobile/.env file.',
                [{ text: 'OK' }]
            );
            console.log('Client IDs are missing or using placeholders in .env');
            return;
        }

        if (!request) {
            Alert.alert(
                'Auth Not Ready',
                'Google authentication is being initialized. Please try again in a moment.',
                [{ text: 'OK' }]
            );
            console.log('Request object is null. Check if Client IDs are valid.');
            return;
        }

        console.log('Initiating Google Login...');
        if (request?.redirectUri) {
            console.log('Redirect URI:', request.redirectUri);
        }
        try {
            const result = await promptAsync();
            if (result.type !== 'success') {
                console.log('Google prompt result:', result);
                if (result.type === 'error') {
                    Alert.alert('Auth Error', result.error?.message || 'Failed to sign in with Google');
                }
            }
        } catch (e: any) {
            console.error('Prompt error:', e);
            Alert.alert('Error', 'An unexpected error occurred during Google Sign-In.');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            padding: 24,
        },
        header: {
            alignItems: 'center',
            marginBottom: 48,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: colors.secondary,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 16,
            paddingHorizontal: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            paddingVertical: 16,
            color: colors.text,
            fontSize: 16,
        },
        button: {
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 18,
            alignItems: 'center',
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
        socialButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary, // Make it look like the primary button
            borderRadius: 16,
            padding: 18,
            gap: 12,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        socialButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
        googleIcon: {
            width: 20,
            height: 20,
            // You can use a real Google icon here
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 32,
        },
        footerText: {
            color: colors.secondary,
            fontSize: 14,
        },
        linkText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: 'bold',
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Apostolic Army Global Church</Text>
                    <Text style={styles.subtitle}>Lift each other up in prayer and community</Text>
                </View>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={handleGoogleLogin}
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' }}>G</Text>
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 32, alignItems: 'center' }}
                    onPress={() => router.replace('/(drawer)/(tabs)')}
                >
                    <Text style={[styles.linkText, { color: colors.secondary, fontWeight: '500' }]}>
                        Skip for now
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
