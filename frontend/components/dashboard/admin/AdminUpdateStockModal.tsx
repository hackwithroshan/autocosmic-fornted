

import React, { useState, useEffect } from 'react';
import { Product } from '../../../types';
import Modal from '../../shared/Modal';
import InputField from '../../shared/InputField';

interface AdminUpdateStockModalProps {
  target: { product: Product; variantSku?: string } | null;
  onClose: () => void;
  onSave: (productId: string, newStock: number, variantSku?: string) => void;
}

const AdminUpdateStockModal: React.FC<AdminUpdateStockModalProps> = ({ target, onClose, onSave }) => {
  const [stock, setStock] = useState<number | string>('');

  useEffect(() => {
    if (target) {
      if (target.variantSku) {
        const variant = target.product.variants?.find(v => v.sku === target.variantSku);
        setStock(variant?.stockQuantity || 0);
      } else {
        setStock(target.product.stockQuantity || 0);
      }
    } else {
      setStock('');
    }
  }, [target]);

  if (!target) return null;

  const handleSave = () => {
    const newStock = Number(stock);
    if (!isNaN(newStock) && newStock >= 0) {
      onSave(target.product.id, newStock, target.variantSku);
      onClose();
    } else {
      alert("Please enter a valid non-negative number for stock.");
    }
  };
  
  const variant = target.product.variants?.find(v => v.sku === target.variantSku);
  const targetName = variant 
    ? `${target.product.name} - (${variant.attributes['Color']} / ${variant.attributes['Size']})`
    : target.product.name;

  return (
    <Modal isOpen={!!target} onClose={onClose} title={`Update Stock for ${targetName}`} size="sm">
      <div className="space-y-4">
        <InputField
          label="New Stock Quantity"
          name="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <div className="flex justify-end gap-3 pt-2">
            <button 
                onClick={onClose} 
                className="bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave} 
                className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover"
            >
                Save Stock
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminUpdateStockModal;
