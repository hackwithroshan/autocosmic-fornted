

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { CartItem, CartItemForCheckout, Product, Order, Address, PageName, OrderItem, ProductVariant, Coupon, UserProfile, PaymentGateway, CheckoutStep } from '../../types';
import { DEFAULT_USER_ID, API_BASE_URL } from '../../constants';
import InputField from '../shared/InputField';
import Accordion from '../shared/Accordion'; 
import OrderSuccessModal from '../OrderSuccessModal'; 
import PhonePeIcon from '../icons/PhonePeIcon';
import CashIcon from '../icons/CashIcon';
import CreditCardIcon from '../icons/CreditCardIcon';


declare global {
  interface Window {
    Razorpay: any; 
  }
}

type PaymentMethodValue = 'razorpay' | 'cod' | 'phonepe';

interface MappedPaymentGateway {
    id: string;
    name: string;
    value: PaymentMethodValue;
    enabled: boolean;
}


interface CheckoutPageProps {
  cartItems: CartItem[]; 
  buyNowItem: CartItemForCheckout | null; 
  navigateToPage: (page: PageName, data?: any) => void;
  onPlaceOrder: (order: Omit<Order, 'id'>, guestDetails?: { email: string, createAccount: boolean, password?: string }, paymentDetails?: any) => Promise<{success: boolean; error?: string; orderId?: string}>;
  products: Product[];
  currentUser: UserProfile | null;
  paymentGateways: PaymentGateway[];
}

