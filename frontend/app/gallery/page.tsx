'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, Church, Award, MapPin, Clock, Filter, Download, Share2, ChevronRight, Search, X, Heart } from 'lucide-react';
import Image from 'next/image';
import { apiService } from '@/lib/api';
import { useSocket } from '@/contexts/SocketContext';

// Types for our gallery data
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  date: string;
  category: 'main' | 'department' | 'event' | 'pastorate' | 'screens';
  tags: string[];
  width: number;
  height: number;
  featured?: boolean;
}

interface BackendGalleryItem {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  leader: string;
  meetingSchedule: string;
  images: string[];
  contactEmail: string;
}

interface Pastor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  phone?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  images: string[];
}

// Dummy data for testing - will be replaced with backend API calls
const dummyImages: GalleryImage[] = [
  // Main Gallery - grouped by dates
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    alt: 'Sunday Service Worship',
    title: 'Sunday Morning Worship',
    description: 'Our vibrant Sunday service with full congregation',
    date: '2024-03-10',
    category: 'main',
    tags: ['worship', 'sunday', 'congregation'],
    width: 800,
    height: 600,
    featured: true
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
    alt: 'Prayer Meeting',
    title: 'Wednesday Prayer Night',
    description: 'Intimate prayer and worship evening',
    date: '2024-03-06',
    category: 'main',
    tags: ['prayer', 'worship', 'midweek'],
    width: 800,
    height: 600
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    alt: 'Youth Conference',
    title: 'Youth Conference 2024',
    description: 'Annual youth conference with guest speakers',
    date: '2024-02-28',
    category: 'main',
    tags: ['youth', 'conference', 'speakers'],
    width: 800,
    height: 600,
    featured: true
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    alt: 'Baptism Service',
    title: 'Water Baptism Service',
    description: 'New believers being baptized',
    date: '2024-02-25',
    category: 'main',
    tags: ['baptism', 'newbelievers', 'celebration'],
    width: 800,
    height: 600
  },
  
  // Department Images
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    alt: 'Children Ministry',
    title: 'Children Sunday School',
    description: 'Interactive learning for children',
    date: '2024-03-09',
    category: 'department',
    tags: ['children', 'sundayschool', 'learning'],
    width: 800,
    height: 600
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    alt: 'Youth Ministry',
    title: 'Youth Fellowship',
    description: 'Youth gathering for games and worship',
    date: '2024-03-08',
    category: 'department',
    tags: ['youth', 'fellowship', 'games'],
    width: 800,
    height: 600
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    alt: 'Women Ministry',
    title: 'Women\'s Breakfast Fellowship',
    description: 'Monthly women\'s fellowship meeting',
    date: '2024-03-02',
    category: 'department',
    tags: ['women', 'fellowship', 'breakfast'],
    width: 800,
    height: 600
  },
  
  // Event Images
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    alt: 'Christmas Concert',
    title: 'Christmas Concert 2023',
    description: 'Annual Christmas musical celebration',
    date: '2023-12-24',
    category: 'event',
    tags: ['christmas', 'concert', 'celebration'],
    width: 800,
    height: 600,
    featured: true
  },
  
  // Pastorate Images
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    alt: 'Senior Pastor',
    title: 'Rev. John & Grace Daniels',
    description: 'Senior Pastors of AAGC',
    date: '2024-01-15',
    category: 'pastorate',
    tags: ['pastor', 'leadership', 'family'],
    width: 800,
    height: 600
  }
];

const departments: Department[] = [
  {
    id: '1',
    name: 'Children Ministry',
    description: 'Nurturing young hearts in Christ through age-appropriate teaching and fun activities. Our ministry focuses on building strong spiritual foundations in children ages 3-12.',
    leader: 'Sis. Sarah Johnson',
    meetingSchedule: 'Sundays, 9:00 AM & Wednesdays, 5:30 PM',
    images: [
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80'
    ],
    contactEmail: 'children@aagc.org'
  },
  {
    id: '2',
    name: 'Youth Ministry',
    description: 'Empowering teenagers and young adults to live for Christ in their generation. We provide relevant teaching, mentorship, and community for ages 13-25.',
    leader: 'Bro. Michael Chen',
    meetingSchedule: 'Fridays, 7:00 PM & Sundays, 11:00 AM',
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
      'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&q=80'
    ],
    contactEmail: 'youth@aagc.org'
  },
  {
    id: '3',
    name: 'Women\'s Ministry',
    description: 'Building godly women through fellowship, Bible study, and practical support. We aim to strengthen women in their faith, families, and calling.',
    leader: 'Dr. Elizabeth Williams',
    meetingSchedule: 'First Saturday of each month, 10:00 AM',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80'
    ],
    contactEmail: 'women@aagc.org'
  },
  {
    id: '4',
    name: 'Men\'s Ministry',
    description: 'Equipping men to lead with integrity in their homes, workplaces, and communities through discipleship and accountability.',
    leader: 'Bro. David Thompson',
    meetingSchedule: 'Second Saturday of each month, 8:00 AM',
    images: [
      'https://images.unsplash.com/photo-1560250056-07ba64664864?w=800&q=80',
      'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&q=80'
    ],
    contactEmail: 'men@aagc.org'
  },
  {
    id: '5',
    name: 'Worship & Creative Arts',
    description: 'Leading the church into God\'s presence through music, dance, and creative expression. We develop worship leaders and creatives for ministry.',
    leader: 'Sis. Miriam Adebayo',
    meetingSchedule: 'Thursdays, 6:00 PM (Practice)',
    images: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'
    ],
    contactEmail: 'worship@aagc.org'
  },
  {
    id: '6',
    name: 'Hospitality & Ushering',
    description: 'Creating a welcoming atmosphere for visitors and members, ensuring smooth service operations and making everyone feel at home.',
    leader: 'Bro. James Okoro',
    meetingSchedule: 'Sundays, 8:00 AM (Pre-service briefing)',
    images: [
      'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
    ],
    contactEmail: 'ushers@aagc.org'
  }
];

const pastors: Pastor[] = [
  {
    id: '1',
    name: 'Rev. John Daniels',
    role: 'Senior Pastor',
    bio: 'With over 25 years of pastoral experience, Rev. Daniels leads AAGC with a vision for community transformation and spiritual growth. He holds a Doctorate in Theology.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    email: 'pastorjohn@aagc.org',
    phone: '+234 801 234 5678'
  },
  {
    id: '2',
    name: 'Pastor Grace Daniels',
    role: 'Co-Pastor & Women\'s Ministry Director',
    bio: 'Pastor Grace oversees the women\'s ministry and church administration. She is passionate about family ministry and discipleship.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    email: 'pastorgrace@aagc.org',
    phone: '+234 802 345 6789'
  },
  {
    id: '3',
    name: 'Pastor Michael Chen',
    role: 'Associate Pastor - Youth & Young Adults',
    bio: 'Formerly a youth leader, Pastor Michael now oversees our thriving youth ministry. He connects with young people through relevant teaching and mentorship.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    email: 'pastormichael@aagc.org',
    phone: '+234 803 456 7890'
  },
  {
    id: '4',
    name: 'Pastor Sarah Johnson',
    role: 'Children\'s Ministry Director',
    bio: 'With a background in early childhood education, Pastor Sarah brings creativity and love to our children\'s ministry programs.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80',
    email: 'pastorsarah@aagc.org',
    phone: '+234 804 567 8901'
  }
];

const events: Event[] = [
  {
    id: '1',
    title: 'Christmas Concert 2023',
    date: 'December 24, 2023',
    time: '5:00 PM - 8:00 PM',
    description: 'Our annual Christmas musical celebration featuring choir, drama, and special performances.',
    images: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
    ]
  },
  {
    id: '2',
    title: 'Easter Resurrection Service',
    date: 'March 31, 2024',
    time: '6:00 AM - 12:00 PM',
    description: 'Sunrise service and celebration of Christ\'s resurrection with baptism and communion.',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
    ]
  },
  {
    id: '3',
    title: 'Annual Church Retreat',
    date: 'October 15-17, 2024',
    time: 'All Day',
    description: 'Three days of spiritual refreshment, teaching, and fellowship at the mountain retreat center.',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
    ]
  }
];

