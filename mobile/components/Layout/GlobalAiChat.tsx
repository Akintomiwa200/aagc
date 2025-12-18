import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareText, X, Send, Sparkles, Clock, Plus, ChevronRight } from 'lucide-react';
import { ChatMessage, ChatSession } from '../../types';
import { askChurchAi } from '../../services/geminiService';

export const GlobalAiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'history' | 'chat'>('history');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Local History State (In a real app, persist this)
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  // Active Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && view === 'chat') scrollToBottom();
  }, [messages, isOpen, view]);

  const createNewSession = () => {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
          id: newId,
          title: 'New Conversation',
          date: new Date(),
          messages: [],
          preview: 'Start a new conversation...'
      };
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newId);
      setMessages([]);
      setView('chat');
  };

  const openSession = (session: ChatSession) => {
      setActiveSessionId(session.id);
      setMessages(session.messages);
      setView('chat');
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSessionId) return;

    const userText = input;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText };
    
    // Optimistic update
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Get History String for context
    const historyContext = updatedMessages.slice(-5).map(m => `${m.role}: ${m.text}`).join('\n');

    const response = await askChurchAi(userText, historyContext);
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response };
    
    const finalMessages = [...updatedMessages, aiMsg];
    setMessages(finalMessages);
    setLoading(false);

    // Update Session in list
    setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
            return {
                ...s,
                messages: finalMessages,
                title: s.messages.length === 0 ? (userText.slice(0, 30) + '...') : s.title,
                preview: response.slice(0, 50) + '...'
            };
        }
        return s;
    }));
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => {
            setIsOpen(true);
            // If no sessions, auto start one
            if (sessions.length === 0) createNewSession();
        }}
        className={`fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform text-white ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={24} />
      </button>

      {/* Full Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
              
              {/* Header */}
              <div className="bg-primary-600 p-4 text-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                      {view === 'chat' && (
                          <button onClick={() => setView('history')} className="hover:bg-white/20 p-1 rounded-full">
                              <ChevronRight size={20} className="rotate-180" />
                          </button>
                      )}
                      <div>
                          <h2 className="font-bold">Church Assistant</h2>
                          <p className="text-xs text-primary-100 opacity-90">Christianity & Church Support Only</p>
                      </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full">
                      <X size={24} />
                  </button>
              </div>

              {/* View: History List */}
              {view === 'history' && (
                  <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 space-y-4">
                      <button 
                        onClick={createNewSession}
                        className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-3 text-primary-600 dark:text-primary-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                              <Plus size={20} />
                          </div>
                          New Conversation
                      </button>

                      <div className="space-y-2">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Recent Chats</h3>
                          {sessions.map(session => (
                              <button 
                                key={session.id}
                                onClick={() => openSession(session)}
                                className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-left hover:border-primary-200 transition-colors"
                              >
                                  <div className="flex justify-between items-start mb-1">
                                      <span className="font-semibold text-gray-900 dark:text-white truncate pr-2">{session.title}</span>
                                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(session.date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.preview}</p>
                              </button>
                          ))}
                          {sessions.length === 0 && (
                              <p className="text-center text-gray-400 text-sm py-10">No history yet.</p>
                          )}
                      </div>
                  </div>
              )}

              {/* View: Active Chat */}
              {view === 'chat' && (
                  <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {messages.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                                 <Sparkles size={48} className="text-primary-300 mb-4" />
                                 <p className="text-gray-500 font-medium">How can I help you in your walk with God today?</p>
                             </div>
                          )}
                          
                          {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary-600 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                          ))}
                          
                          {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                      </div>

                      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                         <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="p-2.5 bg-primary-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                         </div>
                      </div>
                  </div>
              )}

           </div>
        </div>
      )}
    </>
  );
};
