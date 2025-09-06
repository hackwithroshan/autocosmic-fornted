
import React, { useState, useEffect } from 'react';
import { NavLinkItem, AdminNavLink, Product, Order, Coupon, AdminUser, CmsPage, Customer, OrderStatus, MediaFile, Testimonial, Notification, PageName, Category, VariantAttribute, HeroSlide, OccasionContent, CuratedLook, EmotionCategory, ShoppableVideo, StoreSettings, SeoSettings, ThemeSettings, FooterSettings, SiteSettingsBundle, MarketingCampaign, ProductReview, UserProfile, SupportTicket, Faq, ShippingZone, ShippingProvider, PaymentGateway, Integration, CategoryGridItem, PromoGridItem, TopCategoryItem, AuthPageSettings, TeamMember, StatItem, PricingPlan } from '../../types';
import { ADMIN_DASHBOARD_NAV_LINKS } from '../../constants';
import AdminLayout from '../admin/AdminLayout';

// Import all section components
import AdminOverviewSection from '../admin/AdminOverviewSection';
import AdminOrderManagementSection from '../admin/AdminOrderManagementSection';
import AdminProductManagementSection from '../admin/AdminProductManagementSection';
import { AdminCustomerManagementSection } from '../admin/AdminCustomerManagementSection';
import AdminInventorySection from '../admin/AdminInventorySection';
import AdminAnalyticsSection from '../admin/AdminAnalyticsSection';
import AdminCouponsSection from '../admin/AdminCouponsSection';
import AdminRolesSection from '../admin/AdminRolesSection';
import AdminSecuritySection from '../admin/AdminSecuritySection';
import AdminCategoryManagementSection from '../admin/AdminCategoryManagementSection';
import AdminStoreSettingsSection from '../admin/AdminStoreSettingsSection';
import AdminPendingOrdersSection from '../admin/AdminPendingOrdersSection';
import AdminShippedOrdersSection from '../admin/AdminShippedOrdersSection';
import AdminReturnedOrdersSection from '../admin/AdminReturnedOrdersSection';
import AdminOrderStatusTrackerSection from '../admin/AdminOrderStatusTrackerSection';
import AdminTagsSection from '../admin/AdminTagsSection';
import AdminVariantsSection from '../admin/AdminVariantsSection';
import AdminBulkUploadSection from '../admin/AdminBulkUploadSection';
import AdminCustomerGroupsSection from '../admin/AdminCustomerGroupsSection';
import AdminWishlistsSection from '../admin/AdminWishlistsSection';
import AdminFeedbackSection from '../admin/AdminFeedbackSection';
import AdminEmailCampaignsSection from '../admin/AdminEmailCampaignsSection';
import AdminPushNotificationsSection from '../admin/AdminPushNotificationsSection';
import AdminSocialAdsSection from '../admin/AdminSocialAdsSection';
import { AdminTestimonialsSection } from '../admin/AdminTestimonialsSection';
import AdminBlogSection from '../admin/AdminBlogSection';
import AdminFaqSection from '../admin/AdminFaqSection';
import AdminCustomPagesSection from '../admin/AdminCustomPagesSection';
import AdminReviewsSection from '../admin/AdminReviewsSection';
import AdminShippingSection from '../admin/AdminShippingSection';
import AdminPaymentsSection from '../admin/AdminPaymentsSection';
import AdminThemeSettingsSection from '../admin/AdminThemeSettingsSection';
import AdminIntegrationsSection from '../admin/AdminIntegrationsSection';
import AdminSupportTicketsSection from '../admin/AdminSupportTicketsSection';
import AdminHelpArticlesSection from '../admin/AdminHelpArticlesSection';
import AdminChatLogsSection from '../admin/AdminChatLogsSection';
import AdminNotificationsSection from '../admin/AdminNotificationsSection';
import AdminSeoSettingsSection from '../admin/AdminSeoSettingsSection';
import AdminAddProductSection from '../admin/AdminAddProductSection';
import AdminShoppableVideosSection from '../admin/AdminShoppableVideosSection';
import AdminOrderDetailModal from '../admin/AdminOrderDetailModal';
import AdminUpdateStockModal from '../admin/AdminUpdateStockModal';
import AdminProductViewModal from '../admin/AdminProductViewModal';
import AdminCustomerDetailModal from '../admin/AdminCustomerDetailModal';
import AdminMediaManagerSection from '../admin/AdminMediaManagerSection';
import AdminHeroSliderSection from '../admin/AdminHeroSliderSection';
import AdminOccasionsSection from '../admin/AdminOccasionsSection';
import AdminLooksSection from '../admin/AdminLooksSection';
import AdminEmotionsSection from '../admin/AdminEmotionsSection';
import AdminHeaderManagerSection from '../admin/AdminHeaderManagerSection';
import AdminFooterManagerSection from '../admin/AdminFooterManagerSection';
import AdminProfileSection from '../admin/AdminProfileSection';
import AdminAuthPageSettingsSection from '../admin/AdminAuthPageSettingsSection';
import AdminPoliciesSection from '../admin/AdminPoliciesSection';
import AdminTeamSection from '../admin/AdminTeamSection';
import AdminStatsSection from '../admin/AdminStatsSection';
import AdminPricingSection from '../admin/AdminPricingSection';


