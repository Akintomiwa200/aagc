// components/devotional/PrayerSection.tsx
'use client';

import { MessageSquare, Users, Clock, Heart, Send, CheckCircle, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const prayerTopics = [
  { id: 1, topic: "Healing & Health", count: 234, emoji: "🏥", description: "Physical and emotional healing" },
  { id: 2, topic: "Family & Relationships", count: 189, emoji: "👨‍👩‍👧‍👦", description: "Marriage, parenting, friendships" },
  { id: 3, topic: "Finances & Provision", count: 156, emoji: "💰", description: "Financial breakthrough and wisdom" },
  { id: 4, topic: "Salvation of Loved Ones", count: 278, emoji: "✝️", description: "Family and friends coming to Christ" },
  { id: 5, topic: "Peace in Nation", count: 312, emoji: "🌍", description: "World peace and national healing" },
  { id: 6, topic: "Career & Purpose", count: 142, emoji: "💼", description: "Finding and fulfilling God's calling" },
  { id: 7, topic: "Mental Health", count: 198, emoji: "🧠", description: "Anxiety, depression, and peace of mind" },
  { id: 8, topic: "Spiritual Growth", count: 267, emoji: "📈", description: "Deeper relationship with God" },
];

const livePrayerSessions = [
  { time: "6:00 AM", duration: "30 min", type: "Morning Watch", leader: "Pastor John", participants: 45 },
  { time: "12:00 PM", duration: "15 min", type: "Midday Prayer", leader: "Sister Mary", participants: 28 },
  { time: "9:00 PM", duration: "45 min", type: "Night Vigil", leader: "Brother David", participants: 67 },
];

type Prayer = {
  id: number;
  text: string;
  time: string;
  type: 'request' | 'thanksgiving' | 'intercession';
  anonymous: boolean;
};

export default function PrayerSection() {
  const [prayerRequest, setPrayerRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prayerType, setPrayerType] = useState<'request' | 'thanksgiving' | 'intercession'>('request');
  const [submittedPrayers, setSubmittedPrayers] = useState<Prayer[]>([]);
  const [activePrayers, setActivePrayers] = useState(prayerTopics);
  const [nextSession, setNextSession] = useState({ time: "6:00 AM", minutesLeft: 135 });
  const router = useRouter();

  useEffect(() => {
    // Simulate live prayer count updates
    const interval = setInterval(() => {
      setActivePrayers(prev => prev.map(topic => ({
        ...topic,
        count: topic.count + Math.floor(Math.random() * 3)
      })));
    }, 30000);

    // Simulate countdown to next session
    const countdownInterval = setInterval(() => {
      setNextSession(prev => ({
        ...prev,
        minutesLeft: Math.max(0, prev.minutesLeft - 1)
      }));
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prayerRequest.trim()) {
      const newPrayer: Prayer = {
        id: Date.now(),
        text: prayerRequest,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: prayerType,
        anonymous: isAnonymous
      };
      
      // In real app, send to backend
      console.log('Prayer request submitted:', newPrayer);
      
      // Add to local state for demo
      setSubmittedPrayers(prev => [newPrayer, ...prev]);
      
      // Update prayer count for relevant topic
      if (prayerType === 'request') {
        setActivePrayers(prev => prev.map(topic => 
          topic.id === 1 ? { ...topic, count: topic.count + 1 } : topic
        ));
      }
      
      setPrayerRequest('');
      setIsAnonymous(false);
      setPrayerType('request');
      
      // Show success message
      alert('Prayer submitted! Our prayer team will intercede for you.');
      
      // Navigate to prayer wall
      router.push('/prayer/wall');
    }
  };

  const handlePrayTopic = (topicId: number) => {
    // Navigate to specific prayer topic
    router.push(`/prayer/topics/${topicId}`);
  };

  const handleJoinLive = () => {
    router.push('/prayer/live');
  };

  const handleViewPrayers = () => {
    router.push('/prayer/wall');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          Prayer Wall
        </h3>
        <div className="flex items-center gap-2 text-green-600">
          <Globe className="h-5 w-5" />
          <span className="text-sm font-medium">Live Prayers Worldwide</span>
        </div>
      </div>

      {/* Submit Prayer Request */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`px-4 py-2 rounded-lg cursor-pointer transition ${prayerType === 'request' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
               onClick={() => setPrayerType('request')}>
            🙏 Prayer Request
          </div>
          <div className={`px-4 py-2 rounded-lg cursor-pointer transition ${prayerType === 'thanksgiving' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
               onClick={() => setPrayerType('thanksgiving')}>
            🙌 Thanksgiving
          </div>
          <div className={`px-4 py-2 rounded-lg cursor-pointer transition ${prayerType === 'intercession' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
               onClick={() => setPrayerType('intercession')}>
            🤝 Intercession
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              placeholder={prayerType === 'request' 
                ? "Share your prayer need..." 
                : prayerType === 'thanksgiving'
                ? "Share what you're thankful for..."
                : "Pray for someone else's need..."}
              className="w-full h-40 p-4 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none resize-none text-lg"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
              {prayerRequest.length}/500
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <span className="text-sm">Post anonymously</span>
              </label>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>24/7 prayer team</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleViewPrayers}
                className="px-4 py-2.5 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg transition font-medium"
              >
                View Prayers
              </button>
              <button
                type="submit"
                disabled={!prayerRequest.trim()}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Prayer
              </button>
            </div>
          </div>
        </form>

        {/* Recent Submissions */}
        {submittedPrayers.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Recently Submitted</h4>
            <div className="space-y-3">
              {submittedPrayers.slice(0, 2).map(prayer => (
                <div key={prayer.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{prayer.anonymous ? 'Anonymous' : 'You'}</span>
                    <span className="text-xs text-gray-500">{prayer.time}</span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">{prayer.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prayer Commitment */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          7-Day Prayer Challenge
        </h4>
        <p className="text-gray-700 mb-4">
          Commit to praying for 10 minutes daily. Receive reminders and prayer prompts.
        </p>
        <button 
          onClick={() => router.push('/prayer/challenge')}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition"
        >
          Start Prayer Challenge
        </button>
      </div>
    </div>
  );
}