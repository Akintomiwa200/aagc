import { ChurchEvent, Department, Devotional, EventType, Badge } from './types';

export const APP_NAME = "Apostolic Army Global";

export const BADGES: Badge[] = [
  { id: 'new_believer', name: 'New Believer', description: 'Joined the community', icon: 'User', requiredPoints: 0 },
  { id: 'faithful', name: 'Faithful', description: 'Earned 100 points', icon: 'Heart', requiredPoints: 100 },
  { id: 'prayer_warrior', name: 'Prayer Warrior', description: 'Earned 300 points', icon: 'Flame', requiredPoints: 300 },
  { id: 'disciple', name: 'Disciple', description: 'Earned 500 points', icon: 'BookOpen', requiredPoints: 500 },
  { id: 'saint', name: 'Saint', description: 'Earned 1000 points', icon: 'Crown', requiredPoints: 1000 },
  { id: 'apostle', name: 'Apostle', description: 'Earned 2500 points', icon: 'Globe', requiredPoints: 2500 },
];

export const MOCK_EVENTS: ChurchEvent[] = [
  {
    id: '1',
    title: 'Supernatural Sunday Service',
    date: '2023-10-29',
    time: '09:00 AM',
    location: 'Main Auditorium',
    description: 'Experience the move of God and the prophetic word. Come expecting a miracle as we dive deep into the mysteries of the Kingdom.',
    type: EventType.SERVICE,
    requiresRegistration: false,
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
    previousImages: [
        'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?w=400&q=80',
        'https://images.unsplash.com/photo-1601142634808-38923eb7c560?w=400&q=80',
        'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80'
    ],
    testimonials: [
        { id: '1', name: 'John Doe', text: 'The presence of God was heavy! I got healed.', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: '2', name: 'Sarah Smith', text: 'Best service ever. The worship was divine.', avatar: 'https://i.pravatar.cc/150?u=2' }
    ]
  },
  {
    id: '2',
    title: 'Prophetic Fire Night',
    date: '2023-11-03',
    time: '06:00 PM',
    location: 'Youth Hall',
    description: 'A night of intense worship and prophetic impartation. This isn\'t just a service, it\'s an encounter.',
    type: EventType.YOUTH,
    requiresRegistration: true,
    image: 'https://images.unsplash.com/photo-1510590337019-5ef2d39aa7bf?w=800&q=80',
    previousImages: [
        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80',
        'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&q=80'
    ],
    testimonials: [
        { id: '3', name: 'Mike Ross', text: 'My life changed after the last fire night.', avatar: 'https://i.pravatar.cc/150?u=3' }
    ]
  },
  {
    id: '3',
    title: 'Global Outreach',
    date: '2023-11-10',
    time: '10:00 AM',
    location: 'City Center Park',
    description: 'Taking the gospel to the nations. Join us as we feed the hungry and share the love of Christ.',
    type: EventType.OUTREACH,
    requiresRegistration: true,
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
    previousImages: [
         'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80',
         'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80'
    ],
    testimonials: [
        { id: '4', name: 'Emily Clark', text: 'So fulfilling to give back to the community.', avatar: 'https://i.pravatar.cc/150?u=4' }
    ]
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Prophetic Worship Team',
    head: 'Minister Sarah Jones',
    description: 'Leading the congregation in spirit-filled worship.',
    meetingTime: 'Tuesdays 6pm'
  },
  {
    id: '2',
    name: 'Protocol & Hosting',
    head: 'Deacon Paul Smith',
    description: 'Maintaining order and welcoming guests.',
    meetingTime: 'Thursdays 5pm'
  },
  {
    id: '3',
    name: 'Media & Technical',
    head: 'Bro. David Chen',
    description: 'Managing audio, video, and online streaming.',
    meetingTime: 'Saturdays 10am'
  },
  {
    id: '4',
    name: 'Children Church',
    head: 'Sis. Mary Johnson',
    description: 'Teaching the next generation the way of the Lord.',
    meetingTime: 'Sundays 8am'
  }
];

export const INITIAL_DEVOTIONAL: Devotional = {
  date: new Date().toISOString().split('T')[0],
  title: "Operating in the Supernatural",
  scripture: "Acts 1:8",
  content: "But you will receive power when the Holy Spirit comes on you. To walk in the supernatural is to walk in the consciousness of God's indwelling presence. You are not just a natural being; you are a spirit being living in a body.",
  prayer: "Lord, baptize me afresh with Your fire. Let signs and wonders follow my life today. Amen.",
  author: "Apostle Michael",
  image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80"
};