interface AdminDashboardPageProps {
  navigateToPage: (page: PageName, data?: any) => void;
  initialSection?: string;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: AdminUser | null;
  storeName: string;
  hasNewTicketNotification: boolean;
  onClearSupportNotification: () => void;
  
  // Data props from App state
  products: Product[];
  allOrders: Order[];
  allCustomers: Customer[];
  allCoupons: Coupon[];
  adminUsers: AdminUser[];
  supportTickets: SupportTicket[];
  siteSettings: SiteSettingsBundle | null;
  marketingCampaigns: MarketingCampaign[];
  reviews: ProductReview[];
  faqs: Faq[];
  categories: Category[];
  variantAttributes: VariantAttribute[];
  wishlistAnalytics: any[];
  mediaLibrary: MediaFile[];
  shippingZones: ShippingZone[];
  shippingProviders: ShippingProvider[];
  paymentGateways: PaymentGateway[];
  integrations: Integration[];

  // CMS Data for Previews
  heroSlides: HeroSlide[];
  shoppableVideos: ShoppableVideo[];
  testimonials: Testimonial[];
  occasions: OccasionContent[];
  looks: CuratedLook[];
  emotions: EmotionCategory[];
  cmsPages: CmsPage[];
  categoryGridItems: CategoryGridItem[];
  promoGridItems: PromoGridItem[];
  topCategories: TopCategoryItem[];
  teamMembers: TeamMember[];
  stats: StatItem[];
  pricingPlans: PricingPlan[];


  // Handler props from App state
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onSaveAdminUser: (user: AdminUser) => Promise<boolean>;
  onDeleteAdminUser: (userId: string) => Promise<boolean>;
  onSaveCoupon: (coupon: Coupon) => Promise<boolean>;
  onDeleteCoupon: (couponId: string) => Promise<boolean>;
  onSaveSupportTicket: (ticket: SupportTicket) => void;
  onBulkUploadProducts: (products: Product[], counts: { created: number; updated: number }) => void;
  onSaveSiteSettings: (settings: SiteSettingsBundle) => Promise<boolean>;
  onSaveReview: (review: ProductReview) => void;
  onDeleteReview: (reviewId: string) => void;
  onSaveFaq: (faq: Faq) => Promise<boolean>;
  onDeleteFaq: (faqId: string) => Promise<boolean>;
  onSaveProduct: (product: Product) => Promise<boolean>;
  onUpdateProductStatus: (productId: string, status: Product['publishStatus']) => Promise<boolean>;
  onDeleteProduct: (productId: string) => Promise<boolean>;
  onUpdateStock: (productId: string, newStock: number, variantSku?: string) => void;
  onSaveCategory: (category: Partial<Category>, parentId: string | null) => Promise<boolean>;
  onDeleteCategory: (categoryId: string) => Promise<boolean>;
  onSaveVariantAttribute: (attribute: Partial<VariantAttribute>) => Promise<boolean>;
  onDeleteVariantAttribute: (attributeId: string) => Promise<boolean>;
  onAddValueToAttribute: (attributeId: string, value: string) => Promise<boolean>;
  onDeleteValueFromAttribute: (attributeId: string, value: string) => Promise<boolean>;
  onUploadMedia: (files: File[]) => void;
  onDeleteMedia: (fileId: string) => void;
  onToggleCustomerBlock: (customerId: string) => Promise<boolean>;
  onSaveShippingZone: (zone: ShippingZone) => Promise<boolean>;
  onSaveShippingProvider: (provider: ShippingProvider) => Promise<boolean>;
  onSavePaymentGateway: (gateway: PaymentGateway) => Promise<boolean>;
  onSaveIntegration: (integration: Integration) => Promise<boolean>;

