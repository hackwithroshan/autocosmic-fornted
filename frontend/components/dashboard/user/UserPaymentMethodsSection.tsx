



import React, { useState } from 'react';
import { PaymentMethod, ZainaColor } from '../../../types';
import CreditCardIcon from '../../icons/CreditCardIcon'; 
import PlusCircleIcon from '../../icons/PlusCircleIcon'; 
import AddPaymentMethodModal from './AddPaymentMethodModal';

interface UserPaymentMethodsSectionProps {
  paymentMethods: PaymentMethod[];
  onSaveMethod: (method: PaymentMethod) => void;
  onDeleteMethod: (id: string) => void;
  onSetDefaultMethod: (id: string) => void;
  userId: string;
}

const UserPaymentMethodsSection: React.FC<UserPaymentMethodsSectionProps> = ({
  paymentMethods,
  onSaveMethod,
  onDeleteMethod,
  onSetDefaultMethod,
  userId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const handleEdit = (method: PaymentMethod) => {
      setEditingMethod(method);
      setIsModalOpen(true);
  };
  
  const handleSaveFromModal = (method: PaymentMethod) => {
    onSaveMethod(method);
    setEditingMethod(null);
  };
  
  const handleRemove = (id: string) => {
      if (window.confirm("Are you sure you want to remove this payment method?")) {
          onDeleteMethod(id);
          alert('Payment method removed.');
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy">Payment Methods</h2>
        <button
          onClick={() => {
              setEditingMethod(null);
              setIsModalOpen(true);
          }}
          className="bg-zaina-primary text-zaina-white font-medium py-2 px-4 rounded-md hover:bg-zaina-secondary-blue text-sm transition-colors flex items-center"
        >
          <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Card
        </button>
      </div>

      {paymentMethods.length === 0 && (
        <p className="text-zaina-slate-gray">You have no saved payment methods.</p>
      )}

      <div className="space-y-4">
        {paymentMethods.map(pm => (
          <div key={pm.id} className="bg-zaina-white p-4 rounded-lg shadow-md border border-zaina-cool-gray-medium flex justify-between items-center">
            <div className="flex items-center">
              <CreditCardIcon className="w-8 h-8 text-zaina-primary mr-4" />
              <div>
                <p className="font-semibold text-zaina-deep-navy">{pm.brand} ending in •••• {pm.last4}</p>
                <p className="text-sm text-zaina-slate-gray">Expires {pm.expiryMonth}/{pm.expiryYear}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {pm.isDefault && <span className="text-xs bg-zaina-sky-blue-light text-zaina-primary px-2 py-0.5 rounded-full">Default</span>}
              {!pm.isDefault && <button onClick={() => onSetDefaultMethod(pm.id)} className="text-gray-500 hover:underline text-xs">Set as Default</button>}
              <button onClick={() => handleEdit(pm)} className="text-zaina-secondary-blue hover:underline text-xs">Edit</button>
              <button onClick={() => handleRemove(pm.id)} className="text-zaina-deep-red-accent hover:underline text-xs">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <AddPaymentMethodModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFromModal}
        editingMethod={editingMethod}
        userId={userId}
      />
    </div>
  );
};

export default UserPaymentMethodsSection;
