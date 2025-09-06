
import React from 'react';
import { Customer, Order } from '../../../types';
import Modal from '../../shared/Modal';

interface AdminCustomerDetailModalProps {
  customer: Customer | null;
  orders: Order[];
  onClose: () => void;
}

const AdminCustomerDetailModal: React.FC<AdminCustomerDetailModalProps> = ({ customer, orders, onClose }) => {
  if (!customer) return null;

  const customerOrders = orders.filter(o => o.customerName === customer.name);

  return (
    <Modal isOpen={!!customer} onClose={onClose} title={`Customer Details: ${customer.name}`} size="lg">
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-4 p-3 bg-admin-light dark:bg-admin-dark rounded-lg">
            <img src={customer.profilePictureUrl} alt={customer.name} className="w-16 h-16 rounded-full object-cover"/>
            <div>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                <p><strong>Joined:</strong> {new Date(customer.joinDate).toLocaleDateString()}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-admin-light dark:bg-admin-dark rounded">
                <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">Total Orders</p>
                <p className="font-bold text-lg">{customer.totalOrders}</p>
            </div>
             <div className="p-2 bg-admin-light dark:bg-admin-dark rounded">
                <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">Total Spent</p>
                <p className="font-bold text-lg">${customer.totalSpent.toFixed(2)}</p>
            </div>
             <div className="p-2 bg-admin-light dark:bg-admin-dark rounded">
                <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">Last Order</p>
                <p className="font-bold text-lg">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}</p>
            </div>
        </div>

        <div>
          <h4 className="font-semibold text-admin-text dark:text-admin-dark-text mb-2">Order History</h4>
          <div className="max-h-60 overflow-y-auto border rounded-lg">
             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase">
                    <tr>
                        <th className="px-2 py-2 text-left">Order ID</th>
                        <th className="px-2 py-2 text-left">Date</th>
                        <th className="px-2 py-2 text-left">Amount</th>
                        <th className="px-2 py-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {customerOrders.length > 0 ? customerOrders.map(order => (
                        <tr key={order.id}>
                            <td className="px-2 py-2 text-admin-accent font-medium">#{order.id.slice(-6)}</td>
                            <td className="px-2 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="px-2 py-2">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-2 py-2">{order.status}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan={4} className="text-center p-4">No orders found for this customer.</td></tr>
                    )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdminCustomerDetailModal;