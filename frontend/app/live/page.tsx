'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Users, MessageCircle } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  timestamp: string;
}

interface LivestreamData {
  id: string;
  platform: 'youtube' | 'facebook' | 'vimeo' | 'custom';
  title: string;
  url: string;
  embedUrl?: string;
  isActive: boolean;
  description?: string;
}

export default function LivePage() {
  const router = useRouter();
  const { socket, isConnected, joinLivestream, leaveLivestream, sendLivestreamChat } = useSocket();
  const { user } = useAuth();
  const [livestream, setLivestream] = useState<LivestreamData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLivestream();
  }, []);

  useEffect(() => {
    if (livestream?.isActive && socket && isConnected) {
      joinLivestream(livestream.id);

      socket.on('livestream-chat-message', (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
      });

      socket.on('livestream-viewer-count', (data: { viewerCount: number }) => {
        setViewerCount(data.viewerCount);
      });

      return () => {
        leaveLivestream(livestream.id);
        socket.off('livestream-chat-message');
        socket.off('livestream-viewer-count');
      };
    }
  }, [livestream, socket, isConnected, joinLivestream, leaveLivestream]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchLivestream = async () => {
    try {
      const data = await apiService.getLiveStream();
      if (data && data.length > 0) {
        const active = data.find((l: LivestreamData) => l.isActive) || data[0];
        setLivestream(active);
      }
    } catch (error) {
      console.error('Failed to fetch livestream:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || !livestream) return;

    sendLivestreamChat(
      livestream.id,
      input,
      user?.name || 'Anonymous'
    );
    setInput('');
  };

  const getEmbedUrl = (url: string, platform: string) => {
    if (platform === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 p-4 border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Live Stream</h1>
          {isConnected && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-4">
          {livestream?.isActive ? (
            <>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                {livestream.embedUrl || livestream.url ? (
                  <iframe
                    src={getEmbedUrl(livestream.embedUrl || livestream.url, livestream.platform)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <p>No stream available</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-900 p-4 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-2">{livestream.title}</h2>
                {livestream.description && (
                  <p className="text-gray-400 text-sm">{livestream.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{viewerCount} viewers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-lg font-medium">No Live Stream</p>
                <p className="text-sm">Check back later for upcoming streams</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MessageCircle size={18} />
              Live Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length > 0 ? (
              messages.map(msg => (
                <div key={msg.id} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm mt-10">
                No messages yet. Start the conversation!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg border-none text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || !isConnected}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
