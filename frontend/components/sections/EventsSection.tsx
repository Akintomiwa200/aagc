'use client';

import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from 'next/link';
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
  category: string;
  image: string;
}

const categoryColors: Record<string, string> = {
  Worship: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Outreach: "bg-green-500/20 text-green-300 border-green-500/30",
  Training: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  // Fallback
  default: "bg-gray-500/20 text-gray-300 border-gray-500/30"
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const getEventId = (event: Event) => event.id || event._id || '';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getEvents();
        setEvents(data);
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
      setEvents(prev => [event, ...prev]);
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

  return (
    <section className="relative bg-gray-50 py-20 px-6 lg:px-16 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Church Calendar</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Upcoming Events & Gatherings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us for worship, fellowship, and service as we grow together in Christ.
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
            <p className="text-gray-500">No upcoming events found.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event, idx) => (
              <div
                key={getEventId(event) || idx}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
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
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${categoryColors[event.category] || categoryColors.default}`}>
                      {event.category || 'Event'}
                    </span>
                  </div>

                  {/* Calendar Icon */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-700" />
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {event.detail}
                  </p>

                  <Link href={`/events/${getEventId(event)}`} className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-green-600 text-gray-700 hover:text-white py-3 rounded-xl font-medium transition-all group/btn">
                    RSVP Now
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4 bg-white p-6 rounded-2xl shadow-md">
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Prayer Line</div>
            </div>
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold text-green-600">100+</div>
              <div className="text-sm text-gray-600 mt-1">Weekly Attendees</div>
            </div>
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold text-green-600">10+</div>
              <div className="text-sm text-gray-600 mt-1">Ministries</div>
            </div>
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold text-green-600">52</div>
              <div className="text-sm text-gray-600 mt-1">Weeks/Year</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
