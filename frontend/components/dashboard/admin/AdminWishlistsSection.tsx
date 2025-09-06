

import React from 'react';
import HeartIcon from '../../icons/HeartIcon';
import { Product } from '../../../types';

interface WishlistAnalyticsData {
  product: Product;
  count: number;
}

interface AdminWishlistsSectionProps {
  wishlistAnalytics: WishlistAnalyticsData[];
}

const AdminWishlistsSection: React.FC<AdminWishlistsSectionProps> = ({ wishlistAnalytics }) => {

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Customer Wishlists Analytics</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Discover which products your customers desire the most to inform stocking and marketing decisions.
      </p>

      <div>
        <h3 className="font-semibold mb-2">Top 10 Most Wishlisted Products</h3>
        <div className="overflow-x-auto border rounded-lg">
             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Wishlist Count</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                   {wishlistAnalytics.map(item => (
                       <tr key={item.product.id}>
                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                               <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                               {item.product.name}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.product.category}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold flex items-center">
                               <HeartIcon className="w-4 h-4 mr-2 text-red-500" isFilled={true} /> {item.count}
                           </td>
                       </tr>
                   ))}
                   {wishlistAnalytics.length === 0 && (
                     <tr>
                       <td colSpan={3} className="text-center py-6 text-gray-500">
                         No wishlist data available yet.
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWishlistsSection;
