import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Send, X, Book as BookIcon, Volume2, ArrowLeft, ChevronRight, Clock, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { askBibleAi } from '../services/geminiService';
import { ChatMessage, ChatSession } from '../types';

// Extended Bible Data
const BIBLE_VERSIONS = ['NIV', 'KJV', 'ESV', 'NLT', 'MSG', 'NKJV'];

const OLD_TESTAMENT = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes'
];

const NEW_TESTAMENT = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

// Mock Text Generator to simulate full bible
const getBibleText = (book: string, chapter: number, version: string) => {
    if (book === 'John' && chapter === 3) {
        return `[${version}] 1 Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council. 2 He came to Jesus at night and said, “Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.”

3 Jesus replied, “Very truly I tell you, no one can see the kingdom of God unless they are born again.”

4 “How can someone be born when they are old?” Nicodemus asked. “Surely they cannot enter a second time into their mother’s womb to be born!”

5 Jesus answered, “Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit. 6 Flesh gives birth to flesh, but the Spirit gives birth to spirit.`;
    }

    if (book === 'Psalms' && chapter === 23) {
        return `[${version}] 1 The Lord is my shepherd; I shall not want.
2 He maketh me to lie down in green pastures: he leadeth me beside the still waters.
3 He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.
4 Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.`;
    }

    return `[${version}] Chapter ${chapter} of ${book} \n\n1 In the beginning was the Word, and the Word was with God, and the Word was God. 2 The same was in the beginning with God. 3 All things were made by him; and without him was not any thing made that was made. \n\n4 In him was life; and the life was the light of men. 5 And the light shineth in darkness; and the darkness comprehended it not.`;
};

