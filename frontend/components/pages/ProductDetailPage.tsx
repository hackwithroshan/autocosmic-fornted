




import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, Testimonial, NavLinkItem, PageName, ProductVariant, SiteSettingsBundle } from '../../types';
import RatingStars from '../RatingStars';
import TrustBadge from '../shared/TrustBadge';
import FacebookIcon from '../icons/FacebookIcon';
import InstagramIcon from '../icons/InstagramIcon';
import TwitterIcon from '../icons/TwitterIcon';
import ShieldIcon from '../icons/ShieldIcon'; 
import TruckIcon from '../icons/TruckIcon'; 
import ExchangeIcon from '../icons/ExchangeIcon'; 
import MiniProductCarousel from '../MiniProductCarousel';
import RecentlyViewedProducts from '../RecentlyViewedProducts';
import InputField from '../shared/InputField'; 
import QuoteIcon from '../icons/QuoteIcon'; 
import StarIcon from '../icons/StarIcon'; 
import FloatingAddToCartBar from '../FloatingAddToCartBar';
import Modal from '../shared/Modal'; 
import ChevronRightIcon from '../icons/ChevronRightIcon'; 
import Accordion from '../shared/Accordion';
import HeartIcon from '../icons/HeartIcon';
import ScaleIcon from '../icons/ScaleIcon';
import { sanitizeHTML } from '../utils/sanitizer';

declare global {
  interface Window {
    Razorpay: any; 
  }
}

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number, selectedVariant: ProductVariant) => void;
  onNavigateToPage: (page: PageName, data?: any) => void; 
  onProductQuickView: (product: Product) => void; 
  onProductQuickShop: (product: Product) => void; 
  isLoggedIn: boolean;
  onDirectBuyNow: (product: Product, quantity: number, selectedVariant: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  isProductInWishlist: (productId: string) => boolean;
  recentlyViewedProducts: Product[];
  siteSettings: SiteSettingsBundle & { [key: string]: any }; // Allow dynamic properties
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product,
  allProducts,
  onAddToCart, 
  onNavigateToPage,
  onProductQuickView,
  onProductQuickShop,
  isLoggedIn,
  onDirectBuyNow,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
  isProductInWishlist,
  recentlyViewedProducts,
  siteSettings,
}) => {
  const isSimpleProduct = useMemo(() => {
    return !product.variants || product.variants.length === 0 || 
           (product.variants.length === 1 && Object.keys(product.variants[0].attributes).length === 0);
  }, [product.variants]);
  
  const attributeKeys = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return { colorKey: undefined, sizeKey: undefined };
    }
    const keys = new Set<string>();
    product.variants.forEach(v => Object.keys(v.attributes).forEach(k => keys.add(k)));
    const keyArray = Array.from(keys);
    return {
      colorKey: keyArray.find(k => k.toLowerCase() === 'color'),
      sizeKey: keyArray.find(k => k.toLowerCase() === 'size'),
    }
  }, [product.variants]);

  const { colorKey, sizeKey } = attributeKeys;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageUrl, setActiveImageUrl] = useState<string>(product.imageUrl || '');
  const [isSizeGuideModalOpen, setIsSizeGuideModalOpen] = useState(false); 
  const mainProductActionsRef = useRef<HTMLDivElement>(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  const availableColors = useMemo(() => {
    if (!colorKey || !product.variants) return [];
    return [...new Set(product.variants.map(v => v.attributes[colorKey!]).filter(Boolean))];
  }, [product.variants, colorKey]);

  const availableSizesForColor = useMemo(() => {
    if (!sizeKey || !product.variants) return [];
    let variantsToConsider = product.variants;
    if (colorKey && selectedColor) {
      variantsToConsider = product.variants.filter(v => v.attributes[colorKey!] === selectedColor);
    }
    return [...new Set(variantsToConsider.map(v => v.attributes[sizeKey!]).filter(Boolean))];
  }, [product.variants, selectedColor, colorKey, sizeKey]);

  useEffect(() => {
    const defaultVariant = product.variants?.[0];
    if (isSimpleProduct) {
      setActiveImageUrl(defaultVariant?.imageUrl || product.imageUrl || '');
      setSelectedColor(undefined);
      setSelectedSize(undefined);
    } else {
      let initialColor: string | undefined;
      if (colorKey) initialColor = availableColors[0];
      
      let initialSize: string | undefined;
      if (sizeKey) {
        if (initialColor && colorKey) {
          const sizesForInitialColor = [...new Set(product.variants!.filter(v => v.attributes[colorKey] === initialColor).map(v => v.attributes[sizeKey!]).filter(Boolean))];
          initialSize = sizesForInitialColor[0];
        } else {
          initialSize = [...new Set(product.variants!.map(v => v.attributes[sizeKey!]).filter(Boolean))][0];
        }
      }
      setSelectedColor(initialColor);
      setSelectedSize(initialSize);
    }
  }, [product, isSimpleProduct, availableColors, colorKey, sizeKey]);
  
  const currentVariant = useMemo(() => {
    if (isSimpleProduct) return product.variants?.[0];
    if (!product.variants) return undefined;

    return product.variants.find(v => {
        let isMatch = true;
        if (colorKey && selectedColor) isMatch = isMatch && v.attributes[colorKey] === selectedColor;
        if (sizeKey && selectedSize) isMatch = isMatch && v.attributes[sizeKey] === selectedSize;
        return isMatch;
    });
  }, [product, isSimpleProduct, selectedColor, selectedSize, colorKey, sizeKey]);
  
  useEffect(() => {
    if (currentVariant?.imageUrl) {
        setActiveImageUrl(currentVariant.imageUrl);
    } else if (product.imageUrl) {
        setActiveImageUrl(product.imageUrl);
    }
  }, [currentVariant, product.imageUrl]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBar(!entry.isIntersecting),
      { rootMargin: "0px 0px -100% 0px" }
    );
    const target = mainProductActionsRef.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target) };
  }, []);

  const priceToShow = currentVariant?.price ?? product.price;
  const stockQuantity = currentVariant?.stockQuantity ?? product.stockQuantity;
  const isOutOfStock = stockQuantity === 0;
  const isAddToCartDisabled = !isSimpleProduct && !currentVariant || isOutOfStock;

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10);

  const galleryImages = [product.imageUrl, ...(product.images || [])].filter(Boolean) as string[];

  const handleAddToCart = () => {
    if (isAddToCartDisabled) return;
    onAddToCart(product, quantity, currentVariant!);
  };
  
  const handleBuyNow = () => {
    if(isAddToCartDisabled) return;
    onDirectBuyNow(product, quantity, currentVariant!);
  }

  return (
    <div className="bg-zaina-neutral-light dark:bg-dark-zaina-bg-card font-body-jost min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={() => onNavigateToPage('home')} className="hover:underline">Home</button>
              <ChevronRightIcon className="w-4 h-4 mx-1" />
            </li>
            <li className="flex items-center">
              <button onClick={() => onNavigateToPage('shop')} className="hover:underline">Shop</button>
               <ChevronRightIcon className="w-4 h-4 mx-1" />
            </li>
            <li className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-zaina-white dark:bg-dark-zaina-neutral-medium rounded-lg shadow-lg overflow-hidden sticky top-28">
              <img src={activeImageUrl} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 ease-in-out"/>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {galleryImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImageUrl(img)} className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${activeImageUrl === img ? 'border-zaina-primary' : 'border-transparent hover:border-zaina-primary/50'}`}>
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-5">
            <h1 className="text-3xl md:text-4xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary">{product.name}</h1>
            {product.rating && <div className="flex items-center gap-2"><RatingStars rating={product.rating} /><span className="text-sm">({(product.reviews || []).length} reviews)</span></div>}
            
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-zaina-gold">₹{priceToShow.toFixed(2)}</p>
              {product.mrp > priceToShow && <p className="text-lg text-zaina-text-secondary line-through">₹{product.mrp.toFixed(2)}</p>}
            </div>

            <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary leading-relaxed">{product.description}</p>
            
            {colorKey && availableColors.length > 0 && (
              <div>
                <span className="text-sm font-semibold">Color: <span className="font-normal">{selectedColor}</span></span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableColors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor === color ? 'border-zaina-primary' : 'border-zaina-neutral-medium'}`} style={{ backgroundColor: color.toLowerCase() }} aria-label={`Select color ${color}`} />
                  ))}
                </div>
              </div>
            )}

            {sizeKey && availableSizesForColor.length > 0 && (
                <div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold">Size: <span className="font-normal">{selectedSize}</span></span>
                        <button onClick={() => setIsSizeGuideModalOpen(true)} className="text-zaina-primary hover:underline">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {availableSizesForColor.map(size => (
                            <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 text-sm font-medium rounded-md border-2 transition-colors ${selectedSize === size ? 'bg-zaina-primary border-zaina-primary text-white' : 'border-zaina-neutral-medium bg-white hover:border-zaina-primary'}`}>{size}</button>
                        ))}
                    </div>
                </div>
            )}

            <div ref={mainProductActionsRef} className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zaina-neutral-medium rounded-md">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3">-</button>
                  <span className="px-4">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={isAddToCartDisabled} className="w-full bg-zaina-gold text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              <button onClick={handleBuyNow} disabled={isAddToCartDisabled} className="w-full bg-zaina-cta-blue text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                Buy Now
              </button>
              <div className="flex items-center justify-center gap-6 text-sm">
                  <button onClick={() => onToggleWishlist(product)} className={`flex items-center gap-1.5 ${isWishlisted ? 'text-zaina-primary' : ''}`}><HeartIcon className="w-4 h-4" isFilled={isWishlisted}/> Add to Wishlist</button>
                  <button onClick={() => onToggleCompare(product)} className={`flex items-center gap-1.5 ${isCompared ? 'text-zaina-primary' : ''}`}><ScaleIcon className="w-4 h-4"/> Add to Compare</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <TrustBadge Icon={TruckIcon} text={siteSettings.deliveryReturnsHtml?.split('\n')[0] || "Free Shipping"} />
              <TrustBadge Icon={ExchangeIcon} text={siteSettings.productDeclarationHtml?.split('\n')[0] || "Easy Returns"} />
              <TrustBadge Icon={ShieldIcon} text={siteSettings.helpContactHtml?.split('\n')[0] || "Secure Checkout"} />
            </div>

          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 md:mt-16">
            <Accordion identifier="description" title="Description" defaultOpen>
                {product.longDescriptionHtml ? <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(product.longDescriptionHtml) }} /> : <p>No detailed description available.</p>}
            </Accordion>
            {product.specifications && product.specifications.length > 0 && (
                <Accordion identifier="specs" title="Specifications">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {product.specifications.map(spec => (<React.Fragment key={spec.key}><dt className="font-semibold">{spec.key}</dt><dd>{spec.value}</dd></React.Fragment>))}
                    </dl>
                </Accordion>
            )}
            {product.reviews && product.reviews.length > 0 && (
                <Accordion identifier="reviews" title={`Reviews (${product.reviews.length})`}>
                    <div className="space-y-4">
                        {product.reviews.map(review => (
                            <div key={review.id} className="border-b pb-2 last:border-b-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{review.user.name}</span>
                                    <RatingStars rating={review.rating} starSize="h-4 w-4" />
                                </div>
                                <p className="text-sm italic mt-1">"{review.comment}"</p>
                                <p className="text-xs text-gray-500 text-right">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </Accordion>
            )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <MiniProductCarousel title="Related Products" products={relatedProducts} onProductQuickView={onProductQuickView} onProductQuickShop={onProductQuickShop} onProductCardClick={p => onNavigateToPage('productDetail', p)} onToggleWishlist={onToggleWishlist} isProductInWishlist={isProductInWishlist} />
          </div>
        )}

      </div>
       <FloatingAddToCartBar 
         isVisible={showFloatingBar}
         product={product}
         selectedSize={selectedSize}
         quantity={quantity}
         onQuantityChange={setQuantity}
         onAddToCart={handleAddToCart}
         onClose={() => setShowFloatingBar(false)}
         availableSizes={availableSizesForColor}
         onSizeSelect={setSelectedSize}
         isAddToCartDisabled={isAddToCartDisabled}
      />
      <Modal isOpen={isSizeGuideModalOpen} onClose={() => setIsSizeGuideModalOpen(false)} title="Size Guide">
        {siteSettings.sizeGuideHtml ? <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(siteSettings.sizeGuideHtml) }} /> : <p>Size guide content not available.</p>}
      </Modal>
    </div>
  );
};