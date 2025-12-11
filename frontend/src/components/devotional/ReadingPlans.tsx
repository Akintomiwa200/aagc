// components/devotional/ReadingPlans.tsx
'use client';

import { Book, Target, CheckCircle, TrendingUp } from 'lucide-react';

const readingPlans = [
  {
    id: 1,
    title: "New Testament in 90 Days",
    description: "Read through the entire New Testament in 3 months",
    progress: 65,
    currentBook: "Romans",
    daysLeft: 30
  },
  {
    id: 2,
    title: "Psalms & Proverbs",
    description: "Daily wisdom and worship readings",
    progress: 42,
    currentBook: "Psalm 91",
    daysLeft: 58
  },
  {
    id: 3,
    title: "Gospels Study",
    description: "Deep dive into the life of Jesus",
    progress: 100,
    currentBook: "Completed",
    daysLeft: 0
  }
];

export default function ReadingPlans() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Book className="h-6 w-6 text-green-600" />
          Bible Reading Plans
        </h3>
        <span className="text-sm text-green-600 font-medium">Active</span>
      </div>

      <div className="space-y-6">
        {readingPlans.map(plan => (
          <div key={plan.id} className="p-4 rounded-xl border border-gray-200 hover:border-green-300 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900">{plan.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
              {plan.progress === 100 && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Progress</span>
                <span className="font-medium text-green-700">{plan.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${plan.progress === 100 ? 'bg-green-500' : 'bg-green-600'}`}
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Currently: {plan.currentBook}</span>
              </div>
              <div className="text-gray-500">
                {plan.daysLeft > 0 ? `${plan.daysLeft} days left` : 'Completed'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start New Plan */}
      <button className="w-full mt-6 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition">
        <TrendingUp className="h-5 w-5" />
        Start New Reading Plan
      </button>
    </div>
  );
}