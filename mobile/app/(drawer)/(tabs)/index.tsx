import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, SafeAreaView, Dimensions } from 'react-native';
import { useRouter, Link } from 'expo-router';
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
    MapPin
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const [refreshing, setRefreshing] = useState(false);
    const [dailyRhema, setDailyRhema] = useState<any>(null);
    const [latestSermon, setLatestSermon] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            const rhemaData = await apiService.getTodayDevotional();
            setDailyRhema(rhemaData);

            const sermonData = await apiService.getSermons();
            if (sermonData && sermonData.length > 0) {
                setLatestSermon(sermonData[0]);
            }
        } catch (error) {
            console.log('Failed to fetch home data', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

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
        rhemaTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        rhemaText: {
            fontSize: 14,
            color: colors.secondary,
            lineHeight: 22,
        },
        quickLinksGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
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
        }
    });

    const QuickLink = ({ icon: Icon, title, route, color }: any) => (
        <TouchableOpacity style={styles.linkCard} onPress={() => router.push(route)}>
            <View style={[styles.linkIcon, { backgroundColor: color + '15' }]}>
                <Icon size={24} color={color} />
            </View>
            <Text style={styles.linkTitle}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Visual Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.welcomeText}>Grace & Peace,</Text>
                            <Text style={styles.userName}>Apostolic Army</Text>
                        </View>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
                            <Bell size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MapPin size={14} color="rgba(255,255,255,0.7)" />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' }}>
                            Global Headquarters
                        </Text>
                    </View>
                </View>

                {/* Latest Sermon Spotlight */}
                <TouchableOpacity style={styles.spotlightCard} onPress={() => router.push('/(drawer)/sermons')}>
                    <View style={styles.playIcon}>
                        <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary, letterSpacing: 1 }}>LATEST SERMON</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }} numberOfLines={1}>
                            {latestSermon?.title || 'The Power of Faith'}
                        </Text>
                        <Text style={{ fontSize: 13, color: colors.secondary }}>Watch now</Text>
                    </View>
                    <ChevronRight size={20} color={colors.border} />
                </TouchableOpacity>

                {/* Daily Rhema Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Daily Rhema</Text>
                        <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/devotional')}>
                            <Text style={styles.seeAll}>More</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.rhemaCard}
                        onPress={() => router.push('/(drawer)/(tabs)/devotional')}
                    >
                        <Text style={styles.rhemaTitle}>{dailyRhema?.title || 'Walking in Victory'}</Text>
                        <Text style={styles.rhemaText} numberOfLines={3}>
                            {dailyRhema?.content || dailyRhema?.body || 'Start your day with a powerful word from God...'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Quick Actions</Text>
                    <View style={styles.quickLinksGrid}>
                        <QuickLink icon={Book} title="Bible" route="/(drawer)/bible" color="#7C3AED" />
                        <QuickLink icon={Heart} title="Giving" route="/(drawer)/giving" color="#EC4899" />
                        <QuickLink icon={Zap} title="Live Meet" route="/(drawer)/live-meet" color="#F59E0B" />
                        <QuickLink icon={MessageSquare} title="Prayers" route="/(drawer)/(tabs)/prayers" color="#10B981" />
                        <QuickLink icon={Users} title="Friends" route="/(drawer)/friends" color="#3B82F6" />
                        <QuickLink icon={Calendar} title="Events" route="/(drawer)/events" color="#6366F1" />
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