// Helper function to group images by date (for main gallery)
const groupImagesByDate = (images: GalleryImage[]) => {
  const grouped: Record<string, GalleryImage[]> = {};
  
  images.forEach(image => {
    if (image.category === 'main') {
      const date = new Date(image.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(image);
    }
  });
  
  return Object.entries(grouped).sort((a, b) => 
    new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [liveImages, setLiveImages] = useState<GalleryImage[]>([]);
  const { socket } = useSocket();

  const mapBackendImage = (item: BackendGalleryItem): GalleryImage => ({
    id: item.id || item._id || '',
    src: item.imageUrl || '',
    alt: item.title || 'Gallery image',
    title: item.title || 'Untitled',
    description: item.description,
    date: item.createdAt || new Date().toISOString(),
    category: 'main',
    tags: item.tags || [],
    width: 800,
    height: 600,
    featured: false,
  });

  useEffect(() => {
    const fetchLiveImages = async () => {
      try {
        const data = await apiService.getGalleryImages();
        const normalized = Array.isArray(data)
          ? data
              .map(mapBackendImage)
              .filter((item) => Boolean(item.id && item.src))
          : [];
        setLiveImages(normalized);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
      }
    };

    fetchLiveImages();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onCreated = (item: BackendGalleryItem) => {
      const mapped = mapBackendImage(item);
      if (!mapped.id || !mapped.src) return;
      setLiveImages((prev) => [mapped, ...prev]);
    };

    const onUpdated = (item: BackendGalleryItem) => {
      const mapped = mapBackendImage(item);
      if (!mapped.id || !mapped.src) return;
      setLiveImages((prev) =>
        prev.map((existing) => (existing.id === mapped.id ? mapped : existing))
      );
    };

    const onDeleted = (data: { imageId: string }) => {
      setLiveImages((prev) => prev.filter((item) => item.id !== data.imageId));
    };

    socket.on('gallery-image-created', onCreated);
    socket.on('gallery-image-updated', onUpdated);
    socket.on('gallery-image-deleted', onDeleted);

    return () => {
      socket.off('gallery-image-created', onCreated);
      socket.off('gallery-image-updated', onUpdated);
      socket.off('gallery-image-deleted', onDeleted);
    };
  }, [socket]);

  const galleryImages = liveImages.length > 0 ? liveImages : dummyImages;

  // Group images by date for main gallery
  const groupedByDate = groupImagesByDate(galleryImages);
  
  // Filter images based on selected category and search
  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Function to handle image selection (for modal)
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  // Function to toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // Function to get images by category
  const getImagesByCategory = (category: GalleryImage['category']) => {
    return galleryImages.filter(img => img.category === category);
  };

  // Backend integration placeholder - this will be replaced with actual API calls
  const fetchImagesFromBackend = async (category?: string) => {
    // TODO: Implement actual API call
    console.log('Fetching images from backend...');
    
    // Example structure for future implementation:
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/images`, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // return await response.json();
    
    return dummyImages;
  };

  const fetchDepartmentsFromBackend = async () => {
    // TODO: Implement actual API call
    return departments;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-16 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
            <div className="w-2 h-2 bg-green-500 dark:bg-emerald-400 rounded-full"></div>
            <span className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
              Visual Journey
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Church Gallery
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Explore our moments of worship, fellowship, and ministry through photographs and stories.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search images by title or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'all', label: 'All Photos', icon: <Church className="h-4 w-4" /> },
              { id: 'main', label: 'Main Gallery', icon: <Calendar className="h-4 w-4" /> },
              { id: 'department', label: 'Departments', icon: <Users className="h-4 w-4" /> },
              { id: 'event', label: 'Events', icon: <Award className="h-4 w-4" /> },
              { id: 'pastorate', label: 'Pastorate', icon: <Users className="h-4 w-4" /> },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 dark:bg-emerald-600 text-white border-green-600 dark:border-emerald-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-emerald-500'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {selectedCategory === 'all' || selectedCategory === 'main' ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Main Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Photos organized by date - from our latest services and gatherings
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="h-4 w-4" />
                <span>{groupedByDate.length} date groups</span>
              </div>
            </div>

            {/* Date Grouped Gallery */}
            <div className="space-y-12">
              {groupedByDate.map(([date, images]) => (
                <div key={date} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 dark:bg-emerald-400 rounded-full"></div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {date}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {images.length} photos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                        onClick={() => handleImageClick(image)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          {/* TODO: Replace with Next.js Image component for production */}
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(image.id);
                            }}
                            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-transform"
                          >
                            <Heart className={`h-5 w-5 ${
                              favorites.includes(image.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </button>
                          
                          {image.featured && (
                            <div className="absolute top-4 left-4 bg-green-500 dark:bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Featured
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors">
                            {image.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {image.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {image.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {selectedCategory === 'all' || selectedCategory === 'department' ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Departmental Galleries
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore the unique ministries and activities of each department
                </p>
              </div>
            </div>

            <div className="grid gap-8">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-2/3">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {dept.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Led by: {dept.leader}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {dept.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                            <span className="font-medium">Meeting Schedule:</span>
                            <span>{dept.meetingSchedule}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Church className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                            <span className="font-medium">Contact:</span>
                            <a
                              href={`mailto:${dept.contactEmail}`}
                              className="text-green-600 dark:text-emerald-400 hover:underline"
                            >
                              {dept.contactEmail}
                            </a>
                          </div>
                        </div>

                        <button className="mt-6 inline-flex items-center gap-2 text-green-600 dark:text-emerald-400 hover:text-green-700 dark:hover:text-emerald-300 font-medium">
                          View Department Gallery
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="lg:w-1/3">
                        <div className="grid grid-cols-2 gap-4">
                          {dept.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => {
                                const galleryImg: GalleryImage = {
                                  id: `dept-${dept.id}-${idx}`,
                                  src: img,
                                  alt: `${dept.name} image ${idx + 1}`,
                                  title: `${dept.name}`,
                                  date: new Date().toISOString(),
                                  category: 'department',
                                  tags: [dept.name.toLowerCase()],
                                  width: 400,
                                  height: 400
                                };
                                handleImageClick(galleryImg);
                              }}
                            >
                              <img
                                src={img}
                                alt={`${dept.name} ${idx + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {selectedCategory === 'all' || selectedCategory === 'event' ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Event Galleries
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Special events, conferences, and celebrations
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {event.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => {
                            const galleryImg: GalleryImage = {
                              id: `event-${event.id}-${idx}`,
                              src: img,
                              alt: `${event.title} image ${idx + 1}`,
                              title: event.title,
                              date: event.date,
                              category: 'event',
                              tags: ['event', event.title.toLowerCase()],
                              width: 400,
                              height: 400
                            };
                            handleImageClick(galleryImg);
                          }}
                        >
                          <img
                            src={img}
                            alt={`${event.title} ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-300 hover:text-white py-3 rounded-xl font-medium transition-all">
                      View All Event Photos
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {selectedCategory === 'all' || selectedCategory === 'pastorate' ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Pastorate Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Meet our pastoral team and leadership
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {pastors.map((pastor) => (
                <div
                  key={pastor.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={pastor.image}
                          alt={pastor.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 dark:bg-emerald-500 rounded-full flex items-center justify-center">
                          <Church className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {pastor.name}
                        </h3>
                        <p className="text-green-600 dark:text-emerald-400 font-medium mb-3">
                          {pastor.role}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                          {pastor.bio}
                        </p>

                        <div className="space-y-2">
                          <a
                            href={`mailto:${pastor.email}`}
                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-emerald-400"
                          >
                            ✉️ {pastor.email}
                          </a>
                          {pastor.phone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              📞 {pastor.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Additional Screens Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Other Screens
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Building plans, future projects, and church infrastructure
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                This section will include building plans, architectural renderings, 
                and photos of our church expansion projects. Check back soon for updates!
              </p>
            </div>
          </div>
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition-transform"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex flex-col lg:flex-row h-full">
                {/* Image */}
                <div className="lg:w-2/3 h-64 lg:h-auto bg-gray-900">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="lg:w-1/3 p-6 overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedImage.title}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(selectedImage.id)}
                        className="p-2 hover:scale-110 transition-transform"
                      >
                        <Heart className={`h-6 w-6 ${
                          favorites.includes(selectedImage.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedImage.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                        <span>{new Date(selectedImage.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tags:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 dark:bg-emerald-600 hover:bg-green-700 dark:hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition">
                        <Download className="h-5 w-5" />
                        Download
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition">
                        <Share2 className="h-5 w-5" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backend Integration Note */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-emerald-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-green-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Backend Integration Ready
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                This gallery page is structured to easily integrate with your backend. 
                The dummy data will be replaced with real API calls to your image storage 
                service (Cloudinary, AWS S3, etc.) and database.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Ready for:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    <li>Cloudinary Integration</li>
                    <li>AWS S3 Storage</li>
                    <li>Database Image Metadata</li>
                    <li>Dynamic Category Management</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300">API Endpoints:</p>
                  <code className="block bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 mt-2 text-xs text-gray-700 dark:text-gray-300">
                    /api/gallery/images?category=main&date=2024-03
                  </code>
                  <code className="block bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 mt-2 text-xs text-gray-700 dark:text-gray-300">
                    /api/departments/{'{id}'}/images
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
