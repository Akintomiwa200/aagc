'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, User, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Friend {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Suggestion {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  mutualFriends?: number;
  status: 'none' | 'pending_sent' | 'pending_received';
}

export default function FriendsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my_friends' | 'find'>('my_friends');
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await apiService.getFriends(user.id);
      setFriends(data || []);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  }, [user?.id]);

  const fetchSuggestions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await apiService.getMembers();
      const filtered = (data || [])
        .filter((u: any) => u.id !== user.id)
        .map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          mutualFriends: Math.floor(Math.random() * 5),
          status: friends.some(f => f.id === u.id) ? 'none' as const : 'none' as const,
        }));
      setSuggestions(filtered);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [user?._id, friends]);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user, fetchFriends]);

  useEffect(() => {
    if (activeTab === 'find' && user) {
      fetchSuggestions();
    }
  }, [activeTab, user, fetchSuggestions]);

  const handleSendRequest = async (friendId: string) => {
    if (!user?.id) return;
    try {
      await apiService.sendFriendRequest(user.id, friendId);
      setSuggestions(prev =>
        prev.map(s => s._id === friendId ? { ...s, status: 'pending_sent' as const } : s)
      );
    } catch (error) {
      console.error('Failed to send request:', error);
    }
  };

  const displayedFriends = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedSuggestions = suggestions.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const isDiscoverable = s.status === 'none' || s.status === 'pending_sent';
    return matchesSearch && isDiscoverable;
  });

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24">
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-900 dark:text-white" size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Friends</h1>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
          <button
            onClick={() => { setActiveTab('my_friends'); setSearch(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'my_friends' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
          >
            My Friends
          </button>
          <button
            onClick={() => { setActiveTab('find'); setSearch(''); }}
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
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'my_friends' ? (
          <div className="space-y-4">
            {!search && (
              <button
                onClick={() => router.push('/friends/requests')}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <UserPlus size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 dark:text-white">Friend Requests</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage incoming requests</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            )}

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Friends ({displayedFriends.length})</h3>

            {displayedFriends.length > 0 ? (
              displayedFriends.map(friend => (
                <div key={friend._id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full bg-gray-200" alt={friend.name} />
                    <span className="font-medium text-gray-900 dark:text-white">{friend.name}</span>
                  </div>
                  <button className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Message
                  </button>
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
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {search ? 'Search Results' : 'Suggested for you'}
            </h3>

            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : displayedSuggestions.length > 0 ? (
              displayedSuggestions.map(person => (
                <div key={person._id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={person.avatar || '/default-avatar.png'} className="w-12 h-12 rounded-full bg-gray-200" alt={person.name} />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{person.name}</h4>
                      <p className="text-xs text-gray-500">{person.mutualFriends} mutual friends</p>
                    </div>
                  </div>
                  {person.status === 'pending_sent' ? (
                    <button disabled className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg text-sm font-medium">
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(person._id)}
                      className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
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
}
