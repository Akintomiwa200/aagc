
export enum EventType {
  SERVICE = 'Service',
  YOUTH = 'Youth',
  OUTREACH = 'Outreach',
  CONFERENCE = 'Conference'
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: EventType;
  requiresRegistration: boolean;
  image?: string;
  isRegistered?: boolean;
  previousImages?: string[];
  testimonials?: Testimonial[];
}

export interface Devotional {
  date: string;
  title: string;
  scripture: string;
  content: string;
  prayer: string;
  author: string;
  image: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  description: string;
  meetingTime: string;
}

export interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  date: string;
  isPrivate: boolean;
  count: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
  messages: ChatMessage[];
  preview: string;
}

export interface AppNotification {
  id: string;
  type: 'event' | 'message' | 'alert' | 'social';
  title: string;
  message: string;
  time: string; // ISO String
  read: boolean;
  link?: string;
}

// New Types
export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  series: string;
  thumbnail: string;
  duration: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  tags?: string[];
}

export interface Transaction {
  id: string;
  type: 'Tithe' | 'Offering' | 'Project' | 'Seed';
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  // Extended Profile Fields
  bio?: string;
  location?: string;
  phone?: string;
  // Gamification
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  badges: string[]; // IDs of earned badges
}

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'event' | 'devotional' | 'social' | 'giving' | 'achievement';
  description?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  status: 'friend' | 'pending_received' | 'pending_sent' | 'none';
}

export interface ChurchBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

