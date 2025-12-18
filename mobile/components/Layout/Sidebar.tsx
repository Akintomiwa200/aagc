import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Info, Image, Users, HelpCircle, MapPin, Phone, Settings, Book, Bell, PlaySquare, PenTool, Moon } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { name: 'Sermons', path: '/sermons', icon: PlaySquare },
    { name: 'My Notes', path: '/notes', icon: PenTool },
    { name: 'Bible', path: '/bible', icon: Book },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'About Church', path: '/about', icon: Info },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Departments', path: '/departments', icon: Users },
    { name: 'First Timers', path: '/first-timer', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-black z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-900 bg-primary-50 dark:bg-gray-900/50">
          <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">{APP_NAME}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="py-4 overflow-y-auto h-[calc(100%-64px)] bg-white dark:bg-black flex flex-col justify-between">
          <div>
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Theme Toggle in Sidebar */}
            <div className="px-2 mt-2">
                 <button 
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                 >
                    <div className="flex items-center space-x-3">
                        <Moon size={20} />
                        <span className="font-medium">Dark Mode</span>
                    </div>
                    
                    {/* Toggle Switch UI */}
                    <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-5' : ''}`} />
                    </div>
                 </button>
            </div>
          </div>

          <div className="px-6 pb-6 mt-6">
            <div className="p-5 bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="font-bold text-primary-400 mb-2">Service Times</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                    <span>Sunday</span>
                    <span className="font-bold text-white">9:00 AM</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                    <span>Wednesday</span>
                    <span className="font-bold text-white">6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};