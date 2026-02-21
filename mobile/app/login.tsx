import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

// The Expo auth proxy — a valid HTTPS URL that Google accepts as redirect_uri
const PROXY_REDIRECT_URI = 'https://auth.expo.io/@herkintormiwer/aagc-mobile';

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [googleLoading, setGoogleLoading] = useState(false);

    // The deep-link URI for THIS app running in Expo Go
    // Chrome Custom Tabs will intercept URLs matching this scheme
    const appReturnUrl = makeRedirectUri();

    React.useEffect(() => {
        console.log('=== Google Auth Debug ===');
        console.log('Proxy redirect URI (for Google):', PROXY_REDIRECT_URI);
        console.log('App return URL (for browser interception):', appReturnUrl);
        console.log('Web Client ID:', GOOGLE_WEB_CLIENT_ID ? 'SET ✓' : 'MISSING ✗');
        console.log('========================');
    }, []);

    React.useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const token = await apiService.getToken();
        if (token) {
            router.replace('/(drawer)/(tabs)');
        }
    };

    const handleGoogleLogin = async () => {
        if (!GOOGLE_WEB_CLIENT_ID || GOOGLE_WEB_CLIENT_ID.includes('provide-your-')) {
            Alert.alert(
                'Configuration Required',
                'Google Client IDs are not configured. Please add them to the .env file.',
            );
            return;
        }

        setGoogleLoading(true);

        try {
            // Build the Google OAuth URL
            // - redirect_uri is the Expo proxy (HTTPS, accepted by Google)
            // - The proxy will redirect to exp://IP:PORT which Chrome Custom Tabs intercepts
            const params = new URLSearchParams({
                client_id: GOOGLE_WEB_CLIENT_ID,
                redirect_uri: PROXY_REDIRECT_URI,
                response_type: 'token',
                scope: 'openid email profile',
                prompt: 'select_account',
            });
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

            console.log('Opening Google OAuth...');

            // Open the browser — listen for the exp:// return (NOT the proxy URL)
            // Flow: Google → auth.expo.io (proxy) → exp://IP:PORT (intercepted by Chrome Custom Tabs)
            const result = await WebBrowser.openAuthSessionAsync(authUrl, appReturnUrl);

            console.log('Browser result type:', result.type);

            if (result.type === 'success' && 'url' in result) {
                console.log('Received redirect URL');

                // Parse the access_token from the URL fragment (#access_token=...)
                const url = result.url;
                const fragment = url.split('#')[1] || '';
                const queryPart = url.split('?')[1] || '';
                const combined = fragment || queryPart;

                // Try to get access_token from fragment (implicit flow) or query params
                let accessToken: string | null = null;

                if (combined) {
                    const params = new URLSearchParams(combined);
                    accessToken = params.get('access_token');
                }

                if (!accessToken) {
                    console.log('No access token found in URL:', url);
                    Alert.alert('Auth Error', 'Could not retrieve your Google account details. Please try again.');
                    return;
                }

                console.log('Got access token, fetching user info...');

                // Fetch user info from Google
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (!userInfoRes.ok) {
                    throw new Error('Failed to fetch user info from Google');
                }

                const userInfo = await userInfoRes.json();
                console.log('Google user:', { email: userInfo.email, name: userInfo.name });

                // Send to our backend
                const backendResult = await apiService.mobileOAuth(
                    'google',
                    accessToken,
                    userInfo.email,
                    userInfo.name || userInfo.given_name,
                    userInfo.picture,
                );

                if (backendResult?.token) {
                    console.log('Login successful!');
                    router.replace('/(drawer)/(tabs)');
                } else {
                    Alert.alert('Error', 'Login succeeded but no session was created.');
                }
            } else if (result.type === 'cancel' || result.type === 'dismiss') {
                // User cancelled — don't show an error
                console.log('User cancelled sign-in');
            } else {
                console.log('Unexpected result:', result);
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            Alert.alert(
                'Sign-In Failed',
                'Could not complete sign-in. Please check your internet connection and try again.',
            );
        } finally {
            setGoogleLoading(false);
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
        socialButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
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
        linkText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: 'bold',
        },
        debugInfo: {
            marginTop: 24,
            padding: 16,
            backgroundColor: colors.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 6,
        },
        debugText: {
            fontSize: 11,
            color: colors.secondary,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Apostolic Army Global Church</Text>
                    <Text style={styles.subtitle}>Lift each other up in prayer and community</Text>
                </View>

                <TouchableOpacity
                    style={[styles.socialButton, { opacity: googleLoading ? 0.7 : 1 }]}
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

                {/* Debug info - only visible during development */}
                {__DEV__ && (
                    <View style={styles.debugInfo}>
                        <Text style={[styles.debugText, { fontWeight: 'bold', color: colors.text }]}>Debug Info:</Text>
                        <Text style={styles.debugText}>Google redirect: {PROXY_REDIRECT_URI}</Text>
                        <Text style={styles.debugText}>App return URL: {appReturnUrl}</Text>
                        <Text style={styles.debugText}>Client ID: {GOOGLE_WEB_CLIENT_ID ? '✓ Set' : '✗ Missing'}</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
