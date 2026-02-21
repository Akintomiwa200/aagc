import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
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
    const [newPrayer, setNewPrayer] = useState({ name: '', request: '' });
    const [submitting, setSubmitting] = useState(false);

    const { socket } = useSocket();

    const fetchPrayers = useCallback(async () => {
        try {
            const data = await apiService.getPrayers();
            setPrayers(data || []);
        } catch {
            // Error handled by refreshing state or showing empty list
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrayers();
    }, [fetchPrayers]);

    useEffect(() => {
        if (!socket) return;

        const onCreated = (data: any) => {
            setPrayers(prev => [data.prayer, ...prev]);
        };

        const onUpdated = (data: any) => {
            setPrayers(prev =>
                prev.map(p =>
                    (p.id || p._id) === (data.prayer.id || data.prayer._id)
                        ? data.prayer
                        : p
                )
            );
        };

        const onDeleted = (data: any) => {
            setPrayers(prev =>
                prev.filter(p => (p.id || p._id) !== data.prayerId)
            );
        };

        socket.on('prayer-created', onCreated);
        socket.on('prayer-updated', onUpdated);
        socket.on('prayer-deleted', onDeleted);

        return () => {
            socket.off('prayer-created', onCreated);
            socket.off('prayer-updated', onUpdated);
            socket.off('prayer-deleted', onDeleted);
        };
    }, [socket]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPrayers();
        setRefreshing(false);
    };

    const handleCreatePrayer = async () => {
        if (!newPrayer.name.trim() || !newPrayer.request.trim()) {
            Alert.alert('Fields Required', 'Please fill in both your name and prayer request.');
            return;
        }

        setSubmitting(true);
        try {
            await apiService.createPrayer({
                name: newPrayer.name,
                request: newPrayer.request,
                isAnonymous: false
            });
            setNewPrayer({ name: '', request: '' });
            setModalVisible(false);
            Alert.alert('Success', 'Your prayer request has been submitted.');
        } catch {
            Alert.alert('Oops', 'Could not submit your prayer right now. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000' : '#F9FAFB',
        },
        content: {
            padding: 16,
            paddingBottom: 120,
        },
        header: {
            marginBottom: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFF' : '#111827',
        },
        subtitle: {
            fontSize: 14,
            color: '#7C3AED',
            fontWeight: '600',
            letterSpacing: 1,
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : '#FFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFF' : '#111827',
            marginBottom: 8,
        },
        cardText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#4B5563',
            marginBottom: 12,
        },
        meta: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        metaText: {
            fontSize: 12,
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
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: isDark ? '#111827' : '#FFF',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#FFF' : '#111827',
        },
        input: {
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            borderRadius: 12,
            padding: 16,
            color: isDark ? '#FFF' : '#111827',
            marginBottom: 16,
        },
        textarea: {
            height: 120,
            textAlignVertical: 'top',
        },
        submitButton: {
            backgroundColor: '#7C3AED',
            borderRadius: 16,
            padding: 18,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        submitText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 8,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#7C3AED']}
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Prayer Wall</Text>
                    <Text style={styles.subtitle}>LIFT UP ONE ANOTHER</Text>
                </View>

                {loading ? (
                    <ActivityIndicator color="#7C3AED" />
                ) : prayers.length ? (
                    prayers.map(prayer => (
                        <View key={prayer.id || prayer._id} style={styles.card}>
                            <Text style={styles.cardTitle}>{prayer.name}</Text>
                            <Text style={styles.cardText}>{prayer.request}</Text>
                            <View style={styles.meta}>
                                <Text style={styles.metaText}>
                                    {prayer.authorName || 'Anonymous'}
                                </Text>
                                <Text style={styles.metaText}>
                                    {new Date(
                                        prayer.created_at || prayer.createdAt
                                    ).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.metaText}>No prayer requests yet.</Text>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Plus size={24} color="#FFF" />
            </TouchableOpacity>

            <Modal transparent animationType="slide" visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Prayer Request</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Your Name (or Topic)"
                            value={newPrayer.name}
                            onChangeText={t => setNewPrayer(p => ({ ...p, name: t }))}
                        />

                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="Your prayer request..."
                            multiline
                            value={newPrayer.request}
                            onChangeText={t =>
                                setNewPrayer(p => ({ ...p, request: t }))
                            }
                        />

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleCreatePrayer}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Send size={18} color="#FFF" />
                                    <Text style={styles.submitText}>Post Request</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
