
import React, { useState } from 'react';
import { CategoryGridItem, PromoGridItem, TopCategoryItem } from '../../../types';
import InputField from '../../shared/InputField';
import Modal from '../../shared/Modal';
import TrashIcon from '../../icons/TrashIcon';

type GridType = 'categoryGrid' | 'promoGrid' | 'topCategories';

interface AdminHomepageContentSectionProps {
  categoryGridItems: CategoryGridItem[];
  promoGridItems: PromoGridItem[];
  topCategories: TopCategoryItem[];
  onUpdateHomepageContent: (type: GridType, items: any[]) => void;
}

const AdminHomepageContentSection: React.FC<AdminHomepageContentSectionProps> = ({
  categoryGridItems,
  promoGridItems,
  topCategories,
  onUpdateHomepageContent,
}) => {
  const [activeTab, setActiveTab] = useState<GridType>('categoryGrid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    let newItem: any;
    switch (activeTab) {
        case 'categoryGrid':
            newItem = { id: `cg_${Date.now()}`, supertitle: 'New', title: 'Title', subtitle: 'Subtitle', callToAction: 'Browse', imageUrl: '', backgroundColor: '#cccccc', textColor: 'text-black', link: '#', gridSpan: 1 };
            break;
        case 'promoGrid':
            newItem = { id: `pg_${Date.now()}`, tag: 'New Tag', title: 'New Promo', subtitle: '', priceText: '', imageUrl: '', link: '#', buttonText: 'Shop Now', align: 'left' };
            break;
        case 'topCategories':
            newItem = { id: `tc_${Date.now()}`, name: 'New Category', itemCount: 0, imageUrl: '', link: '#' };
            break;
    }
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleSaveItem = (updatedItem: any) => {
    let currentItems: any[];
    let newItems;
    switch (activeTab) {
      case 'categoryGrid':
        currentItems = categoryGridItems;
        newItems = currentItems.map(i => i.id === updatedItem.id ? updatedItem : i);
        if (!currentItems.find(i => i.id === updatedItem.id)) newItems.push(updatedItem);
        onUpdateHomepageContent(activeTab, newItems);
        break;
      case 'promoGrid':
        currentItems = promoGridItems;
        newItems = currentItems.map(i => i.id === updatedItem.id ? updatedItem : i);
        if (!currentItems.find(i => i.id === updatedItem.id)) newItems.push(updatedItem);
        onUpdateHomepageContent(activeTab, newItems);
        break;
      case 'topCategories':
        currentItems = topCategories;
        newItems = currentItems.map(i => i.id === updatedItem.id ? updatedItem : i);
        if (!currentItems.find(i => i.id === updatedItem.id)) newItems.push(updatedItem);
        onUpdateHomepageContent(activeTab, newItems);
        break;
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
    const handleDeleteItem = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        let newItems;
        switch (activeTab) {
            case 'categoryGrid':
                newItems = categoryGridItems.filter(i => i.id !== id);
                onUpdateHomepageContent(activeTab, newItems);
                break;
            case 'promoGrid':
                 newItems = promoGridItems.filter(i => i.id !== id);
                 onUpdateHomepageContent(activeTab, newItems);
                break;
            case 'topCategories':
                 newItems = topCategories.filter(i => i.id !== id);
                 onUpdateHomepageContent(activeTab, newItems);
                break;
        }
    };
  
  const renderList = () => {
    let items: any[] = [];
    if (activeTab === 'categoryGrid') items = categoryGridItems;
    if (activeTab === 'promoGrid') items = promoGridItems;
    if (activeTab === 'topCategories') items = topCategories;
    
    return items.map(item => (
        <div key={item.id} className="p-3 border rounded-lg flex justify-between items-center bg-white dark:bg-admin-dark-card">
            <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt={item.title || item.name} className="w-12 h-12 object-contain rounded-md bg-gray-200" />
                <div>
                    <p className="font-semibold">{item.title || item.name}</p>
                    <p className="text-xs text-gray-500">{item.subtitle || `${item.itemCount || 0} items`}</p>
                </div>
            </div>
            <div>
                 <button onClick={() => handleEdit(item)} className="text-blue-500 hover:underline text-sm">Edit</button>
                 <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:underline text-sm ml-3"><TrashIcon className="w-4 h-4 inline-block"/></button>
            </div>
        </div>
    ));
  };
  
  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Homepage Content</h1>
        <button onClick={handleAddNew} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center">
            Add New Item
        </button>
      </div>
      <div className="border-b mb-4">
          <nav className="-mb-px flex space-x-4">
              <button onClick={() => setActiveTab('categoryGrid')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'categoryGrid' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500'}`}>Category Grid</button>
              <button onClick={() => setActiveTab('promoGrid')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'promoGrid' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500'}`}>Promo Grid</button>
              <button onClick={() => setActiveTab('topCategories')} className={`py-2 px-1 border-b-2 text-sm ${activeTab === 'topCategories' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500'}`}>Top Categories</button>
          </nav>
      </div>
      <div className="space-y-3">
        {renderList()}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit ${activeTab}`}>
        {editingItem && <EditForm item={editingItem} onSave={handleSaveItem} type={activeTab} />}
      </Modal>
    </div>
  );
};


const EditForm = ({ item, onSave, type }: { item: any; onSave: (item: any) => void; type: GridType}) => {
    const [formData, setFormData] = useState(item);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: name === 'gridSpan' || name === 'itemCount' ? Number(value) : value }));
    };

    if (type === 'categoryGrid') {
        return (
            <div className="space-y-4">
                <InputField label="Supertitle (e.g., 'Enjoy')" name="supertitle" value={formData.supertitle} onChange={handleChange} />
                <InputField label="Title (e.g., 'With')" name="title" value={formData.title} onChange={handleChange} />
                <InputField label="Subtitle (e.g., 'Earphone')" name="subtitle" value={formData.subtitle} onChange={handleChange} />
                <InputField label="Button Text (e.g., 'Browse')" name="callToAction" value={formData.callToAction} onChange={handleChange} />
                <InputField label="Link URL" name="link" value={formData.link} onChange={handleChange} />
                <InputField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                <div className="flex items-center gap-4">
                    <InputField label="Grid Span (1 or 2)" name="gridSpan" type="number" value={formData.gridSpan} onChange={handleChange} />
                     <div>
                        <label className="block text-sm font-medium mb-1">Background Color</label>
                        <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} className="w-full h-10 p-1 border rounded" />
                    </div>
                </div>
                <button onClick={() => onSave(formData)} className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save Changes</button>
            </div>
        )
    }
     if (type === 'promoGrid') {
        return (
            <div className="space-y-3">
                <InputField label="Tag" name="tag" value={formData.tag} onChange={handleChange} />
                <InputField label="Title" name="title" value={formData.title} onChange={handleChange} />
                <InputField label="Subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
                <InputField label="Price Text" name="priceText" value={formData.priceText} onChange={handleChange} />
                <InputField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                 <InputField label="Button Text" name="buttonText" value={formData.buttonText} onChange={handleChange} />
                 <InputField label="Link URL" name="link" value={formData.link} onChange={handleChange} />
                 <div>
                    <label className="block text-sm font-medium mb-1">Align</label>
                    <select name="align" value={formData.align} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                 </div>

                <button onClick={() => onSave(formData)} className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save Changes</button>
            </div>
        )
    }
    if (type === 'topCategories') {
        return (
             <div className="space-y-3">
                <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                <InputField label="Item Count" name="itemCount" type="number" value={formData.itemCount} onChange={handleChange} />
                <InputField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                <InputField label="Link (Category Name)" name="link" value={formData.link} onChange={handleChange} />
                <button onClick={() => onSave(formData)} className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save Changes</button>
            </div>
        )
    }

    return null;
}

export default AdminHomepageContentSection;
