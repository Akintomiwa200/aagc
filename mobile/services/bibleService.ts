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

// Initialize with safe defaults
const initialHighlights: Highlight[] = [];
const initialBookmarks: Bookmark[] = [];
const initialNotes: Note[] = [];

// Move BIBLE_VERSIONS and HIGHLIGHT_COLORS outside the class as constants
export const BIBLE_VERSIONS = [
    { code: "kjv", name: "King James Version", language: "English" },
    { code: "web", name: "World English Bible", language: "English" },
    { code: "asv", name: "American Standard Version", language: "English" },
    { code: "bbe", name: "Bible in Basic English", language: "English" },
    { code: "niv", name: "New International Version", language: "English" },
    { code: "esv", name: "English Standard Version", language: "English" },
    { code: "nlt", name: "New Living Translation", language: "English" },
    { code: "nasb", name: "New American Standard Bible", language: "English" },
    { code: "amp", name: "Amplified Bible", language: "English" },
    { code: "csb", name: "Christian Standard Bible", language: "English" },
    { code: "msg", name: "The Message", language: "English" },
    { code: "leb", name: "Lexham English Bible", language: "English" },
];

export const HIGHLIGHT_COLORS = [
    { id: 'yellow', color: '#FFD700', name: 'Yellow' },
    { id: 'green', color: '#90EE90', name: 'Green' },
    { id: 'blue', color: '#87CEEB', name: 'Blue' },
    { id: 'pink', color: '#FFB6C1', name: 'Pink' },
    { id: 'orange', color: '#FFA500', name: 'Orange' },
    { id: 'purple', color: '#DDA0DD', name: 'Purple' },
];

class BibleService {
    private baseURL = 'https://bible-api.com';

    // Remove static keyword and reference the constants
    BIBLE_VERSIONS = BIBLE_VERSIONS;
    HIGHLIGHT_COLORS = HIGHLIGHT_COLORS;

