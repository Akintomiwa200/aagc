'use client';

import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useSocket } from "@/contexts/SocketContext";

interface Event {
  id?: string;
  _id?: string;
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
  const { socket } = useSocket();
  const getEventId = (event: Event) => event.id || event._id || '';

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

  useEffect(() => {
    if (!socket) return;

    const onCreated = (event: Event) => {
      setEvents(prev => [event, ...prev].slice(0, 3));
    };
    const onUpdated = (event: Event) => {
      const eventId = getEventId(event);
      setEvents(prev => prev.map(existing => (getEventId(existing) === eventId ? event : existing)));
    };
    const onDeleted = (data: { eventId: string }) => {
      setEvents(prev => prev.filter(existing => getEventId(existing) !== data.eventId));
    };

    socket.on('event-created', onCreated);
    socket.on('event-updated', onUpdated);
    socket.on('event-deleted', onDeleted);

    return () => {
      socket.off('event-created', onCreated);
      socket.off('event-updated', onUpdated);
      socket.off('event-deleted', onDeleted);
    };
  }, [socket]);

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <section className="relative py-[80px] px-6 lg:px-16 overflow-hidden" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: 'var(--color-hairline)' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <span className="text-sm font-medium tracking-wide uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.88px' }}>
              Church Calendar
            </span>
          </div>

          <h2
            className="text-[36px] font-normal text-[#26251e] dark:text-[#f7f7f4]"
            style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Upcoming Events & Gatherings
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-body)', fontFamily: "'Inter', system-ui, sans-serif" }}>
            Join us for worship, fellowship, and service as we grow together in Christ.
          </p>

          <Link href="/events" className="inline-flex items-center gap-2 text-white px-[18px] py-[10px] rounded-md font-medium transition mt-4 hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', lineHeight: '1.0' }}>
            View Full Calendar
            <Calendar className="h-4 w-4" />
          </Link>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
            <p style={{ color: 'var(--color-muted)' }}>No upcoming events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event, idx) => (
              <div
                key={getEventId(event) || idx}
                className="group overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-hairline)',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
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
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md" style={{ backgroundColor: 'rgba(245, 78, 0, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(245, 78, 0, 0.2)' }}>
                      {event.category || 'Event'}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold line-clamp-1" style={{ color: 'var(--color-ink)', fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {event.title}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-body)' }}>
                      <Clock className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-body)' }}>
                      <MapPin className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-body)' }}>
                    {event.detail}
                  </p>

                  <Link href={`/events/${getEventId(event)}`} className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-medium transition-all hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', lineHeight: '1.0' }}>
                    Event Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events */}
        <div className="text-center mt-12">
          <Link href="/events" className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all" style={{ border: '2px solid var(--color-hairline-strong)', color: 'var(--color-ink)', fontSize: '14px', lineHeight: '1.4' }}>
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