  // New CMS props
  onSaveHeroSlide: (slide: HeroSlide) => void;
  onDeleteHeroSlide: (slideId: string) => void;
  onSaveShoppableVideo: (video: ShoppableVideo) => void;
  onDeleteShoppableVideo: (videoId: string) => void;
  onSaveTestimonial: (testimonial: Testimonial) => void;
  onDeleteTestimonial: (testimonialId: string) => void;
  onSaveOccasion: (occasion: OccasionContent) => void;
  onDeleteOccasion: (occasionId: string) => void;
  onSaveLook: (look: CuratedLook) => void;
  onDeleteLook: (lookId: string) => void;
  onSaveEmotion: (emotion: EmotionCategory) => void;
  onDeleteEmotion: (emotionId: string) => void;
  onSaveCmsPage: (page: CmsPage) => Promise<boolean>;
  onDeleteCmsPage: (pageId: string) => Promise<boolean>;
  onUpdateHomepageContent: (type: 'categoryGrid' | 'promoGrid' | 'topCategories', items: any[]) => void;
  onSaveTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (memberId: string) => void;
  onSaveStatItem: (stat: StatItem) => void;
  onDeleteStatItem: (statId: string) => void;
  onSavePricingPlan: (plan: PricingPlan) => void;
  onDeletePricingPlan: (planId: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = (props) => {
  const { 
    navigateToPage, initialSection, onLogout, isDarkMode, toggleDarkMode, currentUser, storeName,
    products, allOrders, allCustomers, allCoupons, adminUsers, supportTickets,
    onUpdateOrderStatus,
    onSaveAdminUser, onDeleteAdminUser, onSaveCoupon, onDeleteCoupon, onSaveSupportTicket, onBulkUploadProducts,
    onSaveSiteSettings, siteSettings, marketingCampaigns,
    reviews, onSaveReview, onDeleteReview,
    faqs, onSaveFaq, onDeleteFaq, onSaveProduct, onUpdateStock,
    categories, onSaveCategory, onDeleteCategory,
    variantAttributes, onSaveVariantAttribute, onDeleteVariantAttribute,
    onAddValueToAttribute, onDeleteValueFromAttribute,
    onUploadMedia, onDeleteMedia, mediaLibrary, wishlistAnalytics, onToggleCustomerBlock,
    shippingZones, shippingProviders, onSaveShippingZone, onSaveShippingProvider,
    paymentGateways, onSavePaymentGateway, integrations, onSaveIntegration,
    hasNewTicketNotification, onClearSupportNotification,
    // CMS Props
    heroSlides, onSaveHeroSlide, onDeleteHeroSlide,
    shoppableVideos, onSaveShoppableVideo, onDeleteShoppableVideo,
    testimonials, onSaveTestimonial, onDeleteTestimonial,
    occasions, onSaveOccasion, onDeleteOccasion,
    looks, onSaveLook, onDeleteLook,
    emotions, onSaveEmotion, onDeleteEmotion,
    cmsPages, onSaveCmsPage, onDeleteCmsPage,
    categoryGridItems, promoGridItems, topCategories,
    teamMembers, onSaveTeamMember, onDeleteTeamMember,
    stats, onSaveStatItem, onDeleteStatItem,
    pricingPlans, onSavePricingPlan, onDeletePricingPlan,
    onUpdateHomepageContent,
  } = props;
  
  const [activeTab, setActiveTab] = useState(initialSection || 'dashboard');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [stockUpdateTarget, setStockUpdateTarget] = useState<{product: Product, variantSku?: string} | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const handleNavLinkClick = (id: string) => {
    if (id === 'logout') {
        onLogout();
        return;
    }
    
    // Clear notification if admin navigates to support section
    if (id.startsWith('support_')) {
        onClearSupportNotification();
    }
    
    // Find the link object by its ID to check if it's a page navigation link
    let linkToNavigate: NavLinkItem | undefined;
    
    const findLink = (links: AdminNavLink[]): NavLinkItem | undefined => {
        for (const link of links) {
            if ('id' in link && link.id === id) {
                return link as NavLinkItem;
            }
            if ('subLinks' in link && link.subLinks) {
                const found = findLink(link.subLinks as AdminNavLink[]);
                if (found) return found;
            }
        }
        return undefined;
    };
    
    linkToNavigate = findLink(ADMIN_DASHBOARD_NAV_LINKS);

    if (linkToNavigate && linkToNavigate.pageName) {
        navigateToPage(linkToNavigate.pageName);
    } else {
        setActiveTab(id);
        setProductToEdit(null);
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setActiveTab('products_add');
  };

  const handleSaveProductAndSwitch = async (productData: Product): Promise<boolean> => {
    const success = await props.onSaveProduct(productData);
    if (success) {
        setActiveTab('products_all');
        setProductToEdit(null);
    }
    return success;
  };

  const handleCancelEdit = () => {
    setActiveTab('products_all');
    setProductToEdit(null);
  };

  const navLinksWithAction = ADMIN_DASHBOARD_NAV_LINKS.map(link => {
    if (!('id' in link)) {
      return link;
    }
    return {
        ...link,
        action: () => handleNavLinkClick(link.id)
    }
  });

  const handleSaveAuthPageSettings = (authSettings: AuthPageSettings) => {
    if (siteSettings) {
        onSaveSiteSettings({ ...siteSettings, authPageSettings: authSettings });
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      // Main
      case 'dashboard': return <AdminOverviewSection navigateToPage={navigateToPage} />;
      case 'notifications': return <AdminNotificationsSection onNotificationClick={handleNavLinkClick}/>;
      
      // E-Commerce
      case 'orders_all': return <AdminOrderManagementSection orders={allOrders} onUpdateStatus={onUpdateOrderStatus} onViewOrder={setViewingOrder} />;
      case 'orders_pending': return <AdminPendingOrdersSection orders={allOrders} onUpdateStatus={onUpdateOrderStatus} onViewOrder={setViewingOrder} />;
      case 'orders_shipped': return <AdminShippedOrdersSection orders={allOrders} onUpdateStatus={onUpdateOrderStatus} onViewOrder={setViewingOrder} />;
      case 'orders_returned': return <AdminReturnedOrdersSection orders={allOrders} onUpdateStatus={onUpdateOrderStatus} onViewOrder={setViewingOrder} />;
      case 'orders_tracker': return <AdminOrderStatusTrackerSection orders={allOrders} onUpdateStatus={onUpdateOrderStatus} />;

      case 'products_all': return <AdminProductManagementSection products={products} onEditProduct={handleEditProduct} onUpdateStatus={props.onUpdateProductStatus} onDeleteProduct={props.onDeleteProduct} onViewProduct={setViewingProduct} />;
      case 'products_add': return <AdminAddProductSection 
                                    products={products} 
                                    onSave={handleSaveProductAndSwitch} 
                                    onCancel={handleCancelEdit} 
                                    productToEdit={productToEdit}
                                    onUploadMedia={onUploadMedia}
                                    mediaLibrary={mediaLibrary}
                                    variantAttributes={variantAttributes}
                                    categories={categories}
                                  />;
      case 'products_categories': return <AdminCategoryManagementSection categories={categories} onSaveCategory={onSaveCategory} onDeleteCategory={onDeleteCategory} />;
      case 'products_tags': return <AdminTagsSection products={products} />;
      case 'products_variants': return <AdminVariantsSection attributes={variantAttributes} onSaveAttribute={onSaveVariantAttribute} onDeleteAttribute={onDeleteVariantAttribute} onAddValue={onAddValueToAttribute} onDeleteValue={onDeleteValueFromAttribute} />;
      case 'inventory_all': return <AdminInventorySection products={products} onUpdateStockClick={(p, v) => setStockUpdateTarget({product: p, variantSku: v})}/>;
      case 'inventory_upload': return <AdminBulkUploadSection products={products} onBulkSaveProducts={onBulkUploadProducts} />;
      case 'customers_all': return <AdminCustomerManagementSection customers={allCustomers} onViewDetails={setViewingCustomer} onToggleBlock={onToggleCustomerBlock} />;
      case 'customers_groups': return <AdminCustomerGroupsSection />;
      case 'customers_wishlist': return <AdminWishlistsSection wishlistAnalytics={wishlistAnalytics} />;
      case 'customers_feedback': return <AdminFeedbackSection reviews={reviews} onSaveReview={onSaveReview} onDeleteReview={onDeleteReview} />;
      case 'marketing_coupons': return <AdminCouponsSection initialCoupons={allCoupons} onSave={onSaveCoupon} onDelete={onDeleteCoupon} />;
      case 'marketing_email': return <AdminEmailCampaignsSection />;
      case 'marketing_push': return <AdminPushNotificationsSection />;
      case 'marketing_social': return <AdminSocialAdsSection />;
      case 'reviews_all': return <AdminReviewsSection reviews={reviews} onSaveReview={onSaveReview} onDeleteReview={onDeleteReview} />;
      
      // Content
      case 'media': return <AdminMediaManagerSection media={mediaLibrary} onUpload={onUploadMedia} onDelete={onDeleteMedia} />;
      case 'cms_sliders': return <AdminHeroSliderSection slides={heroSlides} onSave={onSaveHeroSlide} onDelete={onDeleteHeroSlide} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia}/>;
      case 'cms_banners': return <AdminShoppableVideosSection initialVideos={shoppableVideos} onSave={onSaveShoppableVideo} onDelete={onDeleteShoppableVideo} allProducts={products} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia} />;
      case 'cms_testimonials': return <AdminTestimonialsSection testimonials={testimonials} onSave={onSaveTestimonial} onDelete={onDeleteTestimonial} />;
      case 'cms_blog': return <AdminBlogSection pages={cmsPages.filter(p=>p.type === 'post')} onSavePage={onSaveCmsPage} onDeletePage={onDeleteCmsPage} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia} />;
      case 'cms_faq': return <AdminFaqSection faqs={faqs} onSaveFaq={onSaveFaq} onDeleteFaq={onDeleteFaq} />;
      case 'cms_pages': return <AdminCustomPagesSection initialPages={cmsPages.filter(p=>p.type === 'page')} onSavePage={onSaveCmsPage} onDeletePage={onDeleteCmsPage} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia} />;
      case 'cms_occasions': return <AdminOccasionsSection occasions={occasions} onSave={onSaveOccasion} onDelete={onDeleteOccasion} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia} />;
      case 'cms_looks': return <AdminLooksSection looks={looks} onSave={onSaveLook} onDelete={onDeleteLook} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia} />;
      case 'cms_emotions': return <AdminEmotionsSection emotions={emotions} onSave={onSaveEmotion} onDelete={onDeleteEmotion} mediaLibrary={mediaLibrary} onUploadMedia={onUploadMedia} />;
      case 'cms_authpage': 
        if (!siteSettings?.authPageSettings) return <p>Loading settings...</p>;
        return <AdminAuthPageSettingsSection settings={siteSettings.authPageSettings} onSave={handleSaveAuthPageSettings} />;
      case 'cms_team': return <AdminTeamSection teamMembers={teamMembers} onSave={onSaveTeamMember} onDelete={onDeleteTeamMember} />;
      case 'cms_stats': return <AdminStatsSection stats={stats} onSave={onSaveStatItem} onDelete={onDeleteStatItem} />;
      case 'cms_pricing': return <AdminPricingSection plans={pricingPlans} onSave={onSavePricingPlan} onDelete={onDeletePricingPlan} />;

      // Platform
      case 'shipping_zones': return <AdminShippingSection shippingZones={shippingZones} shippingProviders={shippingProviders} onSaveZone={onSaveShippingZone} onSaveProvider={onSaveShippingProvider} />;
      case 'payments_methods':
      case 'payments_logs': return <AdminPaymentsSection orders={allOrders} paymentGateways={paymentGateways} onSaveGateway={props.onSavePaymentGateway} />;
      
      case 'analytics_sales': return <AdminAnalyticsSection orders={allOrders} products={products} customers={allCustomers} />;
      
      case 'users_admins': 
      case 'users_roles': return <AdminRolesSection initialAdminUsers={adminUsers} onSaveAdminUser={onSaveAdminUser} onDeleteAdminUser={onDeleteAdminUser} />;
      case 'users_history': return <AdminSecuritySection />;
      
      // Platform - Settings
      case 'settings_store':
        if (!siteSettings) return <p>Loading settings...</p>;
        return <AdminStoreSettingsSection
          storeSettings={siteSettings.storeSettings}
          onSaveStoreSettings={(s: StoreSettings) => onSaveSiteSettings({ ...siteSettings, storeSettings: s })}
        />;
      case 'settings_header':
        if (!siteSettings) return <p>Loading settings...</p>;
        return <AdminHeaderManagerSection
            headerLinks={siteSettings.headerLinks}
            onSaveHeaderLinks={(links: NavLinkItem[]) => onSaveSiteSettings({ ...siteSettings, headerLinks: links })}
        />;
      case 'settings_footer':
        if (!siteSettings) return <p>Loading settings...</p>;
        return <AdminFooterManagerSection
            footerSettings={siteSettings.footerSettings}
            onSaveFooterSettings={(fs: FooterSettings) => onSaveSiteSettings({ ...siteSettings, footerSettings: fs })}
        />;
      case 'settings_seo':
        if (!siteSettings) return <p>Loading settings...</p>;
        return <AdminSeoSettingsSection
            seoSettings={siteSettings.seoSettings}
            onSaveSeoSettings={(ss: SeoSettings) => onSaveSiteSettings({ ...siteSettings, seoSettings: ss })}
        />;
      case 'settings_theme':
        if (!siteSettings) return <p>Loading settings...</p>;
        return <AdminThemeSettingsSection
            themeSettings={siteSettings.themeSettings}
            onSaveThemeSettings={(ts: ThemeSettings) => onSaveSiteSettings({ ...siteSettings, themeSettings: ts })}
        />;
      case 'settings_integrations':
        return <AdminIntegrationsSection
            integrations={integrations}
            onSaveIntegration={onSaveIntegration}
            siteSettings={siteSettings}
            onSaveSiteSettings={onSaveSiteSettings}
        />;
      case 'settings_policies':
        if (!siteSettings) return <p>Loading settings...</p>;
        return <AdminPoliciesSection
            siteSettings={siteSettings}
            onSaveSiteSettings={onSaveSiteSettings}
        />;

      case 'admin_profile': return <AdminProfileSection user={currentUser} />;
      
      // Support
