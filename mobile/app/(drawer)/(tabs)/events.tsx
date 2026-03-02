import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, RefreshControl } from 'react-native';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import { Link } from 'expo-router';

export default function EventsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const getEventId = (event: any) => event?.id || event?._id;

    const fetchEvents = useCallback(async () => {
        try {
            const data = await apiService.getEvents();
            setEvents(data);
            setError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load events.';
            setError(message);
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleEventCreated = (event: any) => {
            setEvents(prev => [event, ...prev]);
        };

        const handleEventUpdated = (event: any) => {
            const eventId = getEventId(event);
            setEvents(prev => prev.map(e => getEventId(e) === eventId ? event : e));
        };

        const handleEventDeleted = (data: any) => {
            setEvents(prev => prev.filter(e => getEventId(e) !== data.eventId));
        };

        socket.on('event-created', handleEventCreated);
        socket.on('event-updated', handleEventUpdated);
        socket.on('event-deleted', handleEventDeleted);

        return () => {
            socket.off('event-created', handleEventCreated);
            socket.off('event-updated', handleEventUpdated);
            socket.off('event-deleted', handleEventDeleted);
        };
    }, [socket]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    }, [fetchEvents]);

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        return activeTab === 'upcoming' ? eventDate >= now : eventDate < now;
    });

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
        tabContainer: {
            flexDirection: 'row',
            backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
        },
        tab: {
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 10,
        },
        activeTab: {
            backgroundColor: isDark ? '#374151' : '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        activeTabText: {
            color: isDark ? '#FFFFFF' : '#111827',
        },
        eventCard: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 16,
            marginBottom: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        eventImageContainer: {
            height: 150,
            backgroundColor: '#7C3AED',
            justifyContent: 'center',
            alignItems: 'center',
        },
        eventEmoji: {
            fontSize: 48,
        },
        eventContent: {
            padding: 16,
        },
        eventDate: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#7C3AED',
            marginBottom: 4,
            textTransform: 'uppercase',
        },
        eventTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 8,
        },
        eventDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginBottom: 16,
        },
        detailItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        detailText: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        registerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
            paddingVertical: 10,
            borderRadius: 8,
            gap: 6,
        },
        registerText: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyText: {
            fontSize: 16,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
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
                    tintColor={isDark ? '#FFFFFF' : '#111827'}
                    colors={['#7C3AED']}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Events</Text>
                <Text style={styles.subtitle}>JOIN US</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'past' && styles.activeTab]}
                    onPress={() => setActiveTab('past')}
                >
                    <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
                </TouchableOpacity>
            </View>

            {error ? (
                <View style={[styles.eventCard, { borderColor: '#F59E0B' }]}>
                    <Text style={[styles.emptyText, { color: isDark ? '#FCD34D' : '#92400E' }]}>
                        {error}
                    </Text>
                </View>
            ) : null}

            {loading ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Loading events...</Text>
                </View>
            ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                    <Link key={getEventId(event)} href={`/event/${getEventId(event)}`} asChild>
                        <TouchableOpacity style={styles.eventCard}>
                            <View style={styles.eventImageContainer}>
                                <Text style={styles.eventEmoji}>{event.image || '📅'}</Text>
                            </View>
                            <View style={styles.eventContent}>
                                <Text style={styles.eventDate}>
                                    {new Date(event.date).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Text>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <View style={styles.eventDetails}>
                                    <View style={styles.detailItem}>
                                        <Clock size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                        <Text style={styles.detailText}>{event.time}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <MapPin size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                        <Text style={styles.detailText}>{event.location}</Text>
                                    </View>
                                </View>
                                <View style={styles.registerButton}>
                                    <Text style={styles.registerText}>View Details</Text>
                                    <ChevronRight size={16} color={isDark ? '#D1D5DB' : '#4B5563'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No {activeTab} events found.</Text>
                </View>
            )}
        </ScrollView>
    );
}
