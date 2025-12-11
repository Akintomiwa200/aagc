// components/LoadingSpinner.tsx
'use client';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-6 py-20">
      <div className="relative">
        {/* Animated circles */}
        <div className="w-24 h-24 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        
        {/* Church icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">Preparing your experience...</h2>
        <p className="text-gray-600 max-w-md">
          We're getting everything ready for you. This will just take a moment.
        </p>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}