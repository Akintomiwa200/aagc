import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Link, Href } from 'expo-router';
import { Gift, Users, Video, UserPlus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

type QuickLinkItem = {
    id: number;
    name: string;
    icon: any;
    color: string;
    link: Href;
};

export default function HomeScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [dailyDevotional, setDailyDevotional] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const devotionalData = await apiService.getTodayDevotional();
            setDailyDevotional(devotionalData);
        } catch (error) {
            console.log('Failed to fetch home data', error);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const quickLinks: QuickLinkItem[] = [
        { id: 1, name: 'Welcome', icon: UserPlus, color: '#7C3AED', link: '/first-timer' },
        { id: 2, name: 'Tithe', icon: Gift, color: '#10B981', link: '/giving' },
        { id: 3, name: 'Sermons', icon: Users, color: '#3B82F6', link: '/sermons' },
        { id: 4, name: 'Live', icon: Video, color: '#EF4444', link: '/live-meet' },
    ];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 100,
        },
        header: {
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
        },
        headerSubtitle: {
            fontSize: 12,
            color: '#7C3AED',
            fontWeight: '600',
            letterSpacing: 2,
        },
        quickLinksContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 32,
        },
        quickLinkItem: {
            alignItems: 'center',
            gap: 8,
        },
        quickLinkIcon: {
            width: 64,
            height: 64,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
        },
        quickLinkText: {
            fontSize: 10,
            fontWeight: '700',
            color: isDark ? '#9CA3AF' : '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 12,
        },
        cardText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 20,
        },
    });

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={isDark ? '#FFFFFF' : '#111827'} // Cross-platform spinner color
                    colors={['#7C3AED']} // Android spinner color
                />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Apostolic Army</Text>
                <Text style={styles.headerSubtitle}>GLOBAL CHURCH</Text>
            </View>

            {/* Quick Links */}
            <View style={styles.quickLinksContainer}>
                {quickLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.id} href={item.link} asChild>
                            <TouchableOpacity style={styles.quickLinkItem}>
                                <View style={[styles.quickLinkIcon, { backgroundColor: item.color + '20' }]}>
                                    <Icon size={28} color={item.color} />
                                </View>
                                <Text style={styles.quickLinkText}>{item.name}</Text>
                            </TouchableOpacity>
                        </Link>
                    );
                })}
            </View>

            {/* Welcome Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Welcome Home</Text>
                <Text style={styles.cardText}>
                    Welcome to the Apostolic Army Global Church mobile app. Experience the supernatural move of God in your life.
                </Text>
            </View>

            {/* Today's Devotional */}
            <Link href="/devotional" asChild>
                <TouchableOpacity style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Rhema</Text>
                    <Text style={styles.cardText}>
                        {dailyDevotional ? (
                            <>
                                <Text style={{ fontWeight: 'bold' }}>{dailyDevotional.title}</Text>
                                {'\n'}
                                Tap to read today's devotional.
                            </>
                        ) : (
                            "Tap to read today's devotional and grow in your faith journey."
                        )}
                    </Text>
                </TouchableOpacity>
            </Link>

            {/* Events */}
            <Link href="/events" asChild>
                <TouchableOpacity style={styles.card}>
                    <Text style={styles.cardTitle}>Upcoming Events</Text>
                    <Text style={styles.cardText}>
                        Join us for our upcoming services and special gatherings.
                    </Text>
                </TouchableOpacity>
            </Link>
        </ScrollView>
    );
}
