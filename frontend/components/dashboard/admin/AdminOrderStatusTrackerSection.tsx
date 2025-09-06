

import React, { useState } from 'react';
import { Order, OrderStatus } from '../../../types';

interface OrderCardProps {
    order: Order;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onDragStart }) => (
  <div 
    draggable
    onDragStart={(e) => onDragStart(e, order.id)}
    className="bg-white dark:bg-admin-dark-card p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-3 cursor-grab active:cursor-grabbing"
  >
    <p className="text-sm font-semibold text-admin-accent">#{order.id.slice(-6).toUpperCase()}</p>
    <p className="text-xs text-admin-light-text-secondary dark:text-admin-dark-text-secondary truncate">{order.customerName}</p>
    <p className="text-xs font-bold mt-1">${order.totalAmount.toFixed(2)}</p>
  </div>
);

const StatusColumn: React.FC<{
    status: OrderStatus;
    orders: Order[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, orderId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: OrderStatus) => void;
}> = ({ status, orders, onDragStart, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    return (
        <div 
            onDrop={(e) => {
                onDrop(e, status);
                setIsOver(false);
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            className={`w-64 flex-shrink-0 bg-admin-light dark:bg-admin-dark-card/50 rounded-xl p-3 transition-colors ${isOver ? 'bg-admin-accent/20' : ''}`}
        >
            <h2 className="font-semibold text-admin-light-text dark:text-admin-dark-text mb-3 px-2">{status} ({orders.length})</h2>
            <div className="h-[60vh] overflow-y-auto pr-1">
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} onDragStart={onDragStart} />
                ))}
            </div>
        </div>
    )
}

interface AdminOrderStatusTrackerSectionProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminOrderStatusTrackerSection: React.FC<AdminOrderStatusTrackerSectionProps> = ({ orders, onUpdateStatus }) => {
  
  const statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(o => o.status === status);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, orderId: string) => {
    e.dataTransfer.setData("orderId", orderId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: OrderStatus) => {
    const orderId = e.dataTransfer.getData("orderId");
    if (orderId) {
        onUpdateStatus(orderId, newStatus);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text mb-2">Order Status Tracker</h1>
      <p className="mb-6 text-admin-light-text-secondary dark:text-admin-dark-text-secondary">
        Drag and drop orders to update their status.
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map(status => (
            <StatusColumn
                key={status}
                status={status}
                orders={getOrdersByStatus(status)}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
            />
        ))}
      </div>
    </div>
  );
};

export default AdminOrderStatusTrackerSection;