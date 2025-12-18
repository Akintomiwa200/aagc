import React, { useState } from 'react';
import { Plus, Save, Trash2, ArrowLeft, PenTool, Calendar } from 'lucide-react';
import { useNotes } from '../hooks/useAppHooks';
import { Note } from '../types';

export const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
      setIsCreating(true);
      setTitle('');
      setContent('');
      setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
      setIsCreating(true);
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
  };

  const handleSave = () => {
      if (!content.trim()) return;
      
      if (editingNote) {
          updateNote(editingNote.id, title, content);
      } else {
          addNote(title, content);
      }
      setIsCreating(false);
  };

  const handleDelete = () => {
      if (editingNote) {
          deleteNote(editingNote.id);
          setIsCreating(false);
      }
  };

  if (isCreating) {
      return (
          <div className="min-h-screen bg-white dark:bg-black flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-black z-10">
                  <button onClick={() => setIsCreating(false)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
                      <ArrowLeft />
                  </button>
                  <div className="flex gap-2">
                      {editingNote && (
                          <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                              <Trash2 size={20} />
                          </button>
                      )}
                      <button onClick={handleSave} className="px-4 py-2 bg-primary-500 text-white rounded-lg font-bold flex items-center gap-2">
                          <Save size={18} /> Save
                      </button>
                  </div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                  <input 
                    type="text" 
                    placeholder="Sermon Title..." 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 dark:text-white mb-4 w-full"
                  />
                  <textarea 
                    placeholder="Start typing your notes here..." 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full resize-none bg-transparent border-none outline-none text-lg text-gray-700 dark:text-gray-300 leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-800"
                  />
              </div>
          </div>
      );
  }

  return (
    <div className="pb-24 p-4 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-primary-400">My Notes</h1>
          <button 
            onClick={handleCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-primary-500/30"
          >
              <Plus size={24} />
          </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => handleEdit(note)}
                className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-primary-300 transition-colors group"
              >
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg group-hover:text-primary-500 transition-colors">{note.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-3">{note.content}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      {new Date(note.date).toLocaleDateString()}
                  </div>
              </div>
          ))}
          {notes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <PenTool size={48} className="opacity-20 mb-4" />
                  <p>No notes yet. Tap + to create one.</p>
              </div>
          )}
      </div>
    </div>
  );
};
