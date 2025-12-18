'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
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
  ArrowDownRight,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Bell,
  FileText,
  Settings,
  UserPlus,
} from 'lucide-react';

// Extended stats with more church-specific metrics
const stats = [
  { 
    name: 'Total Members', 
    value: '1,245', 
    change: '+12.3%', 
    changeType: 'increase', 
    icon: Users,
    color: 'bg-blue-500',
    detail: 'Active: 1,100 | New this month: 42'
  },
  { 
    name: 'Weekly Attendance', 
    value: '850', 
    change: '+5.2%', 
    changeType: 'increase', 
    icon: Users,
    color: 'bg-green-500',
    detail: 'Avg. weekly growth: 3.1%'
  },
  { 
    name: 'Monthly Donations', 
    value: '$45,230', 
    change: '+8.5%', 
    changeType: 'increase', 
    icon: DollarSign,
    color: 'bg-purple-500',
    detail: 'YTD: $398,450'
  },
  { 
    name: 'Prayer Requests', 
    value: '156', 
    change: '-3.2%', 
    changeType: 'decrease', 
    icon: Heart,
    color: 'bg-red-500',
    detail: 'Answered: 128 | Pending: 28',
    dynamic: true, // Mark as dynamic
  },
  { 
    name: 'Active Volunteers', 
    value: '87', 
    change: '+4.8%', 
    changeType: 'increase', 
    icon: Users,
    color: 'bg-yellow-500',
    detail: 'Teams: 12 | Needs: 15'
  },
  { 
    name: 'Small Groups', 
    value: '24', 
    change: '+2.1%', 
    changeType: 'increase', 
    icon: Users,
    color: 'bg-indigo-500',
    detail: 'Active meetings this week: 18'
  },
];

// Growth data for the chart
const growthData = [
  { month: 'Jan', members: 1150, attendance: 780, donations: 38500 },
  { month: 'Feb', members: 1175, attendance: 795, donations: 39200 },
  { month: 'Mar', members: 1190, attendance: 810, donations: 40500 },
  { month: 'Apr', members: 1205, attendance: 825, donations: 41200 },
  { month: 'May', members: 1220, attendance: 830, donations: 42500 },
  { month: 'Jun', members: 1245, attendance: 850, donations: 45230 },
];

// Custom SVG Line Chart Component (No external library)
const GrowthLineChart = ({ data, width = 600, height = 300 }) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const months = data.map(d => d.month);
  const maxMembers = Math.max(...data.map(d => d.members));
  const maxAttendance = Math.max(...data.map(d => d.attendance));
  const maxDonations = Math.max(...data.map(d => d.donations));
  const maxValue = Math.max(maxMembers, maxAttendance, maxDonations * 0.002); // Scale donations
  
  const xScale = (index) => margin.left + (index * chartWidth) / (months.length - 1);
  const yScale = (value) => margin.top + chartHeight - (value / maxValue) * chartHeight;

  // Create line path for members
  const membersLine = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.members)}`
  ).join(' ');

  // Create line path for attendance
  const attendanceLine = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.attendance)}`
  ).join(' ');

  // Create line path for donations (scaled)
  const donationsLine = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.donations * 0.002)}`
  ).join(' ');

  return (
    <svg width={width} height={height} className="w-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <g key={i}>
          <line
            x1={margin.left}
            y1={margin.top + chartHeight * ratio}
            x2={margin.left + chartWidth}
            y2={margin.top + chartHeight * ratio}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text
            x={margin.left - 10}
            y={margin.top + chartHeight * ratio + 4}
            textAnchor="end"
            className="text-xs fill-gray-500"
          >
            {Math.round(maxValue * (1 - ratio))}
          </text>
        </g>
      ))}

      {/* X-axis */}
      <line
        x1={margin.left}
        y1={margin.top + chartHeight}
        x2={margin.left + chartWidth}
        y2={margin.top + chartHeight}
        stroke="#6b7280"
        strokeWidth="2"
      />
      
      {/* X-axis labels */}
      {months.map((month, i) => (
        <text
          key={i}
          x={xScale(i)}
          y={height - 10}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {month}
        </text>
      ))}

      {/* Y-axis */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + chartHeight}
        stroke="#6b7280"
        strokeWidth="2"
      />

      {/* Members line */}
      <path
        d={membersLine}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Attendance line */}
      <path
        d={attendanceLine}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Donations line (scaled) */}
      <path
        d={donationsLine}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5,5"
      />

      {/* Data points */}
      {data.map((d, i) => (
        <g key={i}>
          <circle
            cx={xScale(i)}
            cy={yScale(d.members)}
            r="4"
            fill="#3b82f6"
            className="hover:r-6 transition-all"
          />
          <circle
            cx={xScale(i)}
            cy={yScale(d.attendance)}
            r="4"
            fill="#10b981"
            className="hover:r-6 transition-all"
          />
          <circle
            cx={xScale(i)}
            cy={yScale(d.donations * 0.002)}
            r="4"
            fill="#8b5cf6"
            className="hover:r-6 transition-all"
          />
        </g>
      ))}

      {/* Legend */}
      <g transform={`translate(${width - 180}, ${margin.top})`}>
        <rect width="160" height="80" fill="white" stroke="#e5e7eb" rx="4" />
        <g transform="translate(10, 20)">
          <circle cx="8" cy="0" r="4" fill="#3b82f6" />
          <text x="20" y="4" className="text-xs fill-gray-700">Members</text>
        </g>
        <g transform="translate(10, 40)">
          <circle cx="8" cy="0" r="4" fill="#10b981" />
          <text x="20" y="4" className="text-xs fill-gray-700">Attendance</text>
        </g>
        <g transform="translate(10, 60)">
          <circle cx="8" cy="0" r="4" fill="#8b5cf6" />
          <text x="20" y="4" className="text-xs fill-gray-700">Donations ($k)</text>
        </g>
      </g>
    </svg>
  );
};

// Custom Bar Chart Component for demographics
const DemographicsBarChart = ({ data, width = 400, height = 200 }) => {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (chartWidth / data.length) * 0.7;
  
  return (
    <svg width={width} height={height}>
      {/* Bars */}
      {data.map((item, i) => {
        const x = margin.left + (i * chartWidth) / data.length;
        const barHeight = (item.value / maxValue) * chartHeight;
        const y = margin.top + chartHeight - barHeight;
        
        return (
          <g key={i}>
            <rect
              x={x + 5}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
              rx="2"
              className="hover:opacity-80 transition-opacity"
            />
            <text
              x={x + barWidth / 2 + 5}
              y={height - 5}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {item.label}
            </text>
            <text
              x={x + barWidth / 2 + 5}
              y={y - 5}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium"
            >
              {item.value}
            </text>
          </g>
        );
      })}
      
      {/* Y-axis */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + chartHeight}
        stroke="#6b7280"
        strokeWidth="1"
      />
    </svg>
  );
};

// Demographic data
const demographicData = [
  { label: '0-18', value: 220 },
  { label: '19-35', value: 450 },
  { label: '36-55', value: 320 },
  { label: '56+', value: 255 },
];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'Joined church membership', time: '10 min ago', type: 'member', priority: 'high' },
  { id: 2, user: 'Sarah Smith', action: 'Made monthly donation: $500', time: '25 min ago', type: 'donation', priority: 'medium' },
  { id: 3, user: 'Pastor Mark', action: 'Uploaded new sermon: "Faith in Action"', time: '1 hour ago', type: 'sermon', priority: 'high' },
  { id: 4, user: 'Prayer Team', action: 'Answered prayer request #142', time: '2 hours ago', type: 'prayer', priority: 'medium' },
  { id: 5, user: 'Event Team', action: 'Created new event: Youth Retreat', time: '3 hours ago', type: 'event', priority: 'high' },
  { id: 6, user: 'Finance Team', action: 'Monthly financial report generated', time: '4 hours ago', type: 'finance', priority: 'low' },
];

// Upcoming events
const upcomingEvents = [
  { id: 1, title: 'Sunday Service', date: 'Today, 10:00 AM', location: 'Main Sanctuary', attendees: 245 },
  { id: 2, title: 'Youth Group Meeting', date: 'Tomorrow, 6:00 PM', location: 'Youth Hall', attendees: 87 },
  { id: 3, title: 'Bible Study', date: 'Dec 18, 7:00 PM', location: 'Room 201', attendees: 42 },
  { id: 4, title: 'Christmas Celebration', date: 'Dec 24, 5:00 PM', location: 'Main Sanctuary', attendees: 500 },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001/api';

export default function EnhancedAdminDashboard() {
  const [timeRange, setTimeRange] = useState('6months');
  const [notificationCount, setNotificationCount] = useState(3);
  const [prayerStats, setPrayerStats] = useState({ total: 0, pending: 0, ongoing: 0, answered: 0 });
  const { socket, isConnected } = useSocket();

  // Fetch prayer stats
  useEffect(() => {
    fetchPrayerStats();
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('initial-data', (data: { prayerStats: any }) => {
      if (data.prayerStats) {
        setPrayerStats(data.prayerStats);
      }
    });

    socket.on('prayer-created', (data: { stats: any }) => {
      if (data.stats) {
        setPrayerStats(data.stats);
      }
    });

    socket.on('prayer-updated', (data: { stats: any }) => {
      if (data.stats) {
        setPrayerStats(data.stats);
      }
    });

    socket.on('prayer-deleted', (data: { stats: any }) => {
      if (data.stats) {
        setPrayerStats(data.stats);
      }
    });

    return () => {
      socket.off('initial-data');
      socket.off('prayer-created');
      socket.off('prayer-updated');
      socket.off('prayer-deleted');
    };
  }, [socket, isConnected]);

  const fetchPrayerStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prayers/stats`);
      if (response.ok) {
        const data = await response.json();
        setPrayerStats(data);
      }
    } catch (error) {
      console.error('Error fetching prayer stats:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header with notifications */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Church Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your church today.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid - Enhanced with more metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${stat.color} rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
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
              <p className="text-sm font-medium text-gray-900 mt-1">{stat.name}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Growth Chart - Now with real SVG chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Growth Overview</h2>
            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
                <option value="custom">Custom range</option>
              </select>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
          <div className="h-80">
            <GrowthLineChart data={growthData} />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Monthly Growth</span>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xl font-bold mt-1">4.2%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xl font-bold mt-1">92.4%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Donation Growth</span>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xl font-bold mt-1">8.5%</p>
            </div>
          </div>
        </div>

        {/* Recent Activities & Demographics */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">View All</span>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className={`p-2 rounded-lg ${
                    activity.priority === 'high' ? 'bg-red-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Activity className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                        activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-6">
            <h2 className="text-lg font-semibold text-gray-900 pl-12 mb-6">Demographics</h2>
            <div className="lg:h-40">
              <DemographicsBarChart data={demographicData} />
            </div>
            <div className="lg:mt-4 mt-12 px-8 grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Age</p>
                <p className="text-xl font-bold">34.2</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Family Units</p>
                <p className="text-xl font-bold">312</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Events & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
              <Calendar className="h-4 w-4" />
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition">
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{event.attendees}</div>
                  <div className="text-sm text-gray-500">Attendees</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">New Members This Month</span>
              <span className="font-bold text-green-600">42</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Volunteer Hours</span>
              <span className="font-bold text-blue-600">1,240</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Prayer Requests</span>
              <span className="font-bold text-red-600">156</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Sermons Uploaded</span>
              <span className="font-bold text-purple-600">24</span>
            </div>
            <div className="mt-6">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
                <FileText className="h-4 w-4" />
                Generate Monthly Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">Most used admin actions</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <button className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <MessageSquare className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Announcement</span>
          </button>
          <button className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <Calendar className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Create Event</span>
          </button>
          <button className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <UserPlus className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Add Member</span>
          </button>
          <button className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <Music className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Upload Sermon</span>
          </button>
          <button className="bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border border-yellow-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <DollarSign className="h-8 w-8 text-yellow-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Add Donation</span>
          </button>
          <button className="bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 border border-pink-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <Heart className="h-8 w-8 text-pink-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Prayer Request</span>
          </button>
          <button className="bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <BarChart3 className="h-8 w-8 text-indigo-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Reports</span>
          </button>
          <button className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center transition group">
            <Settings className="h-8 w-8 text-gray-600 mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-gray-900">Settings</span>
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
        <p>Last updated: Today at 10:30 AM • Data refreshes every 15 minutes</p>
        <p className="mt-1">Need help? Contact support or check the documentation</p>
      </div>
    </div>
  );
}