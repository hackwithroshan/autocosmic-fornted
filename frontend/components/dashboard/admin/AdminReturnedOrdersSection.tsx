


import React from 'react';
import { Order, OrderStatus } from '../../../types';
import AdminOrderManagementSection from './AdminOrderManagementSection';

interface AdminSpecializedOrderViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewOrder: (order: Order) => void;
}

const AdminReturnedOrdersSection: React.FC<AdminSpecializedOrderViewProps> = ({ orders, onUpdateStatus, onViewOrder }) => {
  return (
     <div>
       <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text mb-2">Returned & Canceled Orders</h2>
       <p className="mb-4 text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">Manage and track all returned, refunded, or canceled orders.</p>
       <AdminOrderManagementSection
         orders={orders}
         onUpdateStatus={onUpdateStatus}
         onViewOrder={onViewOrder}
         filterByStatuses={['Returned', 'Cancelled']}
       />
    </div>
  );
};

export default AdminReturnedOrdersSection;
