'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Flame, Star, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

interface TimelineEvent {
  id: string;
  type: 'points' | 'badge' | 'login' | 'prayer' | 'devotional';
  description: string;
  points?: number;
  timestamp: string;
}

const BADGES: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  { id: 'faithful', name: 'Faithful', description: 'Earn 100 points', pointsRequired: 100, icon: '🙏' },
  { id: 'prayer_warrior', name: 'Prayer Warrior', description: 'Earn 300 points', pointsRequired: 300, icon: '⚔️' },
  { id: 'disciple', name: 'Disciple', description: 'Earn 500 points', pointsRequired: 500, icon: '📖' },
  { id: 'saint', name: 'Saint', description: 'Earn 1000 points', pointsRequired: 1000, icon: '✨' },
  { id: 'apostle', name: 'Apostle', description: 'Earn 2500 points', pointsRequired: 2500, icon: '👑' },
];

export default function GamificationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      const savedPoints = localStorage.getItem('user_points');
      const savedStreak = localStorage.getItem('user_streak');
      const savedBadges = localStorage.getItem('earned_badges');
      const savedTimeline = localStorage.getItem('activity_timeline');

      setPoints(savedPoints ? parseInt(savedPoints) : (user?.points || 0));
      setStreak(savedStreak ? parseInt(savedStreak) : (user?.streak || 0));

      const earnedBadgeIds = savedBadges ? JSON.parse(savedBadges) : [];
      setBadges(BADGES.map(b => ({
        ...b,
        earned: earnedBadgeIds.includes(b.id),
      })));

      setTimeline(savedTimeline ? JSON.parse(savedTimeline) : []);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = (amount: number, reason: string) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    localStorage.setItem('user_points', newPoints.toString());

    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      type: 'points',
      description: reason,
      points: amount,
      timestamp: new Date().toISOString(),
    };
    const updatedTimeline = [newEvent, ...timeline].slice(0, 50);
    setTimeline(updatedTimeline);
    localStorage.setItem('activity_timeline', JSON.stringify(updatedTimeline));

    checkBadges(newPoints);
  };

  const checkBadges = (currentPoints: number) => {
    const updatedBadges = badges.map(badge => {
      if (!badge.earned && currentPoints >= badge.pointsRequired) {
        const earnedBadge = {
          ...badge,
          earned: true,
          earnedAt: new Date().toISOString(),
        };

        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          type: 'badge',
          description: `Earned ${badge.name} badge!`,
          timestamp: new Date().toISOString(),
        };
        const updatedTimeline = [newEvent, ...timeline].slice(0, 50);
        setTimeline(updatedTimeline);
        localStorage.setItem('activity_timeline', JSON.stringify(updatedTimeline));

        return earnedBadge;
      }
      return badge;
    });
    setBadges(updatedBadges);
    localStorage.setItem('earned_badges', JSON.stringify(updatedBadges.filter(b => b.earned).map(b => b.id)));
  };

  const getNextBadge = () => {
    return badges.find(b => !b.earned);
  };

  const nextBadge = getNextBadge();
  const progressToNext = nextBadge ? (points / nextBadge.pointsRequired) * 100 : 100;

  if (!user) return null;

  return (
    <div className="bg-[#f7f7f4] min-h-screen">
      <div className="bg-white p-4 border-b border-[#e6e5e0] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-[#f7f7f4] rounded-full">
            <ArrowLeft className="text-[#26251e]" size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[#26251e]">My Progress</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {loading ? (
          <div className="text-center py-10 text-[#5a5852]">Loading...</div>
        ) : (
          <>
            <div className="bg-[#26251e] p-6 rounded-[12px] text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Total Points</p>
                  <h2 className="text-4xl font-bold">{points}</h2>
                </div>
                <Trophy size={48} className="text-[#f54e00]" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Flame className="text-[#f54e00]" size={20} />
                <span className="font-bold">{streak} Day Streak</span>
              </div>

              {nextBadge && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Next: {nextBadge.name} {nextBadge.icon}</span>
                    <span>{points}/{nextBadge.pointsRequired}</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div
                      className="bg-[#f54e00] h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progressToNext, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#26251e] mb-3 flex items-center gap-2">
                <Award size={20} /> Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-[12px] border ${badge.earned ? 'bg-[#f7f7f4] border-[#cfcdc4]' : 'bg-white border-[#e6e5e0]'}`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className={`font-bold ${badge.earned ? 'text-[#26251e]' : 'text-[#a09c92]'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-[#5a5852]">{badge.description}</p>
                    {badge.earned && (
                      <span className="inline-block mt-2 text-xs bg-[#9fc9a2]/30 text-[#26251e] px-2 py-0.5 rounded-full">
                        Earned
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#26251e] mb-3 flex items-center gap-2">
                <TrendingUp size={20} /> Activity Timeline
              </h3>
              <div className="space-y-3">
                {timeline.length > 0 ? (
                  timeline.slice(0, 10).map(event => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-white rounded-[12px] border border-[#e6e5e0]">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${event.type === 'points' ? 'bg-[#9fbbe0]' : event.type === 'badge' ? 'bg-[#f54e00]' : 'bg-[#e6e5e0]'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-[#26251e]">{event.description}</p>
                        {event.points && (
                          <span className="text-xs text-[#f54e00] font-medium">+{event.points} points</span>
                        )}
                        <p className="text-xs text-[#5a5852] mt-1">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#5a5852] text-sm">No activity yet. Start earning points!</p>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-[12px] border border-[#e6e5e0]">
              <h4 className="font-bold text-[#26251e] mb-2">Ways to Earn Points</h4>
              <ul className="space-y-1 text-sm text-[#5a5852]">
                <li className="flex items-center gap-2"><Star size={14} /> Read devotional: +10 points</li>
                <li className="flex items-center gap-2"><Star size={14} /> Daily login: +5 points</li>
                <li className="flex items-center gap-2"><Star size={14} /> Create prayer: +5 points</li>
                <li className="flex items-center gap-2"><Star size={14} /> Read Bible: +3 points</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
