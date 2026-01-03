import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Replace with real one later
        iosClientId: 'YOUR_IOS_CLIENT_ID', // Replace with real one later
        webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with real one later
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            handleMobileOAuth(authentication?.accessToken || '');
        }
    }, [response]);

    const handleMobileOAuth = async (token: string) => {
        setGoogleLoading(true);
        try {
            // Fetch user info from Google using the access token
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userInfo = await response.json();

            // Call our backend with the token and user info
            const result = await apiService.mobileOAuth(
                'google',
                token,
                userInfo.email,
                userInfo.name,
                userInfo.picture
            );

            if (result.token) {
                router.replace('/(drawer)/(tabs)');
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            Alert.alert('Error', error.message || 'Google login failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await apiService.login(email, password);
            router.replace('/(drawer)/(tabs)');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!request) {
            Alert.alert('Error', 'Google auth not ready');
            return;
        }
        promptAsync();
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
        dividerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 32,
        },
        divider: {
            flex: 1,
            height: 1,
            backgroundColor: colors.border,
        },
        dividerText: {
            marginHorizontal: 16,
            color: colors.secondary,
            fontSize: 14,
        },
        socialButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 12,
        },
        socialButtonText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Mail size={20} color={colors.secondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock size={20} color={colors.secondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading || googleLoading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <LogIn size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Sign In</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={handleGoogleLogin}
                    disabled={loading || googleLoading}
                >
                    {googleLoading ? (
                        <ActivityIndicator color={colors.text} />
                    ) : (
                        <>
                            <Text style={{ fontSize: 20 }}>G</Text>
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/register' as any)}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{ marginTop: 24, alignItems: 'center' }}
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
