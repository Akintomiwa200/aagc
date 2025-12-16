'use client';

import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Heart,
  Music,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  { 
    name: 'Total Members', 
    value: '1,245', 
    change: '+12.3%', 
    changeType: 'increase', 
    icon: Users,
    color: 'bg-blue-500'
  },
  { 
    name: 'Active Events', 
    value: '24', 
    change: '+2.1%', 
    changeType: 'increase', 
    icon: Calendar,
    color: 'bg-green-500'
  },
  { 
    name: 'Monthly Donations', 
    value: '$45,230', 
    change: '+8.5%', 
    changeType: 'increase', 
    icon: DollarSign,
    color: 'bg-purple-500'
  },
  { 
    name: 'Prayer Requests', 
    value: '156', 
    change: '-3.2%', 
    changeType: 'decrease', 
    icon: Heart,
    color: 'bg-red-500'
  },
];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'Joined church', time: '10 min ago', type: 'member' },
  { id: 2, user: 'Sarah Smith', action: 'Made donation', time: '25 min ago', type: 'donation' },
  { id: 3, user: 'Pastor Mark', action: 'Added new sermon', time: '1 hour ago', type: 'sermon' },
  { id: 4, user: 'Prayer Team', action: 'Answered prayer request', time: '2 hours ago', type: 'prayer' },
  { id: 5, user: 'Event Team', action: 'Created new event', time: '3 hours ago', type: 'event' },
];

export default function AdminDashboard() {
  return (
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your church today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.color} rounded-xl`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
              </div>
            );
          })}
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Growth Overview</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Growth chart will appear here</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Activity className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center transition">
              <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Send Announcement</span>
            </button>
            <button className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl p-4 flex flex-col items-center justify-center transition">
              <Calendar className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Create Event</span>
            </button>
            <button className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl p-4 flex flex-col items-center justify-center transition">
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Member</span>
            </button>
            <button className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-xl p-4 flex flex-col items-center justify-center transition">
              <Music className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Upload Sermon</span>
            </button>
          </div>
        </div>
      </div>
    
  );
}