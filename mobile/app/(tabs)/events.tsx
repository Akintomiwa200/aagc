import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { apiService } from '../../services/apiService';
import { Link } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function EventsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [events, setEvents] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await apiService.getEvents();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        content: {
            padding: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 16,
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        eventTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 8,
        },
        eventDate: {
            fontSize: 14,
            color: '#7C3AED',
            fontWeight: '600',
        },
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Upcoming Events</Text>
            {loading ? (
                <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>Loading events...</Text>
            ) : (
                events.map((event) => (
                    <Link key={event.id} href={`/event/${event.id}`} asChild>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <Text style={styles.eventDate}>
                                {new Date(event.date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                ))
            )}
        </ScrollView>
    );
}
