

import React, { useState, useEffect } from 'react';
import { Coupon, CouponType } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminCouponsSectionProps {
  initialCoupons: Coupon[];
  onSave: (coupon: Coupon) => Promise<boolean>;
  onDelete: (couponId: string) => Promise<boolean>;
}

const inputFieldClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-admin-accent focus:border-admin-accent bg-admin-light-card dark:bg-admin-dark-card";
const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";
const primaryButtonSmClasses = "bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover transition-colors";
const secondaryButtonSmClasses = "bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors";

const AdminCouponsSection: React.FC<AdminCouponsSectionProps> = ({ initialCoupons, onSave, onDelete }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState<Partial<Coupon>>({
    type: 'percentage',
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: name === 'value' || name === 'usageLimit' ? Number(val) : val }));
  };

  const resetForm = () => {
    setFormData({ type: 'percentage', isActive: true });
    setIsFormVisible(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.code || formData.value === undefined) {
      alert("Coupon code and value are required.");
      return;
    }
    const couponToSave: Coupon = {
      id: editingCoupon ? editingCoupon.id : `coupon_${Date.now()}`,
      code: formData.code!,
      type: formData.type!,
      value: formData.value!,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: formData.usageLimit,
      usageCount: editingCoupon ? editingCoupon.usageCount : 0,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      rules: formData.rules,
    };
    
    const success = await onSave(couponToSave);
    if (success) {
      resetForm();
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsFormVisible(true);
  };
  
  const handleDelete = (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
        onDelete(couponId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Coupons & Promotions</h2>
        {!isFormVisible && (
          <button
            onClick={() => { setIsFormVisible(true); setEditingCoupon(null); setFormData({ type: 'percentage', isActive: true }); }}
            className={`${primaryButtonSmClasses} flex items-center`}
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Coupon
          </button>
        )}
      </div>

      {isFormVisible && (
        <div className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-admin-text dark:text-admin-dark-text mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Coupon Code" name="code" value={formData.code || ''} onChange={handleInputChange} placeholder="e.g., ZAINA25" required />
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1">Coupon Type</label>
                <select id="type" name="type" value={formData.type} onChange={handleInputChange} className={inputFieldClasses}>
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed_amount">Fixed Amount Discount</option>
                  <option value="bogo">Buy X Get Y (BOGO)</option>
                </select>
              </div>
            </div>
            <InputField label="Value" name="value" type="number" value={formData.value || ''} onChange={handleInputChange} placeholder={formData.type === 'percentage' ? "e.g., 25 for 25%" : "e.g., 100 for $100"} required />
            <InputField label="Description (Optional)" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="e.g., Summer Sale Special" />
            <div className="flex gap-3">
              <button type="submit" className={primaryButtonSmClasses}>
                {editingCoupon ? 'Update Coupon' : 'Save Coupon'}
              </button>
              <button type="button" onClick={resetForm} className={secondaryButtonSmClasses}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className={thCellClasses}>Code</th>
              <th className={thCellClasses}>Type</th>
              <th className={thCellClasses}>Value</th>
              <th className={thCellClasses}>Usage</th>
              <th className={thCellClasses}>Status</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {initialCoupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                <td className={`${tdCellClasses} font-medium`}>{coupon.code}</td>
                <td className={`${tdCellClasses} capitalize`}>{coupon.type.replace('_', ' ')}</td>
                <td className={tdCellClasses}>{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}</td>
                <td className={tdCellClasses}>{coupon.usageCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}</td>
                <td className={tdCellClasses}>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={`${tdCellClasses} space-x-1`}>
                  <button onClick={() => handleEdit(coupon)} className="text-admin-accent hover:opacity-80 p-1" title="Edit"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:opacity-80 p-1" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {initialCoupons.length === 0 && !isFormVisible && (
         <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No coupons created yet.</p>
      )}
    </div>
  );
};

export default AdminCouponsSection;