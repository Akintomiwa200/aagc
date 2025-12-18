import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, X, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface GalleryItem {
  id: string;
  url: string;
  title: string;
  date: string; // YYYY-MM-DD
  department: string;
}

// Mock Data
const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?w=600&q=80', title: 'Sunday Worship', date: '2023-10-29', department: 'Worship' },
  { id: '2', url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=600&q=80', title: 'Choir Special', date: '2023-10-29', department: 'Choir' },
  { id: '3', url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80', title: 'Youth Hangout', date: '2023-10-25', department: 'Youth' },
  { id: '4', url: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&q=80', title: 'Bible Study', date: '2023-10-25', department: 'General' },
  { id: '5', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80', title: 'Outreach Prep', date: '2023-10-20', department: 'Outreach' },
  { id: '6', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', title: 'Tech Team', date: '2023-10-29', department: 'Media' },
  { id: '7', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', title: 'Kids Presentation', date: '2023-09-15', department: 'Children' },
  { id: '8', url: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=600&q=80', title: 'Annual Concert', date: '2023-09-15', department: 'Choir' },
  { id: '9', url: 'https://images.unsplash.com/photo-1601142634808-38923eb7c560?w=600&q=80', title: 'Pastor Sermon', date: '2023-10-29', department: 'General' },
  { id: '10', url: 'https://images.unsplash.com/photo-1567620905715-a3dac09cf817?w=600&q=80', title: 'Picnic', date: '2023-08-10', department: 'Social' },
  { id: '11', url: 'https://images.unsplash.com/photo-1609234656388-0176396f4831?w=600&q=80', title: 'Baptism Service', date: '2023-08-15', department: 'Service' },
  { id: '12', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80', title: 'Sound Check', date: '2023-10-29', department: 'Media' },
];

export const Gallery: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set(GALLERY_ITEMS.map(item => item.department));
    return ['All', ...Array.from(depts)];
  }, []);

  // Filter and Group items
  const groupedImages = useMemo(() => {
    let filtered = GALLERY_ITEMS;

    // Apply Department Filter
    if (selectedDept !== 'All') {
      filtered = filtered.filter(item => item.department === selectedDept);
    }

    // Apply Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.title.toLowerCase().includes(q));
    }

    // Group by Month Year
    const groups: Record<string, GalleryItem[]> = {};
    // Sort by date desc first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    filtered.forEach(item => {
      const date = new Date(item.date);
      const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    return groups;
  }, [selectedDept, searchQuery]);

  return (
    <div className="pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
       {/* Header */}
       <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ArrowLeft className="text-gray-900 dark:text-white" size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
             </div>
             <button 
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={`p-2 rounded-full ${isSearchVisible ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
             >
                <Search size={24} />
             </button>
          </div>
          
          {/* Search Bar */}
          {isSearchVisible && (
             <div className="px-4 pb-2 animate-in slide-in-from-top-2">
                <input 
                   type="text" 
                   placeholder="Search photos..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 dark:text-white outline-none"
                   autoFocus
                />
             </div>
          )}

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
       </div>

       {/* Content */}
       <div className="p-4 space-y-8 min-h-[50vh]">
         {Object.entries(groupedImages).map(([dateGroup, items]) => (
           <div key={dateGroup}>
             <h3 className="sticky top-[140px] z-20 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm py-2 w-max pr-4 rounded-r-lg">
               <Calendar size={14} />
               {dateGroup}
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {(items as GalleryItem[]).map(item => (
                 <div 
                    key={item.id} 
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => setSelectedImage(item)}
                 >
                   <img src={item.url} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                   <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                     <p className="text-white text-xs font-medium truncate">{item.title}</p>
                   </div>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
                       {item.department}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ))}

         {Object.keys(groupedImages).length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <Filter size={40} className="opacity-50" />
             </div>
             <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No photos found</p>
             <p className="text-sm">Try changing your filters</p>
           </div>
         )}
       </div>

       {/* Lightbox Modal */}
       {selectedImage && (
         <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-white/80 text-sm font-medium">{selectedImage.date}</span>
              <button 
                onClick={() => setSelectedImage(null)} 
                className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Image Area */}
            <div className="flex-1 flex items-center justify-center p-0 md:p-4 overflow-hidden touch-none">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-w-full max-h-full object-contain md:rounded-lg shadow-2xl" 
              />
            </div>

            {/* Modal Footer / Info */}
            <div className="p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white pb-safe">
              <h2 className="text-2xl font-bold mb-1">{selectedImage.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-300">
                <span className="px-2 py-1 bg-white/20 rounded-md backdrop-blur-md text-white text-xs font-medium">
                  {selectedImage.department}
                </span>
              </div>
            </div>
         </div>
       )}
    </div>
  );
};
