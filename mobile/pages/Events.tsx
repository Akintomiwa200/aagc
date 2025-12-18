
import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PullToRefresh } from '../components/ui/PullToRefresh';
import { MOCK_EVENTS } from '../constants';
import { ChurchEvent, EventType } from '../types';
import { useAuth, useEvents } from '../hooks/useAppHooks';

export const Events: React.FC = () => {
  const { registerForEvent, events: initialEvents } = useEvents();
  const [events, setEvents] = useState<ChurchEvent[]>(initialEvents);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const { addPoints, addToTimeline } = useAuth();

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleRegister = (e: React.MouseEvent, event: ChurchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    registerForEvent(event.id);
    setEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, isRegistered: true } : ev));
    
    addPoints(20);
    addToTimeline({
        id: Date.now().toString(),
        title: `Registered for ${event.title}`,
        date: new Date().toLocaleDateString(),
        type: 'event',
        description: 'Going to be an amazing time of fellowship!'
    });
  };

  const filterOptions = ['All', ...Object.values(EventType)];

  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'All') return true;
    return event.type === selectedFilter;
  });

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 pb-24 p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h1>
            
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {filterOptions.map(option => (
                    <button
                        key={option}
                        onClick={() => setSelectedFilter(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                            selectedFilter === option
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Link 
                    to={`/event/${event.id}`} 
                    key={event.id} 
                    className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-transform active:scale-[0.98]"
                >
                  <div className="h-32 bg-gray-200 relative">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                          {event.type}
                      </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{event.description}</p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-primary-500" />
                              <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Clock size={16} className="text-primary-500" />
                              <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary-500" />
                              <span>{event.location}</span>
                          </div>
                      </div>

                      {event.requiresRegistration && (
                          <div className="pt-2">
                              {event.isRegistered ? (
                                  <Button fullWidth variant="secondary" disabled className="gap-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                      <CheckCircle size={16} /> Registered
                                  </Button>
                              ) : (
                                  <Button fullWidth onClick={(e) => handleRegister(e, event)}>
                                      Register Now
                                  </Button>
                              )}
                          </div>
                      )}
                  </div>
                </Link>
              ))
          ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                  <Calendar size={48} className="opacity-20 mb-4" />
                  <p>No events found for {selectedFilter}</p>
              </div>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
};
