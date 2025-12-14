// components/devotional/ReadingPlans.tsx
'use client';

import { Book, Target, CheckCircle, TrendingUp, Calendar, Award, Clock, Users, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const readingPlans = [
  {
    id: 1,
    title: "New Testament in 90 Days",
    description: "Read through the entire New Testament with daily readings and reflection questions",
    progress: 65,
    currentBook: "Romans",
    daysLeft: 30,
    totalDays: 90,
    participants: 1245,
    difficulty: "Intermediate",
    timePerDay: "15 min",
    features: ["Daily Questions", "Community Forum", "Progress Tracking"],
    recommended: true
  },
  {
    id: 2,
    title: "Psalms & Proverbs",
    description: "Daily wisdom and worship readings with practical application",
    progress: 42,
    currentBook: "Psalm 91",
    daysLeft: 58,
    totalDays: 100,
    participants: 892,
    difficulty: "Beginner",
    timePerDay: "10 min",
    features: ["Weekly Reflections", "Memory Verses", "Prayer Prompts"],
    recommended: false
  },
  {
    id: 3,
    title: "Gospels Study",
    description: "Deep dive into the life and teachings of Jesus",
    progress: 100,
    currentBook: "Completed",
    daysLeft: 0,
    totalDays: 60,
    participants: 1567,
    difficulty: "Intermediate",
    timePerDay: "20 min",
    features: ["Character Studies", "Historical Context", "Application Exercises"],
    recommended: true
  },
  {
    id: 4,
    title: "Through the Bible in a Year",
    description: "Comprehensive journey through all 66 books",
    progress: 28,
    currentBook: "Leviticus",
    daysLeft: 267,
    totalDays: 365,
    participants: 2345,
    difficulty: "Advanced",
    timePerDay: "25 min",
    features: ["Daily Reading", "Weekly Reviews", "Study Notes"],
    recommended: false
  }
];

const planCategories = [
  { id: 'new', label: 'New Plans', count: 12 },
  { id: 'popular', label: 'Most Popular', count: 8 },
  { id: 'short', label: 'Short Term', count: 15 },
  { id: 'thematic', label: 'Thematic', count: 9 },
];

export default function ReadingPlans() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('my-plans');
  const router = useRouter();

  const myPlans = readingPlans.filter(plan => plan.progress > 0 && plan.progress < 100);
  const completedPlans = readingPlans.filter(plan => plan.progress === 100);
  const suggestedPlans = readingPlans.filter(plan => plan.progress === 0 && plan.recommended);

  const handlePlanClick = (planId: number) => {
    router.push(`/reading-plans/${planId}`);
  };

  const handleStartNewPlan = () => {
    router.push('/reading-plans/browse');
  };

  const handleViewAllPlans = () => {
    router.push('/reading-plans/all');
  };

  const handleJoinCommunity = (planId: number) => {
    router.push(`/reading-plans/${planId}/community`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-100 rounded-xl">
            <Book className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Bible Reading Plans</h3>
            <p className="text-gray-600">Structured journeys through Scripture</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('my-plans')}
              className={`px-4 py-2 rounded-md transition ${viewMode === 'my-plans' ? 'bg-white shadow-sm' : ''}`}
            >
              My Plans
            </button>
            <button
              onClick={() => setViewMode('suggested')}
              className={`px-4 py-2 rounded-md transition ${viewMode === 'suggested' ? 'bg-white shadow-sm' : ''}`}
            >
              Suggested
            </button>
            <button
              onClick={() => setViewMode('completed')}
              className={`px-4 py-2 rounded-md transition ${viewMode === 'completed' ? 'bg-white shadow-sm' : ''}`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {planCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition ${selectedCategory === category.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <div className="flex items-center gap-2">
              <span>{category.label}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                {category.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Stats Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{myPlans.length}</div>
              <div className="text-sm text-gray-600">Active Plans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {myPlans.reduce((acc, plan) => acc + plan.progress, 0) / myPlans.length || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg. Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {readingPlans.reduce((acc, plan) => acc + plan.participants, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">24</div>
              <div className="text-sm text-gray-600">Days Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Plans */}
      {viewMode === 'my-plans' && myPlans.length > 0 && (
        <div className="space-y-6 mb-8">
          <h4 className="text-xl font-bold text-gray-900">Continue Reading</h4>
          {myPlans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => handlePlanClick(plan.id)}
              className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{plan.title}</h4>
                        {plan.recommended && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                            <Star className="h-3 w-3" />
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{plan.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{plan.participants.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Your Progress</span>
                        <span className="font-medium text-green-700">{plan.progress}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{plan.totalDays - plan.daysLeft} of {plan.totalDays} days</span>
                        <span>{plan.daysLeft} days left</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Currently: {plan.currentBook}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{plan.timePerDay} per day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{plan.difficulty}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:w-48 space-y-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanClick(plan.id);
                    }}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                  >
                    Continue Reading
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinCommunity(plan.id);
                    }}
                    className="w-full py-2.5 border border-green-600 text-green-600 hover:bg-green-50 font-medium rounded-lg transition"
                  >
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Plans */}
      {viewMode === 'suggested' && (
        <div className="space-y-6 mb-8">
          <h4 className="text-xl font-bold text-gray-900">Recommended For You</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedPlans.map(plan => (
              <div 
                key={plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{plan.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                  </div>
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{plan.timePerDay}/day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>{plan.participants.toLocaleString()} readers</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {plan.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanClick(plan.id);
                    }}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition mt-4"
                  >
                    Start This Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Plans */}
      {viewMode === 'completed' && completedPlans.length > 0 && (
        <div className="space-y-6 mb-8">
          <h4 className="text-xl font-bold text-gray-900">Completed Plans</h4>
          {completedPlans.map(plan => (
            <div 
              key={plan.id}
              className="p-6 rounded-xl border border-green-200 bg-green-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-bold text-gray-900">{plan.title}</h4>
                    <p className="text-gray-600 text-sm">Completed on Feb 15, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700">100%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span>{plan.totalDays} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span>Certificate Earned</span>
                </div>
                <button 
                  onClick={() => router.push(`/reading-plans/${plan.id}/certificate`)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  View Certificate →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start New Plan & View All */}
      <div className="space-y-4">
        <button 
          onClick={handleStartNewPlan}
          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all group"
        >
          <TrendingUp className="h-5 w-5 group-hover:text-green-600" />
          <div className="text-left">
            <div className="font-bold">Start New Reading Plan</div>
            <div className="text-sm">Choose from 50+ curated plans</div>
          </div>
        </button>
        
        <button 
          onClick={handleViewAllPlans}
          className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition"
        >
          View All Reading Plans ({readingPlans.length})
        </button>
      </div>

      {/* Achievement */}
      <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Reading Streak: 24 Days!</h4>
            <p className="text-sm text-gray-600">Keep going to unlock the 30-day achievement</p>
          </div>
        </div>
        <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500" style={{ width: '80%' }}></div>
        </div>
        <div className="text-right text-xs text-gray-600 mt-1">6 days to go</div>
      </div>
    </div>
  );
}