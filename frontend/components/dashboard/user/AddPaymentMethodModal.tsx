
import React, { useState, useEffect } from 'react';
import Modal from '../../shared/Modal';
import InputField from '../../shared/InputField';
import { PaymentMethod } from '../../../types';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentMethod: PaymentMethod) => void;
  editingMethod: PaymentMethod | null;
  userId: string;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ isOpen, onClose, onSave, editingMethod, userId }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  useEffect(() => {
    if (editingMethod) {
        setFormData({
            cardNumber: `•••• •••• •••• ${editingMethod.last4}`,
            expiryDate: `${editingMethod.expiryMonth}/${editingMethod.expiryYear.slice(-2)}`,
            cvv: '•••',
            cardName: 'My Visa Card' // This should ideally be part of the PaymentMethod type
        });
    } else {
        setFormData({ cardNumber: '', expiryDate: '', cvv: '', cardName: ''});
    }
  }, [editingMethod, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'cardNumber') processedValue = value.replace(/\D/g, '').slice(0, 16);
    else if (name === 'expiryDate') {
        const cleanValue = value.replace(/\D/g, ''); 
        if (cleanValue.length <= 2) processedValue = cleanValue;
        else processedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    } else if (name === 'cvv') processedValue = value.replace(/\D/g, '').slice(0, 4);
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSaveClick = () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
      alert("Please fill all fields.");
      return;
    }

    const [month, year] = formData.expiryDate.split('/');
    const newMethod: PaymentMethod = {
      id: editingMethod ? editingMethod.id : `pm${Date.now()}`,
      userId: userId,
      type: 'card',
      last4: formData.cardNumber.slice(-4),
      expiryMonth: month || '',
      expiryYear: `20${year || ''}`,
      brand: 'Visa', // Mock brand detection
      isDefault: editingMethod ? editingMethod.isDefault : false
    };

    onSave(newMethod);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingMethod ? "Edit Payment Method" : "Add New Payment Method"}>
      <div className="space-y-4">
        <InputField label="Name on Card" name="cardName" value={formData.cardName} onChange={handleInputChange} required />
        <InputField label="Card Number" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="•••• •••• •••• ••••" required disabled={!!editingMethod}/>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Expiry Date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" required disabled={!!editingMethod}/>
          <InputField label="CVV" name="cvv" type="password" value={formData.cvv} onChange={handleInputChange} placeholder="•••" required disabled={!!editingMethod}/>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="bg-zaina-neutral-medium text-zaina-text-primary font-semibold py-2 px-4 rounded-md hover:bg-zaina-cool-gray-dark">Cancel</button>
          <button onClick={handleSaveClick} className="bg-zaina-primary text-zaina-white font-semibold py-2 px-4 rounded-md hover:opacity-90">Save Card</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPaymentMethodModal;
