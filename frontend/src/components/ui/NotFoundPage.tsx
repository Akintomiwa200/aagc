// app/components/NotFoundPage.tsx
'use client';

import { Home, Search, ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-900">Page Not Found</div>
          </div>
        </div>

        <div className="w-24 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-8"></div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            {/* Church building */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-24 bg-gray-200 rounded-t-lg">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-8 bg-gray-300 rounded-t-full"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-8 h-12 bg-gray-400"></div>
                </div>
              </div>
            </div>
            
            {/* Search icon */}
            <div className="absolute top-1/4 right-1/4 animate-bounce">
              <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Lost Your Way?
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          It seems the page you're looking for has moved or doesn't exist. 
          Don't worry, we'll help you find your way back home.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 rounded-xl border border-gray-300 shadow-sm hover:shadow transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Popular Pages
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Home', 'About Us', 'Services', 'Events', 'Connect', 'Give'].map((item) => (
              <button
                key={item}
                onClick={() => router.push(`/${item.toLowerCase().replace(' ', '-')}`)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h4 className="font-semibold text-gray-900">Need Directions?</h4>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <div className="text-center">
            <a 
              href="mailto:help@aagc.org" 
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              help@aagc.org
            </a>
            <span className="mx-2 text-gray-400">•</span>
            <a 
              href="tel:+2341234567890" 
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              +234 123 456 7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}