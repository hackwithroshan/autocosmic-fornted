
import React, { useState, useEffect } from 'react';
import { CartItem, Product, ZainaColor, PageName } from '../../types';
import TrashIcon from '../icons/TrashIcon'; 
import InputField from '../shared/InputField';
import TrustBadge from '../shared/TrustBadge';
import ShieldIcon from '../icons/ShieldIcon';
import ExchangeIcon from '../icons/ExchangeIcon';
import TruckIcon from '../icons/TruckIcon';
import { PLACEHOLDER_IMAGE_URL } from '../../constants';

interface CartPageProps {
  navigateToPage: (page: PageName, data?: any) => void;
  initialCartItems: CartItem[]; 
  updateCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; 
}


const CartPage: React.FC<CartPageProps> = ({ navigateToPage, initialCartItems, updateCartItems }) => {
  const cartItems = initialCartItems; 
  const setCartItems = updateCartItems;

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (variantId: string, newQuantity: number) => {
    setCartItems(items => 
      items.map(item => item.selectedVariant.id === variantId ? { ...item, quantity: Math.max(0, newQuantity) } : item)
           .filter(item => item.quantity > 0) 
    );
  };

  const removeItem = (variantId: string) => {
    setCartItems(items => items.filter(item => item.selectedVariant.id !== variantId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  const shippingCost = subtotal > 2000 ? 0 : 100;
  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'ZAINA10') {
      setDiscount(subtotal * 0.1); 
      alert('Coupon applied successfully!');
    } else {
      setDiscount(0);
      alert('Invalid coupon code.');
    }
  };
  
  const trustBadgesData = [
    { Icon: ShieldIcon, text: "Secure Checkout", iconColor: "text-zaina-primary dark:text-dark-zaina-primary" },
    { Icon: ExchangeIcon, text: "Easy Returns Policy", iconColor: "text-zaina-primary dark:text-dark-zaina-primary" },
    { Icon: TruckIcon, text: "Free Shipping Over ₹2000", iconColor: "text-zaina-primary dark:text-dark-zaina-primary" },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light min-h-screen py-12 md:py-16 font-body-jost flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-6">Your Cart is Empty</h1>
        <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
            onClick={() => navigateToPage('shop')}
            className="bg-zaina-gold text-zaina-white dark:text-dark-zaina-text-primary font-semibold py-3 px-8 rounded-md hover:opacity-90 transition duration-300 text-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light min-h-screen py-8 md:py-12 font-body-jost">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary">Shopping Cart</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.selectedVariant.id} className="flex flex-col sm:flex-row items-center gap-4 bg-zaina-white dark:bg-dark-zaina-bg-card p-4 rounded-lg shadow-md">
                <img src={item.selectedVariant.imageUrl || item.imageUrl || PLACEHOLDER_IMAGE_URL} alt={item.name} className="w-24 h-32 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary hover:text-zaina-primary dark:hover:text-dark-zaina-primary transition-colors cursor-pointer" onClick={() => navigateToPage('productDetail', item)}>{item.name}</h2>
                  <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary capitalize">
                    {Object.entries(item.selectedVariant.attributes).map(([key, value]) => `${key}: ${value}`).join(' / ')}
                  </p>
                  <p className="text-sm text-zaina-gold dark:text-zaina-gold font-medium">₹{item.selectedVariant.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 my-2 sm:my-0">
                  <button onClick={() => updateQuantity(item.selectedVariant.id, item.quantity - 1)} className="px-2 py-0.5 border rounded-md text-zaina-primary dark:text-dark-zaina-primary hover:bg-zaina-sky-blue-light/50 dark:hover:bg-dark-zaina-sky-blue-light/30 focus:outline-none focus:ring-1 focus:ring-zaina-primary dark:focus:ring-dark-zaina-primary">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.selectedVariant.id, item.quantity + 1)} className="px-2 py-0.5 border rounded-md text-zaina-primary dark:text-dark-zaina-primary hover:bg-zaina-sky-blue-light/50 dark:hover:bg-dark-zaina-sky-blue-light/30 focus:outline-none focus:ring-1 focus:ring-zaina-primary dark:focus:ring-dark-zaina-primary">+</button>
                </div>
                <p className="font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary w-20 text-center sm:text-right">₹{(item.selectedVariant.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.selectedVariant.id)} className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary hover:text-zaina-deep-red-accent p-1" title="Remove item">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-zaina-white dark:bg-dark-zaina-bg-card p-6 rounded-lg shadow-xl h-fit lg:sticky lg:top-28">
            <h2 className="text-2xl font-heading-cormorant font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary">Discount</span>
                <span className={discount > 0 ? "text-green-600 dark:text-green-400" : ""}>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary">Shipping</span>
                <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'FREE'}</span>
              </div>
              <hr className="my-2 border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium"/>
              <div className="flex justify-between text-lg font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="coupon" className="block text-sm font-medium text-zaina-text-primary dark:text-dark-zaina-text-primary mb-1">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-grow px-3 py-2 border border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium rounded-md shadow-sm focus:ring-zaina-primary dark:focus:ring-dark-zaina-primary focus:border-zaina-primary dark:focus:border-dark-zaina-primary text-sm bg-zaina-white dark:bg-dark-zaina-neutral-medium"
                />
                <button 
                    onClick={handleApplyCoupon}
                    className="bg-zaina-text-secondary text-zaina-white dark:bg-dark-zaina-text-secondary dark:text-dark-zaina-text-primary px-4 py-2 rounded-md hover:bg-zaina-text-primary dark:hover:bg-dark-zaina-text-primary text-sm font-semibold transition"
                >Apply</button>
              </div>
            </div>

            <button 
                onClick={() => navigateToPage('checkout')}
                className="w-full bg-zaina-gold text-zaina-white dark:text-dark-zaina-text-primary font-semibold py-3 px-6 rounded-md hover:opacity-90 transition duration-300 text-lg"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-8 space-y-3">
                {trustBadgesData.map(badge => (
                     <TrustBadge key={badge.text} Icon={badge.Icon} text={badge.text} iconColor="text-zaina-primary dark:text-dark-zaina-primary" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
