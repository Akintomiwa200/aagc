import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Play,
    Book,
    Heart,
    Calendar,
    ChevronRight,
    Bell,
    Users,
    MessageSquare,
    Zap,
    MapPin,
    TrendingUp,
    Clock,
    Eye,
    CheckCircle,
    Target,
    WifiOff,
    RefreshCw
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const QuickLink = ({ icon: Icon, title, route, color, badge, colors, router, isDark }: any) => {
    return (
        <TouchableOpacity
            style={[
                quickStyles.linkCard,
                { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            onPress={() => router.push(route)}
        >
            <View style={[quickStyles.linkIcon, { backgroundColor: color + '15' }]}>
                {Icon && <Icon size={24} color={color} />}
            </View>
            <Text style={[quickStyles.linkTitle, { color: colors.text }]}>{title}</Text>
            {badge ? (
                <View style={[quickStyles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={quickStyles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const quickStyles = StyleSheet.create({
    linkCard: {
        width: (width - 52) / 2,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'flex-start',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    linkIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    }
});


export default function HomeScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const { user } = useAuth();

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dailyRhema, setDailyRhema] = useState<any>(null);
    const [latestSermon, setLatestSermon] = useState<any>(null);
    const [todayEvents, setTodayEvents] = useState<any[]>([]);

    // Real Stats
    const [prayerCount, setPrayerCount] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            setError(null);

            // Fetch real data simultaneously
            const [rhemaRes, sermonRes, eventsRes, prayersRes] = await Promise.allSettled([
                apiService.getTodayDevotional(),
                apiService.getSermons(),
                apiService.getEvents(),
                apiService.get<any[]>('/prayers'),
            ]);

            const rhemaData = rhemaRes.status === 'fulfilled' ? rhemaRes.value : null;
            const sermonData = sermonRes.status === 'fulfilled' ? sermonRes.value : [];
            const eventsData = eventsRes.status === 'fulfilled' ? eventsRes.value : [];
            const prayersData = prayersRes.status === 'fulfilled' ? prayersRes.value : [];

            const failedCount = [rhemaRes, sermonRes, eventsRes, prayersRes].filter(item => item.status === 'rejected').length;
            setError(failedCount > 0 ? 'Some live data could not be refreshed. Pull down to retry.' : null);

            setDailyRhema(rhemaData);

            if (Array.isArray(sermonData) && sermonData.length > 0) {
                setLatestSermon(sermonData[0]);
            }

            // Filter events for today (assuming ISO date strings)
            const todayStr = new Date().toISOString().split('T')[0];
            const filteredEvents = (Array.isArray(eventsData) ? eventsData : []).filter((e: any) => e.date && e.date.startsWith(todayStr));
            setTodayEvents(filteredEvents);

            // Set prayer count from real api
            if (Array.isArray(prayersData) && prayersData.length) {
                const todayPrayers = prayersData.filter((p: any) => p.createdAt && p.createdAt.startsWith(todayStr));
                setPrayerCount(todayPrayers.length);
            }

        } catch (err: any) {
            console.error('Failed to fetch home data', err);
            setError('Unable to connect securely right now. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleInitialData = (data: any) => {
            if (data.activeUsers) setActiveUsers(data.activeUsers);
        };

        socket.on('initial-data', handleInitialData);
        socket.on('prayer-created', () => {
            setPrayerCount(prev => prev + 1);
        });
        socket.on('user-activity', (users: number) => setActiveUsers(users));

        return () => {
            socket.off('initial-data', handleInitialData);
            socket.off('prayer-created');
            socket.off('user-activity');
        };
    }, [socket]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const renderEventItem = (item: any, index: number) => (
        <TouchableOpacity key={item.id || index} style={[styles.eventItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.eventTimeBadge, { backgroundColor: colors.primary + '15' }]}>
                <Clock size={12} color={colors.primary} />
                <Text style={[styles.eventTime, { color: colors.primary }]}>{item.time || 'All Day'}</Text>
            </View>
            <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.eventLocation, { color: colors.secondary }]}>{item.location || 'Church Campus'}</Text>
            <ChevronRight size={16} color={colors.border} style={{ position: 'absolute', right: 16, top: '50%' }} />
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerGradient: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        welcomeText: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        userName: {
            fontSize: 26,
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginTop: 4,
        },
        iconButtonWrapper: {
            flexDirection: 'row',
            gap: 12,
        },
        iconButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: 16,
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        statValue: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },
        statLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 4,
            fontWeight: '500',
        },
        spotlightCard: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            marginTop: -25,
            marginHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            borderWidth: isDark ? 1 : 0,
            borderColor: 'rgba(255,255,255,0.1)'
        },
        sermonStats: {
            flexDirection: 'row',
            gap: 16,
            marginTop: 8,
        },
        sermonStat: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        sermonStatText: {
            fontSize: 12,
            color: colors.secondary,
            fontWeight: '500',
        },
        playIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        section: {
            paddingHorizontal: 20,
            marginTop: 32,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: colors.text,
            letterSpacing: 0.5,
        },
        seeAll: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: 'bold',
        },
        rhemaCard: {
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
            borderWidth: 1,
            borderColor: colors.border,
        },
        rhemaHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        rhemaTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
        },
        rhemaText: {
            fontSize: 15,
            color: colors.secondary,
            lineHeight: 24,
            fontWeight: '500',
        },
        rhemaMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        rhemaVerse: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: 'bold',
            flex: 1,
        },
        rhemaDate: {
            fontSize: 12,
            color: colors.secondary,
            fontWeight: '600',
            backgroundColor: colors.border,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        quickLinksGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        eventItem: {
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
            borderWidth: 1,
        },
        eventTimeBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 12,
            alignSelf: 'flex-start',
            marginBottom: 12,
        },
        eventTime: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        eventTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 6,
        },
        eventLocation: {
            fontSize: 14,
            fontWeight: '500',
        },
        noEvents: {
            textAlign: 'center',
            color: colors.secondary,
            fontSize: 15,
            padding: 24,
            backgroundColor: colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
            marginTop: 60,
        },
        errorText: {
            color: colors.secondary,
            fontSize: 16,
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 24,
            lineHeight: 24,
        },
        retryButton: {
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 16,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        retryText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 16,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                <LinearGradient
                    colors={isDark ? ['#1F2937', '#111827'] : [colors.primary, '#6366F1']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.welcomeText}>Grace & Peace,</Text>
                            <Text style={styles.userName}>{user?.name ? user.name.split(' ')[0] : 'Believer'}</Text>
                        </View>
                        <View style={styles.iconButtonWrapper}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications' as any)}>
                                <Bell size={20} color="#FFFFFF" />
                                <View style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile')}>
                                <Users size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{activeUsers}</Text>
                            <Text style={styles.statLabel}>Online Now</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{prayerCount}</Text>
                            <Text style={styles.statLabel}>Prayers Today</Text>
                        </View>
                    </View>
                </LinearGradient>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={{ marginTop: 16, color: colors.secondary, fontWeight: '600' }}>Preparing Your Feed...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <WifiOff size={48} color={colors.secondary} opacity={0.5} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
                            <RefreshCw size={18} color="#FFFFFF" />
                            <Text style={styles.retryText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {latestSermon && (
                            <TouchableOpacity style={styles.spotlightCard} onPress={() => router.push('/sermons')}>
                                <View style={styles.playIcon}>
                                    <Play size={24} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 4 }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.primary, letterSpacing: 1 }}>
                                            LATEST MESSAGE
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 }} numberOfLines={1}>
                                        {latestSermon.title}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: colors.secondary }}>
                                        {latestSermon.speaker || 'Pastor John Smith'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Daily Rhema</Text>
                                <TouchableOpacity onPress={() => router.push('/devotional')}>
                                    <Text style={styles.seeAll}>Archive</Text>
                                </TouchableOpacity>
                            </View>
                            {dailyRhema ? (
                                <TouchableOpacity style={styles.rhemaCard} onPress={() => router.push('/devotional')}>
                                    <View style={styles.rhemaHeader}>
                                        <Text style={styles.rhemaTitle}>{dailyRhema.title}</Text>
                                        <CheckCircle size={22} color={colors.primary} />
                                    </View>
                                    <Text style={styles.rhemaText} numberOfLines={3}>
                                        {dailyRhema.content || dailyRhema.body}
                                    </Text>
                                    <View style={styles.rhemaMeta}>
                                        <Text style={styles.rhemaVerse}>{dailyRhema.verse}</Text>
                                        <Text style={styles.rhemaDate}>Today</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={[styles.rhemaCard, { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }]}>
                                    <Book size={32} color={colors.border} />
                                    <Text style={{ marginTop: 12, color: colors.secondary, fontWeight: '500' }}>No Devotional Today</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Quick Actions</Text>
                            <View style={styles.quickLinksGrid}>
                                <QuickLink icon={Book} title="Bible" route="/bible" color="#7C3AED" colors={colors} router={router} isDark={isDark} />
                                <QuickLink icon={Heart} title="Giving" route="/giving" color="#EC4899" colors={colors} router={router} isDark={isDark} />
                                <QuickLink icon={Zap} title="Live Meet" route="/live-meet" color="#F59E0B" colors={colors} router={router} isDark={isDark} />
                                <QuickLink icon={MessageSquare} title="Prayers" route="/prayers" color="#10B981" badge={prayerCount} colors={colors} router={router} isDark={isDark} />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Today's Gathering</Text>
                                <TouchableOpacity onPress={() => router.push('/events')}>
                                    <Text style={styles.seeAll}>Calendar</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                {todayEvents.length > 0 ? (
                                    todayEvents.map((item, index) => renderEventItem(item, index))
                                ) : (
                                    <Text style={styles.noEvents}>No church events scheduled for today. Have a blessed day!</Text>
                                )}
                            </View>
                        </View>

                        <View style={{ height: 100 }} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
