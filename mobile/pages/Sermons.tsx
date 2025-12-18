
import React, { useEffect } from 'react';
import { Play, Search, Clock, Video, Share2 } from 'lucide-react';
import { useSermons, useNotifications } from '../hooks/useAppHooks';

export const Sermons: React.FC = () => {
  const { sermons, setSearchQuery } = useSermons();
  const { addNotification } = useNotifications();

  // Simulate a push notification for a new sermon when the user visits the page
  // In a real app, this would be triggered by a socket or a background service
  useEffect(() => {
    const timer = setTimeout(() => {
        addNotification(
            'New Sermon Available', 
            'Apostle Michael just uploaded "Operating in the Supernatural". Watch now!', 
            'message'
        );
    }, 2000);
    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <div className="pb-24 p-4 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      <div className="sticky top-0 z-20 bg-gray-50/90 dark:bg-black/90 backdrop-blur-md py-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-primary-400 mb-4">Sermons</h1>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search messages, preachers..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-primary-500 dark:text-white outline-none"
            />
        </div>
      </div>

      {/* Featured Sermon */}
      {sermons.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer aspect-video">
              <img src={sermons[0].thumbnail} alt={sermons[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                  <span className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-1">Latest Message</span>
                  <h2 className="text-2xl font-bold text-white mb-1 leading-tight">{sermons[0].title}</h2>
                  <p className="text-gray-300 text-sm">{sermons[0].preacher} • {sermons[0].duration}</p>
              </div>
          </div>
      )}

      {/* List */}
      <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Recent Messages</h3>
          {sermons.map((sermon) => (
              <div key={sermon.id} className="bg-white dark:bg-gray-900 p-3 rounded-xl flex gap-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="w-24 h-24 rounded-lg bg-gray-200 relative overflow-hidden flex-shrink-0">
                      <img src={sermon.thumbnail} className="w-full h-full object-cover" alt={sermon.title} />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play size={20} className="text-white opacity-80" fill="currentColor" />
                      </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{sermon.title}</h4>
                          <button className="text-gray-400 hover:text-primary-500">
                              <Share2 size={16} />
                          </button>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">{sermon.preacher}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={12} /> {sermon.duration}</span>
                          <span className="flex items-center gap-1"><Video size={12} /> Video</span>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
