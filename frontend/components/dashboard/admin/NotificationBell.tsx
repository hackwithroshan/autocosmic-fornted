

import React, { useState, useRef, useEffect } from 'react';
import { Notification, PageName } from '../../../types';
import BellIcon from '../../icons/BellIcon';
import CloseIcon from '../../icons/CloseIcon';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (page: PageName, data?: any) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.seen).length;
  const recentUnread = notifications.filter(n => !n.seen).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);
    if (notification.link) {
        onNavigate(notification.link.page, notification.link.data);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full text-admin-light-text-secondary dark:text-admin-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700">
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-admin-light-card dark:bg-admin-dark-card rounded-lg shadow-xl z-50 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
          <div className="p-3 font-semibold text-admin-text dark:text-admin-dark-text border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span>Notifications</span>
            <button onClick={() => onNavigate('adminDashboard', { section: 'notifications' })} className="text-xs font-medium text-admin-accent hover:underline">View All</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentUnread.length > 0 ? (
              recentUnread.map(n => (
                <div key={n.id} className="p-3 border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => handleNotificationClick(n)}>
                  <p className="font-semibold text-sm text-admin-accent">{n.title}</p>
                  <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-gray-500">No new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
