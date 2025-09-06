

import React, { useState, useEffect } from 'react';
import { Product, NavLinkItem, Category } from '../../types';
import ProductGrid from '../ProductGrid';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  onProductQuickView: (product: Product) => void;
  onProductQuickShop: (product: Product) => void;
  onViewProductDetail: (product: Product) => void;
  initialCategory?: string;
  initialSearchTerm?: string;
  onToggleWishlist: (product: Product) => void;
  isProductInWishlist: (productId: string) => boolean;
  onToggleCompare: (product: Product) => void;
  isProductInCompare: (productId: string) => boolean;
  initialProductIds?: string[];
  pageTitle?: string;
}

const ShopPage: React.FC<ShopPageProps> = ({ 
    products,
    categories,
    onProductQuickView, 
    onProductQuickShop, 
    onViewProductDetail,
    initialCategory,
    initialSearchTerm,
    onToggleWishlist,
    isProductInWishlist,
    onToggleCompare,
    isProductInCompare,
    initialProductIds,
    pageTitle: initialPageTitle,
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'ALL');
  const [pageTitle, setPageTitle] = useState(initialPageTitle || 'Shop Our Collection');
  const [headerMessage, setHeaderMessage] = useState('Discover exquisite ethnic wear, curated for the modern woman.');

  useEffect(() => {
    if (initialSearchTerm) {
      setActiveCategory('ALL'); // When searching, we don't filter by category
      setPageTitle(`Search Results`);
      setHeaderMessage(`Showing results for "${initialSearchTerm}"`);
    } else if (initialCategory) {
      setActiveCategory(initialCategory);
      setPageTitle(initialCategory);
      setHeaderMessage(`Explore our collection of ${initialCategory}.`);
    } else if (initialPageTitle) {
      setPageTitle(initialPageTitle);
      setHeaderMessage(`Get the complete look for "${initialPageTitle}".`);
      setActiveCategory('ALL');
    } else {
      setActiveCategory('ALL');
      setPageTitle('Shop Our Collection');
      setHeaderMessage('Discover exquisite ethnic wear, curated for the modern woman.');
    }
  }, [initialCategory, initialSearchTerm, initialPageTitle]);
  
  const categoriesList = [
    { id: 'all', label: 'ALL' },
    ...categories.map(cat => ({ id: cat.id, label: cat.name.toUpperCase() }))
  ];

  
  const getFilteredProducts = () => {
    let filtered = products.filter(p => p.publishStatus === 'Published');

    // Filter by a specific list of IDs first if provided (for 'Shop by Look')
    if (initialProductIds && initialProductIds.length > 0) {
        const idSet = new Set(initialProductIds);
        return filtered.filter(p => idSet.has(p.id!));
    }

    // Then, filter by search term if it exists
    if (initialSearchTerm) {
      const term = initialSearchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(term)))
      );
      return filtered;
    }

    // If no search term, filter by category
    if (activeCategory === 'ALL') {
      return filtered;
    }
    
    // Find the category and its subcategories
    const selectedCat = categories.find(c => c.name.toUpperCase() === activeCategory);
    const validCategoryNames = selectedCat ? [selectedCat.name, ...selectedCat.subCategories.map(sc => sc.name)] : [activeCategory];

    return filtered.filter(p => 
      validCategoryNames.some(name => p.category.toLowerCase() === name.toLowerCase())
    );
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-3">
            {pageTitle}
          </h1>
          <p className="text-lg text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-body-jost">
            {headerMessage}
          </p>
        </header>

        {/* Category Tabs are hidden when searching or viewing a curated look */}
        {!initialSearchTerm && !initialProductIds && (
          <nav className="mb-8 md:mb-10 flex flex-wrap justify-center gap-2 md:gap-4 border-b border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium pb-4">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.label);
                  setPageTitle(cat.label === 'ALL' ? 'All Products' : cat.label);
                  setHeaderMessage(`Explore our collection of ${cat.label}.`);
                }}
                className={`py-2 px-4 md:py-2.5 md:px-6 rounded-md font-body-jost font-semibold text-sm md:text-base transition-all duration-300
                  ${activeCategory === cat.label
                    ? 'bg-zaina-gold text-zaina-white dark:bg-zaina-gold dark:text-dark-zaina-text-primary shadow-md'
                    : `bg-zaina-neutral-light dark:bg-dark-zaina-neutral-medium text-zaina-text-primary dark:text-dark-zaina-text-primary hover:bg-zaina-primary/10 dark:hover:bg-dark-zaina-primary/20 hover:text-zaina-primary dark:hover:text-dark-zaina-primary`}
                `}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}

        <ProductGrid
          title={initialSearchTerm || initialProductIds ? '' : (activeCategory === 'ALL' ? 'All Products' : '')}
          products={filteredProducts}
          onProductQuickView={onProductQuickView}
          onProductQuickShop={onProductQuickShop}
          onProductCardClick={onViewProductDetail}
          sectionBgColor="bg-transparent" 
          titleColor="text-zaina-text-primary dark:text-dark-zaina-text-primary"
          onToggleWishlist={onToggleWishlist}
          isProductInWishlist={isProductInWishlist}
          onToggleCompare={onToggleCompare}
          isProductInCompare={isProductInCompare}
        />
      </div>
    </div>
  );
};

export default ShopPage;
