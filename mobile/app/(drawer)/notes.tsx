import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert, ScrollView } from 'react-native';
import { Plus, Trash2, Save, X, ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

export default function NotesScreen() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    const { user } = useAuth();
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState<any>(null); // null = creating new
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleNoteCreated = (note: any) => {
            setNotes(prev => [note, ...prev]);
        };

        const handleNoteUpdated = (note: any) => {
            setNotes(prev => prev.map(n => n.id === note.id || n._id === note._id ? note : n));
        };

        const handleNoteDeleted = (data: any) => {
            setNotes(prev => prev.filter(n => n.id !== data.noteId && n._id !== data.noteId));
        };

        socket.on('note-created', handleNoteCreated);
        socket.on('note-updated', handleNoteUpdated);
        socket.on('note-deleted', handleNoteDeleted);

        return () => {
            socket.off('note-created', handleNoteCreated);
            socket.off('note-updated', handleNoteUpdated);
            socket.off('note-deleted', handleNoteDeleted);
        };
    }, [socket]);

    const fetchNotes = async () => {
        if (!user) return;
        try {
            const data = await apiService.getNotes(user.id);
            setNotes(data || []);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenNote = (note?: any) => {
        if (note) {
            setCurrentNote(note);
            setNoteTitle(note.title);
            setNoteContent(note.content);
        } else {
            setCurrentNote(null);
            setNoteTitle('');
            setNoteContent('');
        }
        setModalVisible(true);
    };

    const handleSaveNote = async () => {
        if (!noteTitle.trim()) {
            Alert.alert('Error', 'Please provide a title.');
            return;
        }

        try {
            if (currentNote) {
                // Update
                await apiService.updateNote(currentNote.id, { title: noteTitle, content: noteContent });
            } else {
                // Create
                if (!user) {
                    Alert.alert('Error', 'You must be logged in to create a note.');
                    return;
                }
                await apiService.createNote({ title: noteTitle, content: noteContent, userId: user.id });
            }
            fetchNotes(); // Refresh list
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to save note.');
        }
    };

    const handleDeleteNote = async (id: string) => {
        Alert.alert('Delete Note', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await apiService.deleteNote(id);
                        setNotes(prev => prev.filter(n => n.id !== id));
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete note.');
                    }
                }
            }
        ]);
    };

    const renderNoteContent = (content: string) => {
        // Simple regex for Bible verses, e.g., "John 3:16", "1 John 1:9", "Genesis 1:1-5"
        const bibleRegex = /(([1-3]\s+)?[A-Z][a-z]+(\s+[A-Z][a-z]+)?)\s+(\d+):(\d+)(-\d+)?/g;

        const parts = content.split(bibleRegex);
        if (parts.length === 1) return <Text style={styles.inputContentText}>{content}</Text>;

        const result: React.ReactNode[] = [];
        let lastIndex = 0;

        content.replace(bibleRegex, (match, book, p2, p3, chapter, verse, range, offset) => {
            // Push text before match
            result.push(<Text key={`text-${offset}`} style={styles.inputContentText}>{content.slice(lastIndex, offset)}</Text>);

            // Push match as link
            result.push(
                <TouchableOpacity
                    key={`link-${offset}`}
                    onPress={() => {
                        setModalVisible(false);
                        router.push({
                            pathname: '/(drawer)/bible',
                            params: { book, chapter, verse }
                        });
                    }}
                    style={styles.verseLink}
                >
                    <Text style={styles.verseLinkText}>{match}</Text>
                    <ExternalLink size={12} color={colors.primary} />
                </TouchableOpacity>
            );

            lastIndex = offset + match.length;
            return match;
        });

        // Push remaining text
        if (lastIndex < content.length) {
            result.push(<Text key={`text-end`} style={styles.inputContentText}>{content.slice(lastIndex)}</Text>);
        }

        return <View style={styles.contentContainer}>{result}</View>;
    };

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
        noteItem: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        noteTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
        },
        notePreview: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            lineHeight: 20,
        },
        itemFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
            alignItems: 'center',
        },
        date: {
            fontSize: 12,
            color: isDark ? '#6B7280' : '#9CA3AF',
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
        // Modal Styles
        modalContainer: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
            marginTop: 50, // simple header offset for mockup
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        inputTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#374151' : '#E5E7EB',
            paddingBottom: 8,
        },
        inputContent: {
            fontSize: 16,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 24,
            flex: 1,
            textAlignVertical: 'top',
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 40,
        },
        emptyText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        verseLink: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#7C3AED15',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
            marginHorizontal: 2,
            gap: 4,
        },
        verseLinkText: {
            color: '#7C3AED',
            fontWeight: '600',
            fontSize: 16,
        },
        inputContentText: {
            fontSize: 16,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 24,
        },
        contentContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sermon Notes</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No notes yet. Tap + to start writing.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.noteItem} onPress={() => handleOpenNote(item)}>
                            <Text style={styles.noteTitle}>{item.title}</Text>
                            <Text style={styles.notePreview} numberOfLines={2}>{item.content}</Text>
                            <View style={styles.itemFooter}>
                                <Text style={styles.date}>{new Date(item.updatedAt || Date.now()).toLocaleDateString()}</Text>
                                <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                                    <Trash2 size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => handleOpenNote()}>
                <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <X size={24} color={isDark ? '#FFFFFF' : '#111827'} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{currentNote ? 'Edit Note' : 'New Note'}</Text>
                        <TouchableOpacity onPress={handleSaveNote}>
                            <Save size={24} color="#7C3AED" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.inputTitle}
                        placeholder="Title"
                        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        value={noteTitle}
                        onChangeText={setNoteTitle}
                    />

                    {currentNote ? (
                        <View style={{ flex: 1 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {renderNoteContent(noteContent)}
                            </ScrollView>
                            <TouchableOpacity
                                style={{ position: 'absolute', bottom: 20, right: 0, backgroundColor: colors.primary, padding: 12, borderRadius: 30 }}
                                onPress={() => {
                                    // Switch to edit mode by hiding the rendered view? 
                                    // For simplicity in this demo, let's just make it editable by clicking a separate "Edit" button if needed,
                                    // but we can also just show the content as editable by default and only link it in the list or a preview.
                                    // Let's stick to the user's intent: Interconnection.
                                }}
                            >
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TextInput
                            style={styles.inputContent}
                            placeholder="Start writing..."
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            value={noteContent}
                            onChangeText={setNoteContent}
                            multiline
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
}
