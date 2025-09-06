

import React from 'react';
import { Order } from '../../../types';
import Modal from '../../shared/Modal';

interface UserOrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

const UserOrderDetailModal: React.FC<UserOrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

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

  const deliveryCharge = order.deliveryCharge || 0;
  const discountAmount = order.discountAmount || 0;
  const subtotal = (order.totalAmount - deliveryCharge) + discountAmount;


  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Order Details: #${order.id.slice(-6).toUpperCase()}`} size="lg">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between text-sm">
          <div>
            <p className="text-zaina-slate-gray dark:text-dark-zaina-text-secondary">Order Date: <span className="font-medium text-zaina-deep-navy dark:text-dark-zaina-text-primary">{new Date(order.orderDate).toLocaleDateString()}</span></p>
            <p className="text-zaina-slate-gray dark:text-dark-zaina-text-secondary">Payment Method: <span className="font-medium text-zaina-deep-navy dark:text-dark-zaina-text-primary">{order.paymentType || 'N/A'}</span></p>
            <p className="text-zaina-slate-gray dark:text-dark-zaina-text-secondary">Delivery Method: <span className="font-medium text-zaina-deep-navy dark:text-dark-zaina-text-primary capitalize">{order.deliveryType || 'Standard'}</span></p>
          </div>
          <div>
            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-zaina-deep-navy dark:text-dark-zaina-text-primary mb-2">Items</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {(order.items || []).map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-4">
                <img src={item.variant.imageUrl || item.product.imageUrl} alt={item.product.name} className="w-16 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <p className="font-medium text-zaina-deep-navy dark:text-dark-zaina-text-primary">{item.product.name}</p>
                   <p className="text-xs text-zaina-slate-gray dark:text-dark-zaina-text-secondary capitalize">
                        {Object.entries(item.variant.attributes).map(([key, value]) => `${key}: ${value}`).join(' / ')}
                        {' | '}Qty: {item.quantity}
                    </p>
                </div>
                <p className="font-medium text-sm text-zaina-deep-navy dark:text-dark-zaina-text-primary">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-zaina-cool-gray-light dark:border-dark-zaina-border-strong">
          <div>
            <h4 className="font-semibold text-zaina-deep-navy dark:text-dark-zaina-text-primary mb-1">Shipping Address</h4>
            <address className="not-italic text-zaina-slate-gray dark:text-dark-zaina-text-secondary">
              {order.shippingAddress.fullName}<br/>
              {order.shippingAddress.addressLine1}<br/>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
              {order.shippingAddress.country}
            </address>
          </div>
          <div className="text-left sm:text-right">
             <h4 className="font-semibold text-zaina-deep-navy dark:text-dark-zaina-text-primary mb-1">Order Summary</h4>
             <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
             <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
             {discountAmount > 0 && <p className="text-green-600">Discount: -₹{discountAmount.toFixed(2)}</p>}
             <p className="font-bold text-base mt-1">Total: ₹{order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserOrderDetailModal;