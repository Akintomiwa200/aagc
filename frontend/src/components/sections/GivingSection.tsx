'use client';

import React, { FC } from "react";
import { Heart, ShieldCheck, ArrowRight } from "lucide-react";

const GivingSection: FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 px-6 lg:px-16 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main Giving Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section with Image */}
          <div className="relative h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700">
            <img
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80"
              alt="Giving"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-4">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-sm font-medium tracking-wide text-white uppercase">
                  Generosity
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Support God's Work
              </h2>
              <p className="text-lg text-white/90 max-w-2xl">
                Your giving enables ministry, transforms lives, and advances the Kingdom.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12 space-y-8">
            {/* Description */}
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Every gift makes a difference. Whether you're contributing to tithes and
                offerings, supporting missions, or helping families in need, your generosity
                impacts lives and spreads hope throughout our community and beyond.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$42,850</div>
                <div className="text-sm text-gray-600 mt-1">Monthly Giving</div>
                <div className="text-xs text-green-600 mt-1">↑ 12% from last month</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$8,200</div>
                <div className="text-sm text-gray-600 mt-1">Missions Support</div>
                <div className="text-xs text-green-600 mt-1">↑ 18% from last month</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$156,000</div>
                <div className="text-sm text-gray-600 mt-1">Building Fund</div>
                <div className="text-xs text-gray-600 mt-1">Target: $250,000</div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>All transactions are secured with 256-bit SSL encryption</span>
            </div>

            {/* Main CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Heart className="h-6 w-6" />
                Give Now
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-sm text-gray-500">One-time or recurring donations available</p>
            </div>

            {/* Bible Verse */}
            <div className="text-center pt-6">
              <div className="inline-block bg-green-50 px-6 py-4 rounded-2xl border border-green-100">
                <p className="text-gray-700 italic mb-2">
                  "Each of you should give what you have decided in your heart to give,
                  not reluctantly or under compulsion, for God loves a cheerful giver."
                </p>
                <p className="text-sm font-semibold text-green-700">2 Corinthians 9:7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Questions about giving? Contact our finance team at{" "}
            <a
              href="mailto:giving@aagc.org"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              giving@aagc.org
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GivingSection;
  