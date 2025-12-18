
import React, { useState } from 'react';
import { Moon, Sun, Bell, Shield, HelpCircle, LogOut, ChevronRight, User as UserIcon, Lock, Globe, Smartphone, Heart, Users, Download, FileText, ChevronLeft, Loader2, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, useNotifications } from '../hooks/useAppHooks';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const { requestPermission } = useNotifications();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(Notification.permission === 'granted');
  const navigate = useNavigate();

  const handleLogin = async (provider: 'google' | 'apple') => {
      setIsLoggingIn(true);
      await login(provider);
      setIsLoggingIn(false);
  };

  const handleTogglePush = async () => {
      if (pushEnabled) return;
      const granted = await requestPermission();
      if (granted) setPushEnabled(true);
  };

  if (!user) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-black p-6 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-64 bg-primary-600 rounded-b-[50px] opacity-10"></div>
              
              <div className="relative z-10 w-full max-w-sm text-center space-y-8">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl transform rotate-3">
                      <UserIcon size={40} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  
                  <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Home</h1>
                      <p className="text-gray-500 dark:text-gray-400">Sign in to sync your prayers, notes, and connect with the community.</p>
                  </div>

                  <div className="space-y-4">
                      <button 
                        onClick={() => handleLogin('google')}
                        disabled={isLoggingIn}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm"
                      >
                          {isLoggingIn ? <Loader2 className="animate-spin" size={20}/> : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-11.41c0-.76-.1-1.49-.17-1.49z"/></svg>
                                Continue with Google
                            </>
                          )}
                      </button>

                      <button 
                        onClick={() => handleLogin('apple')}
                        disabled={isLoggingIn}
                        className="w-full bg-black text-white hover:bg-gray-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg"
                      >
                          {isLoggingIn ? <Loader2 className="animate-spin" size={20}/> : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74c.79 0 1.86-.71 3.48-.65c2.92.11 4.23 2.09 4.23 2.09S18.91 10.74 18.97 13.88c.07 3.33 2.87 4.54 2.87 4.54s-2.02 4.41-3.39 1.86zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.16 2.39-1.95 4.32-3.74 4.25z"/></svg>
                                Continue with Apple
                            </>
                          )}
                      </button>
                  </div>
                  
                  <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="pb-24 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
          
          <Link to="/profile" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black rounded-2xl border border-gray-100 dark:border-gray-800">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
              <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <ChevronRight className="text-gray-400" />
          </Link>
      </div>

      <div className="p-4 space-y-6">
          {/* Account */}
          <section>
              <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                  <Link to="/profile" className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><UserIcon size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Personal Info</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><Lock size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Security & Privacy</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </button>
              </div>
          </section>

          {/* Social */}
          <section>
              <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Community</h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                  <Link to="/friends" className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg"><Users size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Friends & Requests</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-lg"><Heart size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Invite Friends</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </button>
              </div>
          </section>

          {/* App Settings */}
          <section>
              <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Preferences</h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                  <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Appearance</span>
                      </div>
                      <span className="text-sm text-gray-400 capitalize">{theme}</span>
                  </button>
                  <button onClick={handleTogglePush} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg"><Bell size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Push Notifications</span>
                      </div>
                      <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${pushEnabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${pushEnabled ? 'translate-x-5' : ''}`} />
                      </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-lg"><Globe size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Language</span>
                      </div>
                      <span className="text-sm text-gray-400">English</span>
                  </button>
              </div>
          </section>

          {/* Support */}
          <section>
              <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Support</h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                  <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg"><HelpCircle size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Help Center</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg"><FileText size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Terms & Privacy</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg"><Mail size={18} /></div>
                          <span className="font-medium text-gray-700 dark:text-gray-200">Contact Us</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                  </button>
              </div>
          </section>

          <Button 
            variant="ghost" 
            fullWidth 
            onClick={logout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 py-3"
          >
              <LogOut size={18} className="mr-2" />
              Sign Out
          </Button>

          <div className="text-center text-xs text-gray-400 pb-4">
              Version 1.2.0 • Build 20231105
          </div>
      </div>
    </div>
  );
};
