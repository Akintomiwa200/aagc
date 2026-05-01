'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface FriendRequest {
  _id: string;
  requesterId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
}

export default function FriendRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await apiService.getFriendRequests(user._id);
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  const handleRespond = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await apiService.respondToFriendRequest(requestId, status);
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-900 dark:text-white" size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Friend Requests</h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request._id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={request.requesterId?.avatar || '/default-avatar.png'}
                    className="w-12 h-12 rounded-full bg-gray-200"
                    alt={request.requesterId?.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{request.requesterId?.name}</h4>
                    <p className="text-xs text-gray-500">{request.requesterId?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(request._id, 'accepted')}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleRespond(request._id, 'rejected')}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No pending friend requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
