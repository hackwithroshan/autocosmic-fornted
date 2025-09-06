

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../../../types'; 
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import EyeIcon from '../../icons/EyeIcon';
import Modal from '../../shared/Modal';
import { PLACEHOLDER_IMAGE_URL, API_BASE_URL } from '../../../constants';


interface AdminProductManagementSectionProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onUpdateStatus: (productId: string, status: Product['publishStatus']) => void;
  onDeleteProduct: (productId: string) => void;
  onViewProduct: (product: Product) => void;
}

const AdminProductManagementSection: React.FC<AdminProductManagementSectionProps> = ({ products, onEditProduct, onUpdateStatus, onDeleteProduct, onViewProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Published' | 'Draft' | 'Hidden'>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const termMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = filterStatus === 'all' || product.publishStatus === filterStatus;
        return termMatch && statusMatch;
    });
  }, [products, searchTerm, filterStatus]);


  const handleDeleteConfirm = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id!);
      setProductToDelete(null);
    }
  };
  
  const getStatusColor = (status: Product['publishStatus']) => {
    switch(status) {
        case 'Published': return 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300';
        case 'Draft': return 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-300';
        case 'Hidden': return 'bg-gray-200 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300';
        default: return 'bg-gray-100';
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">All Products</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-accent focus:border-admin-accent text-sm bg-admin-light-card dark:bg-admin-dark-card"
            />
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-accent focus:border-admin-accent text-sm bg-admin-light-card dark:bg-admin-dark-card"
            >
                <option value="all">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Hidden">Hidden</option>
            </select>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Image</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">SKU</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Price</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                    <img src={product.imageUrl || PLACEHOLDER_IMAGE_URL} alt={product.name} className="w-10 h-12 object-cover rounded"/>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-admin-text dark:text-admin-dark-text">{product.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">{product.sku || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text">₹{product.price.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`${(product.stockQuantity || 0) < 5 ? 'text-red-500 font-semibold' : 'text-admin-text-secondary dark:text-dark-admin-text-secondary'}`}>
                        {product.stockQuantity ?? 'N/A'}
                    </span>
                </td>
                 <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                    <select
                        value={product.publishStatus}
                        onChange={(e) => onUpdateStatus(product.id!, e.target.value as Product['publishStatus'])}
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-none focus:ring-0 appearance-none ${getStatusColor(product.publishStatus)}`}
                    >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Hidden">Hidden</option>
                    </select>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                  <button onClick={() => onViewProduct(product)} className="text-gray-500 hover:opacity-80 p-1" title="View Product"><EyeIcon className="w-4 h-4" /></button>
                  <button onClick={() => onEditProduct(product)} className="text-admin-accent hover:opacity-80 p-1" title="Edit Product"><EditIcon className="w-4 h-4" /></button>
                  <button onClick={() => setProductToDelete(product)} className="text-red-500 hover:opacity-80 p-1" title="Delete Product"><TrashIcon className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {filteredProducts.length === 0 && (
        <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No products found matching your search criteria.</p>
      )}

      {productToDelete && (
        <Modal
            isOpen={!!productToDelete}
            onClose={() => setProductToDelete(null)}
            title="Confirm Deletion"
            size="sm"
        >
            <div>
                <p className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">
                    Are you sure you want to delete the product "{productToDelete.name}"? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => setProductToDelete(null)}
                        className="bg-gray-200 dark:bg-gray-600 text-admin-text-primary dark:text-dark-admin-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteConfirm}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                        Delete Product
                    </button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminProductManagementSection;