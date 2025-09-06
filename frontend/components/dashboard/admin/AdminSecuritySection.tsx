


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminActivityLogItem, AdminUser } from '../../../types';
import InputField from '../../shared/InputField';
import Modal from '../../shared/Modal';
import QrCodeIcon from '../../icons/QrCodeIcon';
import { API_BASE_URL } from '../../../constants';

interface AdminSecuritySectionProps {}

const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";
const dangerButtonSmClasses = "bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors";

const AdminSecuritySection: React.FC<AdminSecuritySectionProps> = () => {
  const [activityLogs, setActivityLogs] = useState<AdminActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('zaina-authToken');
        const response = await axios.get(`${API_BASE_URL}/admin/logs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActivityLogs(response.data);
    } catch (error) {
        console.error("Failed to fetch security logs", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = activityLogs.filter(log =>
    log.adminUserName.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    log.ipAddress?.includes(logSearchTerm)
  );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold font-heading-playfair text-admin-text-primary dark:text-dark-zaina-text-primary">Security & Activity Logs</h2>
      
      <section className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary mb-4">Admin Activity Log</h3>
        <InputField
          label=""
          name="logSearch"
          value={logSearchTerm}
          onChange={(e) => setLogSearchTerm(e.target.value)}
          placeholder="Search logs by user, action, IP..."
          className="mb-4"
        />
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <tr>
                <th className={thCellClasses}>Timestamp</th>
                <th className={thCellClasses}>Admin User</th>
                <th className={thCellClasses}>Action</th>
                <th className={thCellClasses}>IP Address</th>
                <th className={thCellClasses}>Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center p-4">Loading logs...</td></tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                    <td className={tdCellClasses}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td className={tdCellClasses}>{log.adminUserName}</td>
                    <td className={tdCellClasses}>{log.action}</td>
                    <td className={tdCellClasses}>{log.ipAddress || 'N/A'}</td>
                    <td className={`${tdCellClasses} text-xs`}>{log.details || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="text-center p-4">No logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminSecuritySection;