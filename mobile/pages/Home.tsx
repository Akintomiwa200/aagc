import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Users, Video, UserPlus, Image as ImageIcon, Sparkles, Loader2, PlaySquare, Flame, CheckCircle2, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PullToRefresh } from '../components/ui/PullToRefresh';
import { MOCK_EVENTS, APP_NAME } from '../constants';
import { generateChurchImage } from '../services/geminiService';
import { useDevotional, useAuth } from '../hooks/useAppHooks';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { devotional } = useDevotional();
  const { user } = useAuth();
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleImageGen = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImg(true);
    setGeneratedImage(null);
    const result = await generateChurchImage(imagePrompt);
    setGeneratedImage(result);
    setIsGeneratingImg(false);
  };

  const quickLinks = [
    { id: 1, name: 'Welcome', icon: UserPlus, color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400', link: '/first-timer' },
    { id: 2, name: 'Tithe', icon: Gift, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', link: '/giving' },
    { id: 3, name: 'Sermons', icon: PlaySquare, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', link: '/sermons' },
    { id: 4, name: 'Live', icon: Video, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', link: '/live-meet' },
  ];

  const missions = [
    { id: 1, title: 'Read Daily Word', xp: '+10 XP', done: true },
    { id: 2, title: 'Pray for a Request', xp: '+5 XP', done: false },
    { id: 3, title: 'Share a Verse', xp: '+15 XP', done: false },
  ];

  const leaderboard = [
    { id: 1, name: 'Sister Deborah', points: 1240, avatar: 'https://i.pravatar.cc/150?u=f1' },
    { id: 2, name: 'Brother Caleb', points: 980, avatar: 'https://i.pravatar.cc/150?u=f2' },
    { id: 3, name: 'Minister Sarah', points: 850, avatar: 'https://i.pravatar.cc/150?u=1' },
  ];

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="pb-24 space-y-8 bg-gray-50 dark:bg-black min-h-screen">
        {/* User Stats Bar */}
        <div className="pt-4 px-4">
          {user && (
              <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-primary-100" />
                        <div className="absolute -bottom-1 -right-1 bg-primary-500 rounded-full p-1 border-2 border-white dark:border-gray-900">
                            <ShieldCheck size={10} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <span className="block text-sm font-black text-gray-900 dark:text-white leading-none">Level {Math.floor(user.points / 100) + 1}</span>
                        <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-widest">{user.points} XP Earned</span>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-800/30">
                          <Flame size={14} className="text-orange-600" fill="currentColor" />
                          <span className="text-xs font-black text-orange-700 dark:text-orange-400">{user.streak}d</span>
                      </div>
                  </div>
              </div>
          )}
          
          <div className="flex justify-between gap-4 overflow-x-auto no-scrollbar pb-2">
            {quickLinks.map((item) => (
              <Link key={item.id} to={item.link} className="flex flex-col items-center space-y-2 min-w-[70px]">
                <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center ${item.color} ring-2 ring-white dark:ring-gray-900 shadow-md transform transition-transform hover:scale-105 active:scale-95`}>
                  <item.icon size={26} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily Missions */}
        <div className="px-4">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Daily Missions</h2>
                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">Boost XP</span>
                </div>
                <div className="space-y-3">
                    {missions.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-primary-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                {m.done ? <CheckCircle2 size={20} className="text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700" />}
                                <span className={`text-sm font-bold ${m.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>{m.title}</span>
                            </div>
                            <span className="text-xs font-black text-primary-600">{m.xp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Devotional Spotlight */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3 px-1">
             <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Today's Rhema</h2>
             <span className="text-[10px] font-black text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full uppercase tracking-widest">Apostolic Word</span>
          </div>
          <Link to="/devotional" className="block relative h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group border border-gray-100 dark:border-gray-800">
            <img src={devotional.image} alt={devotional.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
              <span className="inline-block px-3 py-1 bg-primary-500 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-full mb-3 w-fit shadow-lg">Spirit-Led Insight</span>
              <h3 className="text-3xl font-black text-white mb-2 leading-tight font-serif">{devotional.title}</h3>
              <p className="text-gray-200 text-sm line-clamp-2 mb-4 font-light opacity-90 italic">"{devotional.content}"</p>
              <div className="flex items-center gap-2 text-primary-300 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>{devotional.author}</span>
                <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        </div>

        {/* AI Art Generation - Branding Update */}
        <div className="px-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-primary-900/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                    <Sparkles size={120} className="text-primary-400" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-primary-500/20 text-primary-400 rounded-2xl backdrop-blur-md border border-white/10">
                            <ImageIcon size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">Holy Imagination</h3>
                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.2em]">Prophetic Vision AI</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="relative">
                          <textarea 
                              value={imagePrompt}
                              onChange={(e) => setImagePrompt(e.target.value)}
                              placeholder="Describe your spiritual vision (e.g. 'A city made of gold with a river of crystal water')..."
                              className="w-full p-5 rounded-3xl bg-white/5 border border-white/10 text-white text-base focus:ring-2 focus:ring-primary-500 outline-none resize-none h-28 placeholder:text-gray-500 font-serif italic leading-relaxed"
                          />
                        </div>
                        <Button fullWidth onClick={handleImageGen} disabled={isGeneratingImg || !imagePrompt} className="bg-primary-500 hover:bg-primary-600 text-white border-0 h-16 rounded-[1.75rem] shadow-xl shadow-primary-500/20 text-lg font-black uppercase tracking-widest">
                            {isGeneratingImg ? <><Loader2 className="animate-spin mr-3" /> Visualizing...</> : <><Sparkles className="mr-3" /> Manifest Vision</>}
                        </Button>
                    </div>

                    {generatedImage && (
                        <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-700 border-4 border-white/10 group relative">
                            <img src={generatedImage} alt="Prophetic Vision" className="w-full h-auto" />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Vision Captured</p>
                                    <p className="text-xs text-white/60 italic font-serif">Apostolic Army Global AI</p>
                                </div>
                                <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-colors">Save Insight</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Global Leaderboard - Community Feature */}
        <div className="px-4">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-2xl">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Army Ranks</h2>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Top Disciples</p>
                        </div>
                    </div>
                    <Link to="/friends" className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-b-2 border-primary-100 pb-0.5">Explore</Link>
                </div>
                <div className="space-y-6">
                    {leaderboard.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-black w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>0{index + 1}</span>
                                <div className="relative">
                                    <img src={item.avatar} className="w-12 h-12 rounded-full border-2 border-primary-50 shadow-sm" alt={item.name} />
                                    {index === 0 && <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-white dark:border-gray-900"><Sparkles size={8} className="text-white" /></div>}
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-gray-700 dark:text-gray-200">{item.name}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prophetic Rank</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-black text-primary-600 uppercase tracking-widest">{item.points} XP</span>
                                <span className="text-[10px] text-green-500 font-bold">↑ 2.4%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Events Scroller */}
        <div className="px-4 pb-12">
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Holy Gatherings</h2>
            <Link to="/events" className="text-primary-600 dark:text-primary-500 text-[10px] font-black uppercase tracking-[0.2em]">All Convocations</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 px-1">
              {MOCK_EVENTS.map(event => (
                  <Link 
                    key={event.id} 
                    to={`/event/${event.id}`}
                    className="min-w-[320px] block bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                      <div className="flex items-center gap-5 mb-6">
                          <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-3xl text-center min-w-[75px] border border-primary-100/50">
                              <span className="block text-[10px] font-black text-primary-700 dark:text-primary-400 uppercase leading-none mb-1.5 tracking-widest">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="block text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{new Date(event.date).getDate()}</span>
                          </div>
                          <div className="flex-1">
                              <h3 className="font-black text-gray-900 dark:text-white text-xl leading-tight line-clamp-1 font-serif">{event.title}</h3>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                  <Video size={12} className="text-primary-500" />
                                  Online & Physical
                              </p>
                          </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-3 py-1.5 rounded-full uppercase tracking-widest">{event.type}</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Details <ArrowRight size={14} className="text-primary-500" />
                        </div>
                      </div>
                  </Link>
              ))}
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};