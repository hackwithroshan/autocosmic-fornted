

import React, { useState, useEffect } from 'react';
import { NavLinkItem, MenuTag, MegaMenuColumn } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminHeaderManagerSectionProps {
  headerLinks: NavLinkItem[];
  onSaveHeaderLinks: (links: NavLinkItem[]) => void;
}

const AdminHeaderManagerSection: React.FC<AdminHeaderManagerSectionProps> = ({ headerLinks, onSaveHeaderLinks }) => {
  const [links, setLinks] = useState<NavLinkItem[]>(headerLinks);

  useEffect(() => {
    setLinks(headerLinks);
  }, [headerLinks]);
  
  const handleSaveAll = () => {
    onSaveHeaderLinks(links);
    alert('Header navigation saved!');
  };

  const addLink = (newLink: NavLinkItem, parentId?: string | null) => {
    if (!parentId) {
      setLinks(prev => [...prev, newLink].sort((a,b) => a.order - b.order));
      return;
    }
    const addRecursively = (items: NavLinkItem[]): NavLinkItem[] => {
      return items.map(item => {
        if (item.id === parentId) {
          const newSubLinks = [...(item.subLinks || []), newLink].sort((a,b) => a.order - b.order);
          const newType = item.type === 'link' ? 'dropdown' : item.type;
          return { ...item, subLinks: newSubLinks, type: newType };
        }
        if (item.subLinks) {
          return { ...item, subLinks: addRecursively(item.subLinks) };
        }
        return item;
      });
    };
    setLinks(prev => addRecursively(prev));
  };

  const updateLink = (linkId: string, updatedLink: NavLinkItem) => {
    const updateRecursively = (items: NavLinkItem[]): NavLinkItem[] => {
      return items.map(item => {
        if (item.id === linkId) {
          return updatedLink;
        }
        if (item.subLinks) {
          return { ...item, subLinks: updateRecursively(item.subLinks) };
        }
        return item;
      });
    };
    setLinks(prev => updateRecursively(prev));
  };
  
  const deleteLink = (linkId: string) => {
    const deleteRecursively = (items: NavLinkItem[]): NavLinkItem[] => {
      return items
        .filter(item => item.id !== linkId)
        .map(item => {
          if (item.subLinks) {
            return { ...item, subLinks: deleteRecursively(item.subLinks) };
          }
          return item;
        });
    };
    setLinks(prev => deleteRecursively(prev));
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Header & Navigation</h2>
            <button onClick={handleSaveAll} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover self-start sm:self-center">
                Save All Header Changes
            </button>
        </div>
        <div className="p-4 sm:p-6 bg-admin-light-card dark:bg-admin-dark-card rounded-2xl shadow-lg">
            <LinkList
                links={links}
                addLink={addLink}
                updateLink={updateLink}
                deleteLink={deleteLink}
            />
            <button onClick={() => addLink({ id: `link_${Date.now()}`, label: 'New Top Link', href: '#', type: 'link', order: links.length + 1, visible: true })} className="mt-4 text-admin-accent hover:underline flex items-center gap-1">
                <PlusCircleIcon className="w-4 h-4"/> Add Top-Level Link
            </button>
        </div>
    </div>
  );
};

// --- Sub-components ---

interface LinkListProps {
    links: NavLinkItem[];
    level?: number;
    addLink: (newLink: NavLinkItem, parentId?: string | null) => void;
    updateLink: (linkId: string, updatedLink: NavLinkItem) => void;
    deleteLink: (linkId: string) => void;
}

const LinkList: React.FC<LinkListProps> = (props) => {
    const { links, level = 0, addLink } = props;
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleEdit = (link: NavLinkItem) => setEditingId(link.id);
    const handleCancel = () => setEditingId(null);
    
    const sortedLinks = links.slice().sort((a,b) => a.order - b.order);

    return (
        <div className={`space-y-2 ${level > 0 ? 'ml-4 mt-2 pt-2 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}>
            {sortedLinks.map(link => (
                <div key={link.id}>
                    {editingId === link.id ? (
                        <LinkEditor link={link} onCancel={handleCancel} {...props} />
                    ) : (
                        <div className="p-3 bg-white dark:bg-admin-dark-card rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="font-medium" style={{ opacity: link.visible ? 1 : 0.5 }}>{link.label}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(link)} className="p-1 text-blue-500 hover:text-blue-700" title="Edit"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => props.deleteLink(link.id)} className="p-1 text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                                    {level < 2 && link.type !== 'mega' && (
                                      <button onClick={() => addLink({id: `sublink_${Date.now()}`, label: 'New Sub Link', href: '#', type: 'link', order: (link.subLinks?.length || 0) + 1, visible: true }, link.id)} className="p-1 text-green-500 hover:text-green-700" title="Add Sub-link"><PlusCircleIcon className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </div>
                            {link.subLinks && link.subLinks.length > 0 && <LinkList {...props} links={link.subLinks} level={level + 1} />}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


interface LinkEditorProps extends LinkListProps {
    link: NavLinkItem;
    onCancel: () => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ link, updateLink, onCancel }) => {
    const [editedLink, setEditedLink] = useState(link);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'order' ? Number(value) : value);
        setEditedLink(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = () => {
        updateLink(link.id, editedLink);
        onCancel();
    };

    return (
        <div className="p-4 border-l-4 border-admin-accent bg-admin-light dark:bg-admin-dark/80 rounded-r-lg space-y-4">
            <InputField label="Label" name="label" value={editedLink.label} onChange={handleChange} required />
            <InputField label="URL (Href)" name="href" value={editedLink.href} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="Type" name="type" as="select" value={editedLink.type} onChange={handleChange}>
                    <option value="link">Link</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="mega">Mega Menu</option>
                </InputField>
                <InputField label="Order" name="order" type="number" value={editedLink.order} onChange={handleChange} />
                <InputField label="Tag" name="tag" as="select" value={editedLink.tag || ''} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="HOT">HOT</option>
                    <option value="SALE">SALE</option>
                </InputField>
            </div>
            <InputField label="Icon Image URL (Optional)" name="iconUrl" value={editedLink.iconUrl || ''} onChange={handleChange} />
            <div className="flex items-center">
                <input id={`visible-${editedLink.id}`} type="checkbox" name="visible" checked={editedLink.visible} onChange={handleChange} className="h-4 w-4 rounded text-admin-accent"/>
                <label htmlFor={`visible-${editedLink.id}`} className="ml-2 text-sm">Visible</label>
            </div>
            
            <div className="flex gap-2">
                <button onClick={handleSave} className="bg-admin-accent text-white py-1.5 px-4 rounded text-sm">Save</button>
                <button onClick={onCancel} className="bg-gray-300 dark:bg-gray-600 py-1.5 px-4 rounded text-sm">Cancel</button>
            </div>
        </div>
    );
};

export default AdminHeaderManagerSection;