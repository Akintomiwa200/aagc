import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Plus, X, Send } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';

export default function PrayersScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [prayers, setPrayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPrayer, setNewPrayer] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchPrayers = useCallback(async () => {
        try {
            const data = await apiService.getPrayers();
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

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handlePrayerCreated = (data: any) => {
            setPrayers(prev => [data.prayer, ...prev]);
        };

        const handlePrayerUpdated = (data: any) => {
            setPrayers(prev => prev.map(p => p.id === data.prayer.id || p._id === data.prayer._id ? data.prayer : p));
        };

        const handlePrayerDeleted = (data: any) => {
            setPrayers(prev => prev.filter(p => p.id !== data.prayerId && p._id !== data.prayerId));
        };

        socket.on('prayer-created', handlePrayerCreated);
        socket.on('prayer-updated', handlePrayerUpdated);
        socket.on('prayer-deleted', handlePrayerDeleted);

        return () => {
            socket.off('prayer-created', handlePrayerCreated);
            socket.off('prayer-updated', handlePrayerUpdated);
            socket.off('prayer-deleted', handlePrayerDeleted);
        };
    }, [socket]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPrayers();
        setRefreshing(false);
    }, [fetchPrayers]);

    const handleCreatePrayer = async () => {
        if (!newPrayer.title.trim() || !newPrayer.description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            await apiService.createPrayer(newPrayer.title, newPrayer.description, true);
            setNewPrayer({ title: '', description: '' });
            setModalVisible(false);
            Alert.alert('Success', 'Prayer request submitted');
            fetchPrayers();
        } catch (error) {
            console.error('Failed to create prayer:', error);
            Alert.alert('Error', 'Failed to submit prayer request');
        } finally {
            setSubmitting(false);
        }
    };

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
        fab: {
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#7C3AED',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            paddingBottom: 40,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        inputContainer: {
            marginBottom: 20,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 8,
        },
        input: {
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            borderRadius: 12,
            padding: 16,
            color: isDark ? '#FFFFFF' : '#111827',
            fontSize: 16,
        },
        textArea: {
            height: 120,
            textAlignVertical: 'top',
        },
        submitButton: {
            backgroundColor: '#7C3AED',
            borderRadius: 16,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        submitButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
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
                        <View key={prayer.id || prayer._id} style={styles.card}>
                            <Text style={styles.cardTitle}>{prayer.title}</Text>
                            <Text style={styles.cardText}>{prayer.description}</Text>
                            <View style={styles.metaContainer}>
                                <Text style={styles.author}>{prayer.authorName || 'Anonymous'}</Text>
                                <Text style={styles.date}>
                                    {new Date(prayer.created_at || prayer.createdAt).toLocaleDateString()}
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

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Plus size={24} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>

            {/* Create Prayer Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Prayer Request</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={isDark ? '#FFFFFF' : '#111827'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Healing for my family"
                                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                value={newPrayer.title}
                                onChangeText={(text) => setNewPrayer(prev => ({ ...prev, title: text }))}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Your Request</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Share your prayer request..."
                                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                value={newPrayer.description}
                                onChangeText={(text) => setNewPrayer(prev => ({ ...prev, description: text }))}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                            onPress={handleCreatePrayer}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Send size={20} color="#FFFFFF" />
                                    <Text style={styles.submitButtonText}>Post Request</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
