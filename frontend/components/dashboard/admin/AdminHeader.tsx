


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MenuIcon from '../../icons/MenuIcon';
import SearchIcon from '../../icons/SearchIcon';
import SunIcon from '../../icons/SunIcon';
import MoonIcon from '../../icons/MoonIcon';
import NotificationBell from './NotificationBell';
import { Notification, PageName, UserProfile, AdminUser } from '../../../types';
import { API_BASE_URL } from '../../../constants';

interface AdminHeaderProps {
  pageTitle: string;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigate: (page: PageName, data?: any) => void;
  currentUser: UserProfile | AdminUser | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  pageTitle,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  toggleDarkMode,
  onNavigate,
  currentUser,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem('zaina-authToken');
        const response = await axios.get(`${API_BASE_URL}/admin/notifications`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
        console.error("Failed to fetch notifications:", errorMessage);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationRead = (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, seen: true } : n));
    // API call would go here
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-admin-light-card dark:bg-admin-dark-card border-b border-gray-200 dark:border-gray-700/50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-full text-admin-light-text-secondary dark:text-admin-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-admin-light-text dark:text-admin-dark-text hidden sm:block">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Global Search */}
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-admin-light-text-secondary dark:text-admin-dark-text-secondary absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full max-w-xs pl-9 pr-4 py-2 text-sm rounded-lg border bg-admin-light dark:bg-admin-dark-card border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-admin-accent focus:border-admin-accent outline-none"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-admin-light-text-secondary dark:text-admin-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-500" />}
          </button>
          
           {/* Notifications */}
          <NotificationBell
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationRead}
            onNavigate={onNavigate}
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <img
                src={currentUser?.profilePictureUrl || '/media/admin-avatar.jpg'}
                alt="Admin User"
                className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-offset-admin-light-card dark:ring-offset-admin-dark-card ring-admin-accent"
              />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-admin-light-card dark:bg-admin-dark-card rounded-lg shadow-lg py-1 z-50 ring-1 ring-black/5 dark:ring-white/10">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold">{currentUser?.name || 'Admin'}</p>
                    <p className="text-xs text-admin-light-text-secondary dark:text-admin-dark-text-secondary">{currentUser?.role || 'Super Admin'}</p>
                </div>
                <button
                  onClick={() => {
                      onNavigate('adminDashboard', { section: 'admin_profile' });
                      setIsProfileOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-admin-light-text-secondary dark:text-admin-dark-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;