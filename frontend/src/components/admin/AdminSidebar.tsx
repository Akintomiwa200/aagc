'use client';

import React, { useState } from 'react';
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
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSidebarProps {
  onClose?: () => void;
  isMobileOpen?: boolean; // Add this prop to control mobile visibility
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
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

export default function AdminSidebar({ onClose, isMobileOpen = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - Always visible on desktop, hidden on mobile */}
      <div className={`hidden lg:flex flex-col h-full bg-gray-900 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {!collapsed ? (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Church className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">AAGC Church</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </Link>
          ) : (
            <Link href="/admin" className="flex justify-center w-full">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Church className="h-6 w-6" />
              </div>
            </Link>
          )}
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {/* Desktop: Show "Main Navigation" label only when not collapsed */}
            {!collapsed && (
              <div className="px-3 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main Navigation
                </p>
              </div>
            )}
            
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-300 hover:text-red-100 hover:bg-red-900/20 rounded-lg transition ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar Drawer */}
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
              <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Church className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">AAGC Church</h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-3 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main Navigation
                </p>
              </div>
              <div className="space-y-1 px-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || 
                    (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
                  
                  return (
                    <Link
                      key={item.name}
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
                  );
                })}
              </div>
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
        </>
      )}
    </>
  );
}