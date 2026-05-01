'use client';

import React, { FC } from "react";
import { Heart, ShieldCheck, ArrowRight } from "lucide-react";

const GivingSection: FC = () => {
  return (
    <section className="relative py-[80px] px-6 lg:px-16 overflow-hidden bg-[#f7f7f4]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Giving Card */}
        <div className="bg-white rounded-[12px] shadow-none border border-[#e6e5e0] overflow-hidden">
          {/* Header Section with Image */}
          <div className="relative h-64 lg:h-80 overflow-hidden bg-[#26251e]">
            <img
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80"
              alt="Giving"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#26251e]/60 via-transparent to-transparent"></div>

            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-[#f54e00]/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-[#f54e00] fill-[#f54e00]" />
              </div>

              <div className="inline-flex items-center gap-2 bg-[#f54e00]/10 backdrop-blur-md px-4 py-2 rounded-full border border-[#f54e00]/20 mb-4">
                <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
                <span className="text-sm font-medium tracking-wide text-white uppercase" style={{ letterSpacing: '0.88px' }}>
                  Generosity
                </span>
              </div>

              <h2
                className="text-[36px] font-normal text-white mb-4"
                style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Support God's Work
              </h2>
              <p className="text-lg text-white/90 max-w-2xl" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Your giving enables ministry, transforms lives, and advances the Kingdom.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12 space-y-8">
            {/* Description */}
            <div className="text-center space-y-4">
              <p className="text-lg text-[#5a5852] leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Every gift makes a difference. Whether you're contributing to tithes and
                offerings, supporting missions, or helping families in need, your
                generosity impacts lives and spreads hope throughout our community and
                beyond.
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-[#5a5852]">
              <ShieldCheck className="h-5 w-5 text-[#f54e00]" />
              <span>All transactions are secured with 256-bit SSL encryption</span>
            </div>

            {/* Main CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <button className="group inline-flex items-center gap-3 bg-[#f54e00] hover:bg-[#d04200] text-white px-[18px] py-[10px] rounded-[8px] font-medium transition" style={{ fontSize: '14px', lineHeight: '1.0' }}>
                <Heart className="h-4 w-4" />
                Give Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-sm text-[#5a5852]">One-time or recurring donations available</p>
            </div>

            {/* Bible Verse */}
            <div className="text-center pt-6">
              <div className="inline-block bg-[#f7f7f4] px-6 py-4 rounded-[12px] border border-[#e6e5e0]">
                <p className="text-[#5a5852] italic mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  "Each of you should give what you have decided in your heart to give,
                  not reluctantly or under compulsion, for God loves a cheerful giver."
                </p>
                <p className="text-sm font-semibold text-[#f54e00]">2 Corinthians 9:7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8 text-[#5a5852] text-sm" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          <p>
            Questions about giving? Contact our finance team at{" "}
            <a
              href="mailto:giving@aagc.com"
              className="text-[#f54e00] hover:text-[#d04200] font-medium"
            >
              giving@aagc.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GivingSection;
