'use client';

import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";

interface Event {
  id: string; // Added ID
  title: string;
  date: string;
  time: string;
  location: string;
  detail: string;
  category: 'Worship' | 'Outreach' | 'Training';
  image: string;
}

const categoryColors: Record<string, { light: string, dark: string }> = { // Relaxed type key
  Worship: {
    light: "bg-purple-500/20 text-purple-700 border-purple-500/30",
    dark: "bg-purple-500/30 text-purple-300 border-purple-500/50"
  },
  Outreach: {
    light: "bg-green-500/20 text-green-700 border-green-500/30",
    dark: "bg-green-500/30 text-green-300 border-green-500/50"
  },
  Training: {
    light: "bg-blue-500/20 text-blue-700 border-blue-500/30",
    dark: "bg-blue-500/30 text-blue-300 border-blue-500/50"
  },
  // Default fallback
  default: {
    light: "bg-gray-500/20 text-gray-700 border-gray-500/30",
    dark: "bg-gray-500/30 text-gray-300 border-gray-500/50"
  }
};

export default function EventsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getEvents();
        // Take only top 3 for home page
        setEvents(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <section className="relative py-20 px-6 lg:px-16 overflow-hidden dark-bg">
      {/* Decorative Background - Uses CSS variables */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 dot-grid"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-2 h-2 bg-green-500 dark:bg-emerald-400 rounded-full"></div>
            <span className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
              Church Calendar
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Upcoming Events & Gatherings
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join us for worship, fellowship, and service as we grow together in Christ.
          </p>

          <Link href="/events" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition mt-4">
            View Full Calendar
            <Calendar className="h-4 w-4" />
          </Link>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
            <p className="text-gray-500">No upcoming events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event, idx) => (
              <div
                key={event.id || idx}
                className="group card dark:card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                  transform: activeIndex === idx ? 'translateY(-8px)' : 'none',
                  boxShadow: activeIndex === idx
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${getCategoryColor(event.category || 'default').light + ' dark:' + getCategoryColor(event.category || 'default').dark
                      }`}>
                      {event.category || 'Event'}
                    </span>
                  </div>

                  {/* Calendar Icon */}
                  <div className="absolute top-4 right-4 glass p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {event.detail}
                  </p>

                  <Link href={`/events/${event.id}`} className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-300 hover:text-white py-3 rounded-xl font-medium transition-all group/btn">
                    Event Details
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events */}
        <div className="text-center mt-12">
          <Link href="/events" className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-600 dark:hover:border-emerald-500 hover:text-green-700 dark:hover:text-emerald-400 rounded-full font-medium transition-all">
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}