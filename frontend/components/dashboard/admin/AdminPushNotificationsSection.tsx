
import React, { useState } from 'react';
import InputField from '../../shared/InputField';

interface SentNotification {
    id: number;
    title: string;
    message: string;
    timestamp: Date;
}

const AdminPushNotificationsSection: React.FC = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [sentHistory, setSentHistory] = useState<SentNotification[]>([]);

    const handleSendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        const newNotification: SentNotification = {
            id: Date.now(),
            title,
            message,
            timestamp: new Date()
        };
        setSentHistory(prev => [newNotification, ...prev]);

        alert(`Sending push notification:
        Title: ${title}
        Message: ${message}
        Link: ${link}
        (Simulated)`);
        setTitle('');
        setMessage('');
        setLink('');
    };

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Push Notifications</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Send timely alerts and promotions directly to your users' devices.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
            <h3 className="font-semibold mb-2">Compose Notification</h3>
            <form onSubmit={handleSendNotification} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <InputField label="Title" name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Flash Sale!" required />
                <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="New arrivals are 25% off for the next 3 hours!" className="w-full text-sm p-2 border rounded-md bg-white dark:bg-admin-dark" required/>
                </div>
                 <InputField label="Link URL (Optional)" name="link" value={link} onChange={e => setLink(e.target.value)} placeholder="/shop?category=sale" />
                 <button type="submit" className="w-full bg-admin-accent text-white font-semibold py-2 rounded-lg hover:bg-admin-accent-hover">Send Notification</button>
            </form>
        </div>
        <div>
            <h3 className="font-semibold mb-2">Sent History</h3>
            <div className="space-y-2 text-sm max-h-80 overflow-y-auto pr-2">
                {sentHistory.length === 0 ? (
                     <p className="text-gray-500">No notifications sent yet.</p>
                ) : (
                    sentHistory.map(item => (
                        <div key={item.id} className="p-2 border rounded-lg">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.timestamp.toLocaleString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPushNotificationsSection;
