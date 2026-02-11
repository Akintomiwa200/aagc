import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { X, Send, Sparkles, User, Bot } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { askChurchAi } from '../services/geminiService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface GlobalAIModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function GlobalAIModal({ visible, onClose }: GlobalAIModalProps) {
    const { colors, isDark } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Blessings! I am your Apostolic Army Global assistant. How can I help you with your spiritual journey or church matters today?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        try {
            const history = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
            const aiResponse = await askChurchAi(userMessage.text, history);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm sorry, I'm having a moment of silence. Please try again later.",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageContainer,
                isUser ? styles.userMessage : styles.aiMessage,
                { backgroundColor: isUser ? colors.primary : (isDark ? '#1F2937' : '#F3F4F6') }
            ]}>
                {!isUser && (
                    <View style={styles.aiIcon}>
                        <Sparkles size={12} color={colors.primary} />
                    </View>
                )}
                {isUser ? (
                    <Text style={[
                        styles.messageText,
                        { color: '#FFFFFF' }
                    ]}>
                        {item.text}
                    </Text>
                ) : (
                    <View style={{ flex: 1, width: '100%' }}>
                        <Markdown
                            style={{
                                body: {
                                    color: colors.text,
                                    fontSize: 15,
                                    lineHeight: 20,
                                },
                                blockquote: {
                                    marginTop: 10,
                                    marginBottom: 10,
                                    backgroundColor: isDark ? '#374151' : '#E5E7EB',
                                    padding: 10,
                                    borderRadius: 4,
                                    borderLeftWidth: 4,
                                    borderLeftColor: colors.secondary,
                                },
                                code_inline: {
                                    backgroundColor: isDark ? '#374151' : '#E5E7EB',
                                    borderRadius: 4,
                                    padding: 2,
                                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                                },
                                code_block: {
                                    backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                    borderRadius: 8,
                                    padding: 10,
                                    marginTop: 10,
                                    marginBottom: 10,
                                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                },
                            }}
                        >
                            {item.text}
                        </Markdown>
                    </View>
                )}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <View style={styles.headerTitleContainer}>
                            <View style={[styles.sparkleContainer, { backgroundColor: colors.primary + '20' }]}>
                                <Sparkles size={20} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={[styles.headerTitle, { color: colors.text }]}>Church AI</Text>
                                <Text style={styles.headerSubtitle}>Prophetic Wisdom & Guidance</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                    />

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={[styles.loadingText, { color: colors.secondary }]}>Discerning wisdom...</Text>
                        </View>
                    )}

                    <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
                                    color: colors.text,
                                    borderColor: colors.border
                                }
                            ]}
                            placeholder="Ask me anything spiritual..."
                            placeholderTextColor={colors.secondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                { backgroundColor: inputText.trim() ? colors.primary : colors.secondary + '40' }
                            ]}
                            onPress={handleSend}
                            disabled={!inputText.trim() || loading}
                        >
                            <Send size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '80%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sparkleContainer: {
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    closeButton: {
        padding: 4,
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    messageContainer: {
        maxWidth: '85%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 4,
    },
    userMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    aiIcon: {
        marginRight: 8,
        marginTop: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        gap: 12,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        borderWidth: 1,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
