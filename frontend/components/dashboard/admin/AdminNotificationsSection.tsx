


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Notification, PageName } from '../../../types';
import BellIcon from '../../icons/BellIcon';
import { API_BASE_URL } from '../../../constants';

interface AdminNotificationsSectionProps {
  onNotificationClick: (page: PageName, data?: any) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'order': return <span role="img" aria-label="Order">🧾</span>;
        case 'user': return <span role="img" aria-label="User">👤</span>;
        case 'inventory': return <span role="img" aria-label="Inventory">📦</span>;
        default: return <BellIcon className="w-4 h-4 text-gray-500" />;
    }
}

const AdminNotificationsSection: React.FC<AdminNotificationsSectionProps> = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('zaina-authToken');
        const response = await axios.get(`${API_BASE_URL}/admin/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
    } catch (error) {
        console.error("Failed to fetch notifications");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onMarkAllRead = async () => {
    try {
        const token = localStorage.getItem('zaina-authToken');
        await axios.post(`${API_BASE_URL}/admin/notifications/mark-all-read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    } catch (error) {
        alert('Failed to mark all as read.');
    }
  };

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Notifications</h1>
        <button
            onClick={onMarkAllRead}
            className="text-sm font-semibold text-admin-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={notifications.every(n => n.seen)}
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? <p>Loading notifications...</p> : notifications.length > 0 ? (
            notifications.map(notification => (
                <div 
                    key={notification.id} 
                    onClick={() => notification.link && onNotificationClick(notification.link.page, notification.link.data)}
                    className={`p-4 rounded-lg flex items-start gap-4 transition-all duration-200
                        ${notification.seen ? 'bg-admin-light dark:bg-admin-dark/50 opacity-70' : 'bg-white dark:bg-admin-dark-card shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01]'}
                    `}
                >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-admin-accent/10 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                        <p className={`font-semibold text-admin-text dark:text-admin-dark-text ${!notification.seen ? 'text-admin-accent' : ''}`}>{notification.title}</p>
                        <p className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                    {!notification.seen && (
                        <div className="w-2.5 h-2.5 bg-admin-accent rounded-full flex-shrink-0 self-center" aria-label="Unread"></div>
                    )}
                </div>
            ))
        ) : (
            <p className="text-center py-10 text-admin-text-secondary dark:text-dark-admin-text-secondary">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsSection;