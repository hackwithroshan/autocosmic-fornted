

import React, { useState } from 'react';
import { Faq } from '../../../types';
import Accordion from '../../shared/Accordion';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminFaqSectionProps {
    faqs: Faq[];
    onSaveFaq: (faq: Faq) => Promise<boolean>;
    onDeleteFaq: (faqId: string) => Promise<boolean>;
}

const AdminFaqSection: React.FC<AdminFaqSectionProps> = ({ faqs, onSaveFaq, onDeleteFaq }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [formData, setFormData] = useState<Partial<Faq>>({
        question: '',
        answer: '',
        isActive: true
    });

    const handleEdit = (faq: Faq) => {
        setEditingFaq(faq);
        setFormData(faq);
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingFaq(null);
        setFormData({
            id: `faq_${Date.now()}`,
            question: '',
            answer: '',
            isActive: true,
            order: (faqs?.length || 0) + 1
        });
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setEditingFaq(null);
        setFormData({});
        setIsFormVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.question && formData.answer) {
            const success = await onSaveFaq(formData as Faq);
            if (success) {
                handleCancel();
            }
        } else {
            alert("Question and Answer are required.");
        }
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            onDeleteFaq(id);
        }
    };

    return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">FAQ Manager</h1>
            {!isFormVisible && (
                <button onClick={handleAddNew} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center">
                    <PlusCircleIcon className="w-5 h-5 mr-2"/> Add FAQ
                </button>
            )}
        </div>

        {isFormVisible && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner space-y-4">
                <h3 className="text-lg font-semibold">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                <InputField label="Question" name="question" value={formData.question || ''} onChange={e => setFormData(p => ({...p, question: e.target.value}))} required />
                <InputField label="Answer" name="answer" as="textarea" rows={4} value={formData.answer || ''} onChange={e => setFormData(p => ({...p, answer: e.target.value}))} required />
                <div className="flex gap-3">
                    <button type="submit" className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save</button>
                    <button type="button" onClick={handleCancel} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
                </div>
            </form>
        )}

        <div className="space-y-2">
            {faqs.map(faq => (
                <Accordion key={faq.id} identifier={faq.id} title={faq.question}>
                    <p className="text-sm">{faq.answer}</p>
                    <div className="mt-3 text-right space-x-2">
                        <button onClick={() => handleEdit(faq)} className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"><EditIcon className="w-3 h-3"/> Edit</button>
                        <button onClick={() => handleDelete(faq.id)} className="text-xs text-red-500 hover:underline inline-flex items-center gap-1"><TrashIcon className="w-3 h-3"/> Delete</button>
                    </div>
                </Accordion>
            ))}
        </div>
        {faqs.length === 0 && !isFormVisible && <p className="text-center py-8">No FAQs found. Add one to get started.</p>}
    </div>
  );
};

export default AdminFaqSection;