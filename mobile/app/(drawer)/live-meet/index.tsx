import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Image,
} from 'react-native';
import { Radio, Clock, Users, ChevronRight, WifiOff, RefreshCw, Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function StreamsListScreen() {
    const { colors, isDark } = useTheme();
    const { socket } = useSocket();
    const router = useRouter();

    const [streams, setStreams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStreams = useCallback(async () => {
        try {
            setError(null);
            const data = await apiService.get('/livestream/all');
            setStreams(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch streams:', err);
            setError('Unable to load streams. Please check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStreams();
    }, [fetchStreams]);

    // Listen for real-time stream updates
    useEffect(() => {
        if (!socket) return;

        const handleStreamUpdate = (stream: any) => {
            setStreams(prev => {
                const index = prev.findIndex(s => s._id === stream._id);
                if (index >= 0) {
                    const updated = [...prev];
                    updated[index] = stream;
                    return updated;
                }
                return [stream, ...prev];
            });
        };

        socket.on('livestream-updated', handleStreamUpdate);
        return () => { socket.off('livestream-updated', handleStreamUpdate); };
    }, [socket]);

    const liveStreams = streams.filter(s => s.isLive);
    const upcomingStreams = streams.filter(s => !s.isLive && s.scheduledStartTime && new Date(s.scheduledStartTime) > new Date());
    const pastStreams = streams.filter(s => !s.isLive && (!s.scheduledStartTime || new Date(s.scheduledStartTime) <= new Date()));

    const onRefresh = () => {
        setRefreshing(true);
        fetchStreams();
    };

    const navigateToStream = (stream: any) => {
        router.push(`/(drawer)/live-meet/${stream._id}` as any);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 16, color: colors.secondary, fontWeight: '600' }}>Loading Streams...</Text>
            </View>
        );
    }

    if (error && streams.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <WifiOff size={48} color={colors.secondary} opacity={0.5} />
                <Text style={{ color: colors.secondary, fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 24, lineHeight: 24 }}>
                    {error}
                </Text>
                <TouchableOpacity
                    style={[styles.retryBtn, { backgroundColor: colors.primary }]}
                    onPress={() => { setLoading(true); fetchStreams(); }}
                >
                    <RefreshCw size={18} color="#FFFFFF" />
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderStreamCard = (stream: any, isLive: boolean) => (
        <TouchableOpacity
            key={stream._id}
            style={[styles.streamCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigateToStream(stream)}
            activeOpacity={0.7}
        >
            {/* Thumbnail / Gradient */}
            <View style={styles.cardThumbnail}>
                {stream.thumbnailUrl ? (
                    <Image source={{ uri: stream.thumbnailUrl }} style={styles.thumbnailImage} />
                ) : (
                    <LinearGradient
                        colors={isLive ? ['#EF4444', '#DC2626'] : isDark ? ['#1F2937', '#374151'] : ['#7C3AED', '#6366F1']}
                        style={styles.thumbnailGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Radio size={28} color="rgba(255,255,255,0.6)" />
                    </LinearGradient>
                )}
                {isLive && (
                    <View style={styles.liveTag}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveTagText}>LIVE</Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {stream.title}
                </Text>
                {stream.speaker && (
                    <Text style={[styles.cardSpeaker, { color: colors.secondary }]}>
                        with {stream.speaker}
                    </Text>
                )}
                <View style={styles.cardMeta}>
                    {isLive ? (
                        <View style={styles.metaItem}>
                            <Users size={13} color="#EF4444" />
                            <Text style={[styles.metaText, { color: '#EF4444' }]}>
                                {stream.viewerCount || 0} watching
                            </Text>
                        </View>
                    ) : stream.scheduledStartTime ? (
                        <View style={styles.metaItem}>
                            <Clock size={13} color={colors.secondary} />
                            <Text style={[styles.metaText, { color: colors.secondary }]}>
                                {new Date(stream.scheduledStartTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                {' · '}
                                {new Date(stream.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            <ChevronRight size={20} color={colors.border} style={{ alignSelf: 'center' }} />
        </TouchableOpacity>
    );

    const hasContent = liveStreams.length > 0 || upcomingStreams.length > 0 || pastStreams.length > 0;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
        >
            {/* Hero Banner */}
            <LinearGradient
                colors={isDark ? ['#1F2937', '#111827'] : ['#7C3AED', '#6366F1']}
                style={styles.heroBanner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.heroDecor1} />
                <View style={styles.heroDecor2} />
                <Radio size={32} color="rgba(255,255,255,0.3)" />
                <Text style={styles.heroTitle}>Live Streams</Text>
                <Text style={styles.heroSubtitle}>
                    {liveStreams.length > 0
                        ? `${liveStreams.length} stream${liveStreams.length > 1 ? 's' : ''} live now`
                        : 'Join the next service live'}
                </Text>
            </LinearGradient>

            {!hasContent ? (
                <View style={styles.emptyState}>
                    <Calendar size={48} color={colors.border} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>No Streams Yet</Text>
                    <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
                        Upcoming services and events will appear here.{'\n'}Pull down to refresh.
                    </Text>
                </View>
            ) : (
                <View style={styles.listContent}>
                    {/* Live Now Section */}
                    {liveStreams.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionDot, { backgroundColor: '#EF4444' }]} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Now</Text>
                            </View>
                            {liveStreams.map(s => renderStreamCard(s, true))}
                        </View>
                    )}

                    {/* Upcoming Section */}
                    {upcomingStreams.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionDot, { backgroundColor: '#F59E0B' }]} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
                            </View>
                            {upcomingStreams.map(s => renderStreamCard(s, false))}
                        </View>
                    )}

                    {/* Past Streams Section */}
                    {pastStreams.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionDot, { backgroundColor: colors.border }]} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Past</Text>
                            </View>
                            {pastStreams.map(s => renderStreamCard(s, false))}
                        </View>
                    )}
                </View>
            )}

            <View style={{ height: 80 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroBanner: {
        paddingVertical: 36,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
        gap: 8,
    },
    heroDecor1: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    heroDecor2: {
        position: 'absolute',
        bottom: -20,
        left: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    streamCard: {
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 10,
        paddingRight: 12,
    },
    cardThumbnail: {
        width: 100,
        height: 90,
        position: 'relative',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    thumbnailGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveTag: {
        position: 'absolute',
        top: 6,
        left: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    liveTagText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    cardInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    cardSpeaker: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 6,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
