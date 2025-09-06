

import React from 'react';
import { ProductReview } from '../../../types';
import RatingStars from '../../RatingStars';

interface AdminFeedbackSectionProps {
    reviews: ProductReview[];
    onSaveReview: (review: ProductReview) => void;
    onDeleteReview: (reviewId: string) => void;
}

const AdminFeedbackSection: React.FC<AdminFeedbackSectionProps> = ({ reviews, onSaveReview, onDeleteReview }) => {
    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => !r.approved).length;
    const approvedReviews = totalReviews - pendingReviews;
    
    const handleToggleApproval = (review: ProductReview) => {
        onSaveReview({ ...review, approved: !review.approved });
    };

    const handleDelete = (reviewId: string) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            onDeleteReview(reviewId);
        }
    };

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Customer Feedback & Reviews</h1>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
                Review and manage all product reviews submitted by customers.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-4 bg-admin-light dark:bg-admin-dark rounded-lg">
                    <p className="text-2xl font-bold">{totalReviews}</p>
                    <p className="text-sm text-admin-light-text-secondary dark:text-admin-dark-text-secondary">Total Reviews</p>
                </div>
                <div className="p-4 bg-admin-light dark:bg-admin-dark rounded-lg">
                    <p className="text-2xl font-bold text-yellow-500">{pendingReviews}</p>
                    <p className="text-sm text-admin-light-text-secondary dark:text-admin-dark-text-secondary">Pending Approval</p>
                </div>
                <div className="p-4 bg-admin-light dark:bg-admin-dark rounded-lg">
                    <p className="text-2xl font-bold text-green-500">{approvedReviews}</p>
                    <p className="text-sm text-admin-light-text-secondary dark:text-admin-dark-text-secondary">Approved</p>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map(item => (
                    <div key={item.id} className="p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-admin-dark">
                        <div className="flex justify-between items-start">
                             <div className="flex items-start gap-3">
                                <div>
                                    <p className="font-semibold">{item.user.name}</p>
                                    <p className="text-xs text-gray-500">Product: {item.product?.name || 'N/A'}</p>
                                </div>
                             </div>
                             <RatingStars rating={item.rating} />
                        </div>
                         <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 italic">"{item.comment}"</p>
                         <div className="mt-3 flex items-center justify-between">
                            <span className={`text-xs font-semibold py-1 px-2 rounded-full ${item.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {item.approved ? 'Approved' : 'Pending'}
                            </span>
                            <div className="text-xs space-x-2">
                                <button onClick={() => handleToggleApproval(item)} className="text-green-500 hover:underline">{item.approved ? 'Unapprove' : 'Approve'}</button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
                            </div>
                         </div>
                    </div>
                ))}
                {reviews.length === 0 && <p className="text-center text-gray-500 py-6">No feedback submitted yet.</p>}
            </div>
        </div>
    );
};

export default AdminFeedbackSection;