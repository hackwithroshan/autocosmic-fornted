


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Customer } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import EyeIcon from '../../icons/EyeIcon';
import MessageSquareIcon from '../../icons/MessageSquareIcon'; 
import SlashIcon from '../../icons/SlashIcon'; 
import CheckCircleIcon from '../../icons/CheckCircleIcon'; 


interface AdminCustomerManagementSectionProps {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
  onToggleBlock: (customerId: string) => Promise<boolean>;
}

export const AdminCustomerManagementSection: React.FC<AdminCustomerManagementSectionProps> = ({ customers, onViewDetails, onToggleBlock }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!customers) return <div className="text-center p-8">Loading customers...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text mb-6">Customer Management</h2>
      
      <div className="mb-4">
        <input
            type="text"
            placeholder="Search customers (name, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-accent focus:border-admin-accent text-sm bg-admin-light-card dark:bg-admin-dark-card"
        />
      </div>

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Email</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Join Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Last Order</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Total Spent</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                        {customer.profilePictureUrl && <img src={customer.profilePictureUrl} alt={customer.name} className="w-8 h-8 rounded-full object-cover mr-3"/>}
                        <span className="text-sm font-medium text-admin-text dark:text-admin-dark-text">{customer.name}</span>
                    </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">{customer.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">{new Date(customer.joinDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text">₹{customer.totalSpent.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.isBlocked ? 'bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300'}`}>
                        {customer.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                  <button onClick={() => onViewDetails(customer)} className="text-admin-accent hover:opacity-80 p-1" title="View Details"><EyeIcon className="w-4 h-4" /></button>
                  <a href={`mailto:${customer.email}`} className="text-blue-500 hover:opacity-80 p-1" title="Email Customer"><MessageSquareIcon className="w-4 h-4" /></a>
                  <button 
                    onClick={() => onToggleBlock(customer.id)} 
                    className={`${customer.isBlocked ? 'text-green-500' : 'text-red-500'} hover:opacity-80 p-1`} 
                    title={customer.isBlocked ? 'Unblock Customer' : 'Block Customer'}
                  >
                    {customer.isBlocked ? <CheckCircleIcon className="w-4 h-4"/> : <SlashIcon className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredCustomers.length === 0 && (
        <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No customers found matching your search.</p>
      )}
    </div>
  );
};