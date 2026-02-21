import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
    Settings,
    ChevronRight,
    Heart,
    BookOpen,
    Users,
    Award,
    Bell,
    Shield,
    LogOut,
    Edit3,
    Star,
    Zap,
    WifiOff,
    RefreshCw,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface MenuItem {
    icon: any;
    label: string;
    subtitle?: string;
    route: string;
    color: string;
    badge?: string;
}

export default function ProfileScreen() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const { user: authUser, logout } = useAuth();
    const router = useRouter();

    const [profileData, setProfileData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchProfile = React.useCallback(async () => {
        try {
            setError(null);
            const data = await apiService.getMe();
            setProfileData(data);
        } catch (err) {
            console.log('Failed to fetch profile', err);
            setError('Could not load your profile. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const displayUser = profileData || authUser;
    const userName = displayUser?.name || 'Guest';
    const userEmail = displayUser?.email || 'Sign in to sync your progress';
    const userAvatar = displayUser?.picture || displayUser?.avatar || null;
    const userInitial = userName.charAt(0).toUpperCase();

    const menuItems: MenuItem[] = [
        {
            icon: Edit3,
            label: 'Edit Profile',
            subtitle: 'Update your personal info',
            route: '/settings/profile',
            color: '#7C3AED',
        },
        {
            icon: Heart,
            label: 'Prayer Journal',
            subtitle: 'Your personal prayers',
            route: '/prayers',
            color: '#EC4899',
        },
        {
            icon: BookOpen,
            label: 'Devotional History',
            subtitle: 'Past devotionals & notes',
            route: '/devotional',
            color: '#10B981',
        },
        {
            icon: Users,
            label: 'Friends',
            subtitle: 'Your faith community',
            route: '/friends',
            color: '#3B82F6',
        },
        {
            icon: Bell,
            label: 'Notifications',
            subtitle: 'Manage your alerts',
            route: '/notifications',
            color: '#F59E0B',
        },
        {
            icon: Settings,
            label: 'Settings',
            subtitle: 'App preferences & more',
            route: '/settings',
            color: '#6366F1',
        },
    ];

    const stats = [
        { label: 'Prayers', value: profileData?.stats?.prayerCount || 0, icon: Heart, color: '#EC4899' },
        { label: 'Streak', value: profileData?.stats?.streak || 0, icon: Zap, color: '#F59E0B' },
        { label: 'Friends', value: profileData?.stats?.friendsCount || 0, icon: Users, color: '#3B82F6' },
    ];

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 16, color: colors.secondary, fontWeight: '600' }}>Loading Profile...</Text>
            </View>
        );
    }

    if (error && !displayUser) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <WifiOff size={48} color={colors.secondary} opacity={0.5} />
                <Text style={{ color: colors.secondary, fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 24, lineHeight: 24 }}>
                    {error}
                </Text>
                <TouchableOpacity
                    style={{ backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }}
                    onPress={() => { setLoading(true); fetchProfile(); }}
                >
                    <RefreshCw size={18} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            {/* Hero Header */}
            <LinearGradient
                colors={isDark ? ['#1F2937', '#111827'] : ['#7C3AED', '#6366F1']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Background decoration */}
                <View style={styles.heroDecoration1} />
                <View style={styles.heroDecoration2} />

                <View style={styles.heroContent}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarRing}>
                            <View style={styles.avatar}>
                                {userAvatar ? (
                                    <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
                                ) : (
                                    <Text style={styles.avatarInitial}>{userInitial}</Text>
                                )}
                            </View>
                        </View>
                        {displayUser && (
                            <View style={styles.onlineDot} />
                        )}
                    </View>

                    {/* User Info */}
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>

                    {/* Member Badge */}
                    {displayUser && (
                        <View style={styles.memberBadge}>
                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.memberBadgeText}>Member</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Stats Card - overlapping the hero */}
            <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {stats.map((stat, index) => {
                    const StatIcon = stat.icon;
                    return (
                        <React.Fragment key={stat.label}>
                            {index > 0 && (
                                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            )}
                            <View style={styles.statItem}>
                                <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                                    <StatIcon size={16} color={stat.color} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                                <Text style={[styles.statLabel, { color: colors.secondary }]}>{stat.label}</Text>
                            </View>
                        </React.Fragment>
                    );
                })}
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
                <Text style={[styles.menuSectionTitle, { color: colors.secondary }]}>ACCOUNT</Text>

                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.menuItem,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    marginBottom: index === menuItems.length - 1 ? 0 : 8,
                                },
                            ]}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={[styles.menuIconBg, { backgroundColor: item.color + '12' }]}>
                                <Icon size={20} color={item.color} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                {item.subtitle && (
                                    <Text style={[styles.menuSubtitle, { color: colors.secondary }]}>{item.subtitle}</Text>
                                )}
                            </View>
                            {item.badge && (
                                <View style={[styles.menuBadge, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <ChevronRight size={18} color={colors.border} />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Sign Out */}
            {displayUser && (
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={[styles.signOutButton, { borderColor: '#EF444430' }]}
                        onPress={async () => {
                            await logout();
                            router.replace('/login' as any);
                        }}
                    >
                        <LogOut size={20} color="#EF4444" />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Sign In CTA for guests */}
            {!displayUser && (
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={[styles.signInButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/login' as any)}
                    >
                        <Text style={styles.signInText}>Sign In / Create Account</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroGradient: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    heroDecoration1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    heroDecoration2: {
        position: 'absolute',
        bottom: 20,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    heroContent: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatarRing: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: '#7C3AED',
    },
    userName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '500',
        marginBottom: 16,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberBadgeText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    statsCard: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: -30,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    statDivider: {
        width: 1,
        height: '70%',
        alignSelf: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    statIconBg: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuSection: {
        paddingHorizontal: 20,
        marginTop: 28,
    },
    menuSectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        gap: 14,
    },
    menuIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextContainer: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    menuSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    menuBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    menuBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#EF444408',
    },
    signOutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signInButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 20,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signInText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
