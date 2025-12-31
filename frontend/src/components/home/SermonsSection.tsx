'use client';

import { Play, Download, Share2, Calendar, User, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";

interface Sermon {
  id: string; // Added ID
  title: string;
  preacher: string;
  date: string;
  series: string; // Relaxed type
  duration: string;
  description: string;
  plays: string;
  image: string;
  videoUrl?: string; // Optional
}

const seriesColors: Record<string, string> = {
  // Relaxed mapping with fallback
  "Unshakable Foundation": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Daily Bread": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Kingdom Builders": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Divine Encounters": "bg-green-500/20 text-green-300 border-green-500/30",
  "default": "bg-gray-500/20 text-gray-300 border-gray-500/30"
};

export default function SermonsSection() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const data = await apiService.getSermons();
        setSermons(data);
      } catch (error) {
        console.error("Failed to fetch sermons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  return (
    <section className="relative py-20 px-6 lg:px-16 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 dot-grid"></div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium tracking-wide uppercase">
              Teaching & Preaching
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Recent Messages & Sermons
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our library of biblical teaching to grow in your faith journey.
          </p>

          <Link href="/sermons" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition mt-4">
            Browse Sermon Library
          </Link>
        </div>

        {/* Sermons Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-3xl">
            <p className="text-gray-500">No sermons available.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sermons.map((sermon, idx) => (
              <div
                key={sermon.id || idx}
                className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                }}
              >
                {/* Sermon Image/Thumbnail */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={sermon.image || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"}
                    alt={sermon.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Series Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${seriesColors[sermon.series] || seriesColors.default}`}
                    >
                      {sermon.series || 'Sermon'}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/sermons/${sermon.id}`} className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-gray-900 fill-gray-900" />
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{sermon.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        <span>{sermon.plays}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sermon Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium line-clamp-1">{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span>{sermon.date}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {sermon.description}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <Link href={`/sermons/${sermon.id}`} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all">
                      <Play className="h-4 w-4" />
                      Play Now
                    </Link>
                    <button className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl transition-all">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl transition-all">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
