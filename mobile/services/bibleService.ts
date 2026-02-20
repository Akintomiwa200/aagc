// services/bibleService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BibleVerse {
    id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    version: string;
}

export interface Highlight {
    id: string;
    verseId: string;
    color: string;
    createdAt: Date;
    note?: string;
}

export interface Bookmark {
    id: string;
    verseId: string;
    createdAt: Date;
}

export interface Note {
    id: string;
    verseId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

export const BIBLE_VERSIONS = [
    { code: 'kjv', name: 'King James Version', language: 'English' },
    { code: 'web', name: 'World English Bible', language: 'English' },
    { code: 'asv', name: 'American Standard Version', language: 'English' },
    { code: 'bbe', name: 'Bible in Basic English', language: 'English' },
    { code: 'niv', name: 'New International Version', language: 'English' },
    { code: 'esv', name: 'English Standard Version', language: 'English' },
    { code: 'nlt', name: 'New Living Translation', language: 'English' },
    { code: 'nasb', name: 'New American Standard Bible', language: 'English' },
    { code: 'amp', name: 'Amplified Bible', language: 'English' },
    { code: 'csb', name: 'Christian Standard Bible', language: 'English' },
    { code: 'msg', name: 'The Message', language: 'English' },
    { code: 'leb', name: 'Lexham English Bible', language: 'English' },
    { code: 'tpt', name: 'The Passion Translation', language: 'English' },
    { code: 'pcm', name: 'Holy Bible Nigerian Pidgin English', language: 'Pidgin' },
    { code: 'ybcv', name: 'Bibeli Mimọ', language: 'Yoruba' },
] as const;

export const HIGHLIGHT_COLORS = [
    { id: 'yellow', color: '#FFD700', name: 'Yellow' },
    { id: 'green', color: '#90EE90', name: 'Green' },
    { id: 'blue', color: '#87CEEB', name: 'Blue' },
    { id: 'pink', color: '#FFB6C1', name: 'Pink' },
    { id: 'orange', color: '#FFA500', name: 'Orange' },
    { id: 'purple', color: '#DDA0DD', name: 'Purple' },
] as const;

// Storage keys
const KEYS = {
    highlights: 'bible_highlights',
    bookmarks: 'bible_bookmarks',
    notes: 'bible_notes',
    progress: 'reading_progress',
    votdPrefix: 'votd_',
    cachePrefix: 'bible_cache_',
} as const;

class BibleService {
    private readonly baseURL = 'https://bible-api.com';

