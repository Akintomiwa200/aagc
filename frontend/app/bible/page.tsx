'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, BookOpen, ChevronDown, ChevronRight, MessageCircle, Highlighter, Bookmark } from 'lucide-react';
import { BIBLE_VERSIONS, BIBLE_BOOKS } from '@/constants/bible';

interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

interface Highlight {
  id: string;
  verseId: string;
  color: string;
}

interface Bookmark {
  id: string;
  verseId: string;
}

const HIGHLIGHT_COLORS = [
  { id: 'yellow', color: '#FFD700', name: 'Yellow' },
  { id: 'green', color: '#90EE90', name: 'Green' },
  { id: 'blue', color: '#87CEEB', name: 'Blue' },
  { id: 'pink', color: '#FFB6C1', name: 'Pink' },
];

export default function BiblePage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showVersionSelector, setShowVersionSelector] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [showHighlighter, setShowHighlighter] = useState(false);

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    try {
      const cleanBook = selectedBook.replace(/\s+/g, '');
      const res = await fetch(
        `https://bible-api.com/${cleanBook}+${selectedChapter}?translation=${selectedVersion}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (!Array.isArray(data.verses)) {
        setVerses([]);
        return;
      }
      const bibleVerses: BibleVerse[] = data.verses.map((v: any) => ({
        id: `${selectedBook}-${selectedChapter}-${v.verse}-${selectedVersion}`,
        book: selectedBook,
        chapter: selectedChapter,
        verse: v.verse,
        text: (v.text ?? '').trim(),
        version: selectedVersion,
      }));
      setVerses(bibleVerses);
      localStorage.setItem('bible_progress', JSON.stringify({ book: selectedBook, chapter: selectedChapter }));
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

  useEffect(() => {
    fetchChapter();
    loadUserData();
  }, [fetchChapter]);

  const loadUserData = () => {
    try {
      const savedHighlights = localStorage.getItem('bible_highlights');
      const savedBookmarks = localStorage.getItem('bible_bookmarks');
      if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const toggleHighlight = (verseId: string) => {
    const existing = highlights.find(h => h.verseId === verseId);
    if (existing) {
      const updated = highlights.filter(h => h.verseId !== verseId);
      setHighlights(updated);
      localStorage.setItem('bible_highlights', JSON.stringify(updated));
    } else {
      setSelectedVerse(verseId);
      setShowHighlighter(true);
    }
  };

  const applyHighlight = (color: string) => {
    if (!selectedVerse) return;
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      verseId: selectedVerse,
      color,
    };
    const updated = [...highlights, newHighlight];
    setHighlights(updated);
    localStorage.setItem('bible_highlights', JSON.stringify(updated));
    setShowHighlighter(false);
    setSelectedVerse(null);
  };

  const toggleBookmark = (verseId: string) => {
    const existing = bookmarks.find(b => b.verseId === verseId);
    if (existing) {
      const updated = bookmarks.filter(b => b.verseId !== verseId);
      setBookmarks(updated);
      localStorage.setItem('bible_bookmarks', JSON.stringify(updated));
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        verseId,
      };
      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      localStorage.setItem('bible_bookmarks', JSON.stringify(updated));
    }
  };

  const isVerseHighlighted = (verseId: string) => highlights.find(h => h.verseId === verseId);
  const isVerseBookmarked = (verseId: string) => bookmarks.some(b => b.verseId === verseId);

  const oldTestament = BIBLE_BOOKS.filter(b => b.testament === 'old');
  const newTestament = BIBLE_BOOKS.filter(b => b.testament === 'new');

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-900 dark:text-white" size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bible</h1>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setShowBookSelector(!showBookSelector); setShowVersionSelector(false); }}
            className="flex-1 flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <span className="font-medium text-gray-900 dark:text-white">{selectedBook}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => { setShowVersionSelector(!showVersionSelector); setShowBookSelector(false); }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedVersion.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <Search size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {showBookSelector && (
          <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-h-64 overflow-y-auto z-20 p-2">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase px-2 py-1">Old Testament</h3>
              {oldTestament.map(book => (
                <button
                  key={book.name}
                  onClick={() => { setSelectedBook(book.name); setShowBookSelector(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedBook === book.name ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {book.name}
                </button>
              ))}
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase px-2 py-1">New Testament</h3>
              {newTestament.map(book => (
                <button
                  key={book.name}
                  onClick={() => { setSelectedBook(book.name); setShowBookSelector(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedBook === book.name ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {book.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {showVersionSelector && (
          <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20 p-2">
            {BIBLE_VERSIONS.map(version => (
              <button
                key={version.code}
                onClick={() => { setSelectedVersion(version.code); setShowVersionSelector(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedVersion === version.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {version.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ChevronRight size={18} className="rotate-180 text-gray-700 dark:text-gray-300" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Chapter {selectedChapter}</span>
          <button
            onClick={() => setSelectedChapter(selectedChapter + 1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {verses.map(verse => {
              const highlight = isVerseHighlighted(verse.id);
              const isBookmarked = isVerseBookmarked(verse.id);
              return (
                <div
                  key={verse.id}
                  className={`p-3 rounded-lg ${highlight ? '' : 'bg-white dark:bg-gray-900'} border border-gray-100 dark:border-gray-800`}
                  style={highlight ? { backgroundColor: highlight.color + '40' } : {}}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-blue-600 min-w-[20px] mt-1">{verse.verse}</span>
                    <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed">{verse.text}</p>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => toggleHighlight(verse.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <Highlighter size={14} className={highlight ? 'text-blue-600' : 'text-gray-400'} />
                    </button>
                    <button onClick={() => toggleBookmark(verse.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <Bookmark size={14} className={isBookmarked ? 'text-yellow-600 fill-yellow-600' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showHighlighter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowHighlighter(false)}>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Choose Highlight Color</h3>
            <div className="flex gap-3">
              {HIGHLIGHT_COLORS.map(hc => (
                <button
                  key={hc.id}
                  onClick={() => applyHighlight(hc.color)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: hc.color }}
                  title={hc.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
