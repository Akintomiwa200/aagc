'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNotes = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await apiService.getNotes(user._id);
      setNotes(data || []);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleSave = async () => {
    if (!title.trim() || !user?._id) return;

    try {
      if (editingNote) {
        await apiService.updateNote(editingNote._id, { title, content });
      } else {
        await apiService.createNote({ title, content, userId: user._id });
      }
      setTitle('');
      setContent('');
      setShowEditor(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await apiService.deleteNote(id);
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setShowEditor(false);
    setEditingNote(null);
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ArrowLeft className="text-gray-900 dark:text-white" size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h1>
          </div>
          {!showEditor && (
            <button
              onClick={() => setShowEditor(true)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {showEditor && (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-4 space-y-3">
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={16} className="inline mr-1" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save size={16} className="inline mr-1" /> Save
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note._id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{note.title}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(note)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <Pencil size={14} className="text-gray-500" />
                    </button>
                    <button onClick={() => handleDelete(note._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No notes yet. Create your first note!</p>
          </div>
        )}
      </div>
    </div>
  );
}
