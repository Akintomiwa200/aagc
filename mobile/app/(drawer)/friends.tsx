import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Search, UserPlus, MoreVertical, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';

export default function FriendsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const data = await apiService.getFriends();
            setFriends(data);
        } catch (error) {
            console.error('Failed to fetch friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleMemberCreated = (member: any) => {
            // This might not be a friend yet, but depends on logic
            // For now, let's just refresh if needed or ignore
        };

        const handleMemberUpdated = (member: any) => {
            setFriends(prev => prev.map(f => f.id === member.id || f._id === member._id ? { ...f, ...member } : f));
        };

        const handleMemberDeleted = (data: any) => {
            setFriends(prev => prev.filter(f => f.id !== data.userId && f._id !== data.userId));
        };

        socket.on('member-created', handleMemberCreated);
        socket.on('member-updated', handleMemberUpdated);
        socket.on('member-deleted', handleMemberDeleted);

        return () => {
            socket.off('member-created', handleMemberCreated);
            socket.off('member-updated', handleMemberUpdated);
            socket.off('member-deleted', handleMemberDeleted);
        };
    }, [socket]);

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        searchContainer: {
            padding: 16,
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },
        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 16,
            color: isDark ? '#FFFFFF' : '#111827',
        },
        listContent: {
            padding: 16,
        },
        friendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 12,
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
        friendInfo: {
            flex: 1,
            marginLeft: 12,
        },
        friendName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        friendStatus: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        actions: {
            flexDirection: 'row',
            gap: 8,
        },
        iconButton: {
            padding: 8,
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
            borderRadius: 20,
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
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 40,
        },
        emptyText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 8,
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Friends</Text>
                <TouchableOpacity onPress={() => router.push('/friend-requests')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#7C3AED', fontWeight: '600', marginRight: 4 }}>Requests</Text>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search friends..."
                        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredFriends}
                    keyExtractor={(item) => item.id || item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No friends found. connect with people!</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.friendItem}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.friendInfo}>
                                <Text style={styles.friendName}>{item.name}</Text>
                                <Text style={styles.friendStatus}>{item.status || 'Online'}</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.iconButton}>
                                    <MessageSquare size={20} color={isDark ? '#D1D5DB' : '#4B5563'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton}>
                                    <MoreVertical size={20} color={isDark ? '#D1D5DB' : '#4B5563'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.fab}>
                <UserPlus size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}
