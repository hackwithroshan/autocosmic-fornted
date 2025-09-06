import React, { useState, useEffect, useMemo } from 'react';
import { Product, MediaFile, ProductVariant, VariantAttribute, Category } from '../../../types';
import InputField from '../../shared/InputField';
import TagInput from '../../shared/TagInput';
import MediaManagerModal from './MediaManagerModal';
import TrashIcon from '../../icons/TrashIcon';
import CreateVariantModal from './CreateVariantModal';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import Accordion from '../../shared/Accordion';
import SeoPreview from './SeoPreview';
import SeoScoreIndicator from './SeoScoreIndicator';


interface AdminAddProductSectionProps {
  products: Product[];
  onSave: (product: Product) => Promise<boolean>;
  onCancel: () => void;
  productToEdit: Product | null;
  onUploadMedia: (files: File[]) => void;
  mediaLibrary: MediaFile[];
  variantAttributes: VariantAttribute[];
  categories: Category[];
}

const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const AdminAddProductSection: React.FC<AdminAddProductSectionProps> = ({ products, onSave, onCancel, productToEdit, onUploadMedia, mediaLibrary, variantAttributes, categories }) => {
    const isEditing = !!productToEdit;
    
    const [product, setProduct] = useState<Partial<Product>>({});
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [seoScore, setSeoScore] = useState(0);
    
    const [nameError, setNameError] = useState('');
    const [skuError, setSkuError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [variantErrors, setVariantErrors] = useState<Record<number, string>>({});
    
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [mediaModalTarget, setMediaModalTarget] = useState<'primary' | 'gallery' | 'banner' | 'variant' | null>(null);
    const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
    const [galleryUrlInput, setGalleryUrlInput] = useState('');
    
    
    useEffect(() => {
        if (isEditing) {
            setProduct(productToEdit);
            setVariants(productToEdit.variants || []);
            setIsSlugManuallyEdited(true);
            setSelectedCategoryName(productToEdit.category);
        } else {
            // Set defaults for a new product
            setProduct({
                publishStatus: 'Published',
                isTaxable: true,
                isNew: true,
                gender: 'Female',
                tags: [],
                specifications: [{ key: '', value: '' }],
                images: [],
                faqs: [],
            });
            setVariants([]);
             setIsSlugManuallyEdited(false);
             setSelectedCategoryName('');
        }
    }, [productToEdit, isEditing]);

    const calculateSeoScore = (p: Partial<Product>): number => {
        let score = 0;
        const title = p.metaTitle || p.name || '';
        const description = p.metaDescription || '';
        const nameKeywords = (p.name || '').toLowerCase().split(' ');

        // Title length
        if (title.length > 30 && title.length <= 60) score += 25;
        // Description length
        if (description.length > 120 && description.length <= 160) score += 25;
        // Keyword in Title
        if (nameKeywords.length > 0 && title.toLowerCase().includes(nameKeywords[0])) score += 25;
        // Keyword in Description
        if (nameKeywords.length > 0 && description.toLowerCase().includes(nameKeywords[0])) score += 25;
        
        return score;
    };

    useEffect(() => {
        setSeoScore(calculateSeoScore(product));
    }, [product.name, product.metaTitle, product.metaDescription]);


    const validatePrice = (price?: number, mrp?: number) => {
        if (price !== undefined && mrp !== undefined && price > mrp) {
            return `Selling price cannot be greater than MRP (₹${mrp}).`;
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let val: any;

        if (type === 'checkbox') {
            val = (e.target as HTMLInputElement).checked;
        } else if (['price', 'mrp', 'stockQuantity', 'weightKg'].includes(name)) {
            const num = parseFloat(value);
            val = isNaN(num) ? undefined : num;
        } else {
            val = value;
        }
        
        let newProductState = { ...product, [name]: val };
        
        if (name === 'price') setPriceError(validatePrice(val, newProductState.mrp));
        if (name === 'mrp') setPriceError(validatePrice(newProductState.price, val));
        
        if (name === 'name') {
            if (!isSlugManuallyEdited) { newProductState.slug = generateSlug(value); }
            const similarProduct = products.find(p => p.id !== productToEdit?.id && p.name.toLowerCase().includes(value.toLowerCase()));
            setNameError(similarProduct ? `Similar product exists: "${similarProduct.name}"` : '');
        }

        if (name === 'sku' && value) {
            const duplicateSku = products.find(p => p.id !== productToEdit?.id && p.sku === value);
            setSkuError(duplicateSku ? `SKU already exists for product: "${duplicateSku.name}"` : '');
        }
        
        setProduct(newProductState);
    };
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setSelectedCategoryName(newCategory);
        setProduct(prev => ({
            ...prev,
            category: newCategory,
            subCategory: '', // Reset sub-category on main category change
        }));
    };
    
    const availableSubCategories = useMemo(() => {
        if (!selectedCategoryName) return [];
        const findCat = (cats: Category[]): Category | undefined => {
            for (const cat of cats) {
                if (cat.name === selectedCategoryName) return cat;
                if (cat.subCategories) {
                    const found = findCat(cat.subCategories);
                    if (found) return found;
                }
            }
            return undefined;
        };
        const mainCat = findCat(categories);
        return mainCat?.subCategories || [];
    }, [selectedCategoryName, categories]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugManuallyEdited(true);
        setProduct({ ...product, slug: generateSlug(e.target.value) });
    };

    const handleDimensionChange = (field: 'length' | 'width' | 'height', value: string) => {
        const num = parseFloat(value);
        setProduct(prev => ({
            ...prev,
            dimensionsCm: {
                ...(prev.dimensionsCm || {}),
                [field]: isNaN(num) ? undefined : num,
            }
        }));
    };
    
    const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
        const newVariants = [...variants];
        let finalValue: any = value;
        if (field === 'price' || field === 'stockQuantity') {
            const num = parseFloat(value as string);
            finalValue = isNaN(num) ? undefined : num;
        }
        (newVariants[index] as any)[field] = finalValue;

        if (field === 'price') {
            const error = validatePrice(finalValue as number, product.mrp);
            setVariantErrors(prev => ({ ...prev, [index]: error }));
        }

        setVariants(newVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
        setVariantErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[index];
            return newErrors;
        });
    };

    const handleGenerateVariants = (newGeneratedVariants: ProductVariant[]) => {
        setVariants(prevVariants => {
            const existingVariantKeys = new Set(prevVariants.map(v => `${v.attributes['Color']}-${v.attributes['Size']}`));
            const variantsToAdd = newGeneratedVariants.filter(nv => !existingVariantKeys.has(`${nv.attributes['Color']}-${nv.attributes['Size']}`));
            if (variantsToAdd.length < newGeneratedVariants.length) {
                alert('Some variant combinations already existed and were not added to prevent duplicates.');
            }
            return [...prevVariants, ...variantsToAdd];
        });
    };

    const handleSpecsChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...(product.specifications || [])];
        newSpecs[index][field] = value;
        setProduct({ ...product, specifications: newSpecs });
    };

    const addSpecField = () => {
        setProduct({ ...product, specifications: [...(product.specifications || []), { key: '', value: '' }] });
    };

    const removeSpecField = (index: number) => {
        const newSpecs = (product.specifications || []).filter((_, i) => i !== index);
        setProduct({ ...product, specifications: newSpecs });
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...(product.faqs || [])];
        newFaqs[index][field] = value;
        setProduct({ ...product, faqs: newFaqs });
    };

    const addFaqField = () => {
        setProduct({ ...product, faqs: [...(product.faqs || []), { question: '', answer: '' }] });
    };

    const removeFaqField = (index: number) => {
        const newFaqs = (product.faqs || []).filter((_, i) => i !== index);
        setProduct({ ...product, faqs: newFaqs });
    };

    const handleOpenMediaModal = (target: 'primary' | 'gallery' | 'banner' | 'variant', variantIndex?: number) => {
        setMediaModalTarget(target);
        if(target === 'variant') {
            setEditingVariantIndex(variantIndex!);
        }
        setIsMediaModalOpen(true);
    };
    
    const handleSelectFromMedia = (selectedUrls: string[]) => {
        if(selectedUrls.length === 0) {
            setIsMediaModalOpen(false);
            return;
        }

        switch(mediaModalTarget) {
            case 'primary':
                setProduct(prev => ({ ...prev, imageUrl: selectedUrls[0] }));
                break;
            case 'gallery':
                setProduct(prev => {
                    const currentImages = prev.images || [];
                    const newImages = selectedUrls.filter(url => !currentImages.includes(url));
                    const combined = [...currentImages, ...newImages];
                    if (combined.length > 8) {
                        alert('You can only have up to 8 gallery images. Some images were not added.');
                        return { ...prev, images: combined.slice(0, 8) };
                    }
                    return { ...prev, images: combined };
                });
                break;
            case 'banner':
                setProduct(prev => ({ ...prev, bannerImageUrl: selectedUrls[0] }));
                break;
            case 'variant':
                 if (editingVariantIndex !== null) {
                    handleVariantChange(editingVariantIndex, 'imageUrl', selectedUrls[0]);
                }
                break;
        }
        setIsMediaModalOpen(false);
        setEditingVariantIndex(null);
    };
    
    const handleFileUpload = (files: FileList, target: 'primary' | 'gallery' | 'banner') => {
        const fileArray = Array.from(files);
        // In a real app, you would upload these files to a server/CDN and get back URLs.
        // For this mock, we'll use FileReader to create local data URLs for preview.
        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                if(target === 'primary') {
                    setProduct(p => ({...p, imageUrl: dataUrl}));
                } else if(target === 'banner') {
                    setProduct(p => ({...p, bannerImageUrl: dataUrl}));
                } else if(target === 'gallery') {
                    setProduct(p => ({...p, images: [...(p.images || []), dataUrl].slice(0, 8)}));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const addGalleryUrls = () => {
        const urls = galleryUrlInput.split('\n').map(url => url.trim()).filter(Boolean);
        if (urls.length === 0) return;
    
        setProduct(prev => {
            const currentImages = prev.images || [];
            const newUrls = urls.filter(url => !currentImages.includes(url));
            const combined = [...currentImages, ...newUrls];
            
            if (combined.length > 8) {
                alert(`Cannot add more than 8 images. Only ${8 - currentImages.length} of the new URLs could be added.`);
                return { ...prev, images: combined.slice(0, 8) };
            }
            return { ...prev, images: combined };
        });
        setGalleryUrlInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalProductData: Product = {
            ...product,
            variants: variants,
            id: productToEdit?.id,
        } as Product;
        
        await onSave(finalProductData);
    };

    const renderCategoryOptions = (cats: Category[], level = 0): React.ReactNode[] => {
        let options: React.ReactNode[] = [];
        cats.forEach(cat => {
            options.push(<option key={cat.id} value={cat.name}>{'— '.repeat(level)}{cat.name}</option>);
            if (cat.subCategories && cat.subCategories.length > 0) {
                options = options.concat(renderCategoryOptions(cat.subCategories, level + 1));
            }
        });
        return options;
    };
    
    return (
        <div className="pb-24">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
                        <InputField label="Product Title" name="name" value={product.name || ''} onChange={handleInputChange} required error={nameError} />
                        <InputField label="URL Slug" name="slug" value={product.slug || ''} onChange={handleSlugChange} helperText="Auto-generated from title. Edit carefully." />
                        <InputField label="Short Description" as="textarea" rows={4} name="description" value={product.description || ''} onChange={handleInputChange} required />
                    </div>

                    <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
                        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">Product Images</h3>
                        <div>
                            <h4 className="text-sm font-medium text-admin-text-secondary mb-2">Primary Image</h4>
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 flex-shrink-0 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                    {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover rounded-md"/> : <span className="text-xs text-gray-400">Preview</span>}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => handleOpenMediaModal('primary')} className="text-xs py-1 px-3 border rounded-md whitespace-nowrap">Choose from Library</button>
                                        <label className="text-xs py-1 px-3 border rounded-md cursor-pointer block text-center whitespace-nowrap">
                                            Upload New
                                            <input type="file" className="sr-only" onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'primary')} />
                                        </label>
                                        {product.imageUrl && <button type="button" onClick={() => setProduct(p=>({...p, imageUrl: undefined}))} className="text-xs text-red-500 whitespace-nowrap">Remove</button>}
                                    </div>
                                    <InputField
                                        label=""
                                        name="imageUrl"
                                        value={product.imageUrl || ''}
                                        onChange={handleInputChange}
                                        placeholder="Or paste image URL"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-admin-text-secondary mb-2">Image Gallery <span className="font-normal">({product.images?.length || 0} / 8)</span></h4>
                            <div className="grid grid-cols-4 gap-2">
                                {(product.images || []).map((img, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={img} className="w-full h-full object-cover rounded-md" />
                                        <button type="button" onClick={() => setProduct(p => ({...p, images: p.images?.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><TrashIcon className="w-3 h-3"/></button>
                                    </div>
                                ))}
                                {(!product.images || product.images.length < 8) && (
                                     <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-admin-accent cursor-pointer">
                                        <PlusCircleIcon className="w-6 h-6"/>
                                        <span className="text-xs mt-1">Add Image</span>
                                        <input type="file" className="sr-only" multiple onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'gallery')} />
                                    </label>
                                )}
                            </div>
                             <div className="flex items-center gap-2 mt-2">
                                 <button type="button" onClick={() => handleOpenMediaModal('gallery')} className="text-xs py-1 px-3 border rounded-md">Choose from Library</button>
                             </div>
                             <div className="mt-3">
                                <InputField
                                    as="textarea"
                                    rows={3}
                                    label=""
                                    name="galleryUrlInput"
                                    value={galleryUrlInput}
                                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                                    placeholder="Or paste multiple image URLs, one per line."
                                />
                                <button type="button" onClick={addGalleryUrls} className="text-xs py-1 px-3 border rounded-md mt-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    Add URLs
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <Accordion identifier="variants" title="Variants">
                        <div className="flex justify-end mb-4">
                            <button type="button" onClick={() => setIsVariantModalOpen(true)} className="text-sm font-semibold text-admin-accent hover:underline">Generate Variants</button>
                        </div>
                        {variants.length > 0 ? (
                            <div className="overflow-x-auto">
                               <table className="min-w-full text-sm">
                                   <thead>
                                       <tr className="border-b">
                                           {Object.keys(variants[0].attributes).map(attr => <th key={attr} className="py-2 px-2 text-left font-medium">{attr}</th>)}
                                           <th className="py-2 px-2 text-left font-medium">Price</th>
                                           <th className="py-2 px-2 text-left font-medium">Stock</th>
                                           <th className="py-2 px-2 text-left font-medium">SKU</th>
                                           <th className="py-2 px-2 text-left font-medium">Image</th>
                                           <th></th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                    {variants.map((v, i) => (
                                        <tr key={i} className="border-b last:border-b-0">
                                            {Object.entries(v.attributes).map(([key, val]) => <td key={key} className="py-2 px-2">{val}</td>)}
                                            <td className="py-2 px-2"><InputField name="price" type="number" label="" value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} className="w-24"/></td>
                                            <td className="py-2 px-2"><InputField name="stock" type="number" label="" value={v.stockQuantity} onChange={e => handleVariantChange(i, 'stockQuantity', e.target.value)} className="w-20"/></td>
                                            <td className="py-2 px-2"><InputField name="sku" label="" value={v.sku} onChange={e => handleVariantChange(i, 'sku', e.target.value)} className="w-28"/></td>
                                            <td className="py-2 px-2"><button type="button" onClick={() => handleOpenMediaModal('variant', i)} className="text-xs underline">{v.imageUrl ? 'Change' : 'Set'}</button></td>
                                            <td className="py-2 px-2"><button type="button" onClick={() => removeVariant(i)}><TrashIcon className="w-4 h-4 text-red-500"/></button></td>
                                        </tr>
                                    ))}
                                   </tbody>
                               </table>
                            </div>
                        ) : <p className="text-xs text-center text-gray-500 py-4">No variants defined. Add base inventory info or generate variants.</p>}
                    </Accordion>

                    <Accordion identifier="advanced-details" title="Additional Details">
                        <div className="space-y-4">
                            <InputField label="Long Description (HTML Supported)" as="textarea" rows={10} name="longDescriptionHtml" value={product.longDescriptionHtml || ''} onChange={handleInputChange} />
                            <div>
                                <h4 className="text-sm font-medium mb-2">Specifications</h4>
                                {product.specifications?.map((spec, i) => (
                                    <div key={i} className="flex gap-2 items-center mb-2">
                                        <InputField label="" name="key" value={spec.key} onChange={e => handleSpecsChange(i, 'key', e.target.value)} placeholder="e.g., Fabric"/>
                                        <InputField label="" name="value" value={spec.value} onChange={e => handleSpecsChange(i, 'value', e.target.value)} placeholder="e.g., Cotton"/>
                                        <button type="button" onClick={() => removeSpecField(i)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                                    </div>
                                ))}
                                <button type="button" onClick={addSpecField} className="text-xs text-admin-accent hover:underline">+ Add Specification</button>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">Product FAQs</h4>
                                {product.faqs?.map((faq, i) => (
                                     <div key={i} className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <InputField label="" name="question" value={faq.question} onChange={e => handleFaqChange(i, 'question', e.target.value)} placeholder="Question"/>
                                            <button type="button" onClick={() => removeFaqField(i)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                                        </div>
                                        <InputField label="" as="textarea" name="answer" value={faq.answer} onChange={e => handleFaqChange(i, 'answer', e.target.value)} placeholder="Answer" rows={2}/>
                                    </div>
                                ))}
                                <button type="button" onClick={addFaqField} className="text-xs text-admin-accent hover:underline">+ Add FAQ</button>
                            </div>
                        </div>
                    </Accordion>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
                        <InputField as="select" label="Product Status" name="publishStatus" value={product.publishStatus || 'Published'} onChange={handleInputChange}>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Hidden">Hidden</option>
                        </InputField>
                    </div>

                    <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
                        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">Organization</h3>
                        <div className="space-y-4">
                            <InputField as="select" label="Category" name="category" value={product.category || ''} onChange={handleCategoryChange} required>
                                <option value="">Select a Category</option>
                                {renderCategoryOptions(categories)}
                            </InputField>
                            <InputField as="select" label="Sub-category" name="subCategory" value={product.subCategory || ''} onChange={handleInputChange} disabled={availableSubCategories.length === 0}>
                                <option value="">Select a sub-category</option>
                                {availableSubCategories.map(sc => <option key={sc.id} value={sc.name}>{sc.name}</option>)}
                            </InputField>
                           <TagInput label="Tags" tags={product.tags || []} setTags={(tags) => setProduct(p => ({...p, tags}))} placeholder="Add tags..."/>
                        </div>
                    </div>

                    <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
                        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">Inventory & Pricing</h3>
                        <div className="space-y-4">
                            <InputField label="Base SKU" name="sku" value={product.sku || ''} onChange={handleInputChange} required error={skuError}/>
                            {variants.length === 0 && (
                                <InputField label="Selling Price (₹)" name="price" type="number" value={product.price ?? ''} onChange={handleInputChange} required error={priceError} />
                            )}
                            <InputField label="MRP (₹)" name="mrp" type="number" value={product.mrp ?? ''} onChange={handleInputChange} required helperText="Max Retail Price. Variants inherit this if their price isn't set." />
                             <InputField label="Base Stock Quantity" name="stockQuantity" type="number" value={product.stockQuantity ?? ''} onChange={handleInputChange} required helperText="For simple products. Ignored if variants exist." />
                        </div>
                    </div>
                    
                    <Accordion identifier="seo-settings" title="SEO Settings">
                         <div className="space-y-4 p-2">
                            <InputField label="Meta Title" name="metaTitle" value={product.metaTitle || ''} onChange={handleInputChange} helperText={`${(product.metaTitle || '').length} / 60`} />
                            <InputField label="Meta Description" as="textarea" rows={4} name="metaDescription" value={product.metaDescription || ''} onChange={handleInputChange} helperText={`${(product.metaDescription || '').length} / 160`} />
                            <SeoPreview title={product.metaTitle || product.name || ''} slug={product.slug || ''} description={product.metaDescription || ''} />
                            <SeoScoreIndicator score={seoScore} />
                        </div>
                    </Accordion>
                    
                    <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
                         <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">Product Page Banner</h3>
                         <div className="space-y-4">
                            <InputField label="Banner Image URL" name="bannerImageUrl" value={product.bannerImageUrl || ''} onChange={handleInputChange} />
                            <button type="button" onClick={() => handleOpenMediaModal('banner')} className="text-xs py-1 px-3 border rounded-md">Choose from Library</button>
                            <InputField label="Banner Link URL" name="bannerLink" value={product.bannerLink || ''} onChange={handleInputChange} />
                         </div>
                    </div>
                </div>

                 <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 dark:bg-admin-dark-card/80 backdrop-blur-sm p-4 border-t border-gray-200 dark:border-gray-700 shadow-top-strong flex justify-end items-center gap-4 z-40">
                    <button type="button" onClick={onCancel} className="text-sm font-semibold text-admin-text dark:text-admin-dark-text hover:underline">Cancel</button>
                    <button type="submit" className="bg-admin-accent text-white font-semibold py-2 px-6 rounded-lg hover:bg-admin-accent-hover transition">
                       {isEditing ? 'Save Changes' : 'Publish Product'}
                    </button>
                </div>
            </form>

            <CreateVariantModal 
                isOpen={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                onGenerate={handleGenerateVariants}
                baseSku={product.sku}
                basePrice={product.price}
                attributes={variantAttributes}
            />
            <MediaManagerModal 
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                mediaLibrary={mediaLibrary}
                onSelect={handleSelectFromMedia}
                onUpload={onUploadMedia}
                filter="image"
                allowMultiple={mediaModalTarget === 'gallery'}
            />
        </div>
    );
};

export default AdminAddProductSection;