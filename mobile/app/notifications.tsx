import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const isDark = theme === 'dark';
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (notification: any) => {
            if (notification.userId === user?.id || notification.userId === (user as any)?._id) {
                setNotifications(prev => [notification, ...prev]);
            }
        };

        socket.on('notification-created', handleNotification);

        return () => {
            socket.off('notification-created', handleNotification);
        };
    }, [socket, user]);

    const fetchNotifications = async () => {
        try {
            const data = await apiService.getNotifications(user?.id);
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id: string) => {
        try {
            await apiService.markNotificationRead(id);
            setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark read', error);
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
        item: {
            flexDirection: 'row',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        itemUnread: {
            borderColor: '#7C3AED',
            backgroundColor: isDark ? '#1F2937' : '#F5F3FF',
        },
        iconContainer: {
            marginRight: 16,
            justifyContent: 'center',
        },
        textContainer: {
            flex: 1,
        },
        message: {
            fontSize: 16,
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
            lineHeight: 22,
        },
        date: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        unreadDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#7C3AED',
            marginTop: 6,
            marginLeft: 8,
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
                <Text style={styles.title}>Notifications</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id || item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Bell size={48} color={isDark ? '#374151' : '#E5E7EB'} />
                            <Text style={styles.emptyText}>No notifications yet.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.item, !item.isRead && styles.itemUnread]}
                            onPress={() => handleRead(item.id || item._id)}
                        >
                            <View style={styles.iconContainer}>
                                <Bell size={24} color={!item.isRead ? '#7C3AED' : (isDark ? '#9CA3AF' : '#6B7280')} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.message, !item.isRead && { fontWeight: '600' }]}>{item.message}</Text>
                                <Text style={styles.date}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</Text>
                            </View>
                            {!item.isRead && <View style={styles.unreadDot} />}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
