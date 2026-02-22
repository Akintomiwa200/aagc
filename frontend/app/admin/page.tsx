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
  AlertCircle,
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
import { apiService } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Extended stats with more church-specific metrics
// Types for Dashboard Data
interface ChartData {
  month: string;
  members: number;
  attendance: number;
  donations: number;
}

interface DemographicsItem {
  label: string;
  value: number;
}

interface DashboardStat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any; // Lucide icon
  color: string;
  detail: string;
}

interface RecentActivity {
  id: number;
  user: string;
  action: string;
  time: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees: number;
}

export default function EnhancedAdminDashboard() {
  const { socket, isConnected } = useSocket();
  const [timeRange, setTimeRange] = useState('6months');
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for all dynamic data
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [demographics, setDemographics] = useState<DemographicsItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [prayerStats, setPrayerStats] = useState<any>(null); // Keep specific prayer stats if needed separately

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getDashboardStats();

        if (data) {
          // Process stats to include icons and colors before setting state
          let finalStats: DashboardStat[] = [];

          if (data.stats) {
            finalStats = data.stats.map((s: any) => {
              let Icon = Users;
              let color = 'bg-blue-500';
              if (s.name.includes('Donations')) { Icon = DollarSign; color = 'bg-purple-500'; }
              else if (s.name.includes('Attendance')) { Icon = Users; color = 'bg-green-500'; }
              else if (s.name.includes('Prayer')) { Icon = Heart; color = 'bg-red-500'; }
              else if (s.name.includes('Volunteers')) { Icon = Users; color = 'bg-yellow-500'; }
              else if (s.name.includes('Groups')) { Icon = Users; color = 'bg-indigo-500'; }

              // Only override if not provided by backend or if we want to enforce local styles
              return { ...s, icon: Icon, color };
            });
          }

          // Single batch update if possible (React 18+ does this auto, but cleaner code)
          setDashboardStats(finalStats);
          setChartData(data.chartData || []);
          setActivities(data.recentActivities || []);
          setDemographics(data.demographics || []);
          setUpcomingEvents(data.upcomingEvents || []);
          setNotificationCount(data.notificationCount || 0);
        }
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch prayer stats (legacy separate fetch - consider consolidating)
  useEffect(() => {
    const fetchPrayerStats = async () => {
      try {
        const data = await apiService.getPrayerStats();
        setPrayerStats(data);
      } catch (error) {
        console.error('Error fetching prayer stats:', error);
      }
    };
    fetchPrayerStats();
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('dashboard-update', (data: any) => {
      console.log('Real-time dashboard update:', data);
      // Update specific parts of state based on data.type or structure
      // For simplicity, re-fetching or merging is common.
      // Ideally, the event payload contains the updated stat or activity
      if (data.type === 'stat_update') {
        setDashboardStats(prev => prev.map(s => {
          if (s.name === data.name) {
            // Preserve client-side decorations (icon, color) while updating values
            return { ...s, ...data.payload, icon: s.icon, color: s.color };
          }
          return s;
        }));
      } else if (data.type === 'new_activity') {
        setActivities(prev => {
          const newActivity = data.payload;
          // Avoid duplicates if needed, though id check suggests unique
          if (prev.some((a: RecentActivity) => a.id === newActivity.id)) return prev;
          return [newActivity, ...prev].slice(0, 10);
        });
      }
    });

    socket.on('initial-data', (data: { prayerStats: { total: number; pending: number; ongoing: number; answered: number } }) => {
      if (data.prayerStats) {
        setPrayerStats(data.prayerStats);
      }
    });

    // Listen for specific entity updates to keep stats fresh without full reload
    const handleStatUpdate = (data: { stats: any }) => {
      if (data.stats) setPrayerStats(data.stats);
    };

    socket.on('prayer-created', handleStatUpdate);
    socket.on('prayer-updated', handleStatUpdate);
    socket.on('prayer-deleted', handleStatUpdate);

    return () => {
      socket.off('dashboard-update');
      socket.off('initial-data');
      socket.off('prayer-created');
      socket.off('prayer-updated');
      socket.off('prayer-deleted');
    };
  }, [socket, isConnected]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative inline-block">
            <div className="h-24 w-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Connection Issue</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We encountered an error while trying to load the dashboard. This might be due to a network issue or server maintenance.
            </p>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
              <p className="text-sm font-sans text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 font-medium inline-flex items-center justify-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Try Reconnecting
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
            >
              Go Back
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If this persists, please contact the technical department.
          </p>
        </div>
      </div>
    );
  }

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
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {dashboardStats.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">No stats available.</div>
            ) : (
              dashboardStats.map((stat) => {
                const Icon = stat.icon || Activity;
                return (
                  <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 ${stat.color} rounded-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className={`flex items-center text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
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
              })
            )}
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Growth Chart - Now with Recharts */}
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
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                  <Line type="monotone" dataKey="members" name="Members" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="attendance" name="Attendance" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="donations" name="Donations" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No chart data available</div>
            )}
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
              {activities.length > 0 ? activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className={`p-2 rounded-lg ${activity.priority === 'high' ? 'bg-red-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                    <Activity className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                        activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {activity.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-4">No recent activities</div>
              )}
            </div>
          </div>

          {/* Demographics - Using Recharts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-6 px-4">
            <h2 className="text-lg font-semibold text-gray-900 pl-2 mb-6">Demographics</h2>
            <div className="h-48 w-full">
              {demographics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No demographics data</div>
              )}
            </div>

            <div className="mt-6 px-4 grid grid-cols-2 gap-3">
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
            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
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
            )) : (
              <div className="text-center text-gray-500 py-8">No upcoming events found</div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">New Members This Month</span>
              <span className="font-bold text-green-600">
                {dashboardStats.find(s => s.name === 'Total Members')?.detail.split(':')[2]?.trim() || '--'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              {/* Placeholders until API provides granular quick stats */}
              <span className="text-gray-700">Volunteer Hours</span>
              <span className="font-bold text-blue-600">1,240</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Prayer Requests</span>
              {/* Example dynamic data mapping */}
              <span className="font-bold text-red-600">{prayerStats?.total || '--'}</span>
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