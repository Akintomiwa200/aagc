// app/devotional/page.tsx
import ReadingPlans from '@/components/devotional/ReadingPlans';
import PrayerSection from '@/components/devotional/PrayerSection';
import FeaturedDevotional from '@/components/devotional/FeaturedDevotional';
import Link from 'next/link';
import Navbar from '../../components/sections/Navbar'

export default function DevotionalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Hero Section */}
      <Navbar/>
      <section className="relative bg-gradient-to-br from-green-800 via-emerald-700 to-teal-900 text-white py-24 px-6 lg:px-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <span className="text-sm font-medium tracking-wide uppercase">Daily Spiritual Nourishment</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Grow in Faith
              <br />
              <span className="text-emerald-300">Daily</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Start your day with God's Word. Daily devotionals, Bible reading plans, 
              and prayer community to strengthen your spiritual journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
             
              <div className="text-white/80 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-medium">Today's Verse:</span> Proverbs 3:5-6
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 lg:px-16 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Featured & Recent */}
          <div className="lg:col-span-2 space-y-8">
            <FeaturedDevotional />
            
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <ReadingPlans />
            <PrayerSection />
            
            

            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Today's Challenge</h3>
              <p className="mb-6 text-lg">
                Share today's devotional with one person who needs encouragement. 
                Spread God's Word through a simple text message or conversation.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-90">
                  "Let the word of Christ dwell in you richly..." - Colossians 3:16
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span className="text-sm">Active Challenge</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-lg transition border border-white/30">
                Mark as Complete
              </button>
            </div>

            
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-16">
        <div className="bg-gradient-to-r from-green-900 to-emerald-800 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Start Your Spiritual Journey Today</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of believers growing in faith through daily devotionals, 
            prayer community, and Bible reading plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-white text-green-900 font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}