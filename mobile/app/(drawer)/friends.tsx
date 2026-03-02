import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
    ActivityIndicator, RefreshControl,
} from 'react-native';
import { Search, UserPlus, MessageSquare, WifiOff, RefreshCw, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner-native';

export default function FriendsScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { socket } = useSocket();

    const [friends, setFriends] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sendingId, setSendingId] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        try {
            setError(null);
            const [friendsData, suggestionsData] = await Promise.all([
                apiService.getFriends().catch(() => []),
                apiService.getSuggestedFriends().catch(() => []),
            ]);
            setFriends(Array.isArray(friendsData) ? friendsData : []);
            setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
        } catch (err) {
            setError('Unable to load your friends. Please check your connection and try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const onRefresh = () => { setRefreshing(true); fetchAll(); };

    // Socket listeners
    useEffect(() => {
        if (!socket) return;
        const handleUpdated = (member: any) => {
            setFriends(prev => prev.map(f => (f._id || f.id) === (member._id || member.id) ? { ...f, ...member } : f));
        };
        const handleDeleted = (data: any) => {
            setFriends(prev => prev.filter(f => (f._id || f.id) !== data.userId));
        };
        socket.on('member-updated', handleUpdated);
        socket.on('member-deleted', handleDeleted);
        return () => { socket.off('member-updated', handleUpdated); socket.off('member-deleted', handleDeleted); };
    }, [socket]);

    const handleSendRequest = async (item: any) => {
        const itemId = item._id || item.id;
        setSendingId(itemId);
        try {
            await apiService.sendFriendRequest(itemId);
            setSuggestions(prev => prev.filter(s => (s._id || s.id) !== itemId));
            toast.success(`Friend request sent to ${item.name}!`);
        } catch {
            toast.error('Could not send the friend request right now. Please try again later.');
        } finally {
            setSendingId(null);
        }
    };

    const filteredFriends = friends.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Full-screen error state
    if (error && friends.length === 0 && !loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <WifiOff size={48} color={colors.secondary} style={{ opacity: 0.5 }} />
                <Text style={[styles.errorText, { color: colors.secondary }]}>{error}</Text>
                <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => { setLoading(true); fetchAll(); }}>
                    <RefreshCw size={18} color="#FFF" />
                    <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Friends</Text>
                <TouchableOpacity
                    onPress={() => router.push('/friend-requests')}
                    style={[styles.requestsBadge, { backgroundColor: colors.primary + '15' }]}
                >
                    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Requests</Text>
                    <View style={styles.redDot} />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={[styles.searchWrap, { backgroundColor: colors.card }]}>
                <View style={[styles.searchBar, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
                    <Search size={18} color={colors.secondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search friends..."
                        placeholderTextColor={colors.secondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 12, color: colors.secondary, fontWeight: '600' }}>Loading Friends...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredFriends}
                    keyExtractor={(item) => item._id || item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Users size={48} color={colors.border} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Friends Yet</Text>
                            <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
                                Start connecting with your church community!
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={[styles.friendCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.avatarText}>{item.name?.charAt(0) || '?'}</Text>
                            </View>
                            <View style={styles.friendInfo}>
                                <Text style={[styles.friendName, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.friendStatus, { color: colors.secondary }]}>{item.status || 'Member'}</Text>
                            </View>
                            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                                <MessageSquare size={18} color={colors.secondary} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListFooterComponent={
                        suggestions.length > 0 ? (
                            <View style={{ marginTop: 24, marginBottom: 100 }}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>People You May Know</Text>
                                {suggestions.map(item => {
                                    const itemId = item._id || item.id;
                                    return (
                                        <View key={itemId} style={[styles.friendCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                            <View style={[styles.avatar, { backgroundColor: '#6366F1' }]}>
                                                <Text style={styles.avatarText}>{item.name?.charAt(0) || '?'}</Text>
                                            </View>
                                            <View style={styles.friendInfo}>
                                                <Text style={[styles.friendName, { color: colors.text }]}>{item.name}</Text>
                                                <Text style={[styles.friendStatus, { color: colors.secondary }]}>Suggested</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.addBtn, { backgroundColor: colors.primary + '15' }]}
                                                onPress={() => handleSendRequest(item)}
                                                disabled={sendingId === itemId}
                                            >
                                                {sendingId === itemId ? (
                                                    <ActivityIndicator size="small" color={colors.primary} />
                                                ) : (
                                                    <UserPlus size={18} color={colors.primary} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : <View style={{ height: 100 }} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    title: { fontSize: 24, fontWeight: '900' },
    requestsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    redDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
    searchWrap: { paddingHorizontal: 16, paddingVertical: 12 },
    searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
    searchInput: { flex: 1, fontSize: 15 },
    listContent: { paddingHorizontal: 16, paddingTop: 8 },
    friendCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, marginBottom: 10, borderWidth: 1, gap: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    friendInfo: { flex: 1 },
    friendName: { fontSize: 16, fontWeight: '700' },
    friendStatus: { fontSize: 13, fontWeight: '500', marginTop: 2 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    addBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 12 },
    emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold' },
    emptySubtitle: { fontSize: 14, textAlign: 'center' },
    errorText: { fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 24, lineHeight: 24 },
    retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
    retryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
