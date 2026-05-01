'use client';

import { useState, useEffect } from "react";
import { ArrowRight, Video, Play } from "lucide-react";
import Navbar from "../sections/Navbar";
import Link from "next/link";
import { apiService } from "@/lib/api";

// Hero Slider Images (Church Atmosphere)
const sliderImages = [
  "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1920&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=80",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&q=80"
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    const checkLiveStream = async () => {
      try {
        const data = await apiService.getLiveStream();
        setIsLive(data?.isLive || false);
      } catch (error) {
        console.error("Failed to check live stream", error);
      }
    };
    checkLiveStream();

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f7f4]">
      <Navbar />

      {/* Background Slider */}
      <div className="absolute inset-0">
        {sliderImages.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentSlide === idx ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[#26251e]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center px-6 lg:px-16 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#f54e00]/10 text-[#f54e00] px-4 py-2 rounded-full border border-[#f54e00]/20 mb-8">
            <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
            <span className="text-sm font-medium tracking-wide uppercase" style={{ letterSpacing: '0.88px' }}>
              AAGC
            </span>
          </div>

          {/* Hero Headline - Display Mega */}
          <h1
            className="text-[72px] font-normal text-white leading-[1.1] mb-6"
            style={{
              letterSpacing: '-2.16px',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Raising a Generation<br />
            <span className="text-[#f54e00]">On Fire</span> For Christ
          </h1>

          {/* Description - Body MD */}
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-10" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Apostolic Army Global Church (AAGC) is a Spirit-led ministry committed
            to raising disciples, strengthening believers, and releasing God's
            power across nations through worship, the Word, and service.
          </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
            {isLive ? (
              <Link
                href="/live"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-[18px] py-[10px] rounded-md font-medium transition group animate-pulse"
                style={{ fontSize: '14px', lineHeight: '1.0' }}
              >
                <Play className="w-4 h-4" />
                Watch Live Now
              </Link>
            ) : (
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#f54e00] hover:bg-[#d04200] text-white px-[18px] py-[10px] rounded-md font-medium transition group"
                style={{ fontSize: '14px', lineHeight: '1.0' }}
              >
                Visit Our Church
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link
              href="/sermons"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-[#26251e]/5 text-[#26251e] px-[18px] py-[10px] rounded-md font-medium transition"
              style={{ fontSize: '14px', lineHeight: '1.0' }}
            >
              Latest Sermons
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {sliderImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}


