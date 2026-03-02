import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl,
} from 'react-native';
import { Check, X, WifiOff, RefreshCw, UserCheck, Inbox } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import { toast } from 'sonner-native';

export default function FriendRequestsScreen() {
    const { colors, isDark } = useTheme();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [respondingId, setRespondingId] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        try {
            setError(null);
            const data = await apiService.getFriendRequests();
            setRequests(Array.isArray(data) ? data : []);
        } catch {
            setError('Unable to load friend requests. Please check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const onRefresh = () => { setRefreshing(true); fetchRequests(); };

    const handleRespond = async (id: string, status: 'accepted' | 'rejected', name: string) => {
        setRespondingId(id);
        try {
            await apiService.respondToFriendRequest(id, status);
            setRequests(prev => prev.filter(req => (req._id || req.id) !== id));
            toast.success(
                status === 'accepted'
                    ? `You and ${name} are now friends.`
                    : `You declined ${name}'s request.`,
            );
        } catch {
            toast.error('Could not process this request right now. Please try again.');
        } finally {
            setRespondingId(null);
        }
    };

    // Full-screen error
    if (error && requests.length === 0 && !loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <WifiOff size={48} color={colors.secondary} style={{ opacity: 0.5 }} />
                <Text style={[styles.errorText, { color: colors.secondary }]}>{error}</Text>
                <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => { setLoading(true); fetchRequests(); }}>
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
                <UserCheck size={22} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>Friend Requests</Text>
                {requests.length > 0 && (
                    <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.countText}>{requests.length}</Text>
                    </View>
                )}
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 12, color: colors.secondary, fontWeight: '600' }}>Loading Requests...</Text>
                </View>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item._id || item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Inbox size={48} color={colors.border} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
                            <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
                                No pending friend requests right now.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const itemId = item._id || item.id;
                        const name = item.user?.name || item.name || 'Unknown';
                        const isResponding = respondingId === itemId;
                        return (
                            <View style={[styles.requestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                                    <Text style={[styles.subtitle, { color: colors.secondary }]}>Wants to connect with you</Text>
                                </View>
                                {isResponding ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <View style={styles.actions}>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, styles.rejectBtn]}
                                            onPress={() => handleRespond(itemId, 'rejected', name)}
                                        >
                                            <X size={18} color="#FFFFFF" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, styles.acceptBtn]}
                                            onPress={() => handleRespond(itemId, 'accepted', name)}
                                        >
                                            <Check size={18} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderBottomWidth: 1 },
    title: { fontSize: 22, fontWeight: '900', flex: 1 },
    countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    countText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
    listContent: { padding: 16 },
    requestCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, marginBottom: 10, borderWidth: 1, gap: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700' },
    subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    acceptBtn: { backgroundColor: '#10B981' },
    rejectBtn: { backgroundColor: '#EF4444' },
    emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold' },
    emptySubtitle: { fontSize: 14, textAlign: 'center' },
    errorText: { fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 24, lineHeight: 24 },
    retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
    retryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
