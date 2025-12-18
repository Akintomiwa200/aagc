import React from 'react';
import { ArrowLeft, Edit2, Calendar, MapPin, Users, Share2, Clock, Flame, Award, Zap, Lock, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppHooks';
import { Button } from '../components/ui/Button';
import { BADGES } from '../constants';
import { TimelineItem } from '../types';

export const Profile: React.FC = () => {
  const { user, timeline, friends } = useAuth();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!user) {
      return (
          <div className="h-screen flex items-center justify-center p-4">
              <Button onClick={() => navigate('/settings')}>Log In</Button>
          </div>
      );
  }

  // Calculate Level
  const level = Math.floor(user.points / 100) + 1;
  const progress = user.points % 100;

  const handleShare = async (item: TimelineItem) => {
    const shareData = {
        title: 'GraceMobile Church',
        text: `I just ${item.title} on the GraceMobile Church App!`,
        url: window.location.href // In a real app, this might be a specific link
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback: Copy description to clipboard
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            setCopiedId(item.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    } catch (err) {
        console.error("Share failed:", err);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen pb-24">
      {/* Header with Cover */}
      <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-900">
          <div className="absolute top-0 left-0 p-4">
              <button onClick={() => navigate(-1)} className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white">
                  <ArrowLeft size={24} />
              </button>
          </div>
      </div>

      <div className="px-4 relative -mt-16 mb-6">
          <div className="flex justify-between items-end">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-black shadow-lg object-cover bg-gray-200" 
              />
              <Link to="/profile/edit">
                  <Button size="sm" variant="outline" className="mb-2 bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Edit2 size={16} className="mr-1" /> Edit
                  </Button>
              </Link>
          </div>
          
          <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{user.email.split('@')[0]}</p>
              
              {user.bio && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {user.bio}
                  </p>
              )}
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1"><Calendar size={14} /> Joined {user.joinedDate}</span>
                  {user.location && <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>}
              </div>
          </div>

          <div className="flex gap-4 mt-6">
              <div className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                  <span className="block text-xl font-bold text-gray-900 dark:text-white">{friends.length}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Friends</span>
              </div>
              <div className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                  <span className="block text-xl font-bold text-gray-900 dark:text-white">{timeline.length}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Activities</span>
              </div>
          </div>
      </div>

      {/* Gamification / Spiritual Growth Section */}
      <div className="px-4 mb-8">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Spiritual Growth</h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
             {/* Stats Row */}
             <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600">
                         <Award size={24} />
                     </div>
                     <div>
                         <span className="block text-xs text-gray-500 uppercase font-bold">Level {level}</span>
                         <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.points} XP</span>
                     </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">
                         <Flame size={24} />
                     </div>
                     <div>
                         <span className="block text-xs text-gray-500 uppercase font-bold">Streak</span>
                         <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.streak} Days</span>
                     </div>
                 </div>
             </div>

             {/* Progress Bar */}
             <div className="mb-6">
                 <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                     <span>Progress to Level {level + 1}</span>
                     <span>{progress}/100</span>
                 </div>
                 <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-primary-500 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                     />
                 </div>
             </div>

             {/* Badges Grid */}
             <div>
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Badges</h4>
                 <div className="grid grid-cols-4 gap-2">
                     {BADGES.map(badge => {
                         const isUnlocked = user.badges.includes(badge.id);
                         return (
                             <div key={badge.id} className="flex flex-col items-center gap-1 group">
                                 <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                                     isUnlocked 
                                     ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400' 
                                     : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 grayscale'
                                 }`}>
                                     {isUnlocked ? <Award size={20} /> : <Lock size={20} />}
                                 </div>
                                 <span className={`text-[10px] text-center font-medium leading-tight ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                     {badge.name}
                                 </span>
                             </div>
                         );
                     })}
                 </div>
             </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="px-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Timeline</h3>
          <div className="space-y-6 relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 pl-6 pb-4">
              {timeline.map((item) => (
                  <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-black ${
                          item.type === 'event' ? 'bg-blue-500' :
                          item.type === 'devotional' ? 'bg-purple-500' :
                          item.type === 'social' ? 'bg-green-500' : 
                          item.type === 'achievement' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                              <span className="text-xs text-gray-400">{item.date}</span>
                          </div>
                          {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                          )}
                          <div className="flex justify-end">
                              <button 
                                onClick={() => handleShare(item)}
                                className="text-primary-600 text-xs font-bold flex items-center gap-1 hover:text-primary-700 active:scale-95 transition-transform"
                              >
                                  {copiedId === item.id ? <Check size={12} /> : <Share2 size={12} />}
                                  {copiedId === item.id ? 'Copied Link' : 'Share'}
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
              {timeline.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent activity.</p>
              )}
          </div>
      </div>
    </div>
  );
};