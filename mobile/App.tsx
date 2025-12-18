
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, ChevronRight, Zap, Globe, Heart, CheckCircle } from 'lucide-react';

import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { BottomNav } from './components/Layout/BottomNav';
import { Sidebar } from './components/Layout/Sidebar';
import { GlobalAiChat } from './components/Layout/GlobalAiChat';
import { APP_NAME } from './constants';

import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Devotional } from './pages/Devotional';
import { Prayers } from './pages/Prayers';
import { Settings } from './pages/Settings';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { FirstTimer } from './pages/FirstTimer';
import { Bible } from './pages/Bible';
import { LiveMeeting } from './pages/LiveMeeting';
import { Notifications } from './pages/Notifications';
import { Giving } from './pages/Giving';
import { Sermons } from './pages/Sermons';
import { Notes } from './pages/Notes';
import { Profile } from './pages/Profile';
import { Friends } from './pages/Friends';
import { EditProfile } from './pages/EditProfile';
import { FriendRequests } from './pages/FriendRequests';

// --- Splash Screen Component ---
const SplashScreen = () => (
  <div className="fixed inset-0 bg-gray-50 dark:bg-black flex flex-col items-center justify-center z-[100] animate-out fade-out duration-500 delay-[2500ms] fill-mode-forwards transition-colors duration-200">
    <div className="p-6 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-6 animate-pulse border-2 border-primary-500 shadow-xl">
        <Globe size={64} className="text-primary-600 dark:text-primary-500" />
    </div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center px-4 mb-2 animate-in slide-in-from-bottom-5 duration-700 font-serif tracking-tight">{APP_NAME}</h1>
    <p className="text-primary-600 dark:text-primary-400 text-lg font-light tracking-widest uppercase animate-in slide-in-from-bottom-5 duration-700 delay-200">Home of the Supernatural</p>
  </div>
);

// --- Onboarding Component ---
const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome Home",
      desc: "Join the Apostolic Army Global Church family.",
      icon: Globe,
      color: "bg-blue-600"
    },
    {
      id: 2,
      title: "Supernatural Encounter",
      desc: "Experience the prophetic move of God in your life.",
      icon: Zap,
      color: "bg-primary-500"
    },
    {
      id: 3,
      title: "Global Community",
      desc: "Connect with believers from all around the world.",
      icon: Heart,
      color: "bg-red-500"
    },
    {
      id: 4,
      title: "Grow in Faith",
      desc: "Daily devotionals, bible study, and prayers.",
      icon: CheckCircle,
      color: "bg-green-500"
    }
  ];

  // Fix: Extract icon component to capitalized variable to avoid JSX intrinsic element error
  const currentSlide = slides[slide];
  const Icon = currentSlide.icon;

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-black z-[90] flex flex-col transition-colors duration-200">
       <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-xs">
             <div className={`w-24 h-24 ${currentSlide.color} rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl transform transition-all duration-300 ring-4 ring-white dark:ring-gray-900`}>
                 <Icon size={40} className="text-white" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{currentSlide.title}</h2>
             <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{currentSlide.desc}</p>
          </div>
       </div>

       <div className="p-8">
          <div className="flex justify-center gap-2 mb-8">
             {slides.map((_, i) => (
               <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300 dark:bg-gray-800'}`} />
             ))}
          </div>

          <button 
            onClick={() => {
                if(slide < slides.length - 1) {
                    setSlide(s => s + 1);
                } else {
                    onComplete();
                }
            }}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 transition-colors"
          >
            {slide === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight size={20} />
          </button>
       </div>
    </div>
  );
};

// Layout wrapper to handle header/sidebar visibility
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide standard layout (Header/BottomNav) for immersive pages like LiveMeeting
  const isFullScreenPage = location.pathname === '/live-meet';
  
  if (isFullScreenPage) {
      return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 h-16 flex items-center justify-between shrink-0">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full text-gray-700 dark:text-gray-200"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex flex-col items-center">
             <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight uppercase font-serif">Apostolic Army</span>
             <span className="text-[10px] text-primary-600 dark:text-primary-500 font-medium tracking-widest">GLOBAL</span>
        </div>
        
        <Link to="/notifications" className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full text-gray-700 dark:text-gray-200 relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse"></span>
        </Link>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      <GlobalAiChat />

      <BottomNav />
    </div>
  );
};

// Inner App Content to use Hooks inside ThemeProvider
const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // 1. Check if user is already logged in
    const userSession = localStorage.getItem('church_app_user');
    // Ensure checking for string "null" which might be saved by some JSON stringify logic errors, though usage in this app is correct.
    if (userSession && userSession !== 'null') {
      return false;
    }
    // 2. Otherwise check if they've seen onboarding
    const seen = localStorage.getItem('hasSeenOnboarding');
    return seen !== 'true';
  });

  useEffect(() => {
    // Hide splash after 3 seconds
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showSplash) return <SplashScreen />;
  if (showOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/devotional" element={<Devotional />} />
          <Route path="/bible" element={<Bible />} />
          <Route path="/prayers" element={<Prayers />} />
          <Route path="/giving" element={<Giving />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/first-timer" element={<FirstTimer />} />
          <Route path="/live-meet" element={<LiveMeeting />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friend-requests" element={<FriendRequests />} />
          {/* Fallback routing */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
