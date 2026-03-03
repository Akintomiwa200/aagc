import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner-native';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
const EXPO_OWNER = Constants.expoConfig?.owner || 'herkintormiwer';
const EXPO_SLUG = Constants.expoConfig?.slug || 'aagc-mobile';
const EXECUTION_ENV = (Constants as any).executionEnvironment;
const IS_EXPO_GO =
    Constants.appOwnership === 'expo' ||
    Constants.appOwnership === 'guest' ||
    EXECUTION_ENV === 'storeClient';

const isConfigured = (value: string) => Boolean(value && !value.includes('provide-your-'));
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { login: passwordLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const expoProxyUri = `https://auth.expo.io/@${EXPO_OWNER}/${EXPO_SLUG}`;
    const redirectUri = IS_EXPO_GO
        ? expoProxyUri
        : AuthSession.makeRedirectUri({
            scheme: 'aagc',
            path: 'oauthredirect',
        });

    const googleAuthConfig = IS_EXPO_GO
        ? {
            clientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
            expoClientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
            webClientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
            redirectUri: expoProxyUri,
        }
        : {
            clientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
            webClientId: isConfigured(GOOGLE_WEB_CLIENT_ID) ? GOOGLE_WEB_CLIENT_ID : undefined,
            androidClientId: isConfigured(GOOGLE_ANDROID_CLIENT_ID) ? GOOGLE_ANDROID_CLIENT_ID : undefined,
            iosClientId: isConfigured(GOOGLE_IOS_CLIENT_ID) ? GOOGLE_IOS_CLIENT_ID : undefined,
            redirectUri,
        };

    const [request, response, promptAsync] = Google.useAuthRequest({
        selectAccount: true,
        scopes: ['openid', 'profile', 'email'],
        ...googleAuthConfig,
    });

    React.useEffect(() => {
        const checkSession = async () => {
            const token = await apiService.getToken();
            if (token) router.replace('/(drawer)/(tabs)');
        };
        checkSession();
    }, [router]);

    React.useEffect(() => {
        const completeGoogleLogin = async () => {
            if (!response) return;

            if (response.type === 'error') {
                const description =
                    (response.error as any)?.description ||
                    (response.params as any)?.error_description ||
                    '';
                if (description.toLowerCase().includes('redirect_uri')) {
                    toast.error('Google redirect URI is invalid. Please contact support.');
                } else {
                    toast.error('Google authentication failed.');
                }
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
                    toast.error('Could not retrieve Google token.');
                    return;
                }

                let oauthEmail: string | undefined;
                let oauthName: string | undefined;
                let oauthPicture: string | undefined;

                if (accessToken) {
                    const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    if (infoRes.ok) {
                        const info = await infoRes.json();
                        oauthEmail = info.email;
                        oauthName = info.name || info.given_name;
                        oauthPicture = info.picture;
                    }
                }

                const result = await apiService.mobileOAuth('google', oauthToken, oauthEmail, oauthName, oauthPicture);
                if (result?.token) {
                    router.replace('/(drawer)/(tabs)');
                    return;
                }
                toast.error('Google login completed, but session was not created.');
            } catch (error) {
                console.error('Google login error:', error);
                toast.error('Could not complete Google sign-in.');
            } finally {
                setGoogleLoading(false);
            }
        };

        completeGoogleLogin();
    }, [response, router]);

    const canSubmit = useMemo(() => email.trim().length > 0 && password.length >= 6, [email, password]);

    const handleEmailLogin = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            toast.error('Enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        setPasswordLoading(true);
        try {
            await passwordLogin(normalizedEmail, password);
            router.replace('/(drawer)/(tabs)');
        } catch (error: any) {
            toast.error(error?.message || 'Login failed. Check your credentials.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isConfigured(GOOGLE_WEB_CLIENT_ID) && !isConfigured(GOOGLE_ANDROID_CLIENT_ID) && !isConfigured(GOOGLE_IOS_CLIENT_ID)) {
            toast.error('Google OAuth is not configured.');
            return;
        }
        if (!request) {
            toast('Google sign-in is initializing. Try again.');
            return;
        }
        setGoogleLoading(true);
        try {
            const result = await promptAsync(
                IS_EXPO_GO
                    ? { useProxy: true }
                    : undefined
            );
            if (result.type !== 'success') setGoogleLoading(false);
        } catch {
            setGoogleLoading(false);
            toast.error('Could not open Google sign-in.');
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        keyboard: { flex: 1 },
        content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
        header: { marginBottom: 10, gap: 8 },
        title: { fontSize: 30, fontWeight: '800', color: colors.text },
        subtitle: { fontSize: 15, color: colors.secondary, lineHeight: 21 },
        fieldLabel: { color: colors.secondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
        input: {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 13,
            color: colors.text,
            fontSize: 15,
        },
        primaryBtn: {
            backgroundColor: colors.primary,
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
        },
        primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
        dividerWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
        divider: { flex: 1, height: 1, backgroundColor: colors.border },
        dividerText: { color: colors.secondary, fontSize: 12, fontWeight: '600' },
        googleBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 14,
            backgroundColor: colors.card,
        },
        googleBtnText: { color: colors.text, fontSize: 15, fontWeight: '700' },
    });

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your prayer journey and community access.</Text>
                    </View>

                    <Text style={styles.fieldLabel}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        textContentType="username"
                        style={styles.input}
                        placeholder="you@example.com"
                        placeholderTextColor={colors.secondary}
                    />

                    <Text style={styles.fieldLabel}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        textContentType="password"
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.secondary}
                        onSubmitEditing={handleEmailLogin}
                    />

                    <TouchableOpacity
                        style={[styles.primaryBtn, { opacity: canSubmit && !passwordLoading ? 1 : 0.6 }]}
                        onPress={handleEmailLogin}
                        disabled={!canSubmit || passwordLoading}
                    >
                        {passwordLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
                    </TouchableOpacity>

                    <View style={styles.dividerWrap}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity
                        style={[styles.googleBtn, { opacity: googleLoading || !request ? 0.7 : 1 }]}
                        onPress={handleGoogleLogin}
                        disabled={googleLoading || !request}
                    >
                        {googleLoading ? (
                            <ActivityIndicator color={colors.text} />
                        ) : (
                            <>
                                <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>G</Text>
                                <Text style={styles.googleBtnText}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

