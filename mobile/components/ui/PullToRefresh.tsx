import React, { useState, useRef } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull if we are at the top of the scroll
    if (contentRef.current && contentRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Only allow pulling down if at the top
    if (diff > 0 && contentRef.current?.scrollTop === 0) {
      setPullDistance(Math.min(diff * 0.4, 150)); // Add resistance
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(60); // Snap to loading position
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      className="h-full flex flex-col relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading Indicator Layer */}
      <div 
        className="absolute w-full flex justify-center items-start pointer-events-none z-10 pt-4"
        style={{ 
            top: 0,
            transform: `translateY(${pullDistance - 50}px)`,
            opacity: pullDistance > 0 ? 1 : 0,
            transition: isRefreshing ? 'transform 0.2s' : 'none' 
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md border border-gray-100 dark:border-gray-700">
            {isRefreshing ? (
                <Loader2 className="animate-spin text-primary-600" size={20} />
            ) : (
                <ArrowDown 
                    className={`text-primary-600 transition-transform duration-200 ${pullDistance > THRESHOLD ? 'rotate-180' : ''}`} 
                    size={20} 
                />
            )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto transition-transform duration-200 no-scrollbar"
        style={{ 
            transform: isRefreshing ? `translateY(60px)` : `translateY(${pullDistance * 0.4}px)` 
        }}
      >
        {children}
      </div>
    </div>
  );
};
