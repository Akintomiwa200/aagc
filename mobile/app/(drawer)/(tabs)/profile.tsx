import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Settings as SettingsIcon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

export default function ProfileScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.getMe();
                setUser(data);
            } catch (error) {
                console.log('Failed to fetch user, defaulting to guest', error);
                // Keep user as null for guest
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        content: {
            padding: 16,
        },
        header: {
            alignItems: 'center',
            marginBottom: 32,
            paddingVertical: 24,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#7C3AED',
            marginBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        },
        avatarImage: {
            width: '100%',
            height: '100%',
        },
        avatarAbbr: {
            fontSize: 36,
            color: '#FFFFFF',
            fontWeight: 'bold'
        },
        name: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
        },
        email: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 24,
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        statItem: {
            alignItems: 'center',
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#7C3AED',
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textTransform: 'uppercase',
        },
        menuItem: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        menuText: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#111827',
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    const displayText = user ? {
        name: user.name || 'User',
        email: user.email || '',
        avatar: user.picture || null,
        stats: {
            xp: user.stats?.xp || 0,
            streak: user.stats?.streak || 0,
            friends: user.stats?.friendsCount || 0
        }
    } : {
        name: 'Guest User',
        email: 'Sign in to sync your progress',
        avatar: null,
        stats: { xp: 0, streak: 0, friends: 0 }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    {displayText.avatar ? (
                        <Image source={{ uri: displayText.avatar }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarAbbr}>{displayText.name.charAt(0)}</Text>
                    )}
                </View>
                <Text style={styles.name}>{displayText.name}</Text>
                <Text style={styles.email}>{displayText.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{displayText.stats.xp}</Text>
                    <Text style={styles.statLabel}>XP</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{displayText.stats.streak}</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{displayText.stats.friends}</Text>
                    <Text style={styles.statLabel}>Friends</Text>
                </View>
            </View>

            {user ? (
                <Link href="/profile/edit" asChild>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Edit Profile</Text>
                    </TouchableOpacity>
                </Link>
            ) : (
                <Link href={"/login" as any} asChild>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Sign In / Sign Up</Text>
                    </TouchableOpacity>
                </Link>
            )}

            <Link href="/friends" asChild>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Friends</Text>
                </TouchableOpacity>
            </Link>

            <Link href="/settings" asChild>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
            </Link>
        </ScrollView>
    );
}
