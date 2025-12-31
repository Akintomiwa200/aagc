import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/apiService';

export default function PrayersScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [prayers, setPrayers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPrayers = async () => {
            try {
                const data = await apiService.getPrayers();
                setPrayers(data);
            } catch (error) {
                console.error('Failed to fetch prayers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrayers();
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
        prayerTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 8,
        },
        prayerText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#6B7280',
            marginBottom: 8,
        },
        prayerCount: {
            fontSize: 12,
            color: '#7C3AED',
            fontWeight: '600',
        },
        addButton: {
            backgroundColor: '#7C3AED',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            marginTop: 8,
        },
        addButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Prayer Requests</Text>

            {loading ? (
                <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>Loading prayers...</Text>
            ) : prayers.length > 0 ? (
                prayers.map((prayer) => (
                    <View key={prayer.id} style={styles.card}>
                        <Text style={styles.prayerTitle}>{prayer.title || prayer.name}</Text>
                        <Text style={styles.prayerText}>{prayer.text || prayer.request}</Text>
                        <Text style={styles.prayerCount}>{prayer.count || 0} people praying</Text>
                    </View>
                ))
            ) : (
                <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontStyle: 'italic', marginBottom: 20 }}>
                    No active prayer requests. Be the first to add one!
                </Text>
            )}

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Submit Prayer Request</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
