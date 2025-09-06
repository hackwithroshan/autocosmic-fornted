


import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../../types';
import EyeIcon from '../../icons/EyeIcon';

interface AdminOrderManagementSectionProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewOrder: (order: Order) => void;
  filterByStatuses?: OrderStatus[];
}

const AdminOrderManagementSection: React.FC<AdminOrderManagementSectionProps> = ({ orders, onUpdateStatus, onViewOrder, filterByStatuses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = useMemo(() => {
    let initialFilter = filterByStatuses ? orders.filter(o => filterByStatuses.includes(o.status)) : orders;
    
    return initialFilter.filter(order => {
        const termMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = filterStatus === 'all' || order.status === filterStatus;
        return termMatch && statusMatch;
    });
  }, [orders, searchTerm, filterStatus, filterByStatuses]);
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300';
      case 'Shipped': return 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300';
      case 'Processing': return 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-300';
      case 'Pending': return 'bg-gray-200 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300';
      case 'Cancelled':
      case 'Refunded': return 'bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };
  
  const orderStatuses: Array<OrderStatus | 'all'> = ['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
            type="text"
            placeholder="Search orders (ID, Customer)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg bg-admin-light-card dark:bg-admin-dark-card border-gray-300 dark:border-gray-600"
        />
        <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="w-full md:w-auto px-4 py-2 border rounded-lg bg-admin-light-card dark:bg-admin-dark-card border-gray-300 dark:border-gray-600"
        >
            {orderStatuses.map(status => (
                <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
            ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase">Order ID</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase">Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase">Customer</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase">Total</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                <td className="px-4 py-3 text-sm font-medium text-admin-accent">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">{order.customerName}</td>
                <td className="px-4 py-3 text-sm">₹{order.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <select 
                    value={order.status} 
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-none focus:ring-0 appearance-none ${getStatusColor(order.status)}`}
                  >
                    {orderStatuses.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm space-x-1">
                  <button onClick={() => onViewOrder(order)} className="p-1" title="View Order"><EyeIcon className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredOrders.length === 0 && <p className="text-center py-8">No orders found.</p>}
    </div>
  );
};

export default AdminOrderManagementSection;
