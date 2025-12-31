import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

export default function FriendRequestsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await apiService.getFriendRequests();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (id: string, status: 'accepted' | 'rejected') => {
        try {
            await apiService.respondToFriendRequest(id, status);
            setRequests(prev => prev.filter(req => req.id !== id));
            Alert.alert('Success', `Friend request ${status}.`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update request.');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        header: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        listContent: {
            padding: 16,
        },
        requestItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#7C3AED',
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 'bold',
        },
        info: {
            flex: 1,
            marginLeft: 12,
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        mutuals: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
        },
        actionButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        acceptButton: {
            backgroundColor: '#10B981',
        },
        rejectButton: {
            backgroundColor: '#EF4444',
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 40,
        },
        emptyText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Friend Requests</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No pending friend requests.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.requestItem}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.user?.name?.charAt(0) || '?'}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.user?.name || 'Unknown User'}</Text>
                                <Text style={styles.mutuals}>Wants to be your friend</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => handleRespond(item.id, 'rejected')}
                                >
                                    <X size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.acceptButton]}
                                    onPress={() => handleRespond(item.id, 'accepted')}
                                >
                                    <Check size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
