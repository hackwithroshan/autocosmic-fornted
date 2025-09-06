

import React from 'react';
import { Product } from '../types';
import RatingStars from './RatingStars';
import TrashIcon from './icons/TrashIcon';
import EyeIcon from './icons/EyeIcon';
import CloseIcon from './icons/CloseIcon';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface CompareTrayProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onRemoveFromComparison: (productId: string) => void;
  onViewProductDetail: (product: Product) => void;
}

const CompareTray: React.FC<CompareTrayProps> = ({
  isOpen,
  products,
  onClose,
  onRemoveFromComparison,
  onViewProductDetail,
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[99] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-zaina-white dark:bg-dark-zaina-bg-card shadow-2xl z-[100] p-4 flex flex-col transition-transform duration-300 ease-in-out max-h-[60vh] rounded-t-xl ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-tray-title"
      >
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 id="compare-tray-title" className="text-xl font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary">
              Compare Products ({products.length})
              </h2>
              <button
              onClick={onClose}
              className="text-zaina-slate-gray dark:text-dark-zaina-text-secondary hover:text-zaina-primary dark:hover:text-dark-zaina-primary p-1 rounded-full"
              aria-label="Close comparison tray"
              >
                  <CloseIcon className="w-6 h-6"/>
              </button>
          </div>

          {products.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
                  <p className="text-zaina-slate-gray dark:text-dark-zaina-text-secondary">No products selected for comparison.</p>
                  <p className="text-xs text-zaina-slate-gray dark:text-dark-zaina-text-secondary mt-1">Add up to 4 products to compare.</p>
              </div>
          ) : (
             <div className="overflow-x-auto flex-grow">
                <table className="w-full border-collapse">
                    <tbody>
                        {/* Image */}
                        <tr className="border-b dark:border-dark-zaina-neutral-medium">
                            <td className="py-2 font-semibold text-sm w-28">Image</td>
                            {products.map(p => (
                                <td key={p.id} className="p-2 w-40 text-center">
                                    <img src={p.imageUrl || PLACEHOLDER_IMAGE_URL} alt={p.name} className="w-24 h-32 object-cover mx-auto rounded-md" />
                                </td>
                            ))}
                        </tr>
                        {/* Name */}
                        <tr className="border-b dark:border-dark-zaina-neutral-medium">
                            <td className="py-2 font-semibold text-sm">Name</td>
                            {products.map(p => (
                                <td key={p.id} className="p-2 text-sm font-medium text-zaina-primary dark:text-dark-zaina-primary hover:underline cursor-pointer" onClick={() => onViewProductDetail(p)}>
                                    {p.name}
                                </td>
                            ))}
                        </tr>
                         {/* Price */}
                        <tr className="border-b dark:border-dark-zaina-neutral-medium">
                            <td className="py-2 font-semibold text-sm">Price</td>
                             {products.map(p => (
                                <td key={p.id} className="p-2 text-sm font-bold text-zaina-gold">
                                    ₹{p.price.toFixed(2)}
                                </td>
                            ))}
                        </tr>
                         {/* Rating */}
                        <tr className="border-b dark:border-dark-zaina-neutral-medium">
                            <td className="py-2 font-semibold text-sm">Rating</td>
                             {products.map(p => (
                                <td key={p.id} className="p-2 text-sm">
                                    {p.rating ? <RatingStars rating={p.rating} starSize="h-4 w-4" /> : 'No reviews'}
                                </td>
                            ))}
                        </tr>
                        {/* Action */}
                         <tr>
                            <td className="py-2 font-semibold text-sm"></td>
                             {products.map(p => (
                                <td key={p.id} className="p-2 text-center">
                                    <button onClick={() => onRemoveFromComparison(p.id!)} className="text-xs text-red-500 hover:underline">
                                        Remove
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
             </div>
          )}
      </div>
    </>
  );
};

export default CompareTray;
