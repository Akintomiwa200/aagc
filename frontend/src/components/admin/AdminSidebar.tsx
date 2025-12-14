'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  DollarSign,
  Bell,
  BarChart,
  Shield,
  LogOut,
  Church,
  Heart,
  Music,
  Video,
  Home,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Prayer Requests', href: '/admin/prayers', icon: Heart },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Sermons', href: '/admin/sermons', icon: Music },
  { name: 'Livestream', href: '/admin/livestream', icon: Video },
  { name: 'Donations', href: '/admin/donations', icon: DollarSign },
  { name: 'Reports', href: '/admin/reports', icon: BarChart },
  { name: 'Website', href: '/admin/website', icon: Home },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const churchNavigation = [
  { name: 'Church Info', href: '/admin/church', icon: Church },
  { name: 'Staff', href: '/admin/staff', icon: Shield },
  { name: 'Documents', href: '/admin/documents', icon: FileText },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <Church className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Grace Chapel</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="px-2 py-0.5 text-xs bg-blue-900/30 text-blue-300 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
        </div>
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-3 mt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Church Management
          </p>
        </div>
        <ul className="space-y-1 px-3">
          {churchNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-red-300 hover:text-red-100 hover:bg-red-900/20 rounded-lg transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}