
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    Dimensions,
    Image,
    FlatList
} from 'react-native';
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
    MoreVertical,
    Music,
    Video,
    FileText,
    Award,
    Target,
    Compass,
    Shield,
    Star,
    ArrowUpRight,
    CheckCircle
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';

const { width } = Dimensions.get('window');


const QuickLink = ({ icon: Icon, title, route, color, badge, colors, router, styles }: any) => (
    <TouchableOpacity style={styles.linkCard} onPress={() => router.push(route)}>
        <View style={[styles.linkIcon, { backgroundColor: color + '15' }]}>
            {Icon && <Icon size={24} color={color} />}
        </View>
        <Text style={styles.linkTitle}>{title}</Text>
        {badge ? (
            <View style={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: colors.primary,
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
            }}>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>{badge}</Text>
            </View>
        ) : null}
    </TouchableOpacity>
);

export default function HomeScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const [refreshing, setRefreshing] = useState(false);
    const [dailyRhema, setDailyRhema] = useState<any>(null);
    const [latestSermon, setLatestSermon] = useState<any>(null);
    const [todayEvents, setTodayEvents] = useState<any[]>([]);
    const [prayerCount, setPrayerCount] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [streak, setStreak] = useState(0);
    const [featuredContent, setFeaturedContent] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const [rhemaData, sermonData, eventsData] = await Promise.all([
                apiService.getTodayDevotional(),
                apiService.getSermons(),
                apiService.getEvents()
            ]);

            setDailyRhema(rhemaData);

            if (sermonData && sermonData.length > 0) {
                setLatestSermon(sermonData[0]);
            }

            setTodayEvents(eventsData || []);

            // Static stats for now - replace with API calls
            setPrayerCount(42);
            setActiveUsers(156);
            setStreak(7);

            // Featured content (static for now)
            setFeaturedContent([
                {
                    id: '1',
                    title: 'Spiritual Warfare Series',
                    type: 'series',
                    duration: '4h 30m',
                    icon: Shield,
                    color: '#8B5CF6'
                },
                {
                    id: '2',
                    title: 'Worship Playlist',
                    type: 'music',
                    duration: '12 tracks',
                    icon: Music,
                    color: '#EF4444'
                },
                {
                    id: '3',
                    title: 'Bible Study Guide',
                    type: 'guide',
                    duration: 'PDF',
                    icon: FileText,
                    color: '#10B981'
                }
            ]);

        } catch (error) {
            console.log('Failed to fetch home data', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleInitialData = (data: any) => {
            if (data.sermons && data.sermons.length > 0) {
                setLatestSermon(data.sermons[0]);
            }
            if (data.prayerCount) {
                setPrayerCount(data.prayerCount);
            }
            if (data.activeUsers) {
                setActiveUsers(data.activeUsers);
            }
        };

        socket.on('initial-data', handleInitialData);
        socket.on('prayer-created', () => fetchData());
        socket.on('user-activity', (users: number) => setActiveUsers(users));

        return () => {
            socket.off('initial-data', handleInitialData);
            socket.off('prayer-updated');
            socket.off('user-activity');
        };
    }, [socket]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const renderEventItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.eventItem}>
            <View style={[styles.eventTimeBadge, { backgroundColor: colors.primary + '20' }]}>
                <Clock size={12} color={colors.primary} />
                <Text style={[styles.eventTime, { color: colors.primary }]}>{item.time}</Text>
            </View>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
        </TouchableOpacity>
    );

    const renderFeaturedItem = ({ item }: { item: any }) => {
        const Icon = item.icon;
        return (
            <TouchableOpacity style={styles.featuredCard}>
                <View style={[styles.featuredIcon, { backgroundColor: item.color + '20' }]}>
                    <Icon size={24} color={item.color} />
                </View>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredSubtitle}>{item.duration}</Text>
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>{item.type}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
            backgroundColor: colors.primary,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        welcomeText: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '600',
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFFFFF',
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
            marginTop: 16,
            paddingHorizontal: 20,
        },
        statItem: {
            alignItems: 'center',
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },
        statLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 4,
        },
        spotlightCard: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            marginTop: -20,
            marginHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
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
        },
        playIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
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
            fontWeight: 'bold',
            color: colors.text,
        },
        seeAll: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
        },
        rhemaCard: {
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
        },
        rhemaHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        rhemaTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
        },
        rhemaText: {
            fontSize: 14,
            color: colors.secondary,
            lineHeight: 22,
        },
        rhemaMeta: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        rhemaVerse: {
            fontSize: 12,
            color: colors.primary,
            fontWeight: '600',
        },
        rhemaDate: {
            fontSize: 12,
            color: colors.secondary,
        },
        quickLinksGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
        },
        linkCard: {
            width: (width - 52) / 2,
            padding: 16,
            borderRadius: 20,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            gap: 12,
        },
        linkIcon: {
            width: 48,
            height: 48,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        linkTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.text,
        },
        eventsContainer: {
            marginTop: 8,
        },
        eventItem: {
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        eventTimeBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            alignSelf: 'flex-start',
            marginBottom: 8,
        },
        eventTime: {
            fontSize: 11,
            fontWeight: '600',
        },
        eventTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        eventLocation: {
            fontSize: 13,
            color: colors.secondary,
        },
        noEvents: {
            textAlign: 'center',
            color: colors.secondary,
            fontSize: 14,
            padding: 20,
        },
        featuredGrid: {
            marginTop: 8,
        },
        featuredCard: {
            width: (width - 52) / 2,
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 12,
        },
        featuredIcon: {
            width: 48,
            height: 48,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        featuredTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        featuredSubtitle: {
            fontSize: 12,
            color: colors.secondary,
            marginBottom: 8,
        },
        featuredBadge: {
            backgroundColor: colors.primary + '15',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            alignSelf: 'flex-start',
        },
        featuredBadgeText: {
            fontSize: 10,
            color: colors.primary,
            fontWeight: '600',
        },
        streakCard: {
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 20,
            marginTop: 8,
        },
        streakContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        streakText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
        },
        streakValue: {
            color: '#FFFFFF',
            fontSize: 32,
            fontWeight: 'bold',
        },
        streakLabel: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12,
            marginTop: 4,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Enhanced Header with Stats */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.welcomeText}>Grace & Peace,</Text>
                            <Text style={styles.userName}>Apostolic Army</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
                                <Bell size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile')}>
                                <Users size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <MapPin size={14} color="rgba(255,255,255,0.7)" />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' }}>
                            Global Headquarters
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{activeUsers}</Text>
                            <Text style={styles.statLabel}>Online Now</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{prayerCount}</Text>
                            <Text style={styles.statLabel}>Prayers Today</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <TrendingUp size={16} color="#FFFFFF" />
                                <Text style={styles.statValue}>12%</Text>
                            </View>
                            <Text style={styles.statLabel}>Growth</Text>
                        </View>
                    </View>
                </View>

                {/* Latest Sermon Spotlight */}
                <TouchableOpacity style={styles.spotlightCard} onPress={() => router.push('/sermons')}>
                    <View style={styles.playIcon}>
                        <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary, letterSpacing: 1, marginBottom: 4 }}>
                            FEATURED SERMON
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }} numberOfLines={1}>
                            {latestSermon?.title || 'The Power of Faith'}
                        </Text>
                        <Text style={{ fontSize: 13, color: colors.secondary, marginBottom: 8 }}>
                            {latestSermon?.speaker || 'Pastor John Smith'}
                        </Text>
                        <View style={styles.sermonStats}>
                            <View style={styles.sermonStat}>
                                <Clock size={12} color={colors.secondary} />
                                <Text style={styles.sermonStatText}>{latestSermon?.duration || '45:22'}</Text>
                            </View>
                            <View style={styles.sermonStat}>
                                <Eye size={12} color={colors.secondary} />
                                <Text style={styles.sermonStatText}>{latestSermon?.views || '1.2K'} views</Text>
                            </View>
                        </View>
                    </View>
                    <ChevronRight size={20} color={colors.border} />
                </TouchableOpacity>

                {/* Daily Rhema Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📖 Daily Rhema</Text>
                        <TouchableOpacity onPress={() => router.push('/devotional')}>
                            <Text style={styles.seeAll}>View Archive</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.rhemaCard}
                        onPress={() => router.push('/devotional')}
                    >
                        <View style={styles.rhemaHeader}>
                            <Text style={styles.rhemaTitle}>{dailyRhema?.title || 'Walking in Victory'}</Text>
                            <CheckCircle size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.rhemaText} numberOfLines={4}>
                            {dailyRhema?.content || dailyRhema?.body ||
                                'Start your day with a powerful word from God. Today, we meditate on the promise of victory through Christ...'}
                        </Text>
                        <View style={styles.rhemaMeta}>
                            <Text style={styles.rhemaVerse}>{dailyRhema?.verse || 'Philippians 4:13'}</Text>
                            <Text style={styles.rhemaDate}>Today</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>🚀 Quick Actions</Text>
                    <View style={styles.quickLinksGrid}>
                        <QuickLink icon={Book} title="Bible" route="/bible" color="#7C3AED" colors={colors} router={router} styles={styles} />
                        <QuickLink icon={Heart} title="Giving" route="/giving" color="#EC4899" badge="New" colors={colors} router={router} styles={styles} />
                        <QuickLink icon={Zap} title="Live Meet" route="/live-meet" color="#F59E0B" colors={colors} router={router} styles={styles} />
                        <QuickLink icon={MessageSquare} title="Prayers" route="/prayers" color="#10B981" badge={prayerCount} colors={colors} router={router} styles={styles} />
                        <QuickLink icon={Users} title="Community" route="/friends" color="#3B82F6" badge={activeUsers} colors={colors} router={router} styles={styles} />
                        <QuickLink icon={Calendar} title="Events" route="/events" color="#6366F1" badge={todayEvents.length} colors={colors} router={router} styles={styles} />
                    </View>
                </View>

                {/* Today's Events */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📅 Today's Events</Text>
                        <TouchableOpacity onPress={() => router.push('/events')}>
                            <Text style={styles.seeAll}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.eventsContainer}>
                        {todayEvents.length > 0 ? (
                            <FlatList
                                data={todayEvents}
                                renderItem={renderEventItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                            />
                        ) : (
                            <Text style={styles.noEvents}>No events scheduled for today</Text>
                        )}
                    </View>
                </View>

                {/* Featured Content */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>⭐ Featured</Text>
                        <TouchableOpacity onPress={() => router.push('/library' as any)}>
                            <Text style={styles.seeAll}>Explore</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={featuredContent}
                        renderItem={renderFeaturedItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredGrid}
                        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                    />
                </View>

                {/* Streak Card */}
                <View style={styles.section}>
                    <View style={styles.streakCard}>
                        <View style={styles.streakContent}>
                            <View>
                                <Text style={styles.streakText}>Your Prayer Streak</Text>
                                <Text style={styles.streakValue}>{streak} days</Text>
                                <Text style={styles.streakLabel}>Keep going! You're on fire 🔥</Text>
                            </View>
                            <Target size={48} color="rgba(255,255,255,0.3)" />
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}