import React, { useState } from 'react';
import { ArrowLeft, Search, UserPlus, Check, X as XIcon, User, Users, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppHooks';
import { Button } from '../components/ui/Button';

export const Friends: React.FC = () => {
  const { user, friends, suggestions, sendFriendRequest } = useAuth();
  const [activeTab, setActiveTab] = useState<'my_friends' | 'find'>('my_friends');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  if (!user) return null;

  const handleTabChange = (tab: 'my_friends' | 'find') => {
      setActiveTab(tab);
      setSearch(''); // Clear search when switching context
  };

  // Filter logic based on active tab
  const displayedFriends = friends.filter(f => 
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedSuggestions = suggestions.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const isDiscoverable = s.status === 'none' || s.status === 'pending_sent';
      return matchesSearch && isDiscoverable;
  });

  const pendingCount = suggestions.filter(s => s.status === 'pending_received').length;

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen pb-24 flex flex-col">
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
          <div className="flex items-center gap-4 mb-4">
              <Link to="/settings" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <ArrowLeft className="text-gray-900 dark:text-white" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Friends</h1>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
              <button 
                onClick={() => handleTabChange('my_friends')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'my_friends' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                  My Friends
              </button>
              <button 
                onClick={() => handleTabChange('find')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'find' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                  Find Friends
              </button>
          </div>

          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder={activeTab === 'my_friends' ? "Search your friends..." : "Search for people..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none text-sm dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-900"
             />
         </div>
      </div>

      <div className="p-4 flex-1">
          {activeTab === 'my_friends' ? (
             <div className="space-y-4">
                 {/* Manage Requests Banner */}
                 {!search && (
                     <button 
                        onClick={() => navigate('/friend-requests')}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-2"
                     >
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                 <UserPlus size={20} />
                             </div>
                             <div className="text-left">
                                 <h4 className="font-bold text-gray-900 dark:text-white">Friend Requests</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">
                                     {pendingCount > 0 ? `${pendingCount} new requests` : 'No new requests'}
                                 </p>
                             </div>
                         </div>
                         <div className="flex items-center gap-2">
                             {pendingCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>}
                             <ChevronRight size={16} className="text-gray-400" />
                         </div>
                     </button>
                 )}

                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">All Friends ({displayedFriends.length})</h3>
                 
                 {displayedFriends.length > 0 ? (
                     displayedFriends.map(friend => (
                         <div key={friend.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-colors">
                             <div className="flex items-center gap-3">
                                 <img src={friend.avatar} className="w-10 h-10 rounded-full bg-gray-200" alt={friend.name} />
                                 <span className="font-medium text-gray-900 dark:text-white">{friend.name}</span>
                             </div>
                             <Button size="sm" variant="ghost">Message</Button>
                         </div>
                     ))
                 ) : (
                     <div className="text-center py-10 text-gray-400">
                         <User size={48} className="mx-auto mb-3 opacity-20" />
                         <p>{search ? `No friends found matching "${search}"` : "No friends yet. Go to Find Friends!"}</p>
                     </div>
                 )}
             </div>
          ) : (
             <div className="space-y-4">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    {search ? 'Search Results' : 'Suggested for you'}
                 </h3>
                 
                 {displayedSuggestions.length > 0 ? (
                    displayedSuggestions.map(person => (
                     <div key={person.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
                         <div className="flex items-center gap-3">
                             <img src={person.avatar} className="w-12 h-12 rounded-full bg-gray-200" alt={person.name} />
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white">{person.name}</h4>
                                 <p className="text-xs text-gray-500">{person.mutualFriends} mutual friends</p>
                             </div>
                         </div>
                         {person.status === 'pending_sent' ? (
                             <button disabled className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">
                                 Request Sent
                             </button>
                         ) : (
                             <button 
                                onClick={() => sendFriendRequest(person.id)}
                                className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                             >
                                 <UserPlus size={16} /> Add
                             </button>
                         )}
                     </div>
                    ))
                 ) : (
                     <div className="text-center py-10 text-gray-400">
                         <Users size={48} className="mx-auto mb-3 opacity-20" />
                         <p>{search ? `No results for "${search}"` : "No suggestions available."}</p>
                     </div>
                 )}
             </div>
          )}
      </div>
    </div>
  );
};