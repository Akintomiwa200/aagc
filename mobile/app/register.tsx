import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, UserPlus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

export default function RegisterScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await apiService.register(name, email, password);
            Alert.alert('Success', 'Account created successfully', [
                { text: 'OK', onPress: () => router.replace('/login' as any) }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        try {
            // Simulate Google Sign-up
            Alert.alert('Google Sign Up', 'Google sign-up initialized');
            // await apiService.mobileOAuth('google', 'test-id-token');
            // router.replace('/(drawer)/(tabs)');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Google sign-up failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: 24,
        },
        header: {
            alignItems: 'center',
            marginBottom: 40,
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
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our community today</Text>
                </View>

                <View style={styles.inputContainer}>
                    <User size={20} color={colors.secondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                        value={name}
                        onChangeText={setName}
                    />
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
                    onPress={handleRegister}
                    disabled={loading || googleLoading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <UserPlus size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Sign Up</Text>
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
                    onPress={handleGoogleSignUp}
                    disabled={loading || googleLoading}
                >
                    {googleLoading ? (
                        <ActivityIndicator color={colors.text} />
                    ) : (
                        <>
                            <Text style={{ fontSize: 20 }}>G</Text>
                            <Text style={styles.socialButtonText}>Sign up with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/login' as any)}>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