// FIX: Pass the `adminName` prop to `AdminSupportTicketsSection`.
      case 'support_tickets': return <AdminSupportTicketsSection initialTickets={supportTickets} onSaveTicket={onSaveSupportTicket} adminName={currentUser?.name || 'Admin'} />;
      case 'support_help': return <AdminHelpArticlesSection 
          pages={cmsPages.filter(p => p.type === 'page')} 
          onSavePage={onSaveCmsPage}
          onDeletePage={onDeleteCmsPage}
          mediaLibrary={mediaLibrary}
          onUploadMedia={onUploadMedia}
        />;
      case 'support_chat': return <AdminChatLogsSection />;
      
      // Default to overview for unimplemented sections
      default: return <AdminOverviewSection navigateToPage={navigateToPage} />;
    }
  };
  
  const findLabel = (links: AdminNavLink[], id: string): string | undefined => {
    for (const link of links) {
        if (!('id' in link)) continue;
        if (link.id === id) return link.label;
        if (link.subLinks) {
            const found = findLabel(link.subLinks, id);
            if (found) return found;
        }
    }
    return undefined;
  };
  
  let activeLink = findLabel(ADMIN_DASHBOARD_NAV_LINKS, activeTab);
  if (activeTab === 'products_add') {
    activeLink = productToEdit ? 'Edit Product' : 'Add New Product';
  } else if (activeTab === 'admin_profile') {
    activeLink = 'My Profile';
  }
  
  return (
    <>
      {/* FIX: Pass `hasNewTicketNotification` prop to `AdminLayout`. */}
      <AdminLayout
          navLinks={navLinksWithAction}
          activeNavLinkId={activeTab}
          onNavLinkClick={handleNavLinkClick}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          pageTitle={activeLink || 'Dashboard'}
          onLogout={onLogout}
          onNavigate={navigateToPage}
          currentUser={currentUser as UserProfile | null}
          storeName={storeName}
          hasNewTicketNotification={hasNewTicketNotification}
      >
          {renderActiveTabContent()}
      </AdminLayout>

      <AdminOrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      <AdminCustomerDetailModal customer={viewingCustomer} orders={allOrders} onClose={() => setViewingCustomer(null)} />
      <AdminUpdateStockModal
          target={stockUpdateTarget}
          onClose={() => setStockUpdateTarget(null)}
          onSave={onUpdateStock}
      />
      <AdminProductViewModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
    </>
  );
};

export default AdminDashboardPage;
