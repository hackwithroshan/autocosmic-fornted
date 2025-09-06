import React, { useState, useMemo } from 'react';
import { ProductVariant, VariantAttribute } from '../../../types';
import Modal from '../../shared/Modal';

interface CreateVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (newVariants: ProductVariant[]) => void;
  baseSku?: string;
  basePrice?: number;
  attributes: VariantAttribute[];
}

const CreateVariantModal: React.FC<CreateVariantModalProps> = ({ isOpen, onClose, onGenerate, baseSku = 'SKU', basePrice = 0, attributes }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Set<string>>>(
    attributes.reduce((acc, attr) => ({...acc, [attr.name]: new Set<string>()}), {})
  );

  const toggleSelection = (attributeName: string, value: string) => {
    setSelectedOptions(prev => {
        const newSet = new Set(prev[attributeName]);
        if (newSet.has(value)) {
            newSet.delete(value);
        } else {
            newSet.add(value);
        }
        return {
            ...prev,
            [attributeName]: newSet
        };
    });
  };
  
  const cartesian = (...a: string[][]): string[][] => a.reduce((acc, val) => acc.flatMap(d => val.map(e => [d, e].flat())), [[]] as string[][]);

  const generatedCount = useMemo(() => {
    const sets = Object.values(selectedOptions).map(set => Array.from(set)).filter(arr => arr.length > 0);
    if (sets.length === 0) return 0;
    return sets.reduce((acc, set) => acc * set.length, 1);
  }, [selectedOptions]);

  const handleGenerateClick = () => {
    if (generatedCount === 0) {
      alert("Please select at least one option from an attribute.");
      return;
    }
    
    const attributeNamesWithSelections = attributes
        .filter(attr => (selectedOptions[attr.name] || new Set()).size > 0)
        .map(attr => attr.name);
    
    const setsToCombine = attributeNamesWithSelections.map(name => Array.from(selectedOptions[name]));
        
    const combinations = cartesian(...setsToCombine);

    const newVariants: ProductVariant[] = combinations.map(combo => {
        const comboArray = Array.isArray(combo) ? combo : [combo];
        const attributesObject: Record<string, string> = {};
        let skuSuffix = '';
        
        comboArray.forEach((value, index) => {
            const attrName = attributeNamesWithSelections[index];
            if(attrName) {
                attributesObject[attrName] = value;
                skuSuffix += `-${value.slice(0, 3).toUpperCase()}`;
            }
        });

        return {
          id: `var_${Date.now()}_${Math.random()}`,
          attributes: attributesObject,
          price: basePrice || 0,
          stockQuantity: 10,
          sku: `${baseSku}${skuSuffix}`,
          imageUrl: ''
        };
    });
    
    onGenerate(newVariants);
    onClose();
    setSelectedOptions(attributes.reduce((acc, attr) => ({...acc, [attr.name]: new Set<string>()}), {}));
  };

  const CheckboxGroup = ({ title, items, selectedItems, onToggle }: { title: string, items: string[], selectedItems: Set<string>, onToggle: (item: string) => void }) => (
    <div>
      <h4 className="font-semibold text-admin-text dark:text-admin-dark-text mb-2 capitalize">{title}</h4>
      <div className="max-h-40 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map(item => (
          <label key={item} className="flex items-center text-sm p-2 border rounded-md has-[:checked]:bg-admin-accent/20 has-[:checked]:border-admin-accent cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={selectedItems.has(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 text-admin-accent focus:ring-admin-accent border-gray-300 rounded"
            />
            <span className="ml-2">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Product Variants" size="lg">
      <div className="space-y-6">
        {attributes.map(attr => (
            <CheckboxGroup
                key={attr.id}
                title={`Select ${attr.name}s`}
                items={attr.values}
                selectedItems={selectedOptions[attr.name] || new Set()}
                onToggle={(value) => toggleSelection(attr.name, value)}
            />
        ))}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <p className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">
                {generatedCount > 0 ? `${generatedCount} variant(s) will be generated.` : 'Select options to generate variants.'}
            </p>
            <button
                onClick={handleGenerateClick}
                disabled={generatedCount === 0}
                className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Generate Variants
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateVariantModal;