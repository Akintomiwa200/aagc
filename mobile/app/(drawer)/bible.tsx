import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
    Dimensions,
    Animated,
    Share,
} from 'react-native';
import {
    ChevronLeft,
    ChevronRight,
    Book,
    Settings,
    Search,
    X,
    ChevronDown,
    Bookmark,
    BookmarkCheck,
    Highlighter,
    MessageSquare,
    Share2,
    MoreVertical,
    Sun,
    Moon,
    Type,
    Volume2,
    Check,
    Filter,
    Home,
    Tag,
    Plus,
    Minus,
    ZoomIn,
    ZoomOut,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { BIBLE_BOOKS } from '@/constants/BibleData';
import { bibleService, BIBLE_VERSIONS, HIGHLIGHT_COLORS } from '@/services/bibleService';
import type { BibleVerse, Highlight, Bookmark as BookmarkType, Note } from '@/services/bibleService';

const { width, height } = Dimensions.get('window');

export default function BibleScreen() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[42]); // John
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [selectedVersion, setSelectedVersion] = useState(BIBLE_VERSIONS[0]); // Fixed: Use imported constant
    const [verses, setVerses] = useState<BibleVerse[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
    const [showVerseActions, setShowVerseActions] = useState(false);
    const [selectedVerseForActions, setSelectedVerseForActions] = useState<BibleVerse | null>(null);
    const [fontSize, setFontSize] = useState(18);
    const [showSettings, setShowSettings] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [showHighlightModal, setShowHighlightModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [selectedHighlightColor, setSelectedHighlightColor] = useState('yellow');

    // New state for scripture selector
    const [showScriptureSelector, setShowScriptureSelector] = useState(false);
    const [selectorTab, setSelectorTab] = useState<'book' | 'chapter'>('book');

    // Animations
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fetchScripture = useCallback(async () => {
        setLoading(true);
        try {
            const versesData = await bibleService.getChapter(
                selectedBook.name,
                selectedChapter,
                selectedVersion.code
            );
            setVerses(versesData || []);
            
            // Load user data
            const [userHighlights, userBookmarks, userNotes] = await Promise.all([
                bibleService.getHighlights(),
                bibleService.getBookmarks(),
                bibleService.getNotes(),
            ]);
            
            setHighlights(userHighlights || []);
            setBookmarks(userBookmarks || []);
            setNotes(userNotes || []);
            
            // Save reading progress
            await bibleService.saveReadingProgress(selectedBook.name, selectedChapter);
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
            const currentIndex = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
            if (currentIndex < BIBLE_BOOKS.length - 1) {
                setSelectedBook(BIBLE_BOOKS[currentIndex + 1]);
                setSelectedChapter(1);
            }
        }
    };

    const handlePrevChapter = () => {
        if (selectedChapter > 1) {
            setSelectedChapter(selectedChapter - 1);
        } else {
            const currentIndex = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
            if (currentIndex > 0) {
                setSelectedBook(BIBLE_BOOKS[currentIndex - 1]);
                setSelectedChapter(BIBLE_BOOKS[currentIndex - 1].chapters);
            }
        }
    };

    const handleVersePress = (verse: BibleVerse) => {
        const newSelected = new Set(selectedVerses);
        if (newSelected.has(verse.verse)) {
            newSelected.delete(verse.verse);
            if (newSelected.size === 0) {
                setShowVerseActions(false);
            }
        } else {
            newSelected.add(verse.verse);
            setShowVerseActions(true);
        }
        setSelectedVerses(newSelected);
        setSelectedVerseForActions(verse);
    };

    const handleLongPress = (verse: BibleVerse) => {
        setSelectedVerseForActions(verse);
        setSelectedVerses(new Set([verse.verse]));
        setShowVerseActions(true);
        
        // Animate slide up
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const hideVerseActions = () => {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
        
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setShowVerseActions(false);
            setSelectedVerses(new Set());
        });
    };

    const handleBookmark = async () => {
        if (selectedVerseForActions) {
            try {
                const bookmark = await bibleService.saveBookmark(selectedVerseForActions.id);
                setBookmarks(prev => [...(prev || []), bookmark]);
                Alert.alert('Success', 'Verse bookmarked!');
                hideVerseActions();
            } catch (error) {
                Alert.alert('Error', 'Failed to bookmark verse');
            }
        }
    };

    const handleHighlight = async (color: string) => {
        if (selectedVerseForActions) {
            try {
                const highlight = await bibleService.saveHighlight({
                    verseId: selectedVerseForActions.id,
                    color,
                });
                setHighlights(prev => [...(prev || []), highlight]);
                setShowHighlightModal(false);
                hideVerseActions();
            } catch (error) {
                Alert.alert('Error', 'Failed to highlight verse');
            }
        }
    };

    const handleAddNote = async () => {
        if (selectedVerseForActions && noteText.trim()) {
            try {
                const note = await bibleService.saveNote({
                    verseId: selectedVerseForActions.id,
                    text: noteText,
                });
                setNotes(prev => [...(prev || []), note]);
                setNoteText('');
                setShowNoteModal(false);
                hideVerseActions();
                Alert.alert('Success', 'Note added!');
            } catch (error) {
                Alert.alert('Error', 'Failed to save note');
            }
        }
    };

    const handleShare = async () => {
        if (selectedVerseForActions) {
            try {
                await Share.share({
                    message: `${selectedVerseForActions.book} ${selectedVerseForActions.chapter}:${selectedVerseForActions.verse}\n\n"${selectedVerseForActions.text}"\n\n- ${selectedVersion.name}`,
                });
                hideVerseActions();
            } catch (error) {
                Alert.alert('Error', 'Failed to share verse');
            }
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                const results = await bibleService.searchScripture(searchQuery, selectedVersion.code);
                setSearchResults(results || []);
            } catch (error) {
                console.error('Search failed:', error);
            }
        }
    };

    const isVerseBookmarked = (verseId: string) => {
        return bookmarks?.some(b => b.verseId === verseId) || false;
    };

    const getVerseHighlight = (verseId: string) => {
        return highlights?.find(h => h.verseId === verseId);
    };

    const getVerseNote = (verseId: string) => {
        return notes?.find(n => n.verseId === verseId);
    };

    const slideUp = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    // Scripture selector functions
    const openScriptureSelector = () => {
        setSelectorTab('book');
        setShowScriptureSelector(true);
    };

    const selectBook = (book: typeof BIBLE_BOOKS[0]) => {
        setSelectedBook(book);
        setSelectorTab('chapter');
    };

    const selectChapter = (chapter: number) => {
        setSelectedChapter(chapter);
        setShowScriptureSelector(false);
    };

    const renderVerse = ({ item }: { item: BibleVerse }) => {
        const highlight = getVerseHighlight(item.id);
        const note = getVerseNote(item.id);
        const isBookmarked = isVerseBookmarked(item.id);
        const isSelected = selectedVerses.has(item.verse);
        
        return (
            <TouchableOpacity
                style={[
                    verseStyles.verseContainer,
                    isSelected && { backgroundColor: colors.primary + '08' },
                    highlight && { backgroundColor: highlight.color + '30' },
                ]}
                onPress={() => handleVersePress(item)}
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.7}
            >
                <View style={verseStyles.verseNumberContainer}>
                    <Text style={verseStyles.verseNumber}>{item.verse}</Text>
                </View>
                <View style={verseStyles.verseTextContainer}>
                    <Text style={[verseStyles.verseText, { fontSize }]}>{item.text}</Text>
                    {note && (
                        <Text style={verseStyles.footnote}>
                            📝 Note: {note.text}
                        </Text>
                    )}
                    {isBookmarked && (
                        <BookmarkCheck size={16} color={colors.primary} style={{ marginTop: 8 }} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    // Separate styles to avoid the undefined object issue
    const containerStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        chapterSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: colors.primary + '10',
        },
        chapterText: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
        },
        versionSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.primary + '15',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
        },
        versionText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.primary,
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary + '10',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            flex: 1,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        navButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            backgroundColor: colors.primary + '10',
        },
        navButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },
        chapterInfo: {
            alignItems: 'center',
        },
        chapterTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        chapterSubtitle: {
            fontSize: 12,
            color: colors.secondary,
        },
    });

    const verseStyles = StyleSheet.create({
        verseContainer: {
            flexDirection: 'row',
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border + '30',
        },
        verseNumberContainer: {
            width: 36,
            alignItems: 'flex-start',
            marginTop: 4,
        },
        verseNumber: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
            width: 24,
            height: 24,
            borderRadius: 12,
            textAlign: 'center',
            lineHeight: 24,
            backgroundColor: colors.primary + '10',
        },
        verseTextContainer: {
            flex: 1,
        },
        verseText: {
            lineHeight: 24,
            color: colors.text,
            letterSpacing: 0.3,
        },
        footnote: {
            fontSize: 12,
            color: colors.secondary,
            fontStyle: 'italic',
            marginTop: 8,
        },
    });

    const actionsStyles = StyleSheet.create({
        actionsOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        actionsPanel: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            paddingBottom: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
        },
        actionsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        actionsTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        actionsGrid: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
        },
        actionButton: {
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 16,
            minWidth: 80,
        },
        actionIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.text,
        },
        selectedVerses: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        selectedCount: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },
    });

    const modalStyles = StyleSheet.create({
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
            justifyContent: 'flex-start',
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
        colorGrid: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 20,
        },
        colorButton: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedColor: {
            borderWidth: 3,
            borderColor: colors.primary,
        },
        noteInput: {
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
            minHeight: 120,
            fontSize: 16,
            color: colors.text,
            marginVertical: 20,
        },
        modalActions: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 20,
        },
        cancelButton: {
            flex: 1,
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.border + '30',
            alignItems: 'center',
        },
        saveButton: {
            flex: 1,
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: 'center',
        },
        cancelText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        saveText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
        },
    });

    const searchStyles = StyleSheet.create({
        searchContainer: {
            padding: 20,
            backgroundColor: colors.card,
        },
        searchInput: {
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: colors.text,
            marginBottom: 12,
        },
        searchResult: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        searchReference: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 4,
        },
        searchText: {
            fontSize: 14,
            color: colors.text,
            lineHeight: 20,
        },
    });

    const settingsStyles = StyleSheet.create({
        settingsContainer: {
            padding: 24,
        },
        settingsSection: {
            marginBottom: 32,
        },
        settingsTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
        },
        fontSizeControl: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        fontSizeValue: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        themeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.background,
            marginBottom: 12,
        },
    });

    const versionModalStyles = StyleSheet.create({
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

    const [showVersionPicker, setShowVersionPicker] = useState(false);

    return (
        <SafeAreaView style={containerStyles.container}>
            {/* Header */}
            <View style={containerStyles.header}>
                <View style={containerStyles.headerLeft}>
                    <TouchableOpacity 
                        style={containerStyles.chapterSelector} 
                        onPress={openScriptureSelector}
                    >
                        <Text style={containerStyles.chapterText}>
                            {selectedBook.name} {selectedChapter}
                        </Text>
                        <ChevronDown size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={containerStyles.versionSelector}
                        onPress={() => setShowVersionPicker(true)}
                    >
                        <Text style={containerStyles.versionText}>
                            {selectedVersion.code.toUpperCase()}
                        </Text>
                        <ChevronDown size={14} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={containerStyles.headerRight}>
                    <TouchableOpacity
                        style={containerStyles.iconButton}
                        onPress={() => setShowSearch(true)}
                    >
                        <Search size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={containerStyles.iconButton}
                        onPress={() => setShowSettings(true)}
                    >
                        <Settings size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bible Content */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 16, color: colors.secondary }}>
                        Loading Scripture...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={verses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderVerse}
                    ListHeaderComponent={
                        <View style={{ padding: 24, alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
                                {selectedBook.name} {selectedChapter}
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 4 }}>
                                {selectedVersion.name}
                            </Text>
                        </View>
                    }
                    ListFooterComponent={<View style={{ height: 80 }} />}
                />
            )}

            {/* Navigation Footer */}
            <View style={containerStyles.footer}>
                <TouchableOpacity style={containerStyles.navButton} onPress={handlePrevChapter}>
                    <ChevronLeft size={20} color={colors.primary} />
                    <Text style={containerStyles.navButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <View style={containerStyles.chapterInfo}>
                    <Text style={containerStyles.chapterTitle}>
                        {selectedBook.name} {selectedChapter}
                    </Text>
                    <Text style={containerStyles.chapterSubtitle}>
                        Chapter {selectedChapter} of {selectedBook.chapters}
                    </Text>
                </View>
                
                <TouchableOpacity style={containerStyles.navButton} onPress={handleNextChapter}>
                    <Text style={containerStyles.navButtonText}>Next</Text>
                    <ChevronRight size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Scripture Selection Modal */}
            <Modal
                visible={showScriptureSelector}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowScriptureSelector(false)}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={modalStyles.modalTitle}>Select Scripture</Text>
                            <TouchableOpacity onPress={() => setShowScriptureSelector(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={modalStyles.tabContainer}>
                            <TouchableOpacity
                                style={[modalStyles.tab, selectorTab === 'book' && modalStyles.activeTab]}
                                onPress={() => setSelectorTab('book')}
                            >
                                <Text style={[
                                    modalStyles.tabText, 
                                    selectorTab === 'book' && modalStyles.activeTabText
                                ]}>
                                    Book
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.tab, selectorTab === 'chapter' && modalStyles.activeTab]}
                                onPress={() => setSelectorTab('chapter')}
                            >
                                <Text style={[
                                    modalStyles.tabText, 
                                    selectorTab === 'chapter' && modalStyles.activeTabText
                                ]}>
                                    Chapter
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {selectorTab === 'book' ? (
                            <FlatList
                                data={BIBLE_BOOKS}
                                keyExtractor={(item) => item.name}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={modalStyles.bookItem}
                                        onPress={() => selectBook(item)}
                                    >
                                        <Text style={[
                                            modalStyles.bookItemText,
                                            item.name === selectedBook.name && { 
                                                color: colors.primary, 
                                                fontWeight: 'bold' 
                                            }
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <ScrollView contentContainerStyle={modalStyles.chapterGrid}>
                                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                                    <TouchableOpacity
                                        key={chapter}
                                        style={[
                                            modalStyles.chapterItem,
                                            chapter === selectedChapter && modalStyles.activeChapterItem
                                        ]}
                                        onPress={() => selectChapter(chapter)}
                                    >
                                        <Text style={[
                                            modalStyles.chapterItemText,
                                            chapter === selectedChapter && modalStyles.activeChapterItemText
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

            {/* Verse Actions Panel */}
            {showVerseActions && (
                <>
                    <TouchableOpacity
                        style={actionsStyles.actionsOverlay}
                        onPress={hideVerseActions}
                        activeOpacity={1}
                    />
                    <Animated.View
                        style={[
                            actionsStyles.actionsPanel,
                            {
                                transform: [{ translateY: slideUp }],
                                opacity: fadeAnim,
                            },
                        ]}
                    >
                        <View style={actionsStyles.actionsHeader}>
                            <Text style={actionsStyles.actionsTitle}>Verse Options</Text>
                            <TouchableOpacity onPress={hideVerseActions}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={actionsStyles.actionsGrid}>
                            <TouchableOpacity
                                style={actionsStyles.actionButton}
                                onPress={handleBookmark}
                            >
                                <View style={[actionsStyles.actionIcon, { backgroundColor: '#FFD70015' }]}>
                                    <Bookmark size={24} color="#FFD700" />
                                </View>
                                <Text style={actionsStyles.actionText}>Bookmark</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={actionsStyles.actionButton}
                                onPress={() => setShowHighlightModal(true)}
                            >
                                <View style={[actionsStyles.actionIcon, { backgroundColor: '#87CEEB15' }]}>
                                    <Highlighter size={24} color="#87CEEB" />
                                </View>
                                <Text style={actionsStyles.actionText}>Highlight</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={actionsStyles.actionButton}
                                onPress={() => setShowNoteModal(true)}
                            >
                                <View style={[actionsStyles.actionIcon, { backgroundColor: '#90EE9015' }]}>
                                    <MessageSquare size={24} color="#90EE90" />
                                </View>
                                <Text style={actionsStyles.actionText}>Note</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={actionsStyles.actionButton}
                                onPress={handleShare}
                            >
                                <View style={[actionsStyles.actionIcon, { backgroundColor: '#DDA0DD15' }]}>
                                    <Share2 size={24} color="#DDA0DD" />
                                </View>
                                <Text style={actionsStyles.actionText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {selectedVerses.size > 0 && (
                            <View style={actionsStyles.selectedVerses}>
                                <Text style={actionsStyles.selectedCount}>
                                    {selectedVerses.size} verse{selectedVerses.size > 1 ? 's' : ''} selected
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                </>
            )}

            {/* Highlight Color Modal */}
            <Modal
                visible={showHighlightModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowHighlightModal(false)}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={modalStyles.modalTitle}>Choose Highlight Color</Text>
                            <TouchableOpacity onPress={() => setShowHighlightModal(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={modalStyles.colorGrid}>
                            {HIGHLIGHT_COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color.id}
                                    style={[
                                        modalStyles.colorButton,
                                        { backgroundColor: color.color },
                                        selectedHighlightColor === color.id && modalStyles.selectedColor,
                                    ]}
                                    onPress={() => {
                                        setSelectedHighlightColor(color.id);
                                        handleHighlight(color.color);
                                    }}
                                >
                                    {selectedHighlightColor === color.id && (
                                        <Check size={24} color="#000000" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Note Modal */}
            <Modal
                visible={showNoteModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowNoteModal(false)}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={modalStyles.modalTitle}>Add Note</Text>
                            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={modalStyles.noteInput}
                            multiline
                            placeholder="Write your note here..."
                            placeholderTextColor={colors.secondary}
                            value={noteText}
                            onChangeText={setNoteText}
                            autoFocus
                        />
                        <View style={modalStyles.modalActions}>
                            <TouchableOpacity
                                style={modalStyles.cancelButton}
                                onPress={() => setShowNoteModal(false)}
                            >
                                <Text style={modalStyles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={modalStyles.saveButton}
                                onPress={handleAddNote}
                            >
                                <Text style={modalStyles.saveText}>Save Note</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Search Modal */}
            <Modal
                visible={showSearch}
                animationType="slide"
                onRequestClose={() => setShowSearch(false)}
            >
                <SafeAreaView style={containerStyles.container}>
                    <View style={searchStyles.searchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <TextInput
                                style={[searchStyles.searchInput, { flex: 1 }]}
                                placeholder="Search Bible..."
                                placeholderTextColor={colors.secondary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                            />
                            <TouchableOpacity
                                style={containerStyles.iconButton}
                                onPress={handleSearch}
                            >
                                <Search size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={searchStyles.searchResult}
                                    onPress={() => {
                                        // Navigate to the verse when search result is clicked
                                        const book = BIBLE_BOOKS.find(b => b.name === item.book);
                                        if (book) {
                                            setSelectedBook(book);
                                            setSelectedChapter(item.chapter);
                                            setShowSearch(false);
                                        }
                                    }}
                                >
                                    <Text style={searchStyles.searchReference}>
                                        {item.book} {item.chapter}:{item.verse}
                                    </Text>
                                    <Text style={searchStyles.searchText} numberOfLines={2}>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Settings Modal */}
            <Modal
                visible={showSettings}
                animationType="slide"
                onRequestClose={() => setShowSettings(false)}
            >
                <SafeAreaView style={containerStyles.container}>
                    <View style={containerStyles.header}>
                        <TouchableOpacity onPress={() => setShowSettings(false)}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[containerStyles.chapterText, { flex: 1, textAlign: 'center' }]}>
                            Settings
                        </Text>
                        <View style={{ width: 24 }} />
                    </View>
                    <ScrollView style={settingsStyles.settingsContainer}>
                        <View style={settingsStyles.settingsSection}>
                            <Text style={settingsStyles.settingsTitle}>Text Size</Text>
                            <View style={settingsStyles.fontSizeControl}>
                                <TouchableOpacity
                                    onPress={() => setFontSize(Math.max(14, fontSize - 2))}
                                >
                                    <Minus size={24} color={colors.text} />
                                </TouchableOpacity>
                                <Text style={settingsStyles.fontSizeValue}>{fontSize}px</Text>
                                <TouchableOpacity
                                    onPress={() => setFontSize(Math.min(32, fontSize + 2))}
                                >
                                    <Plus size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={settingsStyles.settingsSection}>
                            <Text style={settingsStyles.settingsTitle}>Bible Version</Text>
                            {BIBLE_VERSIONS.map((version) => (
                                <TouchableOpacity
                                    key={version.code}
                                    style={settingsStyles.themeButton}
                                    onPress={() => {
                                        setSelectedVersion(version);
                                        setShowSettings(false);
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>{version.name}</Text>
                                    {version.code === selectedVersion.code && (
                                        <Check size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Version Picker Modal */}
            <Modal
                visible={showVersionPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowVersionPicker(false)}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={modalStyles.modalTitle}>Select Version</Text>
                            <TouchableOpacity onPress={() => setShowVersionPicker(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={BIBLE_VERSIONS}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={versionModalStyles.versionItem}
                                    onPress={() => {
                                        setSelectedVersion(item);
                                        setShowVersionPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        versionModalStyles.versionItemName,
                                        item.code === selectedVersion.code && { 
                                            color: colors.primary, 
                                            fontWeight: 'bold' 
                                        }
                                    ]}>
                                        {item.name} ({item.code.toUpperCase()})
                                    </Text>
                                    {item.code === selectedVersion.code && <Check size={18} color={colors.primary} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}