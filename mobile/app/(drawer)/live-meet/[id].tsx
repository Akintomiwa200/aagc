import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Video as VideoIcon, Users, MessageSquare, Send, Heart, Gift, WifiOff, RefreshCw, Radio, ArrowLeft } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ChatMessage {
    id: string;
    user: string;
    text: string;
    time: string;
}

export default function StreamViewerScreen() {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { socket } = useSocket();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const chatScrollRef = useRef<ScrollView>(null);
    const videoRef = useRef<Video>(null);

    const [streamInfo, setStreamInfo] = useState<any>(null);
    const [isLive, setIsLive] = useState(false);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [viewerCount, setViewerCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStream = useCallback(async () => {
        try {
            setError(null);
            // Try fetching the specific stream, fall back to live stream
            let data = null;
            if (id && id !== 'live') {
                data = await apiService.get(`/livestream/${id}`).catch(() => null);
            }
            if (!data) {
                data = await apiService.getLiveStream();
            }
            setStreamInfo(data);
            setIsLive(data?.isLive || false);
        } catch (err) {
            console.error('Failed to fetch stream:', err);
            setError('Unable to load this stream.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchStream();
    }, [fetchStream]);

    // Socket.IO: join/leave room and listen for events
    useEffect(() => {
        if (!socket || !streamInfo?._id) return;

        const streamId = streamInfo._id;
        socket.emit('livestream-join', { streamId });

        const handleChatMessage = (msg: ChatMessage) => {
            setChatMessages(prev => [...prev, msg]);
        };
        const handleViewerCount = (data: { viewerCount: number }) => {
            setViewerCount(data.viewerCount);
        };
        const handleStreamUpdate = (stream: any) => {
            if (stream._id === streamId) {
                setStreamInfo(stream);
                setIsLive(stream.isLive);
            }
        };

        socket.on('livestream-chat-message', handleChatMessage);
        socket.on('livestream-viewer-count', handleViewerCount);
        socket.on('livestream-updated', handleStreamUpdate);

        return () => {
            socket.emit('livestream-leave', { streamId });
            socket.off('livestream-chat-message', handleChatMessage);
            socket.off('livestream-viewer-count', handleViewerCount);
            socket.off('livestream-updated', handleStreamUpdate);
        };
    }, [socket, streamInfo?._id]);

    // Auto-scroll chat
    useEffect(() => {
        setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (!message.trim() || !socket || !streamInfo?._id) return;
        socket.emit('livestream-chat', {
            streamId: streamInfo._id,
            message: message.trim(),
            userName: user?.name || 'Guest',
        });
        setMessage('');
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 16, color: colors.secondary, fontWeight: '600' }}>Connecting to Stream...</Text>
            </View>
        );
    }

    if (error || !streamInfo) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <WifiOff size={48} color={colors.secondary} opacity={0.5} />
                <Text style={{ color: colors.secondary, fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 24, lineHeight: 24 }}>
                    {error || 'Stream not found.'}
                </Text>
                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={18} color="#FFFFFF" />
                    <Text style={styles.retryText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            {/* Video Area */}
            <View style={styles.videoContainer}>
                {isLive && streamInfo.streamUrl ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: streamInfo.streamUrl }}
                        style={styles.videoPlayer}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                        isLooping={false}
                        useNativeControls
                    />
                ) : (
                    <LinearGradient
                        colors={isDark ? ['#1F2937', '#0F172A'] : ['#7C3AED', '#4F46E5']}
                        style={styles.videoPlaceholder}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.offlineIcon}>
                            <VideoIcon size={36} color="rgba(255,255,255,0.5)" />
                        </View>
                        <Text style={styles.offlineTitle}>{streamInfo.title}</Text>
                        <Text style={styles.offlineSubtitle}>
                            {streamInfo.scheduledStartTime
                                ? `Starts ${new Date(streamInfo.scheduledStartTime).toLocaleString()}`
                                : 'Stream is not live yet.'}
                        </Text>
                    </LinearGradient>
                )}

                {isLive && (
                    <>
                        <View style={styles.liveBadgePos}>
                            <View style={styles.liveBadge}>
                                <View style={styles.liveIndicator} />
                                <Text style={styles.liveBadgeText}>LIVE</Text>
                            </View>
                        </View>
                        <View style={styles.viewerBadge}>
                            <Users size={12} color="#FFFFFF" />
                            <Text style={styles.viewerText}>{viewerCount}</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Actions Bar */}
            <View style={[styles.actionsBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Heart size={18} color="#EF4444" />
                    <Text style={[styles.actionLabel, { color: colors.secondary }]}>Pray</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Gift size={18} color="#10B981" />
                    <Text style={[styles.actionLabel, { color: colors.secondary }]}>Give</Text>
                </TouchableOpacity>
                <View style={styles.actionBtn}>
                    <Radio size={18} color={isLive ? '#EF4444' : colors.border} />
                    <Text style={[styles.actionLabel, { color: isLive ? '#EF4444' : colors.secondary }]}>
                        {isLive ? 'Live Now' : 'Offline'}
                    </Text>
                </View>
            </View>

            {/* Stream Info */}
            <View style={[styles.infoBar, { borderColor: colors.border }]}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>{streamInfo.title}</Text>
                {streamInfo.speaker && (
                    <Text style={[styles.infoSpeaker, { color: colors.secondary }]}>with {streamInfo.speaker}</Text>
                )}
                {streamInfo.description && (
                    <Text style={[styles.infoDesc, { color: colors.secondary }]} numberOfLines={2}>{streamInfo.description}</Text>
                )}
            </View>

            {/* Chat */}
            <View style={styles.chatSection}>
                <View style={styles.chatHeader}>
                    <MessageSquare size={16} color={colors.primary} />
                    <Text style={[styles.chatTitle, { color: colors.text }]}>Live Chat</Text>
                    <Text style={[styles.chatCount, { color: colors.secondary }]}>{chatMessages.length}</Text>
                </View>
                <ScrollView ref={chatScrollRef} style={styles.chatList} showsVerticalScrollIndicator={false}>
                    {chatMessages.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                            <MessageSquare size={28} color={colors.border} />
                            <Text style={{ marginTop: 8, color: colors.secondary, fontWeight: '500', fontSize: 13 }}>
                                {isLive ? 'Be the first to say something!' : 'Chat activates when live.'}
                            </Text>
                        </View>
                    ) : (
                        chatMessages.map(msg => (
                            <View key={msg.id} style={styles.chatBubble}>
                                <Text style={[styles.chatUser, { color: colors.primary }]}>{msg.user}</Text>
                                <View style={[styles.chatTextBubble, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
                                    <Text style={[styles.chatText, { color: isDark ? '#D1D5DB' : '#374151' }]}>{msg.text}</Text>
                                </View>
                                <Text style={[styles.chatTime, { color: colors.secondary }]}>{msg.time}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>

            {/* Input */}
            <View style={[styles.inputArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                    style={[styles.textInput, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6', color: colors.text }]}
                    placeholder={isLive ? 'Type a message...' : 'Chat available when live'}
                    placeholderTextColor={colors.secondary}
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSendMessage}
                    returnKeyType="send"
                    editable={isLive}
                />
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: colors.primary, opacity: message.trim() && isLive ? 1 : 0.4 }]}
                    onPress={handleSendMessage}
                    disabled={!message.trim() || !isLive}
                >
                    <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    videoContainer: { width: '100%', height: width * 0.5625, backgroundColor: '#000', position: 'relative' },
    videoPlayer: { width: '100%', height: '100%' },
    videoPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    offlineIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    offlineTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
    offlineSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
    liveBadgePos: { position: 'absolute', top: 12, left: 12 },
    liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
    liveBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    viewerBadge: { position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    viewerText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
    actionsBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, borderBottomWidth: 1 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionLabel: { fontSize: 13, fontWeight: '700' },
    infoBar: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    infoTitle: { fontSize: 17, fontWeight: 'bold' },
    infoSpeaker: { fontSize: 14, fontWeight: '500', marginTop: 2 },
    infoDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },
    chatSection: { flex: 1, paddingHorizontal: 16 },
    chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
    chatTitle: { fontSize: 15, fontWeight: 'bold', flex: 1 },
    chatCount: { fontSize: 12, fontWeight: '600' },
    chatList: { flex: 1 },
    chatBubble: { marginBottom: 12, maxWidth: '88%' },
    chatUser: { fontSize: 12, fontWeight: 'bold', marginBottom: 3 },
    chatTextBubble: { padding: 10, borderRadius: 14, borderTopLeftRadius: 4 },
    chatText: { fontSize: 14, lineHeight: 19 },
    chatTime: { fontSize: 10, marginTop: 3, textAlign: 'right' },
    inputArea: { padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1 },
    textInput: { flex: 1, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15 },
    sendButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    retryButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
    retryText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
