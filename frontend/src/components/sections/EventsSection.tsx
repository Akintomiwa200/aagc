'use client';

import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  detail: string;
  category: string;
  image: string;
}

const events: Event[] = [
  {
    title: "Prayer & Worship Night",
    date: "Fri, Feb 21, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Main Sanctuary",
    detail: "An evening of deep intercession, prophetic worship, and communion. All are welcome to encounter God's presence.",
    category: "Worship",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"
  },
  {
    title: "City Care Outreach",
    date: "Sat, Mar 01, 2024",
    time: "8:00 AM - 2:00 PM",
    location: "QVQ4+7V9, Bukuru 930101, Plateau",
    detail: "Community outreach with food distribution, medical checks, and prayer ministry for families in need.",
    category: "Outreach",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"
  },
  {
    title: "Leaders Lab Conference",
    date: "Sun, Mar 09, 2024",
    time: "9:00 AM - 4:00 PM",
    location: "AAGC Conference Center, Plateau",
    detail: "Leadership development intensive for ministry leads, department heads, and emerging leaders.",
    category: "Training",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80"
  },
];

const categoryColors: Record<string, string> = {
  Worship: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Outreach: "bg-green-500/20 text-green-300 border-green-500/30",
  Training: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

export default function EventsSection() {
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

          <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition mt-4">
            View Full Calendar
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {events.map((event, idx) => (
            <div
              key={event.title}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>

                {/* Calendar Icon */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-700" />
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.detail}
                </p>

                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-green-600 text-gray-700 hover:text-white py-3 rounded-xl font-medium transition-all group/btn">
                  RSVP Now
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

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