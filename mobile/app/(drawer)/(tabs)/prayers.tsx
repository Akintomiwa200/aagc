import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

export default function PrayersScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [prayers, setPrayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPrayers = useCallback(async () => {
        try {
            const data = await apiService.getPrayerRequests();
            setPrayers(data);
        } catch (error) {
            console.error('Failed to fetch prayers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrayers();
    }, [fetchPrayers]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPrayers();
        setRefreshing(false);
    }, [fetchPrayers]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        content: {
            padding: 16,
            paddingBottom: 100,
        },
        header: {
            marginBottom: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 14,
            color: '#7C3AED',
            fontWeight: '600',
            letterSpacing: 1,
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 8,
        },
        cardText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#4B5563',
            marginBottom: 12,
            lineHeight: 20,
        },
        metaContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        author: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            fontWeight: '500',
        },
        date: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyText: {
            fontSize: 16,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
    });

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={isDark ? '#FFFFFF' : '#111827'}
                    colors={['#7C3AED']}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Prayer Wall</Text>
                <Text style={styles.subtitle}>LIFT UP ONE ANOTHER</Text>
            </View>

            {loading ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Loading prayers...</Text>
                </View>
            ) : prayers.length > 0 ? (
                prayers.map((prayer: any) => (
                    <View key={prayer.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{prayer.title}</Text>
                        <Text style={styles.cardText}>{prayer.description}</Text>
                        <View style={styles.metaContainer}>
                            <Text style={styles.author}>Anonymous</Text>
                            <Text style={styles.date}>
                                {new Date(prayer.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No prayer requests yet.</Text>
                </View>
            )}
        </ScrollView>
    );
}