    // ── Chapter fetching with caching ───────────────────────────────────────
    async getChapter(book: string, chapter: number, version: string): Promise<BibleVerse[]> {
        const cacheKey = `${KEYS.cachePrefix}${book}_${chapter}_${version}`;

        try {
            // Return cached data if available and valid
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) {
                const parsed: BibleVerse[] = JSON.parse(cached);
                if (parsed.length > 0 && parsed[0].text) return parsed;
            }

            // Fetch from API — bible-api.com uses "bookname+chapter" format
            const cleanBook = book.replace(/\s+/g, '');
            const res = await fetch(`${this.baseURL}/${cleanBook}+${chapter}?translation=${version}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            if (!Array.isArray(data.verses) || data.verses.length === 0) return [];

            const verses: BibleVerse[] = data.verses.map((v: any) => ({
                id: `${book}-${chapter}-${v.verse}-${version}`,
                book,
                chapter,
                verse: v.verse,
                text: (v.text ?? '').trim(),
                version,
            }));

            await AsyncStorage.setItem(cacheKey, JSON.stringify(verses));
            return verses;
        } catch (error) {
            console.error('getChapter error:', error);
            // Fall back to cache on network error
            const cached = await AsyncStorage.getItem(cacheKey);
            return cached ? JSON.parse(cached) : [];
        }
    }

    // ── Verse of the Day ────────────────────────────────────────────────────
    async getVerseOfTheDay(version = 'kjv'): Promise<BibleVerse | null> {
        const today = new Date().toISOString().split('T')[0];
        const key = `${KEYS.votdPrefix}${today}_${version}`;

        try {
            const cached = await AsyncStorage.getItem(key);
            if (cached) return JSON.parse(cached);

            const res = await fetch(`${this.baseURL}/?random=verse&translation=${version}`);
            if (!res.ok) return null;

            const data = await res.json();
            const raw = data.verses?.[0];
            if (!raw) return null;

            const verse: BibleVerse = {
                id: `votd-${today}`,
                book: raw.book_name,
                chapter: raw.chapter,
                verse: raw.verse,
                text: raw.text.trim(),
                version,
            };

            await AsyncStorage.setItem(key, JSON.stringify(verse));
            return verse;
        } catch (error) {
            console.error('getVerseOfTheDay error:', error);
            return null;
        }
    }

    // ── Highlights ──────────────────────────────────────────────────────────
    async getHighlights(): Promise<Highlight[]> {
        try {
            const data = await AsyncStorage.getItem(KEYS.highlights);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async saveHighlight(payload: Pick<Highlight, 'verseId' | 'color'>): Promise<Highlight> {
        const existing = await this.getHighlights();
        const highlight: Highlight = {
            id: Date.now().toString(),
            verseId: payload.verseId,
            color: payload.color,
            createdAt: new Date(),
        };
        await AsyncStorage.setItem(KEYS.highlights, JSON.stringify([...existing, highlight]));
        return highlight;
    }

    async removeHighlight(highlightId: string): Promise<void> {
        const existing = await this.getHighlights();
        await AsyncStorage.setItem(
            KEYS.highlights,
            JSON.stringify(existing.filter(h => h.id !== highlightId))
        );
    }

    async getVerseHighlight(verseId: string): Promise<Highlight | undefined> {
        const all = await this.getHighlights();
        return all.find(h => h.verseId === verseId);
    }

    // ── Bookmarks ───────────────────────────────────────────────────────────
    async getBookmarks(): Promise<Bookmark[]> {
        try {
            const data = await AsyncStorage.getItem(KEYS.bookmarks);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async saveBookmark(verseId: string): Promise<Bookmark> {
        const existing = await this.getBookmarks();
        const bookmark: Bookmark = {
            id: Date.now().toString(),
            verseId,
            createdAt: new Date(),
        };
        await AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify([...existing, bookmark]));
        return bookmark;
    }

    async removeBookmark(bookmarkId: string): Promise<void> {
        const existing = await this.getBookmarks();
        await AsyncStorage.setItem(
            KEYS.bookmarks,
            JSON.stringify(existing.filter(b => b.id !== bookmarkId))
        );
    }

    async isVerseBookmarked(verseId: string): Promise<boolean> {
        const all = await this.getBookmarks();
        return all.some(b => b.verseId === verseId);
    }

    // ── Notes ───────────────────────────────────────────────────────────────
    async getNotes(): Promise<Note[]> {
        try {
            const data = await AsyncStorage.getItem(KEYS.notes);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async saveNote(payload: Pick<Note, 'verseId' | 'text'>): Promise<Note> {
        const existing = await this.getNotes();
        const now = new Date();
        const note: Note = {
            id: Date.now().toString(),
            verseId: payload.verseId,
            text: payload.text,
            createdAt: now,
            updatedAt: now,
        };
        await AsyncStorage.setItem(KEYS.notes, JSON.stringify([...existing, note]));
        return note;
    }

    async updateNote(noteId: string, text: string): Promise<Note> {
        const all = await this.getNotes();
        const index = all.findIndex(n => n.id === noteId);
        if (index === -1) throw new Error(`Note ${noteId} not found`);
        all[index] = { ...all[index], text, updatedAt: new Date() };
        await AsyncStorage.setItem(KEYS.notes, JSON.stringify(all));
        return all[index];
    }

    async removeNote(noteId: string): Promise<void> {
        const existing = await this.getNotes();
        await AsyncStorage.setItem(
            KEYS.notes,
            JSON.stringify(existing.filter(n => n.id !== noteId))
        );
    }

    async getVerseNote(verseId: string): Promise<Note | undefined> {
        const all = await this.getNotes();
        return all.find(n => n.verseId === verseId);
    }

    // ── Search ──────────────────────────────────────────────────────────────
    async searchScripture(query: string, version: string): Promise<BibleVerse[]> {
        try {
            const res = await fetch(
                `${this.baseURL}/search?q=${encodeURIComponent(query)}&version=${version}`
            );
            if (!res.ok) return [];
            const data = await res.json();
            return data.results ?? [];
        } catch (error) {
            console.error('searchScripture error:', error);
            return [];
        }
    }

    // ── Reading Progress ────────────────────────────────────────────────────
    async getReadingProgress(): Promise<Record<string, number>> {
        try {
            const data = await AsyncStorage.getItem(KEYS.progress);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    }

    async saveReadingProgress(book: string, chapter: number): Promise<void> {
        try {
            const progress = await this.getReadingProgress();
            await AsyncStorage.setItem(
                KEYS.progress,
                JSON.stringify({ ...progress, [book]: chapter })
            );
        } catch (error) {
            console.error('saveReadingProgress error:', error);
        }
    }
}

export const bibleService = new BibleService();