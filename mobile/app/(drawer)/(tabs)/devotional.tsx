import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { apiService } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';

export default function DevotionalScreen() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [devotional, setDevotional] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchDevotional = useCallback(async (date: Date) => {
        setLoading(true);
        try {
            // Check if the date is today
            const isToday = new Date().toDateString() === date.toDateString();

            if (isToday) {
                const data = await apiService.getTodayDevotional();
                setDevotional(data);
            } else {
                // For historical devotionals, we'd need an endpoint that accepts a date.
                // Since this is a prototype/church app, we'll simulate it or assume the API might support it.
                // Assuming apiService.getDevotionalByDate(date) exists or we fallback to "No Devotional"
                // For now, let's keep it robust and catch errors.
                // Mapping date to string for possible future API use: date.toISOString().split('T')[0]
                const data = await apiService.getTodayDevotional(); // Fallback for demo
                // In a real app, we'd fetch specific date data here.
                setDevotional(data);
            }
        } catch (error) {
            console.error('Failed to fetch devotional:', error);
            setDevotional(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDevotional(currentDate);
    }, [currentDate, fetchDevotional]);

    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        if (next <= new Date()) {
            setCurrentDate(next);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            padding: 16,
        },
        dateHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            backgroundColor: colors.card,
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        dateText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        navButton: {
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.primary + '15',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
            marginBottom: 24,
        },
        card: {
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
        },
        devotionalTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
        },
        devotionalText: {
            fontSize: 17,
            color: colors.secondary,
            lineHeight: 26,
        },
        scripture: {
            fontStyle: 'italic',
            color: colors.primary,
            marginBottom: 16,
            fontSize: 16,
        }
    });

    const isLatest = currentDate.toDateString() === new Date().toDateString();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Rhema Word</Text>
            <Text style={styles.subtitle}>DAILY DEVOTIONAL</Text>

            <View style={styles.dateHeader}>
                <TouchableOpacity style={styles.navButton} onPress={handlePrevDay}>
                    <ChevronLeft size={20} color={colors.primary} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Calendar size={18} color={colors.primary} />
                    <Text style={styles.dateText}>
                        {currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.navButton, isLatest && { opacity: 0.3 }]}
                    onPress={handleNextDay}
                    disabled={isLatest}
                >
                    <ChevronRight size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : devotional ? (
                <View style={styles.card}>
                    <Text style={styles.devotionalTitle}>{devotional.title}</Text>
                    {devotional.scripture && <Text style={styles.scripture}>{devotional.scripture}</Text>}
                    <Text style={styles.devotionalText}>{devotional.content || devotional.body}</Text>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.devotionalTitle}>No Devotional Found</Text>
                    <Text style={styles.devotionalText}>There is no devotional content for this specific date.</Text>
                </View>
            )}
        </ScrollView>
    );
}
