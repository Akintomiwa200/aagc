import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, MapPin, Clock, Share2, Info } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/apiService';

export default function EventDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const data = await apiService.getEvent(Array.isArray(id) ? id[0] : id);
                setEvent(data);
            } catch (error) {
                console.error('Failed to fetch event:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        imageContainer: {
            height: 250,
            backgroundColor: '#7C3AED20',
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageEmoji: {
            fontSize: 80,
        },
        content: {
            padding: 20,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: -20,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 16,
        },
        badge: {
            alignSelf: 'flex-start',
            backgroundColor: '#7C3AED20',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 16,
        },
        badgeText: {
            color: '#7C3AED',
            fontWeight: '600',
            fontSize: 12,
        },
        metaContainer: {
            gap: 16,
            marginBottom: 24,
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        metaText: {
            fontSize: 16,
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 12,
            marginTop: 8,
        },
        description: {
            fontSize: 16,
            color: isDark ? '#9CA3AF' : '#6B7280',
            lineHeight: 24,
            marginBottom: 32,
        },
        registerButton: {
            backgroundColor: '#7C3AED',
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 16,
        },
        registerButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
        secondaryButton: {
            backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
        },
        secondaryButtonText: {
            color: isDark ? '#FFFFFF' : '#111827',
            fontSize: 16,
            fontWeight: '600',
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Info size={48} color={isDark ? '#4B5563' : '#9CA3AF'} />
                <Text style={{ marginTop: 16, color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 16 }}>
                    Event not found.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Text style={styles.imageEmoji}>📅</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{event.type || 'EVENT'}</Text>
                </View>

                <Text style={styles.title}>{event.title}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Calendar size={20} color="#7C3AED" />
                        <Text style={styles.metaText}>
                            {new Date(event.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Clock size={20} color="#7C3AED" />
                        <Text style={styles.metaText}>
                            {new Date(event.date).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <MapPin size={20} color="#7C3AED" />
                        <Text style={styles.metaText}>{event.location || 'Online / TBA'}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>
                    {event.description || 'No description available for this event.'}
                </Text>

                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Register Now</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton}>
                    <Share2 size={20} color={isDark ? '#FFFFFF' : '#111827'} />
                    <Text style={styles.secondaryButtonText}>Share Event</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
