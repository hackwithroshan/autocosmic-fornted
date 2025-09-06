import React from 'react';
import { Product } from '../types';
import Modal from './shared/Modal';

interface VirtualTryOnPopupProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

const VirtualTryOnPopup: React.FC<VirtualTryOnPopupProps> = ({ isOpen, product, onClose }) => {
  if (!isOpen || !product) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Virtual Try-On (Coming Soon!)" size="lg">
      <div className="text-center">
        <p className="text-lg">
          Imagine seeing how this beautiful <span className="font-semibold">{product.name}</span> looks on you, right from your screen!
        </p>
        <div className="my-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="font-semibold">This feature is currently under development.</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Our team is working hard to bring you an amazing augmented reality try-on experience.</p>
        </div>
        <p className="text-sm">Stay tuned!</p>
      </div>
    </Modal>
  );
};

export default VirtualTryOnPopup;