    async getChapter(book: string, chapter: number, version: string): Promise<BibleVerse[]> {
        try {
            // Clean book name (remove spaces for URL)
            const cleanBook = book.replace(/\s+/g, '');
            
            const response = await fetch(
                `${this.baseURL}/${cleanBook}+${chapter}?translation=${version}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch chapter');
            }
            
            const data = await response.json();
            
            if (data.verses && Array.isArray(data.verses)) {
                return data.verses.map((verse: any) => ({
                    id: `${book}-${chapter}-${verse.verse}-${version}`,
                    book,
                    chapter,
                    verse: verse.verse,
                    text: verse.text ? verse.text.trim() : '',
                    version,
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Failed to fetch chapter:', error);
            return [];
        }
    }

    // Highlight Management
    async saveHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<Highlight> {
        try {
            const highlights = await this.getHighlights();
            const newHighlight: Highlight = {
                ...highlight,
                id: Date.now().toString(),
                createdAt: new Date(),
            };
            
            const updatedHighlights = [...(highlights || []), newHighlight];
            await AsyncStorage.setItem('bible_highlights', JSON.stringify(updatedHighlights));
            
            return newHighlight;
        } catch (error) {
            console.error('Error saving highlight:', error);
            throw error;
        }
    }

    async getHighlights(): Promise<Highlight[]> {
        try {
            const highlights = await AsyncStorage.getItem('bible_highlights');
            return highlights ? JSON.parse(highlights) : initialHighlights;
        } catch (error) {
            console.error('Error getting highlights:', error);
            return initialHighlights;
        }
    }

    async getVerseHighlight(verseId: string): Promise<Highlight | undefined> {
        try {
            const highlights = await this.getHighlights();
            return highlights?.find(h => h.verseId === verseId);
        } catch (error) {
            console.error('Error getting verse highlight:', error);
            return undefined;
        }
    }

    async removeHighlight(highlightId: string): Promise<void> {
        try {
            const highlights = await this.getHighlights();
            const updated = highlights?.filter(h => h.id !== highlightId) || [];
            await AsyncStorage.setItem('bible_highlights', JSON.stringify(updated));
        } catch (error) {
            console.error('Error removing highlight:', error);
        }
    }

    // Bookmarks Management
    async saveBookmark(verseId: string): Promise<Bookmark> {
        try {
            const bookmarks = await this.getBookmarks();
            const newBookmark: Bookmark = {
                id: Date.now().toString(),
                verseId,
                createdAt: new Date(),
            };
            
            const updated = [...(bookmarks || []), newBookmark];
            await AsyncStorage.setItem('bible_bookmarks', JSON.stringify(updated));
            
            return newBookmark;
        } catch (error) {
            console.error('Error saving bookmark:', error);
            throw error;
        }
    }

    async getBookmarks(): Promise<Bookmark[]> {
        try {
            const bookmarks = await AsyncStorage.getItem('bible_bookmarks');
            return bookmarks ? JSON.parse(bookmarks) : initialBookmarks;
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return initialBookmarks;
        }
    }

    async isVerseBookmarked(verseId: string): Promise<boolean> {
        try {
            const bookmarks = await this.getBookmarks();
            return bookmarks?.some(b => b.verseId === verseId) || false;
        } catch (error) {
            console.error('Error checking bookmark:', error);
            return false;
        }
    }

    async removeBookmark(bookmarkId: string): Promise<void> {
        try {
            const bookmarks = await this.getBookmarks();
            const updated = bookmarks?.filter(b => b.id !== bookmarkId) || [];
            await AsyncStorage.setItem('bible_bookmarks', JSON.stringify(updated));
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    }

    // Notes Management
    async saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
        try {
            const notes = await this.getNotes();
            const newNote: Note = {
                ...note,
                id: Date.now().toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            
            const updated = [...(notes || []), newNote];
            await AsyncStorage.setItem('bible_notes', JSON.stringify(updated));
            
            return newNote;
        } catch (error) {
            console.error('Error saving note:', error);
            throw error;
        }
    }

    async getNotes(): Promise<Note[]> {
        try {
            const notes = await AsyncStorage.getItem('bible_notes');
            return notes ? JSON.parse(notes) : initialNotes;
        } catch (error) {
            console.error('Error getting notes:', error);
            return initialNotes;
        }
    }

    async getVerseNote(verseId: string): Promise<Note | undefined> {
        try {
            const notes = await this.getNotes();
            return notes?.find(n => n.verseId === verseId);
        } catch (error) {
            console.error('Error getting verse note:', error);
            return undefined;
        }
    }

    async updateNote(noteId: string, text: string): Promise<Note> {
        try {
            const notes = await this.getNotes();
            const noteIndex = notes?.findIndex(n => n.id === noteId) ?? -1;
            
            if (noteIndex === -1) {
                throw new Error('Note not found');
            }
            
            if (!notes) throw new Error('No notes found');
            
            notes[noteIndex].text = text;
            notes[noteIndex].updatedAt = new Date();
            
            await AsyncStorage.setItem('bible_notes', JSON.stringify(notes));
            
            return notes[noteIndex];
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

    async removeNote(noteId: string): Promise<void> {
        try {
            const notes = await this.getNotes();
            const updated = notes?.filter(n => n.id !== noteId) || [];
            await AsyncStorage.setItem('bible_notes', JSON.stringify(updated));
        } catch (error) {
            console.error('Error removing note:', error);
        }
    }

    // Search Functionality
    async searchScripture(query: string, version: string): Promise<BibleVerse[]> {
        try {
            const response = await fetch(
                `${this.baseURL}/search?q=${encodeURIComponent(query)}&version=${version}`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.results || [];
            }
            
            return [];
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    // Get reading progress
    async getReadingProgress(): Promise<Record<string, number>> {
        try {
            const progress = await AsyncStorage.getItem('reading_progress');
            return progress ? JSON.parse(progress) : {};
        } catch (error) {
            console.error('Error getting reading progress:', error);
            return {};
        }
    }

    async saveReadingProgress(book: string, chapter: number): Promise<void> {
        try {
            const progress = await this.getReadingProgress();
            const updatedProgress = { ...progress, [book]: chapter };
            await AsyncStorage.setItem('reading_progress', JSON.stringify(updatedProgress));
        } catch (error) {
            console.error('Error saving reading progress:', error);
        }
    }
}

export const bibleService = new BibleService();