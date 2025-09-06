

import React, { useState } from 'react';
import { Product } from '../../../types';
import InputField from '../../shared/InputField';
import AdminUpdateStockModal from './AdminUpdateStockModal';

interface AdminInventorySectionProps {
  products: Product[];
  onUpdateStockClick: (product: Product, variantSku?: string) => void;
}

const LOW_STOCK_THRESHOLD = 5;

const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";
const primaryButtonXsClasses = "bg-admin-accent text-white font-semibold py-1 px-2.5 rounded-md hover:bg-admin-accent-hover transition-colors text-xs";
const badgeDangerClasses = "bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full text-xs font-medium";
const badgeSuccessClasses = "bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-medium";


const AdminInventorySection: React.FC<AdminInventorySectionProps> = ({ products, onUpdateStockClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  let displayedProducts = products;

  if (showOnlyLowStock) {
    displayedProducts = displayedProducts.filter(p => (p.stockQuantity !== undefined && p.stockQuantity < LOW_STOCK_THRESHOLD) || 
                                                     (p.variants && p.variants.some(v => v.stockQuantity < LOW_STOCK_THRESHOLD)));
  }

  if (searchTerm) {
    displayedProducts = displayedProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text mb-6">Inventory System</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <InputField
          label="" // No label, using placeholder
          name="inventorySearch"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Product Name or SKU..."
          className="flex-grow"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showLowStock"
            checked={showOnlyLowStock}
            onChange={(e) => setShowOnlyLowStock(e.target.checked)}
            className="h-4 w-4 text-admin-accent focus:ring-admin-accent border-gray-300 dark:border-gray-500 rounded mr-2"
          />
          <label htmlFor="showLowStock" className="text-sm text-admin-text dark:text-admin-dark-text">Show Only Low Stock (&lt; {LOW_STOCK_THRESHOLD})</label>
        </div>
      </div>

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className={thCellClasses}>Product Name</th>
              <th className={thCellClasses}>SKU / Variant</th>
              <th className={thCellClasses}>Current Stock</th>
              <th className={thCellClasses}>Status</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedProducts.map(product => (
              <React.Fragment key={product.id}>
                {(!product.variants || product.variants.length === 0) && (
                  <tr className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                    <td className={`${tdCellClasses} font-medium`}>{product.name}</td>
                    <td className={tdCellClasses}>{product.sku || 'N/A'}</td>
                    <td className={`${tdCellClasses} font-semibold ${(product.stockQuantity !== undefined && product.stockQuantity < LOW_STOCK_THRESHOLD) ? 'text-red-500' : ''}`}>
                      {product.stockQuantity ?? 'N/A'}
                    </td>
                    <td className={tdCellClasses}>
                      {product.stockQuantity !== undefined && product.stockQuantity < LOW_STOCK_THRESHOLD && <span className={badgeDangerClasses}>Low Stock</span>}
                      {product.stockQuantity !== undefined && product.stockQuantity === 0 && <span className={badgeDangerClasses}>Out of Stock</span>}
                      {product.stockQuantity !== undefined && product.stockQuantity >= LOW_STOCK_THRESHOLD && <span className={badgeSuccessClasses}>In Stock</span>}
                    </td>
                    <td className={tdCellClasses}>
                      <button onClick={() => onUpdateStockClick(product)} className={primaryButtonXsClasses}>Update Stock</button>
                    </td>
                  </tr>
                )}
                {product.variants && product.variants.map(variant => (
                  <tr key={`${product.id}-${variant.sku}`} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover bg-gray-50/50 dark:bg-gray-800/30">
                    <td className={`${tdCellClasses} pl-8`}>{product.name} <span className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">({variant.attributes['Color']} / {variant.attributes['Size']})</span></td>
                    <td className={tdCellClasses}>{variant.sku}</td>
                    <td className={`${tdCellClasses} font-semibold ${variant.stockQuantity < LOW_STOCK_THRESHOLD ? 'text-red-500' : ''}`}>
                      {variant.stockQuantity}
                    </td>
                    <td className={tdCellClasses}>
                      {variant.stockQuantity < LOW_STOCK_THRESHOLD && <span className={badgeDangerClasses}>Low Stock</span>}
                      {variant.stockQuantity === 0 && <span className={badgeDangerClasses}>Out of Stock</span>}
                      {variant.stockQuantity >= LOW_STOCK_THRESHOLD && <span className={badgeSuccessClasses}>In Stock</span>}
                    </td>
                     <td className={tdCellClasses}>
                      <button onClick={() => onUpdateStockClick(product, variant.sku)} className={primaryButtonXsClasses}>Update Stock</button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {displayedProducts.length === 0 && (
        <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">
          {showOnlyLowStock ? "No items are currently low in stock." : "No products found."}
        </p>
      )}
    </div>
  );
};

export default AdminInventorySection;
