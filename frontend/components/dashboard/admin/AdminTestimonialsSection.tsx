
import React, { useState } from 'react';
import { Testimonial } from '../../../types';
import TrashIcon from '../../icons/TrashIcon';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';

interface AdminTestimonialsSectionProps {
  testimonials: Testimonial[];
  onSave: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
}

export const AdminTestimonialsSection: React.FC<AdminTestimonialsSectionProps> = ({ testimonials, onSave, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
        userName: '',
        quote: '',
        userImage: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Placeholder image
        rating: 5,
        approved: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const val = isCheckbox ? (e.target as HTMLInputElement).checked : value;
        setNewTestimonial(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = () => {
        if (!newTestimonial.userName || !newTestimonial.quote) {
            alert('User Name and Quote are required.');
            return;
        }
        onSave({
            id: `testimonial_${Date.now()}`,
            ...newTestimonial
        } as Testimonial);
        setNewTestimonial({ userName: '', quote: '', userImage: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', rating: 5, approved: false });
        setIsAdding(false);
    };

    const toggleApproval = (testimonial: Testimonial) => {
        onSave({ ...testimonial, approved: !testimonial.approved });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            onDelete(id);
        }
    };

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Testimonials</h1>
                 <button onClick={() => setIsAdding(!isAdding)} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center">
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> {isAdding ? 'Cancel' : 'Add Testimonial'}
                 </button>
            </div>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
                Manage customer testimonials displayed on your site.
            </p>

            {isAdding && (
                <div className="mb-6 p-4 border rounded-lg bg-admin-light dark:bg-admin-dark space-y-3">
                    <InputField label="User Name" name="userName" value={newTestimonial.userName || ''} onChange={handleInputChange} required />
                    <InputField label="Quote" name="quote" value={newTestimonial.quote || ''} as="textarea" rows={3} onChange={handleInputChange} required />
                    <InputField label="Rating (1-5)" name="rating" type="number" value={newTestimonial.rating || 5} onChange={handleInputChange} />
                     <div className="flex items-center">
                        <input type="checkbox" id="approved" name="approved" checked={!!newTestimonial.approved} onChange={handleInputChange} className="h-4 w-4 rounded text-admin-accent"/>
                        <label htmlFor="approved" className="ml-2 text-sm">Approved</label>
                    </div>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg">Save Testimonial</button>
                </div>
            )}

            {/* Existing Testimonials List */}
            <div className="space-y-3">
                {testimonials.map(item => (
                    <div key={item.id} className="p-3 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={item.userImage} alt={item.userName} className="w-10 h-10 rounded-full"/>
                            <div>
                                <p className="font-semibold">{item.userName}</p>
                                <p className="text-xs text-gray-500 italic">"{item.quote}"</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleApproval(item)} className={`text-xs font-semibold py-1 px-3 rounded-full ${item.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {item.approved ? 'Approved' : 'Pending'}
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
