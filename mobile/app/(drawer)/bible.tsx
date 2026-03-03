import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    SafeAreaView,
    TextInput,
    Dimensions,
    Animated,
    Share,
    PanResponder,
    RefreshControl,
    Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { SvgXml } from 'react-native-svg';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    BookmarkCheck,
    Check,
    Volume2,
    VolumeX,
    Globe,
    ArrowLeft,
    Play,
    Square,
    Minus,
    Plus,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { BIBLE_BOOKS } from '@/constants/BibleData';
import { bibleService, BIBLE_VERSIONS } from '@/services/bibleService';
import type { BibleVerse, Highlight, Bookmark as BookmarkType, Note } from '@/services/bibleService';
import { generateChurchImage } from '@/services/geminiService';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');

// ─── COLORS ────────────────────────────────────────────────────────────────
const C = {
    readingBg:   '#1B2635',
    black:       '#000000',
    verseWhite:  '#FFFFFF',
    verseMuted:  '#6B7A8D',
    iconGrey:    '#8899AA',
    bottomBar:   '#151E2B',
    chapterPill: '#2C3A4A',
    separator:   '#1C1C1C',
    tileBg:      '#2A2A2A',
    versionPill: '#2C3A4A',
    modalBg:     '#1A2333',
    inputBg:     '#0D1623',
    accent:      '#3A6BC9',
};

// ─── VERSIONS SCREEN ────────────────────────────────────────────────────────
export function VersionsScreen({
    onBack,
    currentVersion,
    onSelectVersion,
}: {
    onBack: () => void;
    currentVersion: string;
    onSelectVersion: (code: string) => void;
}) {
    const [search, setSearch] = useState('');
    const filtered = search.trim()
        ? BIBLE_VERSIONS.filter(v =>
              v.name.toLowerCase().includes(search.toLowerCase()) ||
              v.code.toLowerCase().includes(search.toLowerCase()))
        : BIBLE_VERSIONS;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.black }}>
            <StatusBar style="light" />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 4 }}>
                    <ArrowLeft size={24} color={C.verseWhite} />
                </TouchableOpacity>
                <Text style={{ flex: 1, color: C.verseWhite, fontSize: 24, fontWeight: '700' }}>Versions</Text>
            </View>
            <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1C', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 13, gap: 10 }}>
                    <Search size={18} color="#666" />
                    <TextInput
                        style={{ flex: 1, color: C.verseWhite, fontSize: 16 }}
                        placeholder="Search versions..."
                        placeholderTextColor="#555"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <X size={16} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isActive = item.code === currentVersion;
                    return (
                        <TouchableOpacity
                            onPress={() => { onSelectVersion(item.code); onBack(); }}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18 }}
                            activeOpacity={0.7}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: '700', marginBottom: 3, letterSpacing: 0.2 }}>
                                    {item.code.toUpperCase()}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 13 }}>{item.name}</Text>
                            </View>
                            {isActive ? (
                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.verseWhite, alignItems: 'center', justifyContent: 'center' }}>
                                    <Check size={17} color="#000000" strokeWidth={3} />
                                </View>
                            ) : (
                                <View style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: '#444', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#888', fontSize: 13, fontWeight: '600' }}>i</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#111', marginHorizontal: 20 }} />}
                ListFooterComponent={<View style={{ height: 40 }} />}
            />
        </SafeAreaView>
    );
}

