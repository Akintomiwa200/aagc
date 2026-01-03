import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, SafeAreaView, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, Book, Settings, Search, X, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { BIBLE_BOOKS, BIBLE_VERSIONS } from '@/constants/BibleData';

export default function BibleScreen() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[42]); // John by default
    const [selectedChapter, setSelectedChapter] = useState(3); // John 3
    const [selectedVersion, setSelectedVersion] = useState(BIBLE_VERSIONS[0]); // KJV
    const [verses, setVerses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isVersionPickerVisible, setIsVersionPickerVisible] = useState(false);
    const [pickerTab, setPickerTab] = useState<'book' | 'chapter'>('book');

    const fetchScripture = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://bible-api.com/${selectedBook.name}+${selectedChapter}?translation=${selectedVersion.code}`
            );
            const data = await response.json();
            if (data.verses) {
                setVerses(data.verses);
            } else {
                setVerses([]);
            }
        } catch (error) {
            console.error('Failed to fetch scripture:', error);
            setVerses([]);
        } finally {
            setLoading(false);
        }
    }, [selectedBook, selectedChapter, selectedVersion]);

    useEffect(() => {
        fetchScripture();
    }, [fetchScripture]);

    const handleNextChapter = () => {
        if (selectedChapter < selectedBook.chapters) {
            setSelectedChapter(selectedChapter + 1);
        } else {
            const currentBookIndex = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
            if (currentBookIndex < BIBLE_BOOKS.length - 1) {
                const nextBook = BIBLE_BOOKS[currentBookIndex + 1];
                setSelectedBook(nextBook);
                setSelectedChapter(1);
            }
        }
    };

    const handlePrevChapter = () => {
        if (selectedChapter > 1) {
            setSelectedChapter(selectedChapter - 1);
        } else {
            const currentBookIndex = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
            if (currentBookIndex > 0) {
                const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
                setSelectedBook(prevBook);
                setSelectedChapter(prevBook.chapters);
            }
        }
    };

    const togglePicker = () => {
        setPickerTab('book');
        setIsPickerVisible(!isPickerVisible);
    };

    const selectBook = (book: any) => {
        setSelectedBook(book);
        setPickerTab('chapter');
    };

    const selectChapter = (chapter: number) => {
        setSelectedChapter(chapter);
        setIsPickerVisible(false);
    };

    const selectVersion = (version: any) => {
        setSelectedVersion(version);
        setIsVersionPickerVisible(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        selector: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        selectorText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        versionBadge: {
            backgroundColor: colors.primary + '20',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        versionText: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.primary,
        },
        verseList: {
            padding: 16,
        },
        verseContainer: {
            flexDirection: 'row',
            marginBottom: 16,
        },
        verseNumber: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.primary,
            width: 24,
            marginTop: 4,
        },
        verseText: {
            flex: 1,
            fontSize: 18,
            lineHeight: 28,
            color: colors.text,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
        },
        navButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: colors.primary + '10',
        },
        navButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },
        // Modal Styles
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '80%',
            paddingBottom: 40,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        tabContainer: {
            flexDirection: 'row',
            padding: 4,
            backgroundColor: colors.background,
            margin: 16,
            borderRadius: 12,
        },
        tab: {
            flex: 1,
            paddingVertical: 8,
            alignItems: 'center',
            borderRadius: 8,
        },
        activeTab: {
            backgroundColor: colors.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.secondary,
        },
        activeTabText: {
            color: colors.primary,
        },
        grid: {
            padding: 16,
        },
        bookItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        bookItemText: {
            fontSize: 16,
            color: colors.text,
        },
        chapterGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            padding: 16,
        },
        chapterItem: {
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        activeChapterItem: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        chapterItemText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        activeChapterItemText: {
            color: '#FFFFFF',
        },
        versionItem: {
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        versionItemName: {
            fontSize: 16,
            color: colors.text,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.selector} onPress={togglePicker}>
                    <Text style={styles.selectorText}>
                        {selectedBook.name} {selectedChapter}
                    </Text>
                    <Book size={18} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.versionBadge}
                    onPress={() => setIsVersionPickerVisible(true)}
                >
                    <Text style={styles.versionText}>{selectedVersion.code.toUpperCase()}</Text>
                    <ChevronDown size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Scripture Content */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 16, color: colors.secondary }}>Loading Scripture...</Text>
                </View>
            ) : (
                <FlatList
                    data={verses}
                    keyExtractor={(item, index) => `${item.verse}-${index}`}
                    contentContainerStyle={styles.verseList}
                    renderItem={({ item }) => (
                        <View style={styles.verseContainer}>
                            <Text style={styles.verseNumber}>{item.verse}</Text>
                            <Text style={styles.verseText}>{item.text.trim()}</Text>
                        </View>
                    )}
                    ListHeaderComponent={
                        <View style={{ marginBottom: 24, alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
                                {selectedBook.name} {selectedChapter}
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 4 }}>
                                {selectedVersion.name}
                            </Text>
                        </View>
                    }
                    ListFooterComponent={<View style={{ height: 40 }} />}
                />
            )}

            {/* Navigation Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.navButton} onPress={handlePrevChapter}>
                    <ChevronLeft size={20} color={colors.primary} />
                    <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={handleNextChapter}>
                    <Text style={styles.navButtonText}>Next</Text>
                    <ChevronRight size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Selection Modal (Book/Chapter) */}
            <Modal
                visible={isPickerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsPickerVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Scripture</Text>
                            <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, pickerTab === 'book' && styles.activeTab]}
                                onPress={() => setPickerTab('book')}
                            >
                                <Text style={[styles.tabText, pickerTab === 'book' && styles.activeTabText]}>Book</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, pickerTab === 'chapter' && styles.activeTab]}
                                onPress={() => setPickerTab('chapter')}
                            >
                                <Text style={[styles.tabText, pickerTab === 'chapter' && styles.activeTabText]}>Chapter</Text>
                            </TouchableOpacity>
                        </View>

                        {pickerTab === 'book' ? (
                            <FlatList
                                data={BIBLE_BOOKS}
                                keyExtractor={(item) => item.name}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.bookItem}
                                        onPress={() => selectBook(item)}
                                    >
                                        <Text style={[
                                            styles.bookItemText,
                                            item.name === selectedBook.name && { color: colors.primary, fontWeight: 'bold' }
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <ScrollView contentContainerStyle={styles.chapterGrid}>
                                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                                    <TouchableOpacity
                                        key={chapter}
                                        style={[
                                            styles.chapterItem,
                                            chapter === selectedChapter && styles.activeChapterItem
                                        ]}
                                        onPress={() => selectChapter(chapter)}
                                    >
                                        <Text style={[
                                            styles.chapterItemText,
                                            chapter === selectedChapter && styles.activeChapterItemText
                                        ]}>
                                            {chapter}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Version Selection Modal */}
            <Modal
                visible={isVersionPickerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsVersionPickerVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Version</Text>
                            <TouchableOpacity onPress={() => setIsVersionPickerVisible(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={BIBLE_VERSIONS}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.versionItem}
                                    onPress={() => selectVersion(item)}
                                >
                                    <Text style={[
                                        styles.versionItemName,
                                        item.code === selectedVersion.code && { color: colors.primary, fontWeight: 'bold' }
                                    ]}>
                                        {item.name} ({item.code.toUpperCase()})
                                    </Text>
                                    {item.code === selectedVersion.code && <Book size={18} color={colors.primary} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
