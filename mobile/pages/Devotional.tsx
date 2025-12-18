import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { INITIAL_DEVOTIONAL } from '../constants';
import { useAuth } from '../hooks/useAppHooks';

const VERSIONS = ['NIV', 'KJV', 'NKJV', 'MSG', 'ESV'];

export const Devotional: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [version, setVersion] = useState('NIV');
  const { addPoints, addToTimeline } = useAuth();
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);

  // Award points after viewing for 2 seconds
  useEffect(() => {
    if (!hasAwardedPoints) {
        const timer = setTimeout(() => {
            addPoints(10); // Award 10 points for reading devotional
            // Log to timeline
            addToTimeline({
                id: Date.now().toString(),
                title: `Read Daily Word: ${INITIAL_DEVOTIONAL.title}`,
                date: new Date().toLocaleDateString(),
                type: 'devotional',
                description: `Meditated on ${INITIAL_DEVOTIONAL.scripture}`
            });
            setHasAwardedPoints(true);
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [hasAwardedPoints, addPoints, addToTimeline]);

  // Mock text variations for versions
  const getScriptureText = (ver: string) => {
    switch (ver) {
        case 'KJV': return "But ye shall receive power, after that the Holy Ghost is come upon you...";
        case 'MSG': return "But when the Holy Spirit comes upon you, you will be filled with power...";
        case 'ESV': return "But you will receive power when the Holy Spirit has come upon you...";
        default: return INITIAL_DEVOTIONAL.scripture; // Default (Acts 1:8)
    }
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    // Reset points flag for new date (in a real app, track by date ID to avoid multiple rewards same day)
    setHasAwardedPoints(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col pb-20 bg-gray-50 dark:bg-gray-900">
      {/* Date Navigation */}
      <div className="bg-white dark:bg-gray-800 p-4 sticky top-16 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => navigateDay('prev')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ChevronLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Daily Word</span>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(currentDate)}
            </h2>
          </div>
          <button onClick={() => navigateDay('next')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ChevronRight className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{INITIAL_DEVOTIONAL.title}</h1>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-primary-600 dark:text-primary-400 font-bold tracking-wide">Acts 1:8</p>
            <div className="relative group">
                <button className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 flex items-center gap-1 font-bold">
                    {version} <ChevronDown size={10} />
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 hidden group-hover:block z-20 min-w-[80px]">
                    {VERSIONS.map(v => (
                        <button 
                            key={v}
                            onClick={() => setVersion(v)}
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-gray-800/50 p-6 rounded-2xl border-l-4 border-primary-500 italic text-gray-700 dark:text-gray-200 font-serif text-lg leading-relaxed shadow-sm">
          "{getScriptureText(version)}"
        </div>

        <div className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>{INITIAL_DEVOTIONAL.content}</p>
          <p>
             As we navigate through the challenges of today, let us hold fast to the promises that have been spoken over our lives. Navigation through life requires a compass, and that compass is the Word of God.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              Prayer Focus
          </h3>
          <p className="text-gray-700 dark:text-gray-300 italic">"{INITIAL_DEVOTIONAL.prayer}"</p>
        </div>
        
        <div className="pt-4 flex justify-center">
             <Button variant="outline" className="gap-2">
                <Share2 size={16} /> Share Devotional
             </Button>
        </div>
      </div>
    </div>
  );
};