// ─── REFERENCES SCREEN ──────────────────────────────────────────────────────
export function ReferencesScreen({
    onBack,
    onSelectChapter,
    currentBook,
    currentChapter,
}: {
    onBack: () => void;
    onSelectChapter: (bookName: string, chapter: number) => void;
    currentBook: string;
    currentChapter: number;
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedBook, setExpandedBook] = useState<string | null>(null);
    const filtered = searchQuery.trim()
        ? BIBLE_BOOKS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : BIBLE_BOOKS;
    const tilePad = 16;
    const tileGap = 10;
    const tileSize = Math.floor((width - tilePad * 2 - tileGap * 4) / 5);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.black }}>
            <StatusBar style="light" />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 4 }}>
                    <ArrowLeft size={24} color={C.verseWhite} />
                </TouchableOpacity>
                <Text style={{ flex: 1, color: C.verseWhite, fontSize: 24, fontWeight: '700' }}>References</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <TouchableOpacity>
                        <Text style={{ color: C.verseWhite, fontSize: 15, fontWeight: '700', letterSpacing: -0.5 }}>AZ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: '#555', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: C.verseWhite, fontSize: 13 }}>🕐</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1C', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 12 }}>
                    <Search size={19} color="#666" />
                    <TextInput
                        style={{ flex: 1, color: C.verseWhite, fontSize: 16, marginLeft: 10 }}
                        placeholder="Search"
                        placeholderTextColor="#555"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isExpanded = expandedBook === item.name;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() => setExpandedBook(isExpanded ? null : item.name)}
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18 }}
                            >
                                <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: isExpanded ? '700' : '400' }}>
                                    {item.name}
                                </Text>
                                <Volume2 size={19} color="#555" />
                            </TouchableOpacity>
                            {isExpanded && (
                                <View style={{ paddingHorizontal: tilePad, paddingBottom: 16, paddingTop: 4, flexDirection: 'row', flexWrap: 'wrap', gap: tileGap }}>
                                    {Array.from({ length: item.chapters }, (_, i) => i + 1).map((ch) => {
                                        const isCurrent = item.name === currentBook && ch === currentChapter;
                                        return (
                                            <TouchableOpacity
                                                key={ch}
                                                onPress={() => { onSelectChapter(item.name, ch); onBack(); }}
                                                style={{ width: tileSize, height: tileSize, backgroundColor: isCurrent ? C.verseWhite : C.tileBg, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Text style={{ color: isCurrent ? '#000' : C.verseWhite, fontSize: 16, fontWeight: '500' }}>{ch}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.separator, marginHorizontal: 20 }} />}
                ListFooterComponent={<View style={{ height: 40 }} />}
            />
        </SafeAreaView>
    );
}

// ─── MAIN BIBLE SCREEN ──────────────────────────────────────────────────────
export default function BibleScreen() {
    const params = useLocalSearchParams();
    const { colors } = useTheme();
    const { settings, updateSettings } = useSettings();

    const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[42]);
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

    const currentVersion = BIBLE_VERSIONS.find(v => v.code === settings.bibleVersion) || BIBLE_VERSIONS[0];

    // Content
    const [verses, setVerses] = useState<BibleVerse[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    // Verse selection
    const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
    const [showVerseActions, setShowVerseActions] = useState(false);
    const [selectedVerseForActions, setSelectedVerseForActions] = useState<BibleVerse | null>(null);

    // Screen routing
    const [showVersionsScreen, setShowVersionsScreen] = useState(false);
    const [showReferencesScreen, setShowReferencesScreen] = useState(false);

    // Modals
    const [showSearch, setShowSearch] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
    const [searching, setSearching] = useState(false);
    const [compareVersion, setCompareVersion] = useState(settings.bibleVersion);
    const [compareVerseText, setCompareVerseText] = useState('');
    const [compareLoading, setCompareLoading] = useState(false);
    const [generatingVerseImage, setGeneratingVerseImage] = useState(false);
    const [downloadingVerseImage, setDownloadingVerseImage] = useState(false);
    const [verseImageError, setVerseImageError] = useState(false);
    const [generatedVerseImage, setGeneratedVerseImage] = useState<string | null>(null);

    // Note
    const [noteText, setNoteText] = useState('');


    // TTS
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechQueueRef = useRef<string[]>([]);
    const speechSessionRef = useRef(0);

    // Reading settings (opened via ···)
    const [fontSize, setFontSize] = useState(30);
    const [fontFamily, setFontFamily] = useState<'serif' | 'sans-serif'>('serif');
    const [lineHeightMultiplier, setLineHeightMultiplier] = useState(1.5);
    const [redLetter, setRedLetter] = useState(true);

    const mainListRef = useRef<FlatList>(null);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30 && Math.abs(g.dy) < 10,
            onPanResponderRelease: (_, g) => {
                if (g.dx > 50) handlePrevChapter();
                else if (g.dx < -50) handleNextChapter();
            },
        })
    ).current;

    // ── TTS ────────────────────────────────────────────────────────────────
    const stopSpeech = useCallback(async () => {
        speechSessionRef.current += 1;
        speechQueueRef.current = [];
        await Speech.stop();
        setIsSpeaking(false);
    }, []);

    const splitForSpeech = (text: string, maxLen = 3500) => {
        const chunks: string[] = [];
        let rest = text.trim();
        while (rest.length > maxLen) {
            let splitIdx = rest.lastIndexOf('.', maxLen);
            if (splitIdx < maxLen * 0.5) splitIdx = rest.lastIndexOf(' ', maxLen);
            if (splitIdx < 1) splitIdx = maxLen;
            chunks.push(rest.slice(0, splitIdx).trim());
            rest = rest.slice(splitIdx).trim();
        }
        if (rest.length) chunks.push(rest);
        return chunks;
    };

    const startSpeech = useCallback(async () => {
        if (!verses.length) return;
        speechSessionRef.current += 1;
        const sessionId = speechSessionRef.current;
        await Speech.stop();
        const fullText = verses.map(v => `Verse ${v.verse}. ${v.text}`).join(' ');
        const chunks = splitForSpeech(fullText);
        speechQueueRef.current = chunks;
        if (!chunks.length) return;
        setIsSpeaking(true);

        const speakChunk = (index: number) => {
            if (speechSessionRef.current !== sessionId) return;
            if (index >= chunks.length) {
                setIsSpeaking(false);
                return;
            }
            Speech.speak(chunks[index], {
                language: 'en-US',
                pitch: 1.0,
                rate: 0.85,
                onDone: () => speakChunk(index + 1),
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        };

        speakChunk(0);
    }, [verses]);

    const toggleSpeech = useCallback(async () => {
        if (isSpeaking) await stopSpeech();
        else await startSpeech();
    }, [isSpeaking, startSpeech, stopSpeech]);

    // Stop TTS when chapter changes
    useEffect(() => { stopSpeech(); }, [selectedBook.name, selectedChapter]);

    // ── Fetch ──────────────────────────────────────────────────────────────
    const fetchScripture = useCallback(async () => {
        setLoading(true);
        try {
            const versesData = await bibleService.getChapter(selectedBook.name, selectedChapter, settings.bibleVersion);
            setVerses(versesData || []);
            const [hl, bm, nt] = await Promise.all([
                bibleService.getHighlights(),
                bibleService.getBookmarks(),
                bibleService.getNotes(),
            ]);
            setHighlights(hl || []);
            setBookmarks(bm || []);
            setNotes(nt || []);
            await bibleService.saveReadingProgress(selectedBook.name, selectedChapter);
        } catch (e) {
            console.error('Failed to fetch scripture:', e);
            setVerses([]);
        } finally {
            setLoading(false);
        }
    }, [selectedBook, selectedChapter, settings.bibleVersion]);

    useEffect(() => { fetchScripture(); }, [fetchScripture]);

    useEffect(() => {
        if (params.book) {
            const book = BIBLE_BOOKS.find(b => b.name.toLowerCase() === (params.book as string).toLowerCase());
            if (book) {
                setSelectedBook(book);
                if (params.chapter) setSelectedChapter(parseInt(params.chapter as string));
                if (params.verse) {
                    const vi = parseInt(params.verse as string);
                    setSelectedVerse(vi);
                    setTimeout(() => {
                        mainListRef.current?.scrollToIndex({ index: vi - 1, animated: true, viewPosition: 0 });
                    }, 500);
                }
            }
        }
    }, [params.book, params.chapter, params.verse]);

    // ── Chapter navigation ─────────────────────────────────────────────────
    const handleNextChapter = () => {
        if (selectedChapter < selectedBook.chapters) { setSelectedChapter(c => c + 1); }
        else {
            const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
            if (idx < BIBLE_BOOKS.length - 1) { setSelectedBook(BIBLE_BOOKS[idx + 1]); setSelectedChapter(1); }
        }
    };

    const handlePrevChapter = () => {
        if (selectedChapter > 1) { setSelectedChapter(c => c - 1); }
        else {
            const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
            if (idx > 0) { setSelectedBook(BIBLE_BOOKS[idx - 1]); setSelectedChapter(BIBLE_BOOKS[idx - 1].chapters); }
        }
    };

    // ── Verse selection ────────────────────────────────────────────────────
    const openVerseActions = () => {
        setShowVerseActions(true);
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
    };

    const handleVersePress = (verse: BibleVerse) => {
        const ns = new Set(selectedVerses);
        if (ns.has(verse.verse)) {
            ns.delete(verse.verse);
            if (ns.size === 0) {
                hideVerseActions();
                return;
            }
        } else {
            ns.add(verse.verse);
            openVerseActions();
        }
        setSelectedVerses(ns);
        setSelectedVerseForActions(verse);
    };

    const handleLongPress = (verse: BibleVerse) => {
        setSelectedVerseForActions(verse);
        setSelectedVerses(new Set([verse.verse]));
        openVerseActions();
    };

    const hideVerseActions = () => {
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => {
            setShowVerseActions(false);
            setSelectedVerses(new Set());
            setSelectedVerseForActions(null);
        });
    };

    // ── Verse actions ──────────────────────────────────────────────────────
    const handleBookmark = async () => {
        if (!selectedVerseForActions) return;
        try {
            const bm = await bibleService.saveBookmark(selectedVerseForActions.id);
            setBookmarks(prev => [...prev, bm]);
            toast.success('Verse saved.');
            hideVerseActions();
        } catch { toast.error('Could not bookmark verse.'); }
    };

    const handleHighlight = async (color: string) => {
        if (!selectedVerseForActions) return;
        try {
            // Remove any existing highlight for this verse first (replace, don't stack)
            const existing = highlights.find(h => h.verseId === selectedVerseForActions.id);
            if (existing) {
                await bibleService.removeHighlight(existing.id);
                setHighlights(prev => prev.filter(h => h.id !== existing.id));
            }
            // Save new highlight
            const hl = await bibleService.saveHighlight({ verseId: selectedVerseForActions.id, color });
            setHighlights(prev => [...prev, hl]);
            // Don't close the sheet — user can keep changing color or tap other actions
        } catch { toast.error('Could not highlight verse.'); }
    };

    const handleAddNote = async () => {
        if (!selectedVerseForActions || !noteText.trim()) return;
        try {
            const nt = await bibleService.saveNote({ verseId: selectedVerseForActions.id, text: noteText });
            setNotes(prev => [...prev, nt]);
            setNoteText('');
            setShowNoteModal(false);
            hideVerseActions();
            toast.success('Note saved');
        } catch { toast.error('Could not save note.'); }
    };

    const handleShare = async () => {
        if (!selectedVerseForActions) return;
        try {
            await Share.share({
                message: `${selectedVerseForActions.book} ${selectedVerseForActions.chapter}:${selectedVerseForActions.verse}\n\n"${selectedVerseForActions.text}"\n\n— ${currentVersion.name}`,
            });
            hideVerseActions();
        } catch { toast.error('Could not share.'); }
    };

    // ── Search ─────────────────────────────────────────────────────────────
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const results = await bibleService.searchScripture(searchQuery, settings.bibleVersion);
            setSearchResults(results || []);
        } catch { setSearchResults([]); }
        finally { setSearching(false); }
    };

    const loadComparedVerse = useCallback(async () => {
        if (!selectedVerseForActions || !showCompareModal) return;
        setCompareLoading(true);
        try {
            const chapterVerses = await bibleService.getChapter(
                selectedVerseForActions.book,
                selectedVerseForActions.chapter,
                compareVersion
            );
            const match = chapterVerses.find(v => v.verse === selectedVerseForActions.verse);
            setCompareVerseText(match?.text || 'Verse not available in this version.');
        } catch {
            setCompareVerseText('Could not load this version right now.');
        } finally {
            setCompareLoading(false);
        }
    }, [selectedVerseForActions, compareVersion, showCompareModal]);

    useEffect(() => {
        loadComparedVerse();
    }, [loadComparedVerse]);

    const handleGenerateVerseImage = async () => {
        if (!selectedVerseForActions) return;
        setGeneratingVerseImage(true);
        setVerseImageError(false);
        try {
            const prompt = `Create a reverent Christian artwork inspired by ${selectedVerseForActions.book} ${selectedVerseForActions.chapter}:${selectedVerseForActions.verse}. Verse text: "${selectedVerseForActions.text}"`;
            const img = await generateChurchImage(prompt);
            if (!img) {
                toast.error('Could not generate image. Try again.');
                return;
            }
            setGeneratedVerseImage(img);
            toast.success('Image ready');
        } catch {
            toast.error('Image generation failed.');
        } finally {
            setGeneratingVerseImage(false);
        }
    };

    const handleDownloadVerseImage = async () => {
        if (!generatedVerseImage || downloadingVerseImage) return;
        setDownloadingVerseImage(true);
        try {
            const FileSystem = await import('expo-file-system/legacy');
            let fileUri = '';
            if (generatedVerseImage.startsWith('data:image/svg+xml;utf8,')) {
                const encoded = generatedVerseImage.split(',')[1] || '';
                const svg = decodeURIComponent(encoded);
                fileUri = `${FileSystem.documentDirectory}verse-${Date.now()}.svg`;
                await FileSystem.writeAsStringAsync(fileUri, svg, {
                    encoding: (FileSystem as any).EncodingType?.UTF8 || 'utf8',
                });
            } else {
                fileUri = `${FileSystem.documentDirectory}verse-${Date.now()}.jpg`;
                await FileSystem.downloadAsync(generatedVerseImage, fileUri);
            }
            await Share.share({ message: fileUri, url: fileUri });
            toast.success('Image downloaded. Choose Save from the share options.');
        } catch {
            toast.error('Could not download image.');
        } finally {
            setDownloadingVerseImage(false);
        }
    };

    // ── Helpers ────────────────────────────────────────────────────────────
    const getHighlight = (id: string) => highlights.find(h => h.verseId === id);
    const getNote = (id: string) => notes.find(n => n.verseId === id);
    const isBookmarked = (id: string) => bookmarks.some(b => b.verseId === id);
    const slideUp = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

    // ── Red-letter parser ──────────────────────────────────────────────────
    const RED_LETTER_BOOKS = new Set(['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Revelation', 'Revelations']);
    type Segment = { text: string; isJesus: boolean };

    const parseRedLetter = (raw: string): Segment[] => {
        const parts = raw.split(/(\[wj\]|\[\/wj\])/);
        const segs: Segment[] = [];
        let inWJ = false;
        for (const p of parts) {
            if (p === '[wj]') { inWJ = true; continue; }
            if (p === '[/wj]') { inWJ = false; continue; }
            if (p) segs.push({ text: p, isJesus: inWJ });
        }
        return segs.length > 0 ? segs : [{ text: raw, isJesus: false }];
    };

    // ── Verse renderer ─────────────────────────────────────────────────────
    const renderVerse = ({ item }: { item: BibleVerse }) => {
        const highlight = getHighlight(item.id);
        const note = getNote(item.id);
        const bm = isBookmarked(item.id);
        const isSelected = selectedVerses.has(item.verse);
        const useRL = redLetter && RED_LETTER_BOOKS.has(item.book);
        const segments = useRL ? parseRedLetter(item.text) : [{ text: item.text, isJesus: false }];
        const lineHeight = fontSize * lineHeightMultiplier;

        // Background priority:
        // 1. Selected (long-pressed) → bright green like screenshot
        // 2. Saved highlight color → that color at 60% opacity
        // 3. Nothing
        let bgColor: string = 'transparent';
        if (highlight) {
            bgColor = highlight.color + '99'; // 60% opacity
        }

        const textColor = C.verseWhite;
        const numColor = C.verseMuted;

        return (
            <TouchableOpacity
                onPress={() => handleVersePress(item)}
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.85}
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 6,
                    backgroundColor: bgColor,
                    borderLeftWidth: isSelected ? 2 : 0,
                    borderLeftColor: isSelected ? '#4CAF50' : 'transparent',
                    paddingLeft: isSelected ? 18 : 20,
                }}
            >
                <Text
                    style={{
                        fontSize,
                        lineHeight,
                        fontFamily,
                        letterSpacing: 0.2,
                        color: textColor,
                    }}
                >
                    <Text style={{ fontSize: Math.max(11, fontSize * 0.43), color: numColor }}>
                        {item.verse}{' '}
                    </Text>
                    {segments.map((seg, i) => (
                        <Text
                            key={i}
                            style={seg.isJesus ? { color: '#E53030' } : undefined}
                        >
                            {seg.text}
                        </Text>
                    ))}
                </Text>
                {note && (
                    <Text style={{ color: '#7A8A9A', fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>
                        📝 {note.text}
                    </Text>
                )}
                {bm && <BookmarkCheck size={13} color={'#FFD700'} style={{ marginTop: 2 }} />}
                {isSelected && (
                    <View
                        style={{
                            marginTop: 6,
                            height: 2,
                            width: '100%',
                            backgroundColor: '#4CAF50',
                            borderRadius: 1,
                        }}
                    />
                )}
            </TouchableOpacity>
        );
    };

    // ── Sub-screen routing ─────────────────────────────────────────────────
    if (showVersionsScreen) {
        return (
            <VersionsScreen
                onBack={() => setShowVersionsScreen(false)}
                currentVersion={settings.bibleVersion}
                onSelectVersion={(code) => updateSettings({ bibleVersion: code })}
            />
        );
    }
    if (showReferencesScreen) {
        return (
            <ReferencesScreen
                onBack={() => setShowReferencesScreen(false)}
                onSelectChapter={(bookName, chapter) => {
                    const book = BIBLE_BOOKS.find(b => b.name === bookName);
                    if (book) { setSelectedBook(book); setSelectedChapter(chapter); }
                }}
                currentBook={selectedBook.name}
                currentChapter={selectedChapter}
            />
        );
    }

    // ──────────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.readingBg }}>
            <StatusBar style="light" />

            {/*
              TOP TOOLBAR — space-between
              LEFT:  Book name + chapter number (taps → References)
              RIGHT: Volume | Search | ··· Settings | Version pill
            */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingTop: 6,
                paddingBottom: 10,
            }}>
                {/* Book + chapter — left side */}
                <TouchableOpacity
                    onPress={() => setShowReferencesScreen(true)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                    <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: '700' }}>
                        {selectedBook.name}
                    </Text>
                    <Text style={{ color: C.verseMuted, fontSize: 17 }}>
                        {selectedChapter}
                    </Text>
                </TouchableOpacity>

                {/* Icons — right side */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 22 }}>
                    {/* Speaker: toggles TTS, shows VolumeX when speaking */}
                    <TouchableOpacity onPress={toggleSpeech}>
                        {isSpeaking
                            ? <VolumeX size={23} color={C.verseWhite} />
                            : <Volume2 size={23} color={C.iconGrey} />
                        }
                    </TouchableOpacity>

                    {/* Search */}
                    <TouchableOpacity onPress={() => setShowSearch(true)}>
                        <Search size={23} color={C.iconGrey} />
                    </TouchableOpacity>

                    {/* Three dots → Settings modal */}
                    <TouchableOpacity onPress={() => setShowSettings(true)}>
                        <View style={{ flexDirection: 'row', gap: 3.5, alignItems: 'center' }}>
                            {[0, 1, 2].map(i => (
                                <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.iconGrey }} />
                            ))}
                        </View>
                    </TouchableOpacity>

                    {/* Version pill */}
                    <TouchableOpacity
                        onPress={() => setShowVersionsScreen(true)}
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.versionPill, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, gap: 7 }}
                    >
                        <Globe size={15} color={C.verseWhite} />
                        <Text style={{ color: C.verseWhite, fontWeight: '700', fontSize: 14 }}>
                            {currentVersion.code.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bible content */}
            <View style={{ flex: 1 }} {...panResponder.panHandlers}>
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                        <ActivityIndicator size="large" color={C.verseWhite} />
                        <Text style={{ color: C.verseMuted, fontSize: 15 }}>Loading Scripture...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={mainListRef}
                        data={verses}
                        keyExtractor={(item) => item.id}
                        renderItem={renderVerse}
                        extraData={{ selectedVerses, highlights, fontSize, fontFamily, lineHeightMultiplier, redLetter }}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchScripture} tintColor={C.verseWhite} />}
                        ListEmptyComponent={
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <Text style={{ color: C.verseMuted, textAlign: 'center', fontSize: 15 }}>
                                    No verses found. Check your connection.
                                </Text>
                            </View>
                        }
                        onScrollToIndexFailed={(info) => {
                            mainListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                        }}
                        ListFooterComponent={<View style={{ height: 100 }} />}
                    />
                )}
            </View>

            {/*
              BOTTOM BAR — Play/Stop TTS + Chapter nav pill
              Play button goes red with stop icon while speaking
            */}
            <View style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                backgroundColor: C.bottomBar,
                paddingTop: 10, paddingBottom: 24, paddingHorizontal: 16,
                borderTopWidth: 1, borderTopColor: '#232F3E',
                flexDirection: 'row', alignItems: 'center', gap: 10,
            }}>
                {/* Play / Stop */}
                <TouchableOpacity
                    onPress={toggleSpeech}
                    style={{
                        width: 50, height: 50, borderRadius: 25,
                        backgroundColor: isSpeaking ? '#C0392B' : C.chapterPill,
                        alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    {isSpeaking
                        ? <Square size={18} color={C.verseWhite} fill={C.verseWhite} />
                        : <Play size={20} color={C.verseWhite} fill={C.verseWhite} />
                    }
                </TouchableOpacity>

                {/* Chapter nav pill */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.chapterPill, borderRadius: 30, overflow: 'hidden' }}>
                    <TouchableOpacity onPress={handlePrevChapter} style={{ paddingHorizontal: 18, paddingVertical: 14 }}>
                        <ChevronLeft size={20} color={C.verseWhite} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowReferencesScreen(true)} style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ color: C.verseWhite, fontSize: 16, fontWeight: '600' }}>
                            {selectedBook.name} {selectedChapter}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextChapter} style={{ paddingHorizontal: 18, paddingVertical: 14 }}>
                        <ChevronRight size={20} color={C.verseWhite} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Verse Actions Sheet ── */}
            {showVerseActions && selectedVerseForActions && (
                <>
                    {/* Dim backdrop — tap to dismiss */}
                    <Animated.View
                        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', opacity: fadeAnim }}
                        pointerEvents="box-none"
                    >
                        <TouchableOpacity style={{ flex: 1 }} onPress={hideVerseActions} activeOpacity={1} />
                    </Animated.View>

                    {/*
                      Bottom sheet — matches screenshot exactly:
                      1. Drag handle
                      2. Bold verse reference (e.g. "Mishlei (Pro) 1:7")
                      3. Action pills row: Share | Image | Compare | Note | Pray  (scrollable)
                      4. Divider
                      5. Color row: ✕ (remove) | dark-green | light-green | red | pink | sky | yellow…
                    */}
                    <Animated.View
                        style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 20, borderTopRightRadius: 20,
                            paddingBottom: 34,
                            transform: [{ translateY: slideUp }],
                            opacity: fadeAnim,
                            shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: 0.15, shadowRadius: 12, elevation: 20,
                        }}
                    >
                        {/* Drag handle */}
                        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
                            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#CCCCCC' }} />
                        </View>

                        {/* Verse reference */}
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', paddingHorizontal: 20, paddingBottom: 14 }}>
                            {selectedVerseForActions.book} {selectedVerseForActions.chapter}:{selectedVerseForActions.verse}
                        </Text>

                        {/* Action pills — horizontally scrollable */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}
                        >
                            {[
                                {
                                    label: 'Share',
                                    action: handleShare,
                                },
                                {
                                    label: 'Image',
                                    action: () => {
                                        setGeneratedVerseImage(null);
                                        setVerseImageError(false);
                                        setShowImageModal(true);
                                    },
                                },
                                {
                                    label: 'Compare',
                                    action: () => {
                                        setCompareVersion(settings.bibleVersion);
                                        setShowCompareModal(true);
                                    },
                                },
                                {
                                    label: 'Note',
                                    action: () => setShowNoteModal(true),
                                },
                                {
                                    label: 'Copy',
                                    action: async () => {
                                        try {
                                            const { setStringAsync } = await import('expo-clipboard');
                                            await setStringAsync(`${selectedVerseForActions.book} ${selectedVerseForActions.chapter}:${selectedVerseForActions.verse} — ${selectedVerseForActions.text}`);
                                            toast.success('Verse copied to clipboard.');
                                        } catch {
                                            toast.success('Verse copied.');
                                        }
                                        hideVerseActions();
                                    },
                                },
                                {
                                    label: 'Pray',
                                    action: () => toast('Prayer prompt', {
                                        description: `Lord, help me understand ${selectedVerseForActions.book} ${selectedVerseForActions.chapter}:${selectedVerseForActions.verse} and apply it to my life. Amen.`,
                                        duration: 7000,
                                    }),
                                },
                                {
                                    label: 'Bookmark',
                                    action: handleBookmark,
                                },
                            ].map(({ label, action }) => (
                                <TouchableOpacity
                                    key={label}
                                    onPress={action}
                                    style={{
                                        backgroundColor: '#F0F0F0',
                                        borderRadius: 20,
                                        paddingHorizontal: 18,
                                        paddingVertical: 10,
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#222' }}>{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Divider */}
                        <View style={{ height: 1, backgroundColor: '#EEEEEE', marginHorizontal: 16, marginBottom: 16 }} />

                        {/*
                          Color swatch row:
                          First dot = ✕ with active color bg (removes highlight)
                          Then all HIGHLIGHT_COLORS as filled circles
                          Active color has a thin dark border ring
                        */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 }}>
                            {/* Remove / clear highlight */}
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        // Remove existing highlight for this verse
                                        const existing = highlights.find(h => h.verseId === selectedVerseForActions.id);
                                        if (existing) {
                                            await bibleService.removeHighlight(existing.id);
                                            setHighlights(prev => prev.filter(h => h.id !== existing.id));
                                        }
                                        hideVerseActions();
                                    } catch {
                                        toast.error('Could not remove highlight.');
                                    }
                                }}
                                style={{
                                    width: 40, height: 40, borderRadius: 20,
                                    backgroundColor: highlights.find(h => h.verseId === selectedVerseForActions.id)?.color ?? '#4CAF50',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderWidth: 2, borderColor: '#333',
                                }}
                            >
                                <X size={18} color="#FFFFFF" strokeWidth={2.5} />
                            </TouchableOpacity>

                            {/* Color dots */}
                            {[
                                { id: 'green-dark',  color: '#2ECC71' },
                                { id: 'green-light', color: '#A8E6CF' },
                                { id: 'red',         color: '#E74C3C' },
                                { id: 'pink',        color: '#F48FB1' },
                                { id: 'sky',         color: '#B3E5FC' },
                                { id: 'yellow-pale', color: '#FFF59D' },
                                { id: 'yellow',      color: '#FFD700' },
                                { id: 'orange',      color: '#FFA500' },
                            ].map((c) => {
                                const activeHighlight = highlights.find(h => h.verseId === selectedVerseForActions.id);
                                const isActive = activeHighlight?.color === c.color;
                                return (
                                    <TouchableOpacity
                                        key={c.id}
                                        onPress={() => handleHighlight(c.color)}
                                        style={{
                                            width: 36, height: 36, borderRadius: 18,
                                            backgroundColor: c.color,
                                            borderWidth: isActive ? 3 : 1.5,
                                            borderColor: isActive ? '#333' : 'rgba(0,0,0,0.1)',
                                        }}
                                        activeOpacity={0.8}
                                    />
                                );
                            })}
                        </View>
                    </Animated.View>
                </>
            )}

            {/* ── Settings Modal (··· three dots) ── */}
            <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: C.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 }}>

                        {/* Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <Text style={{ color: C.verseWhite, fontSize: 18, fontWeight: '700' }}>Reading Settings</Text>
                            <TouchableOpacity onPress={() => setShowSettings(false)}>
                                <X size={22} color={C.iconGrey} />
                            </TouchableOpacity>
                        </View>

                        {/* ── Font Size ── */}
                        <Text style={{ color: C.verseMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
                            Text Size
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, borderRadius: 14, padding: 14, marginBottom: 20 }}>
                            <TouchableOpacity
                                onPress={() => setFontSize(s => Math.max(14, s - 2))}
                                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#2A3444', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Minus size={18} color={C.verseWhite} />
                            </TouchableOpacity>
                            {/* Preview text at current size */}
                            <Text style={{ color: C.verseWhite, fontSize: fontSize, fontFamily, fontWeight: '400', maxWidth: '55%', textAlign: 'center' }} numberOfLines={1}>
                                Aa {fontSize}px
                            </Text>
                            <TouchableOpacity
                                onPress={() => setFontSize(s => Math.min(48, s + 2))}
                                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#2A3444', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Plus size={18} color={C.verseWhite} />
                            </TouchableOpacity>
                        </View>

                        {/* ── Font Family ── */}
                        <Text style={{ color: C.verseMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
                            Font Style
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                            {(['serif', 'sans-serif'] as const).map(ff => (
                                <TouchableOpacity
                                    key={ff}
                                    onPress={() => setFontFamily(ff)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: fontFamily === ff ? C.accent : C.inputBg,
                                        borderRadius: 12, paddingVertical: 14, alignItems: 'center',
                                        borderWidth: fontFamily === ff ? 0 : 1, borderColor: '#2A3444',
                                    }}
                                >
                                    <Text style={{ color: C.verseWhite, fontSize: 15, fontFamily: ff }}>
                                        {ff === 'serif' ? 'Serif' : 'Sans-Serif'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* ── Line Spacing ── */}
                        <Text style={{ color: C.verseMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
                            Line Spacing
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, borderRadius: 14, padding: 14, marginBottom: 20 }}>
                            <TouchableOpacity
                                onPress={() => setLineHeightMultiplier(v => parseFloat(Math.max(1.1, v - 0.1).toFixed(1)))}
                                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#2A3444', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Minus size={18} color={C.verseWhite} />
                            </TouchableOpacity>
                            <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: '600' }}>
                                {lineHeightMultiplier.toFixed(1)}×
                            </Text>
                            <TouchableOpacity
                                onPress={() => setLineHeightMultiplier(v => parseFloat(Math.min(2.5, v + 0.1).toFixed(1)))}
                                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#2A3444', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Plus size={18} color={C.verseWhite} />
                            </TouchableOpacity>
                        </View>

                        {/* ── Red Letter ── */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 }}>
                            <View>
                                <Text style={{ color: C.verseWhite, fontSize: 15, fontWeight: '600' }}>Red Letter Edition</Text>
                                <Text style={{ color: C.verseMuted, fontSize: 12, marginTop: 2 }}>Words of Jesus shown in red</Text>
                            </View>
                            <Switch
                                value={redLetter}
                                onValueChange={setRedLetter}
                                trackColor={{ false: '#2A3444', true: '#C0392B' }}
                                thumbColor={C.verseWhite}
                                ios_backgroundColor="#2A3444"
                            />
                        </View>

                    </View>
                </View>
            </Modal>

            {/* ── Note Modal ── */}
            <Modal visible={showNoteModal} transparent animationType="slide" onRequestClose={() => setShowNoteModal(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: C.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: '700' }}>Add Note</Text>
                            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                                <X size={22} color={C.iconGrey} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={{ backgroundColor: C.inputBg, borderRadius: 14, padding: 16, color: C.verseWhite, fontSize: 15, minHeight: 120, marginBottom: 16, textAlignVertical: 'top' }}
                            multiline
                            placeholder="Write your note here..."
                            placeholderTextColor="#4A5A6A"
                            value={noteText}
                            onChangeText={setNoteText}
                            autoFocus
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity onPress={() => setShowNoteModal(false)} style={{ flex: 1, backgroundColor: '#2A3444', borderRadius: 14, padding: 16, alignItems: 'center' }}>
                                <Text style={{ color: C.verseWhite, fontSize: 15, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddNote} style={{ flex: 1, backgroundColor: C.accent, borderRadius: 14, padding: 16, alignItems: 'center' }}>
                                <Text style={{ color: C.verseWhite, fontSize: 15, fontWeight: '600' }}>Save Note</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ── Compare Version Modal ── */}
            <Modal visible={showCompareModal} transparent animationType="slide" onRequestClose={() => setShowCompareModal(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: C.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: '700' }}>Compare Versions</Text>
                            <TouchableOpacity onPress={() => setShowCompareModal(false)}>
                                <X size={22} color={C.iconGrey} />
                            </TouchableOpacity>
                        </View>
                        {selectedVerseForActions && (
                            <Text style={{ color: '#7EB8F7', marginBottom: 12, fontWeight: '700' }}>
                                {selectedVerseForActions.book} {selectedVerseForActions.chapter}:{selectedVerseForActions.verse}
                            </Text>
                        )}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 12 }}>
                            {BIBLE_VERSIONS.map(v => (
                                <TouchableOpacity
                                    key={v.code}
                                    onPress={() => setCompareVersion(v.code)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 16,
                                        backgroundColor: compareVersion === v.code ? C.accent : C.inputBg,
                                    }}
                                >
                                    <Text style={{ color: C.verseWhite, fontSize: 12, fontWeight: '700' }}>{v.code.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={{ backgroundColor: C.inputBg, borderRadius: 14, padding: 14, minHeight: 120 }}>
                            {compareLoading ? (
                                <ActivityIndicator color={C.verseWhite} />
                            ) : (
                                <Text style={{ color: C.verseWhite, fontSize: 15, lineHeight: 23 }}>
                                    {compareVerseText || 'Select a version to compare this verse.'}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ── AI Verse Image Modal ── */}
            <Modal visible={showImageModal} transparent animationType="slide" onRequestClose={() => setShowImageModal(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: C.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <Text style={{ color: C.verseWhite, fontSize: 17, fontWeight: '700' }}>AI Verse Image</Text>
                            <TouchableOpacity onPress={() => setShowImageModal(false)}>
                                <X size={22} color={C.iconGrey} />
                            </TouchableOpacity>
                        </View>
                        {selectedVerseForActions && (
                            <Text style={{ color: '#7EB8F7', marginBottom: 10, fontWeight: '700' }}>
                                {selectedVerseForActions.book} {selectedVerseForActions.chapter}:{selectedVerseForActions.verse}
                            </Text>
                        )}
                        <TouchableOpacity
                            onPress={handleGenerateVerseImage}
                            disabled={generatingVerseImage}
                            style={{ backgroundColor: C.accent, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 14, opacity: generatingVerseImage ? 0.7 : 1 }}
                        >
                            <Text style={{ color: C.verseWhite, fontWeight: '700' }}>
                                {generatingVerseImage ? 'Generating...' : 'Generate Image'}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: C.inputBg, borderRadius: 14, minHeight: 180, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {generatedVerseImage ? (
                                generatedVerseImage.startsWith('data:image/svg+xml;utf8,') ? (
                                    <SvgXml
                                        xml={decodeURIComponent(generatedVerseImage.split(',')[1] || '')}
                                        width="100%"
                                        height={260}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: generatedVerseImage }}
                                        style={{ width: '100%', height: 260 }}
                                        resizeMode="cover"
                                        onError={() => {
                                            setVerseImageError(true);
                                            toast.error('Image provider failed. Tap Generate again.');
                                        }}
                                    />
                                )
                            ) : (
                                <Text style={{ color: C.verseMuted, padding: 16, textAlign: 'center' }}>
                                    Tap "Generate Image" to create AI artwork inspired by this verse.
                                </Text>
                            )}
                        </View>
                        {generatedVerseImage && !verseImageError && (
                            <TouchableOpacity
                                onPress={handleDownloadVerseImage}
                                disabled={downloadingVerseImage}
                                style={{
                                    alignSelf: 'flex-end',
                                    marginTop: 10,
                                    backgroundColor: '#2A3444',
                                    borderRadius: 10,
                                    paddingHorizontal: 12,
                                    paddingVertical: 7,
                                    opacity: downloadingVerseImage ? 0.7 : 1,
                                }}
                            >
                                <Text style={{ color: C.verseWhite, fontSize: 12, fontWeight: '700' }}>
                                    {downloadingVerseImage ? 'Saving...' : 'Download'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* ── Search Modal ── */}
            <Modal visible={showSearch} animationType="slide" onRequestClose={() => setShowSearch(false)}>
                <SafeAreaView style={{ flex: 1, backgroundColor: C.readingBg }}>
                    <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>

                        {/* Search bar */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 30, paddingHorizontal: 16, paddingVertical: 11, gap: 10 }}>
                                <Search size={18} color="#666" />
                                <TextInput
                                    style={{ flex: 1, color: C.verseWhite, fontSize: 15 }}
                                    placeholder="Search the Bible..."
                                    placeholderTextColor="#555"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                    onSubmitEditing={handleSearch}
                                    returnKeyType="search"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                                        <X size={16} color="#666" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => { setShowSearch(false); setSearchResults([]); setSearchQuery(''); }}>
                                <Text style={{ color: '#7EB8F7', fontSize: 15, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Searching spinner */}
                        {searching && (
                            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                                <ActivityIndicator color={C.verseWhite} size="large" />
                                <Text style={{ color: C.verseMuted, marginTop: 12, fontSize: 14 }}>Searching...</Text>
                            </View>
                        )}

                        {!searching && (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E2D3E' }}
                                        onPress={() => {
                                            const book = BIBLE_BOOKS.find(b => b.name === item.book);
                                            if (book) {
                                                setSelectedBook(book);
                                                setSelectedChapter(item.chapter);
                                                setShowSearch(false);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }
                                        }}
                                    >
                                        <Text style={{ color: '#7EB8F7', fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                                            {item.book} {item.chapter}:{item.verse}
                                        </Text>
                                        <Text style={{ color: C.verseWhite, fontSize: 14, lineHeight: 20 }} numberOfLines={3}>
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    searchQuery.trim() && !searchResults.length ? (
                                        <View style={{ paddingTop: 60, alignItems: 'center' }}>
                                            <Text style={{ color: C.verseMuted, fontSize: 15 }}>No results found</Text>
                                            <Text style={{ color: C.verseMuted, fontSize: 12, marginTop: 6 }}>Try a different word or phrase</Text>
                                        </View>
                                    ) : !searchQuery.trim() ? (
                                        <View style={{ paddingTop: 60, alignItems: 'center' }}>
                                            <Search size={48} color={C.verseMuted} />
                                            <Text style={{ color: C.verseMuted, fontSize: 15, marginTop: 16 }}>Search the Bible</Text>
                                            <Text style={{ color: C.verseMuted, fontSize: 12, marginTop: 6 }}>Type a word, phrase, or reference</Text>
                                        </View>
                                    ) : null
                                }
                            />
                        )}
                    </View>
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    );
}
