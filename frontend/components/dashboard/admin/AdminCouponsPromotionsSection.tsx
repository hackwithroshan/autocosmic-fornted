
import React, { useState } from 'react';
import { Coupon, CouponType, ZainaColor } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminCouponsPromotionsSectionProps {
  initialCoupons: Coupon[];
}

const inputFieldClasses = "w-full px-3 py-2 border border-zaina-cool-gray-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-zaina-primary focus:border-zaina-primary";
const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-zaina-deep-navy";

const AdminCouponsPromotionsSection: React.FC<AdminCouponsPromotionsSectionProps> = ({ initialCoupons }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isAdding, setIsAdding] = useState(false);
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
    setIsAdding(false);
    setEditingCoupon(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.code || formData.value === undefined) {
      alert("Coupon code and value are required.");
      return;
    }
    const newCoupon: Coupon = {
      id: editingCoupon ? editingCoupon.id : `coupon${Date.now()}`,
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

    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === newCoupon.id ? newCoupon : c));
      alert(`Coupon ${newCoupon.code} updated!`);
    } else {
      setCoupons(prev => [newCoupon, ...prev]);
      alert(`Coupon ${newCoupon.code} created!`);
    }
    resetForm();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsAdding(true);
  };
  
  const handleDelete = (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        alert('Coupon deleted (simulated).');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy">Coupons & Promotions</h2>
        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setEditingCoupon(null); setFormData({ type: 'percentage', isActive: true }); }}
            className="bg-zaina-primary text-zaina-white font-medium py-2 px-4 rounded-md hover:bg-zaina-secondary-blue text-sm transition-colors flex items-center"
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Coupon
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8 p-6 bg-zaina-sky-blue-light/50 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Coupon Code" name="code" value={formData.code || ''} onChange={handleInputChange} placeholder="e.g., ZAINA25" required />
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-zaina-deep-navy mb-1">Coupon Type</label>
                <select id="type" name="type" value={formData.type} onChange={handleInputChange} className={inputFieldClasses}>
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed_amount">Fixed Amount Discount</option>
                  <option value="bogo">Buy X Get Y (BOGO)</option>
                </select>
              </div>
            </div>
            <InputField label="Value" name="value" type="number" value={formData.value || ''} onChange={handleInputChange} placeholder={formData.type === 'percentage' ? "e.g., 25 for 25%" : "e.g., 100 for $100"} required />
            <InputField label="Description (Optional)" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="e.g., Summer Sale Special" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Start Date (Optional)" name="startDate" type="date" value={formData.startDate ? formData.startDate.split('T')[0] : ''} onChange={handleInputChange} />
              <InputField label="End Date (Optional)" name="endDate" type="date" value={formData.endDate ? formData.endDate.split('T')[0] : ''} onChange={handleInputChange} />
            </div>
            <InputField label="Usage Limit (Optional)" name="usageLimit" type="number" value={formData.usageLimit || ''} onChange={handleInputChange} placeholder="e.g., 1000 uses" />
             <div>
                <label htmlFor="rules" className="block text-sm font-medium text-zaina-deep-navy mb-1">Usage Rules (Optional)</label>
                <textarea id="rules" name="rules" value={formData.rules || ''} onChange={handleInputChange} rows={3} placeholder="e.g., Min. purchase $50. Not valid on sale items." className={inputFieldClasses}></textarea>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="isActive" name="isActive" checked={!!formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-zaina-primary focus:ring-zaina-primary border-zaina-cool-gray-dark rounded mr-2" />
              <label htmlFor="isActive" className="text-sm text-zaina-deep-navy">Active</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-zaina-primary text-zaina-white font-semibold py-2 px-5 rounded-md hover:bg-zaina-secondary-blue">
                {editingCoupon ? 'Update Coupon' : 'Save Coupon'}
              </button>
              <button type="button" onClick={resetForm} className="bg-zaina-cool-gray-medium text-zaina-deep-navy font-semibold py-2 px-5 rounded-md hover:bg-zaina-cool-gray-dark">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zaina-cool-gray-medium dashboard-table">
          <thead className="bg-zaina-cool-gray-light">
            <tr>
              <th className={thCellClasses}>Code</th>
              <th className={thCellClasses}>Type</th>
              <th className={thCellClasses}>Value</th>
              <th className={thCellClasses}>Usage</th>
              <th className={thCellClasses}>Status</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zaina-white divide-y divide-zaina-cool-gray-light">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-zaina-sky-blue-light/50">
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
                  <button onClick={() => handleEdit(coupon)} className="text-zaina-secondary-blue hover:text-zaina-primary p-1" title="Edit"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(coupon.id)} className="text-zaina-deep-red-accent hover:text-red-700 p-1" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {coupons.length === 0 && !isAdding && (
         <p className="text-center py-8 text-zaina-slate-gray">No coupons created yet.</p>
      )}
    </div>
  );
};

export default AdminCouponsPromotionsSection;
