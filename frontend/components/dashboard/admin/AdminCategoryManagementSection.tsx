

import React, { useState } from 'react';
import { Category } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminCategoryManagementSectionProps {
  categories: Category[];
  onSaveCategory: (category: Partial<Category>, parentId: string | null) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";
const primaryButtonSmClasses = "bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover transition-colors";
const secondaryButtonSmClasses = "bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors";

interface CategoryRowProps {
    category: Category;
    level: number;
    onEdit: (category: Category, parentId: string | null) => void;
    onAddSubCategory: (parentId: string) => void;
    onDelete: (categoryId: string) => void;
    parentId: string | null;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, level, onEdit, onAddSubCategory, onDelete, parentId }) => {
    return (
        <>
            <tr className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                <td className={`${tdCellClasses} font-medium`} style={{ paddingLeft: `${1 + level * 1.5}rem` }}>
                    {level > 0 && <span className="mr-2 opacity-50">↳</span>}
                    {category.name}
                </td>
                <td className={`${tdCellClasses} space-x-2`}>
                    <button onClick={() => onEdit(category, parentId)} className="text-admin-accent hover:opacity-80 p-1" title="Edit"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(category.id)} className="text-red-500 hover:opacity-80 p-1" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                    {level < 2 && ( // Limit nesting depth
                        <button onClick={() => onAddSubCategory(category.id)} className="text-green-500 hover:opacity-80 p-1" title="Add Sub-category"><PlusCircleIcon className="w-4 h-4" /></button>
                    )}
                </td>
            </tr>
            {category.subCategories && category.subCategories.map(subCat => (
                <CategoryRow key={subCat.id} category={subCat} level={level + 1} onEdit={onEdit} onAddSubCategory={onAddSubCategory} onDelete={onDelete} parentId={category.id}/>
            ))}
        </>
    );
};

const AdminCategoryManagementSection: React.FC<AdminCategoryManagementSectionProps> = ({ categories, onSaveCategory, onDeleteCategory }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [parentId, setParentId] = useState<string | null>(null);
    const [name, setName] = useState('');
    
    const handleEdit = (category: Category, pId: string | null) => {
        setEditingCategory(category);
        setName(category.name);
        setParentId(pId);
        setIsFormOpen(true);
    };

    const handleAdd = (pId: string | null) => {
        setEditingCategory(null);
        setName('');
        setParentId(pId);
        setIsFormOpen(true);
    };
    
    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
        setName('');
        setParentId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        const categoryData: Partial<Category> = {
            id: editingCategory ? editingCategory.id : `cat_${Date.now()}`,
            name,
        };

        onSaveCategory(categoryData, parentId);
        handleCancel();
    };

    const handleDelete = (categoryId: string) => {
        if (window.confirm("Are you sure you want to delete this category? All its sub-categories will also be deleted.")) {
            onDeleteCategory(categoryId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Category Management</h2>
                {!isFormOpen && (
                    <button onClick={() => handleAdd(null)} className={`${primaryButtonSmClasses} flex items-center`}>
                        <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Category
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold text-admin-text dark:text-admin-dark-text mb-4">
                        {editingCategory ? `Edit: ${editingCategory.name}` : (parentId ? 'Add New Sub-category' : 'Add New Top-Level Category')}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Category Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <div className="flex gap-3">
                            <button type="submit" className={primaryButtonSmClasses}>{editingCategory ? 'Update' : 'Save'}</button>
                            <button type="button" onClick={handleCancel} className={secondaryButtonSmClasses}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className={thCellClasses}>Category Name</th>
                            <th className={thCellClasses}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.map(cat => (
                            <CategoryRow key={cat.id} category={cat} level={0} onEdit={handleEdit} onAddSubCategory={handleAdd} onDelete={handleDelete} parentId={null}/>
                        ))}
                    </tbody>
                </table>
            </div>
            {categories.length === 0 && !isFormOpen && (
                <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No categories found. Add one to get started.</p>
            )}
        </div>
    );
};

export default AdminCategoryManagementSection;