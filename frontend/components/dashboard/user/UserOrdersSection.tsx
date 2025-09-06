

import React, { useState } from 'react';
import { Order, OrderStatus, PageName } from '../../../types';
import TruckIcon from '../../icons/TruckIcon'; // For Track Order
import UserOrderDetailModal from './UserOrderDetailModal';
import OrderTrackingModal from './OrderTrackingModal';
import InvoiceDownloader from './InvoiceDownloader';

interface UserOrdersSectionProps {
  orders: Order[];
  navigateToPage: (page: PageName, data?: any) => void;
  onReorder: (order: Order) => void;
}

const UserOrdersSection: React.FC<UserOrdersSectionProps> = ({ orders, navigateToPage, onReorder }) => {
  const [viewingOrderDetails, setViewingOrderDetails] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy dark:text-dark-zaina-text-primary mb-4">My Orders</h2>
        <p className="text-zaina-slate-gray dark:text-dark-zaina-text-secondary">You haven't placed any orders yet.</p>
        <button 
            onClick={() => navigateToPage('shop')}
            className="mt-4 bg-zaina-primary dark:bg-dark-zaina-primary text-zaina-white dark:text-dark-zaina-text-primary font-medium py-2 px-5 rounded-md hover:opacity-90 transition-colors"
        >
            Shop Now
        </button>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300';
      case 'Shipped': return 'bg-blue-100 text-zaina-primary dark:bg-dark-zaina-primary/30 dark:text-dark-zaina-primary';
      case 'Processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300';
      case 'Pending': return 'bg-gray-100 text-zaina-slate-gray dark:bg-gray-700/30 dark:text-gray-300';
      case 'Cancelled':
      case 'Refunded': return 'bg-red-100 text-zaina-deep-red-accent dark:bg-red-700/30 dark:text-red-300';
      default: return 'bg-zaina-cool-gray-light dark:bg-dark-zaina-neutral-medium text-zaina-deep-navy dark:text-dark-zaina-text-secondary';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy dark:text-dark-zaina-text-primary mb-6">My Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zaina-cool-gray-medium dark:divide-dark-zaina-border-strong dashboard-table">
          <thead className="bg-zaina-cool-gray-light dark:bg-dark-zaina-neutral-medium">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray dark:text-dark-zaina-text-secondary uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray dark:text-dark-zaina-text-secondary uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray dark:text-dark-zaina-text-secondary uppercase tracking-wider">Total</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray dark:text-dark-zaina-text-secondary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray dark:text-dark-zaina-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zaina-white dark:bg-dark-zaina-bg-card divide-y divide-zaina-cool-gray-light dark:divide-dark-zaina-border-strong">
            {(orders || []).map((order) => {
                 // Transform Order data to InvoiceData format
              const invoiceData = {
                billingName: order.customerName,
                billingAddress: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
                shippingName: order.customerName,
                shippingAddress: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
                orderNumber: order.id,
                invoiceNumber: `INV-${order.id.slice(-6)}`,
                orderDate: new Date(order.orderDate).toLocaleDateString('en-GB'),
                invoiceDate: new Date(order.orderDate).toLocaleDateString('en-GB'),
                items: (order.items || []).map(item => ({
                  qty: item.quantity,
                  description: `${item.product.name} (${Object.values(item.variant.attributes).join(', ')})`,
                  unitPriceExcl: item.priceAtPurchase / 1.20, // Assuming a 20% VAT for calculation
                  vatRate: 20
                }))
              };
              
              return (
              <tr key={order.id} className="hover:bg-zaina-sky-blue-light/50 dark:hover:bg-dark-zaina-sky-blue-light/20 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-zaina-primary dark:text-dark-zaina-primary">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-zaina-deep-navy dark:text-dark-zaina-text-primary">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-zaina-deep-navy dark:text-dark-zaina-text-primary">₹{order.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => setViewingOrderDetails(order)} className="text-zaina-primary dark:text-dark-zaina-primary hover:underline text-xs">View Details</button>
                  <InvoiceDownloader invoiceData={invoiceData} />
                  {(order.status === 'Shipped' || order.status === 'Delivered') && (
                     <button 
                        onClick={() => setTrackingOrder(order)} 
                        className="text-green-600 dark:text-green-400 hover:underline text-xs inline-flex items-center"
                      >
                        <TruckIcon className="w-3.5 h-3.5 mr-1"/> Track
                      </button>
                  )}
                  {order.status === 'Delivered' && (
                    <button onClick={() => onReorder(order)} className="text-zaina-primary dark:text-dark-zaina-primary hover:underline text-xs">Reorder</button>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      <UserOrderDetailModal order={viewingOrderDetails} onClose={() => setViewingOrderDetails(null)} />
      <OrderTrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
    </div>
  );
};

export default UserOrdersSection;