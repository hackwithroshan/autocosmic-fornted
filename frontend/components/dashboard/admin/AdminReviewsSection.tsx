


import React from 'react';
import { ProductReview } from '../../../types';
import RatingStars from '../../RatingStars';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminReviewsSectionProps {
  reviews: ProductReview[];
  onSaveReview: (review: ProductReview) => void;
  onDeleteReview: (reviewId: string) => void;
}

const AdminReviewsSection: React.FC<AdminReviewsSectionProps> = ({ reviews, onSaveReview, onDeleteReview }) => {
    
    const toggleApproval = (review: ProductReview) => {
        onSaveReview({ ...review, approved: !review.approved });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to permanently delete this review?")) {
            onDeleteReview(id);
        }
    };

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Product Reviews Moderation</h1>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
                Approve or reject new customer reviews before they appear on product pages.
            </p>

            <div className="overflow-x-auto border rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                       {reviews.map(review => (
                           <tr key={review.id}>
                               <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{review.user.name}</td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm">
                                   <div className="flex items-center">
                                       {review.product?.imageUrl && <img src={review.product.imageUrl} alt={review.product.name} className="w-10 h-12 object-cover rounded-md mr-3"/>}
                                       {review.product?.name || 'N/A'}
                                   </div>
                               </td>
                               <td className="px-4 py-3 whitespace-nowrap"><RatingStars rating={review.rating} /></td>
                               <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={review.comment}>"{review.comment}"</td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm">
                                   <span className={`px-2 py-1 text-xs rounded-full font-semibold ${review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                       {review.approved ? 'Approved' : 'Pending'}
                                   </span>
                               </td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                   <button onClick={() => toggleApproval(review)} className="text-green-500 hover:underline p-1" title={review.approved ? 'Unapprove' : 'Approve'}>
                                       <CheckCircleIcon className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:underline p-1" title="Delete">
                                       <TrashIcon className="w-4 h-4" />
                                   </button>
                               </td>
                           </tr>
                       ))}
                       {reviews.length === 0 && (
                           <tr>
                               <td colSpan={6} className="text-center py-8 text-gray-500">No reviews found.</td>
                           </tr>
                       )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default AdminReviewsSection;