import React from 'react';
import { Order } from '../../../types';
import Modal from '../../shared/Modal';

const trackingEvents = [
    { status: 'Out for Delivery', location: 'Mumbai, MH', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    { status: 'Arrived at Hub', location: 'Mumbai, MH', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) },
    { status: 'Shipped from Warehouse', location: 'Delhi, DL', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { status: 'Order Placed', location: 'Zaina Collection', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) }
];


const OrderTrackingModal: React.FC<{ order: Order | null; onClose: () => void; }> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Track Order: #${order.id.slice(-6).toUpperCase()}`} size="md">
      <div className="space-y-4">
        <p className="text-sm">Tracking Number: <span className="font-medium text-zaina-primary">{order.trackingNumber}</span></p>
        <div className="relative pl-4">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-zaina-cool-gray-medium dark:bg-dark-zaina-neutral-medium"></div>
            {trackingEvents.map((event, index) => (
                <div key={index} className="relative pl-6 pb-6">
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${index === 0 ? 'bg-zaina-primary ring-4 ring-zaina-sky-blue-light' : 'bg-zaina-cool-gray-dark'}`}></div>
                    <p className="font-semibold text-sm text-zaina-deep-navy dark:text-dark-zaina-text-primary">{event.status}</p>
                    <p className="text-xs text-zaina-slate-gray dark:text-dark-zaina-text-secondary">{event.location}</p>
                    <p className="text-xs text-zaina-slate-gray dark:text-dark-zaina-text-secondary">{event.timestamp.toLocaleString()}</p>
                </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default OrderTrackingModal;
