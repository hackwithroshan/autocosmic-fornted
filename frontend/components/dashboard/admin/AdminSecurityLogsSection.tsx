
import React, { useState } from 'react';
import { AdminActivityLogItem, AdminUser, ZainaColor } from '../../../types';
import InputField from '../../shared/InputField'; // For potential filtering

interface AdminSecurityLogsSectionProps {
  activityLogs: AdminActivityLogItem[];
  adminUsers: AdminUser[]; // To map userId to name for "Force Logout"
}

const inputFieldClasses = "w-full px-3 py-2 border border-zaina-cool-gray-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-zaina-primary focus:border-zaina-primary";
const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-zaina-deep-navy";
const dangerButtonSmClasses = "bg-zaina-deep-red-accent text-zaina-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors";


const AdminSecurityLogsSection: React.FC<AdminSecurityLogsSectionProps> = ({ activityLogs, adminUsers }) => {
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [selectedUserToLogout, setSelectedUserToLogout] = useState('');

  const filteredLogs = activityLogs.filter(log =>
    log.adminUserName.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    log.ipAddress?.includes(logSearchTerm)
  );

  const handleForceLogout = () => {
    if (!selectedUserToLogout) {
        alert("Please select an admin user to force logout.");
        return;
    }
    alert(`Force logout initiated for admin ID ${selectedUserToLogout} (simulated).`);
    setSelectedUserToLogout('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-6">Security & Logs</h2>

      {/* Admin Activity Log */}
      <section className="mb-8 p-4 bg-zaina-cool-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">Admin Activity Log</h3>
        <InputField
          label="Search Logs"
          name="logSearch"
          value={logSearchTerm}
          onChange={(e) => setLogSearchTerm(e.target.value)}
          placeholder="Search by user, action, IP..."
          className="mb-4"
        />
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-zaina-cool-gray-medium dashboard-table">
            <thead className="bg-zaina-cool-gray-light sticky top-0">
              <tr>
                <th className={thCellClasses}>Timestamp</th>
                <th className={thCellClasses}>Admin User</th>
                <th className={thCellClasses}>Action</th>
                <th className={thCellClasses}>IP Address</th>
                <th className={thCellClasses}>Details</th>
              </tr>
            </thead>
            <tbody className="bg-zaina-white divide-y divide-zaina-cool-gray-light">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zaina-sky-blue-light/50">
                  <td className={tdCellClasses}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td className={tdCellClasses}>{log.adminUserName} ({log.adminUserId})</td>
                  <td className={tdCellClasses}>{log.action}</td>
                  <td className={tdCellClasses}>{log.ipAddress || 'N/A'}</td>
                  <td className={`${tdCellClasses} text-xs`}>{log.details || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && <p className="text-center py-4 text-zaina-slate-gray">No logs found matching criteria.</p>}
      </section>

      {/* Login History (Simplified, could be part of activity log in reality) */}
      <section className="mb-8 p-4 bg-zaina-cool-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">Login History (Recent)</h3>
        <div className="overflow-x-auto max-h-64">
             <table className="min-w-full divide-y divide-zaina-cool-gray-medium dashboard-table">
                <thead className="bg-zaina-cool-gray-light sticky top-0">
                <tr>
                    <th className={thCellClasses}>Timestamp</th>
                    <th className={thCellClasses}>Admin User</th>
                    <th className={thCellClasses}>IP Address</th>
                </tr>
                </thead>
                <tbody className="bg-zaina-white divide-y divide-zaina-cool-gray-light">
                {activityLogs.filter(l => l.action.toLowerCase().includes('logged in')).slice(0, 5).map(log => (
                    <tr key={`login-${log.id}`} className="hover:bg-zaina-sky-blue-light/50">
                    <td className={tdCellClasses}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td className={tdCellClasses}>{log.adminUserName}</td>
                    <td className={tdCellClasses}>{log.ipAddress || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </section>

      {/* Force Logout / Block Suspicious Users */}
      <section className="p-4 bg-zaina-cool-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">User Session Management</h3>
        <div className="flex items-end gap-3">
          <div>
            <label htmlFor="forceLogoutUser" className="block text-sm font-medium text-zaina-deep-navy mb-1">Force Logout Admin User</label>
            <select
              id="forceLogoutUser"
              value={selectedUserToLogout}
              onChange={(e) => setSelectedUserToLogout(e.target.value)}
              className={inputFieldClasses}
            >
              <option value="">Select Admin User...</option>
              {adminUsers.filter(u => u.isActive).map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <button onClick={handleForceLogout} className={`${dangerButtonSmClasses} h-[46px]`}>Force Logout</button>
        </div>
        <p className="text-xs text-zaina-slate-gray mt-2">Blocking suspicious IP addresses or users would be handled via firewall or backend security rules.</p>
      </section>
    </div>
  );
};

export default AdminSecurityLogsSection;
