
import { useState, useEffect, useCallback } from 'react';
import { ChurchEvent, Sermon, Note, Transaction, PrayerRequest, EventType, Devotional, User, TimelineItem, Friend, Badge, AppNotification } from '../types';
import { MOCK_EVENTS, INITIAL_DEVOTIONAL, BADGES } from '../constants';
import { apiService } from '../services/apiService';
import { useSocket } from '../context/SocketContext';

// --- Helper for LocalStorage ---
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// --- Hook: Notifications ---
export const useNotifications = () => {
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('church_app_notifications', [
    { id: '1', type: 'alert', title: 'Welcome to Apostolic Army', message: 'God bless you for joining us today!', time: new Date().toISOString(), read: false }
  ]);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'] = 'alert', link?: string) => {
    const id = Date.now().toString();
    const newNotif: AppNotification = {
      id,
      title,
      message,
      type,
      time: new Date().toISOString(),
      read: false,
      link
    };
    
    setNotifications(prev => [newNotif, ...prev]);

    // Native Push Notification
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' });
    }
  }, [setNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return { notifications, addNotification, markAsRead, markAllRead, requestPermission };
};

// --- Hook: Events ---
export const useEvents = () => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('initial-data', (data: { events: any[] }) => {
      if (data.events) {
        setEvents(data.events.map(normalizeEvent));
      }
    });

    socket.on('event-created', (data: { event: any }) => {
      setEvents(prev => [normalizeEvent(data.event), ...prev]);
    });

    socket.on('event-updated', (data: { event: any }) => {
      setEvents(prev => prev.map(e => 
        e.id === data.event._id || e.id === data.event.id 
          ? normalizeEvent(data.event) 
          : e
      ));
    });

    socket.on('event-deleted', (data: { eventId: string }) => {
      setEvents(prev => prev.filter(e => e.id !== data.eventId));
    });

    return () => {
      socket.off('initial-data');
      socket.off('event-created');
      socket.off('event-updated');
      socket.off('event-deleted');
    };
  }, [socket, isConnected]);

  const normalizeEvent = (event: any): ChurchEvent => {
    return {
      id: event._id || event.id || '',
      title: event.title || 'Event',
      date: event.date || new Date().toISOString(),
      time: event.time || '10:00 AM',
      location: event.location || '',
      description: event.description || '',
      type: event.type || EventType.SERVICE,
      requiresRegistration: event.requiresRegistration || false,
      image: event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
      previousImages: [],
      testimonials: [],
      isRegistered: false,
    };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEvents();
      setEvents(data.map(normalizeEvent));
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to mock data on error
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    await fetchEvents();
  };

  const registerForEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, isRegistered: true } : e));
      addNotification('Registration Confirmed', `You are registered for ${event.title}!`, 'event', `/event/${id}`);
    }
  };

  return { events, loading, refreshEvents, registerForEvent };
};

// --- Hook: Sermons ---
const MOCK_SERMONS: Sermon[] = [
    {
        id: '1', title: 'The Power of Consistency', preacher: 'Apostle Michael', date: '2023-10-22', 
        series: 'Kingdom Principles', duration: '45:20', 
        thumbnail: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&q=80',
        videoUrl: '#'
    },
    {
        id: '2', title: 'Walking in Love', preacher: 'Prophetess Sarah', date: '2023-10-15', 
        series: 'The Heart of God', duration: '52:10', 
        thumbnail: 'https://images.unsplash.com/photo-1534330207526-9e4e3b77dd0f?w=600&q=80',
        videoUrl: '#'
    },
    {
        id: '3', title: 'Financial Dominion', preacher: 'Rev. John Doe', date: '2023-10-08', 
        series: 'Prosperity', duration: '38:45', 
        thumbnail: 'https://images.unsplash.com/photo-1554188248-986adbb1f022?w=600&q=80',
        videoUrl: '#'
    }
];

export const useSermons = () => {
    const [sermons] = useState<Sermon[]>(MOCK_SERMONS);
    const [searchQuery, setSearchQuery] = useState('');
    const { addNotification } = useNotifications();

    const filteredSermons = sermons.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.preacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { sermons: filteredSermons, setSearchQuery };
};

// --- Hook: Notes ---
export const useNotes = () => {
    const [notes, setNotes] = useLocalStorage<Note[]>('church_app_notes', []);

    const addNote = (title: string, content: string) => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: title || 'Untitled Note',
            content,
            date: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
    };

    const updateNote = (id: string, title: string, content: string) => {
        setNotes(notes.map(n => n.id === id ? { ...n, title, content, date: new Date().toISOString() } : n));
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    return { notes, addNote, updateNote, deleteNote };
};

// --- Hook: Giving ---
export const useGiving = () => {
    const [history, setHistory] = useLocalStorage<Transaction[]>('church_app_giving', [
        { id: '1', type: 'Tithe', amount: 100, date: '2023-10-20', status: 'Successful' },
        { id: '2', type: 'Offering', amount: 20, date: '2023-10-22', status: 'Successful' }
    ]);

    const give = async (type: Transaction['type'], amount: number) => {
        await new Promise(r => setTimeout(r, 2000));
        const newTx: Transaction = {
            id: Date.now().toString(),
            type,
            amount,
            date: new Date().toISOString().split('T')[0],
            status: 'Successful'
        };
        setHistory([newTx, ...history]);
        return true;
    };

    return { history, give };
};

// --- Hook: Devotional ---
export const useDevotional = () => {
    const [currentDevotional] = useState<Devotional>(INITIAL_DEVOTIONAL);
    return { devotional: currentDevotional };
};

// --- Hook: Prayers ---
export const usePrayers = () => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket, isConnected } = useSocket();
    const { addNotification } = useNotifications();

    // Fetch prayers on mount
    useEffect(() => {
        fetchPrayers();
    }, []);

    // Set up real-time listeners
    useEffect(() => {
        if (!socket || !isConnected) return;

        socket.on('initial-data', (data: { prayers: any[] }) => {
            if (data.prayers) {
                setRequests(data.prayers.map(normalizePrayer));
            }
        });

        socket.on('prayer-created', (data: { prayer: any }) => {
            setRequests(prev => [normalizePrayer(data.prayer), ...prev]);
            addNotification('New Prayer Request', 'A new prayer request has been added.', 'social');
        });

        socket.on('prayer-updated', (data: { prayer: any }) => {
            setRequests(prev => prev.map(p => 
                p.id === data.prayer._id || p.id === data.prayer.id 
                    ? normalizePrayer(data.prayer) 
                    : p
            ));
        });

        socket.on('prayer-deleted', (data: { prayerId: string }) => {
            setRequests(prev => prev.filter(p => p.id !== data.prayerId));
        });

        return () => {
            socket.off('initial-data');
            socket.off('prayer-created');
            socket.off('prayer-updated');
            socket.off('prayer-deleted');
        };
    }, [socket, isConnected, addNotification]);

    const normalizePrayer = (prayer: any): PrayerRequest => {
        return {
            id: prayer._id || prayer.id || '',
            title: prayer.request?.substring(0, 50) || prayer.title || 'Prayer Request',
            content: prayer.request || prayer.content || '',
            date: prayer.createdAt ? formatDate(prayer.createdAt) : 'Recently',
            isPrivate: prayer.isAnonymous || false,
            count: 0, // Will be updated from backend if available
        };
    };

    const formatDate = (date: string) => {
        const now = new Date();
        const prayerDate = new Date(date);
        const diffMs = now.getTime() - prayerDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const fetchPrayers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPrayers();
            setRequests(data.map(normalizePrayer));
        } catch (error) {
            console.error('Error fetching prayers:', error);
        } finally {
            setLoading(false);
        }
    };

    const addRequest = async (title: string, content: string, isPrivate: boolean) => {
        try {
            const result = await apiService.createPrayer({
                name: 'User', // Will be replaced with actual user name
                request: content,
                isAnonymous: isPrivate,
            });
            // Real-time update will handle adding to list
            addNotification('Prayer Request Submitted', 'Your request has been added to the prayer wall.', 'social');
        } catch (error) {
            console.error('Error creating prayer:', error);
            addNotification('Error', 'Failed to submit prayer request.', 'alert');
        }
    };

    const prayFor = (id: string) => {
        // In a real app, this would increment a count on the backend
        setRequests(requests.map(r => r.id === id ? { ...r, count: r.count + 1 } : r));
    };

    return { requests, addRequest, prayFor, loading, refreshPrayers: fetchPrayers };
};

// --- Hook: Auth & Social ---
export const useAuth = () => {
    const [user, setUser] = useLocalStorage<User | null>('church_app_user', null);
    const [timeline, setTimeline] = useLocalStorage<TimelineItem[]>('church_app_timeline', []);
    const [friends, setFriends] = useLocalStorage<Friend[]>('church_app_friends', []);
    const [suggestions, setSuggestions] = useState<Friend[]>([
        { id: 'f1', name: 'Sister Deborah', avatar: 'https://i.pravatar.cc/150?u=f1', mutualFriends: 12, status: 'none' },
        { id: 'f2', name: 'Brother Caleb', avatar: 'https://i.pravatar.cc/150?u=f2', mutualFriends: 5, status: 'none' },
        { id: 'f3', name: 'Evangelist Mark', avatar: 'https://i.pravatar.cc/150?u=f3', mutualFriends: 8, status: 'pending_received' },
    ]);

    useEffect(() => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];
        const lastActive = user.lastActiveDate;
        if (lastActive === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = user.streak;
        if (lastActive === yesterdayStr) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }

        if (lastActive !== today) {
            updateUser({ streak: newStreak, lastActiveDate: today });
            addPoints(5);
        }
    }, []);

    const login = async (provider: 'google' | 'apple') => {
        try {
            // In a real app, you would use Google/Apple SDK to get the OAuth token
            // For now, we'll simulate it - in production, replace this with actual OAuth flow
            const oauthToken = 'mock-oauth-token'; // Replace with actual token from OAuth SDK
            
            // Get user info from OAuth provider (simplified - in production use actual OAuth)
            let email = '';
            let name = '';
            let picture = '';
            
            // For demo, we'll use a mock response
            // In production: Get these from Google/Apple OAuth response
            if (provider === 'google') {
                // Use Google OAuth SDK here
                email = 'user@example.com';
                name = 'User Name';
                picture = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80';
            } else {
                // Use Apple OAuth SDK here
                email = 'user@example.com';
                name = 'User Name';
                picture = '';
            }
            
            const result = await apiService.mobileOAuth(provider, oauthToken, email, name, picture);
            
            apiService.setToken(result.token);
            
            const today = new Date().toISOString().split('T')[0];
            const userData: User = {
                id: result.user._id || result.user.id || 'u1',
                name: result.user.name || name,
                email: result.user.email || email,
                avatar: result.user.avatar || picture,
                joinedDate: result.user.createdAt ? new Date(result.user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                bio: result.user.bio || '',
                location: result.user.location || '',
                points: result.user.points || 50,
                streak: result.user.streak || 1,
                lastActiveDate: today,
                badges: result.user.badges || ['new_believer']
            };
            
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        apiService.clearToken();
        setUser(null);
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) setUser(prev => prev ? ({ ...prev, ...updates }) : null);
    };

    const addToTimeline = (item: TimelineItem) => setTimeline(prev => [item, ...prev]);

    const addPoints = (amount: number) => {
        if (!user) return;
        const newPoints = user.points + amount;
        const currentBadges = new Set(user.badges);
        let newBadges = [...user.badges];
        BADGES.forEach(badge => {
            if (newPoints >= badge.requiredPoints && !currentBadges.has(badge.id)) {
                newBadges.push(badge.id);
                addToTimeline({
                    id: Date.now().toString(),
                    title: `Earned Badge: ${badge.name}`,
                    date: new Date().toLocaleDateString(),
                    type: 'achievement',
                    description: badge.description
                });
            }
        });
        setUser(prev => prev ? ({ ...prev, points: newPoints, badges: newBadges }) : null);
    };

    // Fix: Implement missing friend-related functions
    const sendFriendRequest = (id: string) => {
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'pending_sent' } : s));
    };

    const acceptFriendRequest = (id: string) => {
        setSuggestions(prev => {
            const person = prev.find(p => p.id === id);
            if (person) {
                setFriends(old => [...old, { ...person, status: 'friend' }]);
            }
            return prev.filter(p => p.id !== id);
        });
    };

    const declineFriendRequest = (id: string) => {
        setSuggestions(prev => prev.filter(p => p.id !== id));
    };

    const cancelFriendRequest = (id: string) => {
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'none' } : s));
    };

    return { 
        user, login, logout, updateUser, addPoints, addToTimeline, 
        timeline, friends, suggestions,
        sendFriendRequest, acceptFriendRequest, declineFriendRequest, cancelFriendRequest
    };
};
