'use client';

import { useState, useEffect } from "react";
import { ArrowRight, HeartHandshake, Users, Flame, Church } from "lucide-react";
import Navbar from "./Navbar";

// Hero Slider Images (Church Atmosphere)
const sliderImages = [
  "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1920&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=80",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&q=80"
];

export default function HeroWithSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center px-6 lg:px-16 pt-32 pb-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Text Content */}
            <div className="space-y-8">
              {/* Church Badge */}
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium tracking-wide">
                  APOSTOLIC ARMY GLOBAL CHURCH (AAGC)
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Raising a Generation{" "}
                <span className="text-green-500">On Fire</span>{" "}
                For Christ
              </h1>

              {/* Church Description */}
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
                Apostolic Army Global Church (AAGC) is a Spirit-led ministry committed
                to raising disciples, strengthening believers, and releasing God’s
                power across nations through worship, the Word, and service.
              </p>

              {/* CTA */}
              <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-medium transition group">
                Visit Our Church
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Ministry Feature Cards (No Numbers) */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              
             {/* Worship - RAISED */}
<div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-700/30 rounded-3xl p-8 hover:bg-emerald-900/50 transition transform -translate-y-6">
  <div className="flex justify-end mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white mb-2">Powerful Worship</div>
                <div className="text-white/70 font-medium">
                  Experience intense Spirit-filled worship.
                </div>
              </div>

              {/* Community */}
              <div className="bg-amber-50/95 backdrop-blur-sm rounded-3xl p-8 hover:bg-white transition">
                <div className="flex justify-end mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-2">Strong Community</div>
                <div className="text-gray-600 font-medium">
                  A family built on love, unity, and faith.
                </div>
              </div>

              {/* Outreach - RAISED */}
<div className="bg-amber-50/95 backdrop-blur-sm rounded-3xl p-8 hover:bg-white transition transform -translate-y-6">
 <div className="flex justify-end mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-2">Global Outreach</div>
                <div className="text-gray-600 font-medium">
                  Touching lives through missions and service.
                </div>
              </div>

              {/* Discipleship */}
              <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-700/30 rounded-3xl p-8 hover:bg-emerald-900/50 transition">
                <div className="flex justify-end mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Church className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white mb-2">Discipleship</div>
                <div className="text-white/70 font-medium">
                  Training believers for kingdom impact.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