export const Bible: React.FC = () => {
  const [version, setVersion] = useState('NIV');
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(3);
  
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navTab, setNavTab] = useState<'books' | 'chapters'>('books');
  const [tempBook, setTempBook] = useState(book);

  const [showAiChat, setShowAiChat] = useState(false);
  const [chatView, setChatView] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
      try {
          const stored = localStorage.getItem('bible_ai_sessions');
          return stored ? JSON.parse(stored) : [];
      } catch {
          return [];
      }
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showAiChat, chatView]);

  useEffect(() => {
      localStorage.setItem('bible_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleBookSelect = (b: string) => {
      setTempBook(b);
      setNavTab('chapters');
  };

  const handleChapterSelect = (c: number) => {
      setBook(tempBook);
      setChapter(c);
      setIsNavOpen(false);
      setNavTab('books');
  };

  const handleNextChapter = () => setChapter(c => c + 1);
  const handlePrevChapter = () => { if (chapter > 1) setChapter(c => c - 1); };

  const saveCurrentSession = (updatedMessages: ChatMessage[], previewText: string) => {
    const id = activeSessionId || Date.now().toString();
    const existingSession = sessions.find(s => s.id === id);
    const title = existingSession ? existingSession.title : `${book} ${chapter} Exegesis`;
    
    const updatedSession: ChatSession = {
        id,
        title,
        date: new Date(),
        messages: updatedMessages,
        preview: previewText
    };

    setSessions(prev => {
        const exists = prev.find(s => s.id === id);
        if (exists) {
            return prev.map(s => s.id === id ? updatedSession : s);
        }
        return [updatedSession, ...prev];
    });

    if (!activeSessionId) setActiveSessionId(id);
  };

  const handleAskAi = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const currentText = getBibleText(book, chapter, version);
    const responseText = await askBibleAi(input, currentText);

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    const finalMessages = [...newMessages, aiMsg];
    
    setMessages(finalMessages);
    setLoading(false);
    
    saveCurrentSession(finalMessages, responseText.slice(0, 50) + '...');
  };

  const handleNewChat = () => {
      setActiveSessionId(null);
      setMessages([]);
      setChatView('chat');
  };

  const handleLoadSession = (session: ChatSession) => {
      setActiveSessionId(session.id);
      setMessages(session.messages);
      setChatView('chat');
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSessionId === id) handleNewChat();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white dark:bg-black">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 h-14 flex items-center justify-between px-4 z-20 shadow-sm sticky top-0">
         <Link to="/" className="p-2 -ml-2 rounded-full text-gray-600 dark:text-gray-300">
            <ArrowLeft size={20} />
         </Link>

         <button 
            onClick={() => setIsNavOpen(true)}
            className="flex-1 mx-4 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
         >
            {book} {chapter} <ChevronDown size={14} />
         </button>

         <div className="flex items-center gap-3">
             <button onClick={() => {
                 const idx = BIBLE_VERSIONS.indexOf(version);
                 const next = BIBLE_VERSIONS[(idx + 1) % BIBLE_VERSIONS.length];
                 setVersion(next);
             }} className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                 {version}
             </button>
             <button className="text-gray-400">
                <Volume2 size={20} />
             </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative bg-gray-50/30 dark:bg-black" id="bible-content">
         <div className="max-w-xl mx-auto">
             <div className="text-center mb-10">
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-2 block">Scripture</span>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight font-serif">{book} {chapter}</h2>
             </div>
             
             <div className="prose dark:prose-invert prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-[2.2rem] font-serif">
                 {getBibleText(book, chapter, version).split('\n').map((paragraph, idx) => (
                     <p key={idx} className="mb-6 drop-shadow-sm">{paragraph}</p>
                 ))}
             </div>
             
             {/* Chapter Nav Footer */}
             <div className="flex justify-between mt-16 mb-24">
                 <button onClick={handlePrevChapter} className="flex items-center gap-2 text-primary-600 font-black uppercase text-xs tracking-widest disabled:opacity-30" disabled={chapter <= 1}>
                    <ArrowLeft size={16} /> Prev
                 </button>
                 <button onClick={handleNextChapter} className="flex items-center gap-2 text-primary-600 font-black uppercase text-xs tracking-widest">
                    Next <ChevronRight size={16} />
                 </button>
             </div>
         </div>
      </div>

      {/* Navigation Modal */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex gap-6">
                    <button onClick={() => setNavTab('books')} className={`text-xl font-black pb-1 uppercase tracking-widest ${navTab === 'books' ? 'text-primary-600 border-b-4 border-primary-600' : 'text-gray-300'}`}>Books</button>
                    <button onClick={() => setNavTab('chapters')} className={`text-xl font-black pb-1 uppercase tracking-widest ${navTab === 'chapters' ? 'text-primary-600 border-b-4 border-primary-600' : 'text-gray-300'}`}>Chapters</button>
                </div>
                <button onClick={() => setIsNavOpen(false)} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black p-4">
                {navTab === 'books' ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-2">Old Covenant</h3>
                            <div className="grid grid-cols-1 gap-1">
                                {OLD_TESTAMENT.map(b => (
                                    <button 
                                        key={b} 
                                        onClick={() => handleBookSelect(b)}
                                        className={`text-left px-5 py-4 rounded-2xl font-bold text-base transition-all ${tempBook === b ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-2">New Covenant</h3>
                            <div className="grid grid-cols-1 gap-1">
                                {NEW_TESTAMENT.map(b => (
                                    <button 
                                        key={b} 
                                        onClick={() => handleBookSelect(b)}
                                        className={`text-left px-5 py-4 rounded-2xl font-bold text-base transition-all ${tempBook === b ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-2">
                        <div className="flex items-center gap-3 mb-8">
                             <button onClick={() => setNavTab('books')} className="p-2 bg-primary-50 rounded-xl text-primary-600">
                                <ArrowLeft size={20} />
                             </button>
                             <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{tempBook}</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: 50 }, (_, i) => i + 1).map(c => (
                                <button 
                                    key={c}
                                    onClick={() => handleChapterSelect(c)}
                                    className="aspect-square flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-lg font-black text-gray-700 dark:text-gray-200 active:bg-primary-600 active:text-white transition-colors shadow-sm"
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* AI Button */}
      <button 
        onClick={() => {
            setShowAiChat(true);
            if (!activeSessionId && sessions.length > 0) setChatView('history');
            else setChatView('chat');
        }}
        className="fixed bottom-24 right-6 z-30 w-16 h-16 bg-gradient-to-tr from-primary-600 to-primary-400 text-white rounded-[2rem] shadow-2xl flex items-center justify-center animate-bounce duration-[3000ms]"
      >
        <Sparkles size={28} />
      </button>

      {/* AI Chat Modal */}
      {showAiChat && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-center items-end sm:items-center p-0 sm:p-4">
             <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-[85vh] sm:h-[650px] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 overflow-hidden">
                 <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-primary-600 text-white">
                    <div className="flex items-center gap-3">
                        {chatView === 'chat' && sessions.length > 0 && (
                            <button onClick={() => setChatView('history')} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-widest">Apostolic Exegesis</h3>
                            <p className="text-[10px] text-primary-100 opacity-80 uppercase tracking-widest">Prophetic Insights Only</p>
                        </div>
                    </div>
                    <button onClick={() => setShowAiChat(false)} className="p-2 hover:bg-white/20 rounded-xl">
                        <X size={20} />
                    </button>
                 </div>

                 {chatView === 'history' ? (
                     <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 space-y-6">
                        <button 
                            onClick={handleNewChat}
                            className="w-full bg-white dark:bg-gray-900 p-5 rounded-[2rem] shadow-md flex items-center gap-4 text-primary-600 font-black uppercase text-xs tracking-[0.2em] border border-primary-50"
                        >
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center">
                                <Plus size={24} />
                            </div>
                            New Exegesis
                        </button>

                        <div className="space-y-3">
                            {sessions.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-16">No past study sessions found.</p>
                            )}
                            {sessions.map(session => (
                                <div 
                                    key={session.id}
                                    onClick={() => handleLoadSession(session)}
                                    className="group w-full bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 text-left hover:border-primary-500 transition-all relative cursor-pointer shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={14} className="text-primary-400" />
                                            <span className="font-black text-gray-900 dark:text-white uppercase text-[10px] tracking-widest">{session.title}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold">{new Date(session.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate pl-6 italic">"{session.preview}"</p>
                                    
                                    <button 
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className="absolute right-3 bottom-3 p-2 text-gray-200 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                     </div>
                 ) : (
                     <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-black/50">
                            {messages.length === 0 && (
                                <div className="text-center py-12 space-y-6">
                                    <p className="text-sm text-gray-500 font-medium font-serif italic max-w-xs mx-auto">"How can I assist your study of {book} {chapter} in the Spirit today?"</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {["Context of this passage", "Theological themes", "Prophetic application"].map(s => (
                                            <button key={s} onClick={() => setInput(s)} className="text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-full text-primary-600 shadow-sm">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-none shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none font-serif italic'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest ml-4 animate-pulse">Discernment in progress...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-safe">
                            <div className="flex items-center gap-3">
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                                    placeholder="Enter your inquiry..."
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-5 py-3 text-sm outline-none dark:text-white font-medium"
                                />
                                <button onClick={handleAskAi} disabled={loading || !input.trim()} className="p-4 bg-primary-600 text-white rounded-2xl disabled:opacity-30 shadow-lg shadow-primary-600/20 transition-transform active:scale-90">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                     </>
                 )}
             </div>
          </div>
      )}
    </div>
  );
};