

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLinkItem, UserProfile, Order, Address, SupportTicket, Product, PageName, PaymentMethod } from '../../types';
import { USER_DASHBOARD_NAV_LINKS } from '../../constants';
import DashboardLayout from '../dashboard/common/DashboardLayout';
import UserProfileSection from '../dashboard/user/UserProfileSection';
import UserOrdersSection from '../dashboard/user/UserOrdersSection';
import UserAddressesSection from '../dashboard/user/UserAddressesSection';
import UserWishlistSection from '../dashboard/user/UserWishlistSection';
import UserSupportSection from '../dashboard/user/UserSupportSection';
import UserRecentlyViewedSection from '../dashboard/user/UserRecentlyViewedSection';
import UserPaymentMethodsSection from '../dashboard/user/UserPaymentMethodsSection';

interface UserDashboardPageProps {
  navigateToPage: (page: PageName, data?: any) => void;
  initialSection?: string;
  onLogout: () => void;
  wishlistProducts: Product[];
  recentlyViewedProducts: Product[];
  onToggleWishlist: (product: Product) => void;
  currentUser: UserProfile | null;
  storeName: string;
  
  // Data props from App.tsx
  orders: Order[];
  addresses: Address[];
  supportTickets: SupportTicket[];
  paymentMethods: PaymentMethod[];

  // Handler props from App.tsx
  onUpdateProfile: (updatedProfile: UserProfile) => Promise<void>;
  onChangePassword: (passwords: { current: string; new: string }) => Promise<{ success: boolean; message: string }>;
  onSaveAddress: (address: Address) => void;
  onDeleteAddress: (addressId: string) => void;
  onSaveSupportTicket: (ticket: SupportTicket) => void;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ 
    navigateToPage, 
    initialSection, 
    onLogout, 
    wishlistProducts,
    recentlyViewedProducts,
    onToggleWishlist,
    currentUser, 
    storeName,
    orders,
    addresses,
    supportTickets,
    paymentMethods: initialPaymentMethods, // Rename prop to avoid conflict
    onUpdateProfile,
    onChangePassword,
    onSaveAddress,
    onDeleteAddress,
    onSaveSupportTicket,
}) => {
  const [activeTab, setActiveTab] = useState(initialSection || USER_DASHBOARD_NAV_LINKS[0].id);
  // Create local state for payment methods to make the section interactive
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);

  useEffect(() => {
    setPaymentMethods(initialPaymentMethods);
  }, [initialPaymentMethods]);

  const handleReorder = (order: Order) => {
    alert(`Reordering items from order #${order.id.slice(-6).toUpperCase()} (Simulated).`);
    navigateToPage('cart');
  };

  // --- Local Handlers for Payment Methods (UI only, no persistence) ---
  const handleSavePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prev => {
        const existing = prev.find(p => p.id === method.id);
        if (existing) {
            // Update existing method
            return prev.map(p => p.id === method.id ? method : p);
        }
        // Add new method
        return [...prev, method];
    });
    alert('Payment method saved. This change is for the current session only and will not persist.');
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
    // The alert is in the child component, which is fine.
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(p => ({
        ...p,
        isDefault: p.id === id
    })));
    alert('Default payment method updated. This change is for the current session only.');
  };
  // --- End of Local Handlers ---

  const renderActiveTabContent = () => {
    if (!currentUser) return <div className="text-center p-8">Loading your dashboard...</div>;

    switch (activeTab) {
      case 'profile':
        return <UserProfileSection user={currentUser} onSave={onUpdateProfile} onChangePassword={onChangePassword} />;
      case 'orders':
        return <UserOrdersSection orders={orders} navigateToPage={navigateToPage} onReorder={handleReorder} />;
      case 'addresses':
        return <UserAddressesSection addresses={addresses} onSave={onSaveAddress} onDelete={onDeleteAddress} userId={currentUser.id} />;
      case 'wishlist':
        return <UserWishlistSection wishlistItems={wishlistProducts} navigateToPage={navigateToPage} onToggleWishlist={onToggleWishlist} />;
      case 'support':
        return <UserSupportSection tickets={supportTickets} onSave={onSaveSupportTicket} userId={currentUser.id} />;
      case 'recentlyViewed':
        return <UserRecentlyViewedSection products={recentlyViewedProducts} navigateToPage={navigateToPage} />;
      case 'paymentMethods':
        return <UserPaymentMethodsSection 
                    paymentMethods={paymentMethods} // Pass local state
                    onSaveMethod={handleSavePaymentMethod} // Pass local handler
                    onDeleteMethod={handleDeletePaymentMethod} // Pass local handler
                    onSetDefaultMethod={handleSetDefaultPaymentMethod} // Pass local handler
                    userId={currentUser.id}
               />;
      default:
        return <UserProfileSection user={currentUser} onSave={onUpdateProfile} onChangePassword={onChangePassword} />;
    }
  };
  
  const navLinksWithAction = USER_DASHBOARD_NAV_LINKS.map(link => ({
    ...link,
    action: link.id === 'logout' ? onLogout : () => setActiveTab(link.id)
  }));

  return (
    <DashboardLayout
      sidebarType="tabs"
      navLinks={navLinksWithAction}
      activeNavLinkId={activeTab}
      onNavLinkClick={(id) => id !== 'logout' && setActiveTab(id)}
      brandName={storeName}
      headerContent={
        <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary">
                {!currentUser ? 'Welcome!' : `Welcome, ${currentUser.name.split(' ')[0]}!`}
            </h1>
        </div>
      }
    >
      <div className="font-body-inter text-zaina-text-primary dark:text-dark-zaina-text-primary">
        {renderActiveTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;
