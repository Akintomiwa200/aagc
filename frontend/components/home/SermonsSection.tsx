'use client';

import { Play, Download, Share2, Calendar, Clock, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useSocket } from "@/contexts/SocketContext";

interface Sermon {
  id?: string;
  _id?: string;
  title: string;
  preacher: string;
  date: string;
  series: string;
  duration: string;
  description: string;
  plays: string;
  image: string;
  videoUrl?: string;
}

export default function SermonsSection() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const getSermonId = (sermon: Sermon) => sermon.id || sermon._id || '';

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

  useEffect(() => {
    if (!socket) return;

    const onCreated = (sermon: Sermon) => setSermons(prev => [sermon, ...prev]);
    const onUpdated = (sermon: Sermon) => {
      const sermonId = getSermonId(sermon);
      setSermons(prev => prev.map(existing => (getSermonId(existing) === sermonId ? sermon : existing)));
    };
    const onDeleted = (data: { sermonId: string }) => {
      setSermons(prev => prev.filter(existing => getSermonId(existing) !== data.sermonId));
    };

    socket.on('sermon-created', onCreated);
    socket.on('sermon-updated', onUpdated);
    socket.on('sermon-deleted', onDeleted);

    return () => {
      socket.off('sermon-created', onCreated);
      socket.off('sermon-updated', onUpdated);
      socket.off('sermon-deleted', onDeleted);
    };
  }, [socket]);

  return (
    <section className="relative py-[80px] px-6 lg:px-16 overflow-hidden" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ border: '1px solid var(--color-hairline)' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <span className="text-sm font-medium tracking-wide uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.88px' }}>
              Teaching & Preaching
            </span>
          </div>

          <h2
            className="text-[36px] font-normal text-[#26251e] dark:text-[#f7f7f4]"
            style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400 }}
          >
            Recent Messages & Sermons
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-body)', fontFamily: "'Inter', system-ui, sans-serif" }}>
            Access our library of biblical teaching to grow in your faith journey.
          </p>

          <Link href="/sermons" className="inline-flex items-center gap-2 text-white px-[18px] py-[10px] rounded-md font-medium transition hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', lineHeight: '1.0' }}>
            Browse Sermon Library
          </Link>
        </div>

        {/* Sermons Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
            <p style={{ color: 'var(--color-muted)' }}>No sermons available.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sermons.map((sermon, idx) => (
              <div
                key={getSermonId(sermon) || idx}
                className="group overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-hairline)',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                {/* Sermon Image/Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={sermon.image || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"}
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Series Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(245, 78, 0, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(245, 78, 0, 0.2)' }}>
                      {sermon.series || 'Sermon'}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/sermons/${getSermonId(sermon)}`} className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8" style={{ color: 'var(--color-ink)', fill: 'var(--color-ink)' }} />
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
                  <h3 className="text-lg font-semibold line-clamp-1" style={{ color: 'var(--color-ink)', fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-body)' }}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                      <span className="font-medium line-clamp-1">{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                      <span>{sermon.date}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-body)' }}>
                    {sermon.description}
                  </p>

                  <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid var(--color-hairline)' }}>
                    <Link href={`/sermons/${getSermonId(sermon)}`} className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-lg font-medium transition hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', lineHeight: '1.0' }}>
                      <Play className="h-4 w-4" />
                      Play Now
                    </Link>
                    <button className="flex items-center justify-center p-3 rounded-lg transition" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
                      <Download className="h-5 w-5" style={{ color: 'var(--color-ink)' }} />
                    </button>
                    <button className="flex items-center justify-center p-3 rounded-lg transition" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
                      <Share2 className="h-5 w-5" style={{ color: 'var(--color-ink)' }} />
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
