import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

const isConfigured = (value: string) => Boolean(value && !value.includes('provide-your-'));

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [googleLoading, setGoogleLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        // Fallback clientId keeps Expo Go/dev usable even when a platform ID is missing.
        clientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
        webClientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
        androidClientId: isConfigured(GOOGLE_ANDROID_CLIENT_ID) ? GOOGLE_ANDROID_CLIENT_ID : undefined,
        iosClientId: isConfigured(GOOGLE_IOS_CLIENT_ID) ? GOOGLE_IOS_CLIENT_ID : undefined,
        selectAccount: true,
        scopes: ['openid', 'profile', 'email'],
    });

    React.useEffect(() => {
        console.log('=== Google Auth Debug ===');
        console.log('Google request loaded:', request ? 'YES' : 'NO');
        console.log('Google redirect URI:', request?.redirectUri || 'N/A');
        console.log('Android Client ID:', isConfigured(GOOGLE_ANDROID_CLIENT_ID) ? 'SET ✓' : 'MISSING ✗');
        console.log('iOS Client ID:', isConfigured(GOOGLE_IOS_CLIENT_ID) ? 'SET ✓' : 'MISSING ✗');
        console.log('Web Client ID:', isConfigured(GOOGLE_WEB_CLIENT_ID) ? 'SET ✓' : 'MISSING ✗');
        console.log('========================');
    }, [request]);

    React.useEffect(() => {
        checkSession();
    }, []);

    React.useEffect(() => {
        const completeGoogleLogin = async () => {
            if (!response) {
                return;
            }

            if (response.type === 'error') {
                console.error('Google auth response error:', response.error);
                Alert.alert('Sign-In Failed', 'Google authentication failed. Please try again.');
                setGoogleLoading(false);
                return;
            }

            if (response.type !== 'success') {
                setGoogleLoading(false);
                return;
            }

            try {
                const accessToken = response.authentication?.accessToken || response.params?.access_token || null;
                const idToken = response.authentication?.idToken || response.params?.id_token || null;
                const oauthToken = idToken || accessToken;

                if (!oauthToken) {
                    Alert.alert('Auth Error', 'Could not retrieve a valid Google token. Please try again.');
                    return;
                }

                let email: string | undefined;
                let name: string | undefined;
                let picture: string | undefined;

                if (accessToken) {
                    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (userInfoRes.ok) {
                        const userInfo = await userInfoRes.json();
                        email = userInfo.email;
                        name = userInfo.name || userInfo.given_name;
                        picture = userInfo.picture;
                    }
                }

                const backendResult = await apiService.mobileOAuth('google', oauthToken, email, name, picture);

                if (backendResult?.token) {
                    router.replace('/(drawer)/(tabs)');
                    return;
                }

                Alert.alert('Error', 'Login succeeded but no session was created.');
            } catch (error) {
                console.error('Google login error:', error);
                Alert.alert(
                    'Sign-In Failed',
                    'Could not complete sign-in. Please check your internet connection and try again.',
                );
            } finally {
                setGoogleLoading(false);
            }
        };

        completeGoogleLogin();
    }, [response]);

    const checkSession = async () => {
        const token = await apiService.getToken();
        if (token) {
            router.replace('/(drawer)/(tabs)');
        }
    };

    const handleGoogleLogin = async () => {
        if (!isConfigured(GOOGLE_WEB_CLIENT_ID) && !isConfigured(GOOGLE_ANDROID_CLIENT_ID) && !isConfigured(GOOGLE_IOS_CLIENT_ID)) {
            Alert.alert(
                'Configuration Required',
                'Google Client IDs are not configured. Please add them to the .env file.',
            );
            return;
        }

        if (!request) {
            Alert.alert('Please wait', 'Google sign-in is still initializing. Try again in a moment.');
            return;
        }

        setGoogleLoading(true);

        try {
            const result = await promptAsync();
            if (result.type !== 'success') {
                setGoogleLoading(false);
            }
        } catch (error) {
            console.error('Failed to open Google sign-in:', error);
            setGoogleLoading(false);
            Alert.alert('Sign-In Failed', 'Could not open Google sign-in. Please try again.');
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
                    style={[styles.socialButton, { opacity: googleLoading || !request ? 0.7 : 1 }]}
                    onPress={handleGoogleLogin}
                    disabled={googleLoading || !request}
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

                {__DEV__ && (
                    <View style={styles.debugInfo}>
                        <Text style={[styles.debugText, { fontWeight: 'bold', color: colors.text }]}>Debug Info:</Text>
                        <Text style={styles.debugText}>Redirect URI: {request?.redirectUri || 'loading...'}</Text>
                        <Text style={styles.debugText}>Android Client ID: {isConfigured(GOOGLE_ANDROID_CLIENT_ID) ? '✓ Set' : '✗ Missing'}</Text>
                        <Text style={styles.debugText}>iOS Client ID: {isConfigured(GOOGLE_IOS_CLIENT_ID) ? '✓ Set' : '✗ Missing'}</Text>
                        <Text style={styles.debugText}>Web Client ID: {isConfigured(GOOGLE_WEB_CLIENT_ID) ? '✓ Set' : '✗ Missing'}</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
