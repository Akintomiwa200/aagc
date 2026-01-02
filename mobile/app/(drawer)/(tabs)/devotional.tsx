import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { apiService } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';

export default function DevotionalScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [devotional, setDevotional] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDevotional = async () => {
            try {
                const data = await apiService.getTodayDevotional();
                setDevotional(data);
            } catch (error) {
                console.error('Failed to fetch devotional:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevotional();
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
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 14,
            color: '#7C3AED',
            fontWeight: '600',
            marginBottom: 24,
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        devotionalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 16,
        },
        devotionalText: {
            fontSize: 16,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 24,
        },
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Today's Rhema</Text>
            <Text style={styles.subtitle}>DAILY DEVOTIONAL</Text>

            {loading ? (
                <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>Loading devotional...</Text>
            ) : devotional ? (
                <View style={styles.card}>
                    <Text style={styles.devotionalTitle}>{devotional.title}</Text>
                    <Text style={styles.devotionalText}>{devotional.content || devotional.body}</Text>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.devotionalTitle}>No Devotional Today</Text>
                    <Text style={styles.devotionalText}>Check back tomorrow for a new word.</Text>
                </View>
            )}
        </ScrollView>
    );
}
