
import React, { useState, useEffect } from 'react';
import { ActivityFeedItem, FloatingInfo } from '../types';
import EyeIcon from './icons/EyeIcon'; 
import TagIcon from './icons/TagIcon'; 

interface DynamicInfoElementsProps {
  activityFeedItems: ActivityFeedItem[];
  floatingInfo: FloatingInfo[];
}

const DynamicInfoElements: React.FC<DynamicInfoElementsProps> = ({ activityFeedItems, floatingInfo }) => {
  const [currentActivity, setCurrentActivity] = useState<ActivityFeedItem | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [visibleFloatingInfo, setVisibleFloatingInfo] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activityFeedItems || activityFeedItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentActivity({
        ...activityFeedItems[activityIndex % activityFeedItems.length],
        id: `${Date.now()}-${activityIndex}`, 
        timestamp: new Date(),
      });
      setActivityIndex(prev => prev + 1);
    }, 7000); 

    setCurrentActivity({
        ...activityFeedItems[0],
        id: `${Date.now()}-0`,
        timestamp: new Date(),
    });

    return () => clearInterval(interval);
  }, [activityIndex, activityFeedItems]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (!floatingInfo) return;

    floatingInfo.forEach(info => {
      let target: HTMLElement | null = null;
      if (info.triggerSectionId) {
        target = document.getElementById(info.triggerSectionId);
      } else { 
        setVisibleFloatingInfo(prev => new Set(prev).add(info.id));
        return;
      }
      
      if (target) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setVisibleFloatingInfo(prev => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(info.id);
              } else {
                newSet.delete(info.id); 
              }
              return newSet;
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -20% 0px" } 
        );
        observer.observe(target);
        observers.push(observer);
      }
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [floatingInfo]);

  const getPositionClasses = (corner: FloatingInfo['corner']): string => {
    switch(corner) {
      case 'topLeft': return 'top-28 left-4 md:top-32 md:left-6'; 
      case 'topRight': return 'top-28 right-4 md:top-32 md:right-6';
      case 'bottomLeft': return 'bottom-20 left-4 md:bottom-24 md:left-6'; 
      case 'bottomRight': return 'bottom-20 right-4 md:bottom-24 md:right-6'; 
      default: return 'bottom-20 left-4 md:bottom-24 md:left-6';
    }
  }

  const getIconForInfo = (text: string) => {
    if (text.toLowerCase().includes('viewed') || text.toLowerCase().includes('women')) {
        return <EyeIcon className="w-4 h-4 mr-1.5 text-zaina-primary" />;
    }
    if (text.toLowerCase().includes('styles') || text.toLowerCase().includes('anarkalis')) {
        return <TagIcon className="w-4 h-4 mr-1.5 text-zaina-primary" />;
    }
    return null;
  }

  return (
    <>
      {/* Live Activity Feed */}
      {currentActivity && (
        <div 
          key={currentActivity.id} 
          className="fixed bottom-5 left-5 md:bottom-6 md:left-6 bg-zaina-primary text-zaina-white px-4 py-2.5 rounded-lg shadow-xl z-[90] text-xs md:text-sm font-body-jost animate-slideUpFadeInOut"
          role="status"
          aria-live="polite"
        >
          {currentActivity.message}
        </div>
      )}

      {/* Floating Info Bubbles */}
      {floatingInfo && floatingInfo.map(info => (
        visibleFloatingInfo.has(info.id) && (
          <div
            key={info.id}
            className={`fixed ${getPositionClasses(info.corner)} bg-zaina-white text-zaina-text-primary px-3 py-2 rounded-lg shadow-lg z-[89] text-xs font-body-jost border border-zaina-neutral-medium animate-fadeInQuick flex items-center`}
            role="status"
            aria-live="polite"
          >
            {getIconForInfo(info.text)}
            {info.text}
          </div>
        )
      ))}
      <style>{`
        @keyframes slideUpFadeInOut {
          0% { opacity: 0; transform: translateY(100%); } 
          10% { opacity: 1; transform: translateY(0); } 
          90% { opacity: 1; transform: translateY(0); } 
          100% { opacity: 0; transform: translateY(100%); } 
        }
        @keyframes fadeInQuick {
            from { opacity: 0; transform: scale(0.8) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0px); }
        }
        .animate-slideUpFadeInOut { animation: slideUpFadeInOut 6.8s ease-in-out forwards; }
        .animate-fadeInQuick { animation: fadeInQuick 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
      `}</style>
    </>
  );
};

export default DynamicInfoElements;
