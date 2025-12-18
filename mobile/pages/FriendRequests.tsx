import React, { useState } from 'react';
import { ArrowLeft, UserCheck, X, UserMinus, Clock, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppHooks';
import { Button } from '../components/ui/Button';

export const FriendRequests: React.FC = () => {
  const navigate = useNavigate();
  const { suggestions, acceptFriendRequest, declineFriendRequest, cancelFriendRequest } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = suggestions.filter(s => s.status === 'pending_received');
  const sentRequests = suggestions.filter(s => s.status === 'pending_sent');

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-3 p-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <ArrowLeft className="text-gray-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Friend Requests</h1>
        </div>

        <div className="flex px-4 pb-0">
            <button 
                onClick={() => setActiveTab('received')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'received' 
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                Received {receivedRequests.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{receivedRequests.length}</span>}
            </button>
            <button 
                onClick={() => setActiveTab('sent')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'sent' 
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                Sent {sentRequests.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded-full">{sentRequests.length}</span>}
            </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'received' ? (
            <div className="space-y-3">
                {receivedRequests.length > 0 ? (
                    receivedRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-start gap-4 mb-3">
                                <img src={req.avatar} alt={req.name} className="w-14 h-14 rounded-full object-cover bg-gray-200" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{req.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <Users size={12} />
                                        <span>{req.mutualFriends} mutual friends</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Request received 2d ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    fullWidth 
                                    onClick={() => acceptFriendRequest(req.id)}
                                    className="bg-primary-600 hover:bg-primary-700 h-10 gap-2"
                                >
                                    <UserCheck size={16} /> Confirm
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant="outline" 
                                    onClick={() => declineFriendRequest(req.id)}
                                    className="h-10 gap-2 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                >
                                    <X size={16} /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCheck size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No pending requests</h3>
                        <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-3">
                {sentRequests.length > 0 ? (
                    sentRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3">
                                <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full object-cover bg-gray-200 opacity-80" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{req.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock size={12} />
                                        <span>Pending</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => cancelFriendRequest(req.id)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserMinus size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No sent requests</h3>
                        <p className="text-gray-500 dark:text-gray-400">Go to "Find Friends" to connect with people.</p>
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => navigate('/friends')}
                        >
                            Find Friends
                        </Button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};