import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { Video, Users, MessageSquare, Send, Heart, Gift } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

const { width } = Dimensions.get('window');

export default function LiveMeetScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isLive, setIsLive] = useState(false);
    const [streamInfo, setStreamInfo] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'System', text: 'Welcome to the live chat!', time: '10:00 AM' },
    ]);

    React.useEffect(() => {
        const fetchStream = async () => {
            try {
                const data = await apiService.getLiveStream();
                setStreamInfo(data);
                setIsLive(data?.isLive || false);
            } catch (error) {
                console.log('Failed to fetch live stream info', error);
            }
        };
        fetchStream();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        header: {
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        liveBadge: {
            backgroundColor: '#EF4444',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        liveBadgeText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
        },
        videoPlaceholder: {
            width: '100%',
            height: width * 0.56, // 16:9 Aspect Ratio
            backgroundColor: '#000000',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        playIconWrapper: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#7C3AED',
            justifyContent: 'center',
            alignItems: 'center',
        },
        viewerCount: {
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        viewerCountText: {
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
        },
        content: {
            flex: 1,
        },
        serviceInfo: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        serviceTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
        },
        serviceSubtitle: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        chatSection: {
            flex: 1,
            padding: 16,
        },
        chatHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
        },
        chatTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        chatList: {
            flex: 1,
        },
        chatBubble: {
            marginBottom: 16,
            maxWidth: '85%',
        },
        chatUser: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#7C3AED',
            marginBottom: 2,
        },
        chatText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#4B5563',
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            padding: 12,
            borderRadius: 16,
            borderTopLeftRadius: 4,
        },
        chatTime: {
            fontSize: 10,
            color: isDark ? '#6B7280' : '#9CA3AF',
            marginTop: 4,
            textAlign: 'right',
        },
        inputArea: {
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        textInput: {
            flex: 1,
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 10,
            color: isDark ? '#FFFFFF' : '#111827',
        },
        sendButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#7C3AED',
            justifyContent: 'center',
            alignItems: 'center',
        },
        quickActions: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        actionText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
    });

    const handleSendMessage = () => {
        if (!message.trim()) return;
        const newMessage = {
            id: Date.now(),
            user: 'You',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages([...chatMessages, newMessage]);
        setMessage('');
    };

    return (
        <View style={styles.container}>
            {/* Video Player Placeholder */}
            <View style={styles.videoPlaceholder}>
                <View style={styles.playIconWrapper}>
                    <Video size={32} color="#FFFFFF" />
                </View>
                {isLive && (
                    <>
                        <View style={{ position: 'absolute', top: 12, left: 12 }}>
                            <View style={styles.liveBadge}>
                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
                                <Text style={styles.liveBadgeText}>LIVE</Text>
                            </View>
                        </View>
                        <View style={styles.viewerCount}>
                            <Users size={12} color="#FFFFFF" />
                            <Text style={styles.viewerCountText}>{streamInfo?.viewerCount || 0}</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Heart size={18} color="#EF4444" />
                    <Text style={styles.actionText}>Pray</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Gift size={18} color="#10B981" />
                    <Text style={styles.actionText}>Give</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Users size={18} color="#3B82F6" />
                    <Text style={styles.actionText}>Connect</Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.content}>
                <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{streamInfo?.title || 'No Live Service'}</Text>
                    <Text style={styles.serviceSubtitle}>{streamInfo?.description || 'Check back later for upcoming services.'}</Text>
                </View>

                {/* Chat Section */}
                <View style={styles.chatSection}>
                    <View style={styles.chatHeader}>
                        <MessageSquare size={18} color="#7C3AED" />
                        <Text style={styles.chatTitle}>Live Chat</Text>
                    </View>
                    <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
                        {chatMessages.map((msg) => (
                            <View key={msg.id} style={styles.chatBubble}>
                                <Text style={styles.chatUser}>{msg.user}</Text>
                                <View style={styles.chatText}>
                                    <Text style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>{msg.text}</Text>
                                </View>
                                <Text style={styles.chatTime}>{msg.time}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Input Area */}
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Say something..."
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
