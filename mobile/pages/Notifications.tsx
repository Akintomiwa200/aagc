
import React from 'react';
import { Bell, Calendar, MessageCircle, Heart, Info, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../hooks/useAppHooks';
import { AppNotification } from '../types';

export const Notifications: React.FC = () => {
  const { notifications, markAllRead, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
        case 'event': return <Calendar size={18} />;
        case 'message': return <MessageCircle size={18} />;
        case 'alert': return <Bell size={18} />;
        case 'social': return <Heart size={18} />;
        default: return <Info size={18} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
        case 'event': return 'bg-blue-100 text-blue-600';
        case 'message': return 'bg-purple-100 text-purple-600';
        case 'alert': return 'bg-red-100 text-red-600';
        case 'social': return 'bg-pink-100 text-pink-600';
        default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      
      return date.toLocaleDateString();
  };

  return (
    <div className="pb-24 p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        {notifications.length > 0 && (
          <button 
              onClick={markAllRead} 
              className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-700"
          >
              <Check size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
            <div 
                key={notif.id} 
                onClick={() => markAsRead(notif.id)}
                className={`p-4 rounded-xl border flex gap-4 transition-all duration-300 cursor-pointer ${notif.read ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' : 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800 shadow-sm'}`}
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(notif.type)}`}>
                    {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className={`font-bold text-sm ${notif.read ? 'text-gray-900 dark:text-white' : 'text-primary-900 dark:text-primary-100'}`}>{notif.title}</h3>
                        <span className="text-[10px] text-gray-400">{formatTime(notif.time)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-snug">{notif.message}</p>
                </div>
                {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary-600 mt-2"></div>
                )}
            </div>
        ))}
        {notifications.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p>No new notifications</p>
            </div>
        )}
      </div>
    </div>
  );
};
