


import React from 'react';
import { Order, OrderStatus } from '../../../types';
import AdminOrderManagementSection from './AdminOrderManagementSection';

interface AdminSpecializedOrderViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewOrder: (order: Order) => void;
}

const AdminShippedOrdersSection: React.FC<AdminSpecializedOrderViewProps> = ({ orders, onUpdateStatus, onViewOrder }) => {
  return (
    <div>
       <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text mb-2">Shipped Orders</h2>
       <p className="mb-4 text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">These orders have been dispatched and are in transit to the customer.</p>
       <AdminOrderManagementSection
         orders={orders}
         onUpdateStatus={onUpdateStatus}
         onViewOrder={onViewOrder}
         filterByStatuses={['Shipped']}
       />
    </div>
  );
};

export default AdminShippedOrdersSection;