const SHIPPING_SETTINGS = {
    STANDARD_COST: 100,
    FAST_DELIVERY_COST: 99,
    FREE_SHIPPING_THRESHOLD: 2000 
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, buyNowItem, navigateToPage, onPlaceOrder, products, currentUser, paymentGateways }) => {
  const [activeStep, setActiveStep] = useState<CheckoutStep>('shipping');
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set());
  const [shippingData, setShippingData] = useState<Address>({
    id: 'temp',
    userId: currentUser?.id || DEFAULT_USER_ID,
    type: 'shipping',
    fullName: currentUser?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: currentUser?.phone || '',
  });
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'fast'>('standard'); 
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);


  const { itemsForSummary, subtotal } = React.useMemo(() => {
    const summaryItems: (Product & { quantity: number; selectedVariant: ProductVariant })[] = [];
    let summarySubtotal = 0;

    if (buyNowItem) {
        const productDetails = products.find(p => p.id === buyNowItem.productId);
        if (productDetails) {
            summaryItems.push({
                ...productDetails,
                quantity: buyNowItem.quantity,
                selectedVariant: buyNowItem.variant
            });
            summarySubtotal = buyNowItem.variant.price * buyNowItem.quantity;
        }
    } else {
        cartItems.forEach(item => {
            summaryItems.push(item);
            summarySubtotal += item.selectedVariant.price * item.quantity;
        });
    }
    return { itemsForSummary: summaryItems, subtotal: summarySubtotal };
  }, [cartItems, buyNowItem, products]);
  
  
  let deliveryCharge = 0;
  if (deliveryOption === 'fast') {
      deliveryCharge = SHIPPING_SETTINGS.FAST_DELIVERY_COST;
  }
  
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.value / 100);
    }
    if (appliedCoupon.type === 'fixed_amount') {
      return appliedCoupon.value;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = subtotal - discountAmount + deliveryCharge;

  const enabledPaymentGateways = useMemo<MappedPaymentGateway[]>(() => {
    const gateways: MappedPaymentGateway[] = [];
    if (!paymentGateways) return gateways;

    paymentGateways.forEach(gateway => {
        if (!gateway.enabled) return;

        let value: PaymentMethodValue | null = null;
        if (gateway.name.toLowerCase().includes('razorpay')) value = 'razorpay';
        else if (gateway.name.toLowerCase().includes('cash on delivery')) value = 'cod';
        else if (gateway.name.toLowerCase().includes('phonepe')) value = 'phonepe';
        
        if (value) {
            gateways.push({ id: gateway.id, name: gateway.name, value, enabled: gateway.enabled });
        }
    });
    return gateways;
  }, [paymentGateways]);

  useEffect(() => {
    // Set the first available online payment method as default, or COD if none are online
    const firstOnline = enabledPaymentGateways.find(g => g.value !== 'cod');
    const codAvailable = enabledPaymentGateways.find(g => g.value === 'cod');

    if (firstOnline) {
        setSelectedGatewayId(firstOnline.id);
    } else if (codAvailable) {
        setSelectedGatewayId(codAvailable.id);
    } else {
        setSelectedGatewayId(null);
    }
  }, [enabledPaymentGateways]);


  const handleApplyCoupon = async () => {
    setCouponMessage(null);
    setAppliedCoupon(null);
    try {
        const token = localStorage.getItem('zaina-authToken');
        const response = await axios.post(`${API_BASE_URL}/user/coupons/validate`, 
        { code: couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppliedCoupon(response.data.coupon);
        setCouponMessage({ type: 'success', text: 'Coupon applied successfully!' });
    } catch(err: any) {
        setCouponMessage({ type: 'error', text: err.response?.data?.message || 'Invalid coupon.' });
    }
  };

  const isStepAccessible = (stepId: CheckoutStep): boolean => {
    const stepOrder: CheckoutStep[] = ['shipping', 'delivery', 'payment'];
    const stepIndex = stepOrder.indexOf(stepId);
    if (stepIndex === 0) return true;
    const previousStep = stepOrder[stepIndex - 1];
    return completedSteps.has(previousStep);
  };

  const handleStepChange = (newStep: CheckoutStep) => {
    if (!isStepAccessible(newStep)) return; 
    const stepOrder: CheckoutStep[] = ['shipping', 'delivery', 'payment'];
    const newStepIndex = stepOrder.indexOf(newStep);
    setCompletedSteps(prev => {
        const newCompleted = new Set(prev);
        stepOrder.forEach((step, index) => {
            if (index >= newStepIndex) { newCompleted.delete(step); }
        });
        return newCompleted;
    });
    setActiveStep(newStep);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSuccessfulPayment = async (razorpayResponse?: any) => {
    setCheckoutError(null);
    const guestDetails = !currentUser ? { email: guestEmail, createAccount: false, password: '' } : undefined;
    
    const selectedGateway = enabledPaymentGateways.find(g => g.id === selectedGatewayId);
    const paymentTypeForOrder = selectedGateway?.value || 'card';

    const newOrder: Omit<Order, 'id'> = {
        userId: currentUser?.id || 'guest',
        orderDate: new Date().toISOString(),
        customerName: shippingData.fullName,
        items: itemsForSummary.map(item => ({
            id: `temp-orderitem-${item.id}-${item.selectedVariant.id}`,
            quantity: item.quantity,
            priceAtPurchase: item.selectedVariant.price,
            product: { ...item, variants: undefined, reviews: undefined }, // Nest the product data, remove heavy fields
            variant: item.selectedVariant,
        })),
        totalAmount: total,
        status: 'Processing',
        shippingAddress: { ...shippingData, id: 'addr1'},
        paymentType: paymentTypeForOrder,
        deliveryType: deliveryOption,
        deliveryCharge: deliveryCharge,
        appliedCouponCode: appliedCoupon?.code,
        discountAmount: discountAmount,
        paymentStatus: paymentTypeForOrder === 'cod' ? 'Pending' : 'Success',
    };
    
    const result = await onPlaceOrder(newOrder, guestDetails, razorpayResponse);

    if (result.success) {
        setShowSuccessModal(true);
    } else {
        setCheckoutError(result.error || "An unknown error occurred.");
        setActiveStep('payment');
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setCheckoutError(null);

    if (total < 1) {
        setCheckoutError("The total amount must be at least ₹1.00 to proceed with payment.");
        setIsProcessing(false);
        return;
    }

    if (!selectedGatewayId) {
        setCheckoutError("Please select a payment method.");
        setIsProcessing(false);
        return;
    }
    try {
        const token = localStorage.getItem('zaina-authToken');
        const { data: { orderId, keyId } } = await axios.post(`${API_BASE_URL}/orders/payment/create`, 
            { totalAmount: total, gatewayId: selectedGatewayId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!keyId) {
            throw new Error("Razorpay Key ID not received from server. The administrator may need to configure it.");
        }

        const options = {
            key: keyId,
            amount: Math.round(total * 100),
            currency: "INR",
            name: "ZAINA COLLECTION",
            description: "E-commerce Transaction",
            order_id: orderId,
            handler: (response: any) => {
                handleSuccessfulPayment(response);
            },
            prefill: {
                name: shippingData.fullName,
                email: currentUser?.email || guestEmail,
                contact: shippingData.phone,
            },
            notes: {
                address: `${shippingData.addressLine1}, ${shippingData.city}`
            },
            theme: {
                color: "#4A90E2"
            },
            modal: { 
                ondismiss: () => {
                    setCheckoutError('Payment was cancelled.');
                    setIsProcessing(false);
                } 
            }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response: any){
            console.error(response);
            setCheckoutError(`Payment Failed: ${response.error.description} (Code: ${response.error.code})`);
            setIsProcessing(false);
        });

        rzp.open();
    } catch (err: any) {
        console.error("Razorpay initiation error:", err);
        const errorMessage = err.response?.data?.message || 'Error in opening checkout. Please try again or contact support.';
        setCheckoutError(errorMessage);
        setIsProcessing(false);
    }
  };


  const processOrderPlacement = () => {
    setIsProcessing(true);
    const selectedGateway = enabledPaymentGateways.find(g => g.id === selectedGatewayId);

    if (selectedGateway?.value === 'cod') {
      handleSuccessfulPayment().finally(() => setIsProcessing(false));
    } else if (selectedGateway?.value === 'razorpay' || selectedGateway?.value === 'phonepe') {
        handleRazorpayPayment();
    } else {
        setCheckoutError("No valid payment method selected.");
        setIsProcessing(false);
    }
  };


  const handleSubmitStep = (step: CheckoutStep) => {
    if (step === 'shipping') {
        if(!shippingData.fullName || !shippingData.addressLine1 || !shippingData.city || !shippingData.postalCode || !shippingData.phone || !shippingData.state) {
            alert("Please fill all shipping details.");
            return;
        }
      setCompletedSteps(prev => new Set(prev).add('shipping'));
      setActiveStep('delivery');
    } else if (step === 'delivery') {
      setCompletedSteps(prev => new Set(prev).add('delivery'));
      setActiveStep('payment');
    } else if (step === 'payment') {
      processOrderPlacement();
    }
  };
  
  const renderStepContent = (currentStep: CheckoutStep) => {
    switch (currentStep) {
      case 'shipping':
        return (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitStep('shipping'); }} className="space-y-4">
            <InputField label="Full Name" name="fullName" value={shippingData.fullName} onChange={handleInputChange} required />
            {!currentUser && (
                <InputField label="Email Address" name="email" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required />
            )}
            <InputField label="Address Line 1" name="addressLine1" value={shippingData.addressLine1} onChange={handleInputChange} required />
            <InputField label="Address Line 2 (Optional)" name="addressLine2" value={shippingData.addressLine2 || ''} onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="City" name="city" value={shippingData.city} onChange={handleInputChange} required />
                <InputField label="State" name="state" value={shippingData.state} onChange={handleInputChange} required />
            </div>
            <InputField label="Postal Code" name="postalCode" value={shippingData.postalCode} onChange={handleInputChange} required />
            <InputField label="Country" name="country" value={shippingData.country} onChange={handleInputChange} disabled />
            <InputField label="Phone Number" name="phone" type="tel" value={shippingData.phone || ''} onChange={handleInputChange} required />
            <button type="submit" className="w-full bg-zaina-primary dark:bg-dark-zaina-primary text-zaina-white dark:text-dark-zaina-text-primary font-semibold py-3 rounded-md hover:opacity-90">
              Continue to Delivery
            </button>
          </form>
        );
      case 'delivery':
        return (
          <div>
            <button onClick={() => handleSubmitStep('delivery')} className="w-full bg-zaina-primary dark:bg-dark-zaina-primary text-zaina-white dark:text-dark-zaina-text-primary font-semibold py-3 rounded-md hover:opacity-90 mt-4">
              Continue to Payment
            </button>
          </div>
        );
      case 'payment':
        const selectedGateway = enabledPaymentGateways.find(g => g.id === selectedGatewayId);
        const isPlaceOrderDisabled = isProcessing || !selectedGatewayId;
        const onlinePaymentGateways = enabledPaymentGateways.filter(g => g.value !== 'cod');
        const codGateway = enabledPaymentGateways.find(g => g.value === 'cod');

        const paymentIcons: Record<PaymentMethodValue, React.FC<{className?: string}>> = {
            razorpay: CreditCardIcon,
            cod: CashIcon,
            phonepe: PhonePeIcon,
        };

        return (
            <div className="space-y-4">
                {onlinePaymentGateways.length === 0 && !codGateway && (
                    <p className="text-center text-sm text-red-500 bg-red-50 p-3 rounded-md">
                        No payment methods have been configured by the administrator. Please contact support.
                    </p>
                )}
                
                {onlinePaymentGateways.map((gateway) => {
                    const Icon = paymentIcons[gateway.value];
                    return (
                        <div key={gateway.id} className={`p-3 border rounded-lg bg-white dark:bg-dark-zaina-bg-card transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-zaina-primary dark:has-[:checked]:bg-dark-zaina-sky-blue-light/30`}>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={gateway.id}
                                    checked={selectedGatewayId === gateway.id}
                                    onChange={(e) => {
                                        setSelectedGatewayId(e.target.value);
                                        setCheckoutError(null);
                                    }}
                                    className="h-4 w-4 text-zaina-primary focus:ring-zaina-primary"
                                />
                                {Icon && <Icon className="w-8 h-8 mx-3" />}
                                <span className="font-medium text-sm text-zaina-text-primary dark:text-dark-zaina-text-primary">{gateway.name}</span>
                            </label>
                        </div>
                    );
                 })}

                 {codGateway && (
                    <div className={`p-3 border rounded-lg bg-white dark:bg-dark-zaina-bg-card transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-zaina-primary dark:has-[:checked]:bg-dark-zaina-sky-blue-light/30`}>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={codGateway.id}
                                checked={selectedGatewayId === codGateway.id}
                                onChange={(e) => {
                                    setSelectedGatewayId(e.target.value);
                                    setCheckoutError(null);
                                }}
                                className="h-4 w-4 text-zaina-primary focus:ring-zaina-primary"
                            />
                            <CashIcon className="w-8 h-8 mx-3 text-green-600" />
                            <span className="font-medium text-sm text-zaina-text-primary dark:text-dark-zaina-text-primary">{codGateway.name}</span>
                        </label>
                         {selectedGatewayId === codGateway.id && (
                            <div className="text-xs text-zaina-text-secondary dark:text-dark-zaina-text-secondary p-2 mt-2 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-medium rounded">You will pay in cash upon delivery.</div>
                         )}
                    </div>
                 )}
                 {checkoutError && (
                    <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        <strong>Payment Error:</strong> {checkoutError}
                    </div>
                 )}
                 <button 
                    onClick={() => handleSubmitStep('payment')} 
                    disabled={isPlaceOrderDisabled}
                    className="w-full bg-zaina-gold text-zaina-white dark:text-dark-zaina-text-primary font-semibold py-3 rounded-md mt-4 disabled:opacity-50"
                 >
                     {isPlaceOrderDisabled ? 'Select a Payment Method' : (isProcessing ? 'Processing...' : (selectedGateway?.value === 'cod' ? `Place Order (COD)` : `Pay ₹${total.toFixed(2)}`))}
                 </button>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light min-h-screen py-8 md:py-12 font-body-jost">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary">Checkout</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-6">
            {!currentUser && (
              <div className="p-4 border border-zaina-primary/30 rounded-lg bg-zaina-primary/5">
                <p className="text-sm text-center">
                  <span className="font-semibold">Returning customer?</span>{' '}
                  <button onClick={() => navigateToPage('auth')} className="text-zaina-primary hover:underline font-bold">
                    Sign In
                  </button>
                </p>
              </div>
            )}
            <Accordion identifier="shipping-step" title={<span className={activeStep === 'shipping' ? 'font-bold' : ''}>1. Shipping Information</span>} defaultOpen={activeStep === 'shipping'} onToggle={() => handleStepChange('shipping')}>
                {renderStepContent('shipping')}
            </Accordion>
             <Accordion identifier="delivery-step" title={<span className={activeStep === 'delivery' ? 'font-bold' : ''}>2. Delivery Method</span>} defaultOpen={activeStep === 'delivery'} disabled={!completedSteps.has('shipping')} onToggle={() => handleStepChange('delivery')}>
                {renderStepContent('delivery')}
            </Accordion>
            <Accordion identifier="payment-step" title={<span className={activeStep === 'payment' ? 'font-bold' : ''}>3. Payment Method</span>} defaultOpen={activeStep === 'payment'} disabled={!completedSteps.has('delivery')} onToggle={() => handleStepChange('payment')}>
                {renderStepContent('payment')}
            </Accordion>
          </div>
          
          <div className="lg:col-span-1 bg-zaina-white dark:bg-dark-zaina-bg-card p-6 rounded-lg shadow-xl h-fit lg:sticky lg:top-28">
            <h2 className="text-2xl font-heading-cormorant font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {itemsForSummary.map(item => (
                     <div key={item.selectedVariant.id} className="flex items-center gap-3">
                        <img src={item.selectedVariant.imageUrl || item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded-md"/>
                        <div className="flex-grow">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-zaina-text-secondary dark:text-dark-zaina-text-secondary">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">₹{(item.selectedVariant.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="py-4 border-t border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium">
                <label htmlFor="coupon" className="block text-sm font-medium text-zaina-text-primary dark:text-dark-zaina-text-primary mb-1">Coupon Code</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon"
                        className="flex-grow px-3 py-2 border rounded-md"
                    />
                    <button onClick={handleApplyCoupon} className="bg-zaina-text-secondary text-zaina-white px-4 rounded-md">Apply</button>
                </div>
                {couponMessage && <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMessage.text}</p>}
            </div>
             <div className="space-y-2 py-4 border-t border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Delivery Charge</span><span>₹{deliveryCharge.toFixed(2)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span>Total Payable</span>
                <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <OrderSuccessModal onClose={() => navigateToPage('home')} />}
    </div>
  );
};