'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Sparkles, MessageCircle, BookOpen, Heart } from 'lucide-react';
import { geminiService } from '@/lib/geminiService';

type AIType = 'church' | 'prayer' | 'bible';

export default function AIPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<AIType>('church');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState(geminiService.getChatHistory());
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      let result = '';

      if (activeType === 'church') {
        result = await geminiService.churchAI(input);
      } else if (activeType === 'prayer') {
        result = await geminiService.generatePrayer(input);
      } else {
        result = await geminiService.askBibleQuestion('', input);
      }

      setResponse(result);

      const newChat = geminiService.createNewChat(
        input.length > 30 ? input.substring(0, 30) + '...' : input
      );
      newChat.messages = [
        { role: 'user', parts: [{ text: input }] },
        { role: 'model', parts: [{ text: result }] },
      ];

      const updatedHistory = [newChat, ...chatHistory].slice(0, 20);
      setChatHistory(updatedHistory);
      geminiService.saveChatHistory(updatedHistory);
    } catch (error) {
      setResponse('Error processing request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadChat = (chat: any) => {
    const lastModelMsg = chat.messages.filter((m: any) => m.role === 'model').pop();
    const lastUserMsg = chat.messages.filter((m: any) => m.role === 'user').pop();
    setInput(lastUserMsg?.parts?.[0]?.text || '');
    setResponse(lastModelMsg?.parts?.[0]?.text || '');
    setShowHistory(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col">
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-900 dark:text-white" size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-blue-500" size={24} /> Church AI
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setActiveType('church'); setResponse(''); setInput(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${activeType === 'church' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            <MessageCircle size={16} /> Church AI
          </button>
          <button
            onClick={() => { setActiveType('prayer'); setResponse(''); setInput(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${activeType === 'prayer' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            <Heart size={16} /> Prayer
          </button>
          <button
            onClick={() => { setActiveType('bible'); setResponse(''); setInput(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${activeType === 'bible' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            <BookOpen size={16} /> Bible
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {response && (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{response}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4 text-gray-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!response && !loading && (
          <div className="text-center py-10 text-gray-400">
            <Sparkles size={48} className="mx-auto mb-3 opacity-20" />
            <p>
              {activeType === 'church' && "Ask me anything about faith, the Bible, or church life!"}
              {activeType === 'prayer' && "Enter a topic and I'll generate a prophetic prayer for you."}
              {activeType === 'bible' && "Ask a question about any Bible verse or passage."}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>

        {showHistory && chatHistory.length > 0 && (
          <div className="mb-3 max-h-32 overflow-y-auto">
            {chatHistory.map(chat => (
              <button
                key={chat.id}
                onClick={() => loadChat(chat)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mb-1 truncate"
              >
                {chat.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={
              activeType === 'church' ? 'Ask a question...' :
              activeType === 'prayer' ? 'Enter prayer topic...' :
              'Ask about a Bible verse...'
            }
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
