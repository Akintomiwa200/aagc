
import React, { useState, useEffect } from 'react';
// Added PenTool to the imports from lucide-react
import { Sparkles, Loader2, Plus, Copy, Check, Wand2, Heart, MessageCircle, Bookmark, BookmarkCheck, Flame, Share2, PenTool } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PullToRefresh } from '../components/ui/PullToRefresh';
import { generatePrayer } from '../services/geminiService';
import { usePrayers } from '../hooks/useAppHooks';

export const Prayers: React.FC = () => {
  const { requests, prayFor, addRequest } = usePrayers();
  const [activeTab, setActiveTab] = useState<'wall' | 'ai'>('wall');
  const [topic, setTopic] = useState('');
  const [generatedPrayer, setGeneratedPrayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedPrayers, setSavedPrayers] = useState<string[]>(() => {
    try {
        const s = localStorage.getItem('saved_ai_prayers');
        return s ? JSON.parse(s) : [];
    } catch {
        return [];
    }
  });
  
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGeneratedPrayer('');
    setCopied(false);
    
    const result = await generatePrayer(topic);
    setGeneratedPrayer(result);
    setLoading(true); // Artificial pause for spiritual feel
    setTimeout(() => setLoading(false), 800);
  };

  const toggleSavePrayer = () => {
    if (!generatedPrayer) return;
    setSavedPrayers(prev => {
        const next = prev.includes(generatedPrayer) ? prev.filter(p => p !== generatedPrayer) : [generatedPrayer, ...prev];
        localStorage.setItem('saved_ai_prayers', JSON.stringify(next));
        return next;
    });
  };

  const handleCopy = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };

  const handleNewRequest = () => {
      const title = prompt("What is your prayer request title?");
      const content = prompt("Describe your petition to the Lord...");
      if (title && content) {
          addRequest(title, content, false);
      }
  };

  return (
    <div className="h-full flex flex-col pb-20 bg-gray-50 dark:bg-black">
      {/* Sticky Top Header */}
      <div className="flex bg-white dark:bg-gray-900 sticky top-16 z-20 border-b border-gray-100 dark:border-gray-800 p-1">
        <button 
            onClick={() => setActiveTab('wall')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${activeTab === 'wall' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-gray-400'}`}
        >
            Prayer Wall
        </button>
        <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${activeTab === 'ai' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-gray-400'}`}
        >
            Prophetic Intercessor
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="p-4 min-h-full space-y-6">
                {activeTab === 'wall' ? (
                <div className="space-y-4">
                    <div 
                        onClick={handleNewRequest}
                        className="bg-primary-600 p-6 rounded-[2.5rem] flex items-center justify-between text-white shadow-2xl shadow-primary-600/30 cursor-pointer active:scale-95 transition-all group"
                    >
                        <div>
                            <h3 className="font-black text-xl tracking-tight">Ascend in Prayer</h3>
                            <p className="text-[10px] text-primary-100 font-bold uppercase tracking-widest mt-1">Submit your petition now</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-2 py-4">
                        <Flame size={16} className="text-orange-500" fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Atmosphere of Intercession</span>
                    </div>

                    {requests.map((req) => (
                        <div key={req.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-bottom-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-black text-gray-900 dark:text-white text-xl leading-tight font-serif italic mb-1">"{req.title}"</h4>
                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{req.date}</span>
                                </div>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <Share2 size={16} className="text-gray-400" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-serif mb-8">{req.content}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800/50">
                                <button 
                                    onClick={() => prayFor(req.id)}
                                    className="flex items-center gap-3 px-6 py-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest active:scale-90 transition-all border border-primary-100/50"
                                >
                                    <span className="text-lg">🙏</span> {req.count} Amens
                                </button>
                                <div className="flex items-center gap-6 text-gray-300">
                                    <MessageCircle size={20} />
                                    <Heart size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="text-center space-y-4 py-8 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 rounded-[2rem] flex items-center justify-center mx-auto text-primary-600 dark:text-primary-400 shadow-xl rotate-3 relative">
                            <Wand2 size={32} />
                            <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-2 border-4 border-white dark:border-gray-900">
                                <Sparkles size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Intercession Engine</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2 max-w-[200px] mx-auto leading-relaxed">Let the AI curate prophetic scripture-based prayers for you.</p>
                        </div>
                    </div>

                    <div className="space-y-4 px-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-4">The Burden</label>
                        <div className="relative group">
                            <textarea 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. 'Breaking the cycles of limitation' or 'Peace in my household'..."
                                disabled={loading}
                                className="w-full p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl focus:ring-4 focus:ring-primary-500/10 outline-none text-gray-800 dark:text-white resize-none h-48 transition-all placeholder:text-gray-300 font-serif text-lg italic leading-relaxed"
                            />
                            <div className="absolute bottom-6 right-6 text-primary-200">
                                <PenTool size={24} />
                            </div>
                        </div>
                        <Button 
                            fullWidth 
                            onClick={handleGenerate} 
                            disabled={loading || !topic}
                            className="h-16 rounded-3xl shadow-2xl shadow-primary-600/30 text-lg font-black uppercase tracking-widest bg-gradient-to-tr from-primary-600 to-primary-400 border-0"
                        >
                            {loading ? <Loader2 className="animate-spin mr-3" /> : <Sparkles className="mr-3" />}
                            {loading ? 'Discerning...' : 'Invoke Prophetic Prayer'}
                        </Button>
                    </div>

                    {loading && (
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 animate-pulse space-y-6 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                             <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto"></div>
                             <div className="space-y-3">
                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mx-auto"></div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-5/6 mx-auto"></div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mx-auto"></div>
                             </div>
                             <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest">Ascending to the Throne...</p>
                        </div>
                    )}

                    {generatedPrayer && !loading && (
                        <div className="bg-white dark:bg-gray-900 border-2 border-primary-500/20 rounded-[3rem] p-10 relative animate-in zoom-in duration-700 shadow-[0_20px_60px_-15px_rgba(184,146,37,0.3)] overflow-hidden text-center">
                            <div className="absolute -top-10 -right-10 p-20 opacity-5 rotate-12">
                                <Sparkles size={200} className="text-primary-500" />
                            </div>
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-2xl">
                                        <Sparkles size={18} className="text-primary-600"/>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest leading-none">Holy Insight</h4>
                                        <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">Divine Utterance</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={toggleSavePrayer}
                                        className={`p-3 rounded-2xl transition-all shadow-sm ${savedPrayers.includes(generatedPrayer) ? 'bg-primary-100 text-primary-600 border border-primary-200' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border border-transparent'}`}
                                    >
                                        {savedPrayers.includes(generatedPrayer) ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                                    </button>
                                    <button 
                                        onClick={() => handleCopy(generatedPrayer)} 
                                        className={`p-3 rounded-2xl transition-all shadow-sm ${copied ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border border-transparent'}`}
                                    >
                                        {copied ? <Check size={24} /> : <Copy size={24} />}
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-800 dark:text-gray-100 italic leading-[2.4rem] text-2xl font-serif px-2 relative z-10 mb-8 select-all">"{generatedPrayer}"</p>
                            <div className="pt-8 border-t border-gray-50 dark:border-gray-800 text-center relative z-10">
                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em] animate-pulse">In Jesus' Name, Amen</p>
                            </div>
                        </div>
                    )}

                    {savedPrayers.length > 0 && activeTab === 'ai' && !generatedPrayer && (
                        <div className="space-y-6 pt-6">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Prophetic Vault</h3>
                                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{savedPrayers.length} Items</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {savedPrayers.map((p, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => handleCopy(p)}
                                        className="p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm italic text-sm text-gray-500 line-clamp-3 relative group active:scale-[0.98] transition-all cursor-pointer"
                                    >
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Copy size={14} className="text-primary-400" />
                                        </div>
                                        "{p}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                )}
            </div>
        </PullToRefresh>
      </div>
    </div>
  );
};
