
import React from 'react';

// Centralized Page and Role Definitions
export type AdminRole = 'Super Admin' | 'Product Manager' | 'Order Manager' | 'Support Manager' | 'Content Editor' | 'Analytics Viewer';
export type PageName = 'home' | 'shop' | 'productDetail' | 'about' | 'contact' | 'auth' | 'cart' | 'checkout' | 'policy' | 'userDashboard' | 'adminDashboard' | 'blogIndex' | 'blogPost' | 'notFound' | 'homepageEditor';
export type UserRole = 'user' | 'admin' | AdminRole | null;
export type CheckoutStep = 'shipping' | 'delivery' | 'payment';

// --- Homepage Editor Types ---
export type SectionType = 
  'HeroSlider' | 
  'TrendingProductStrip' | 
  'ShoppableVideoCarouselSection' | 
  'ProductGrid' | 
  'ShopByOccasion' | 
  'TestimonialsSlider' | 
  'BlogPreviewSection' | 
  'InstagramBanner' | 
  'CategoryGrid' | 
  'TopCategories' | 
  // New components from turns 3 & 4
  'CtaSection' |
  'TeamSection' |
  'FaqSection' |
  'StatsCounterSection' |
  'DividerSection' |
  'ColumnsSection' | // Replaces TwoColumnSection
  'HeadingSection' |
  'RichTextSection' |
  'ImageWithTextSection' |
  'PricingTableSection' |
  'VideoEmbedSection' |
  'GoogleMapSection' |
  // New Nested Types
  'Column' |
  'Element_Heading' |
  'Element_Text' |
  'Element_Image' |
  'Element_Button' |
  'CategoryGridCard' |
  'TopCategoryCard' |
  'PromoGrid2' | // New advanced promo grid
  'TabbedProductGrid' | // New tabbed product grid
  'ShopByLook';


export interface HomepageSection {
  id: string; // A unique ID for the section instance, e.g., "bestsellers-1678886400000"
  type: SectionType;
  name?: string; // An editable name for the section instance, e.g., "Featured Summer Collection"
  props?: { 
    [key: string]: any;
    tabs?: TabbedProductGrid_Tab[];
  };
  styles?: React.CSSProperties;
  children?: HomepageSection[]; // For nested components
}

// --- New Component-Specific Types ---
export interface TeamMember {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  socials: {
    twitter?: string;
    linkedin?: string;
  };
  order?: number;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface StatItem {
    id: string;
    icon: string; // For simplicity, could be an icon component name or URL
    value: number;
    label: string;
    order?: number;
}

export interface PricingPlan {
    id: string;
    name: string;
    price: string;
    frequency: string;
    features: string[];
    isFeatured: boolean;
    buttonText: string;
    buttonLink: string;
    order?: number;
}

export interface PromoGrid2CardData {
  tag: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
  backgroundImage?: string;
  backgroundColor?: string;
  productImageUrl?: string;
}


export interface TabbedProductGrid_Banner {
    id: string;
    imageUrl: string;
    link: string;
}

export interface TabbedProductGrid_Tab {
    id: string;
    name: string;
    banners: TabbedProductGrid_Banner[];
}


// --- Dynamic Grid Sections Types ---
export interface CategoryGridItem {
  id: string;
  supertitle: string;
  title: string;
  subtitle: string;
  callToAction: string;
  imageUrl: string;
  backgroundColor: string; // e.g. '#FFDDAA' or a valid CSS color
  textColor: string; // e.g. 'text-white'
  link: string;
  gridSpan: number; // e.g. 1 for small, 2 for large
}

export interface PromoGridItem {
  id: string;
  tag?: string;
  title: string;
  subtitle: string;
  priceText: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  align: 'left' | 'right';
}


export interface TopCategoryItem {
  id: string;
  name: string;
  itemCount: number;
  imageUrl: string;
  link: string;
  backgroundColor?: string;
  textColor?: string;
}


export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id:string;
  name: string;
  subCategories: Category[];
}

export interface VariantAttribute {
  id: string;
  name: string; // e.g., "Size", "Color"
  values: string[]; // e.g., ["S", "M", "L"] or ["Red", "Blue"]
}


export interface Vendor {
  id: string;
  name: string;
}

export interface Product {
  id?: string;
  name: string;
  slug?: string;
  price: number; // Selling Price
  mrp: number; // Product MRP (Maximum Retail Price)
  imageUrl?: string;
  images?: string[]; // For multiple images
  
  // For localStorage persistence to avoid quota errors
  primaryImageId?: string;
  galleryImageIds?: string[];
  
  hoverImageUrl?: string;
  fabricDetailImageUrl?: string; 
  modelImageUrl?: string; 
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number; 
  category: string;
  subCategory?: string;
  description: string;
  tags?: string[]; 
  occasion?: string; 
  emotion?: string; 
  sku?: string;
  stockQuantity?: number; // Base stock, overridden by variants if they exist
  variants?: ProductVariant[];
  brand?: string;
  gender?: 'Male' | 'Female' | 'Unisex' | 'Kids';
  isTaxable?: boolean;
  specifications?: { key: string; value: string }[];
  vendor?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishStatus?: 'Draft' | 'Published' | 'Hidden';
  reviews?: ProductReview[];

  // New fields for shipping
  weightKg?: number;
  dimensionsCm?: {
    length?: number;
    width?: number;
    height?: number;
  };

  // New fields for enhanced product page
  longDescriptionHtml?: string;
  bannerImageUrl?: string;
  bannerLink?: string;
  faqs?: { question: string; answer: string }[];

  // Deprecated top-level fields, now part of variants
  sizes?: string[];
  colors?: string[];
  discountPercentage?: number;
}


export interface ProductVariant {
  id: string;
  attributes: { [key: string]: string }; // e.g., { "Color": "Red", "Size": "M" }
  price: number;
  stockQuantity: number;
  sku: string;
  imageUrl?: string;
}

export interface HeroSlideButton {
  text: string;
  link: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  device: 'desktop' | 'mobile';
  supertitle?: string;
  title?: string;
  titleColor?: string;
  offerText?: string;
  subtitle?: string;
  buttons?: HeroSlideButton[];
  order: number;
  isActive: boolean;
}

export interface ShoppableVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  tag?: string;
  featuredProductIds: string[];
}

export enum ZainaColor {
  // Updated General Palette based on latest instructions
  PrimarySky = '#4A90E2',         // Powdery Blue / Secondary Blue (for interactive elements)
  SecondaryPink = '#F4C434',      // Mustard Yellow (accents, hover effects)
  AccentLavender = '#9ACCBF',     // Mint Green (trust-building UI)
  CtaPeach = '#AF4474',           // Raspberry Pink (CTA buttons, offer tags, banners)
  
  TextPrimary = '#2C3E50',        // Deep Slate Blue (headers, main text) - Updated HEX

  NeutralLight = '#F8F9FA',       // Off White / Cool White (main light backgrounds) - Updated HEX
  NeutralMedium = '#E9ECEF',      // Light Cool Gray / Cool Gray Medium (cards, borders, input bg) - Updated HEX
  
  // Adjusted utility colors (tints of new primary/text)
  SkyBlueLight = '#DAE7F3',       // Lighter tint of new PrimarySky #4A90E2
  SlateGray = '#BDC3C7',          // General Slate Gray / Silver Accent - Updated HEX

  // Kept from old palette for specific uses or if gradually phasing out
  CoolGrayLight = '#F1F3F5',    
  CoolGrayDark = '#DEE2E6',     
  White = '#FFFFFF',             
  SilverAccent = '#BDC3C7',      // Now same as SlateGray
  DeepRedAccent = '#B42B2B',     

  // Semantic aliases (will automatically update based on above definitions)
  Primary = PrimarySky,                 
  SecondaryBlue = PrimarySky, 
  
  CoolWhite = NeutralLight,             
  DeepNavy = TextPrimary,               

  // General purpose colors often used in UI
  Success = '#28a745', 
  Warning = '#ffc107', 
  Error = DeepRedAccent, 
}

export type MenuTag = 'NEW' | 'HOT' | 'SALE';

export interface MegaMenuColumn {
  id: string;
  title: string;
  links: NavLinkItem[];
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string; 
  type: 'link' | 'dropdown' | 'mega';
  order: number;
  isSpecial?: boolean; 
  icon?: React.FC<any>; 
  iconUrl?: string; // For image icons
  subLinks?: NavLinkItem[];
  megaMenuColumns?: MegaMenuColumn[];
  pageName?: PageName; 
  category?: string; 
  visible: boolean;
  tag?: MenuTag | '';
}


export interface CuratedLook {
  id: string;
  title: string;
  imageUrl: string;
  productIds: string[]; 
  description: string;
}

export interface Testimonial {
  id: string;
  userImage: string;
  userName: string;
  userHandle?: string;
  quote: string;
  productImageUrl?: string; 
  rating?: number; // Added rating for reviews
  approved?: boolean;
}

export interface OccasionContent {
  id: string;
  name: string; 
  title: string; 
  description: string; 
  imageUrl: string; 
}

export interface EmotionCategory {
  id:string;
  name: string; 
  emotionTag: string; 
  imageUrl: string; 
  description: string; 
}

export interface GuidedDiscoveryPath {
  id: string;
  prompt: string; 
  targetFilters: { 
    occasion?: string;
    category?: string;
    tags?: string[];
    emotion?: string;
    size?: string;
  };
}

export interface MobileFooterLink {
  id: string;
  label: string;
  icon: React.FC<any>; 
  href: string;
  ariaLabel: string;
  pageName?: PageName;
}

export interface PolicyContent {
  title: string;
  content?: string; 
  htmlContent?: string; 
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant: ProductVariant;
}

export interface CartItemForCheckout {
  productId: string;
  quantity: number;
  variant: ProductVariant;
}


// Dashboard Specific Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  joinDate?: string;
  wishlistProductIds?: string[];
  recentlyViewedProductIds?: string[];
}

export interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export type PaymentMethodType = 'card' | 'cod' | 'razorpay' | 'phonepe';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  brand: string;
  isDefault?: boolean;
}


export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Returned';

export interface OrderItem {
  id: string; // The ID of the OrderItem record
  quantity: number;
  priceAtPurchase: number;
  // Use nested objects to represent the full product and variant at time of purchase
  product: Product;
  variant: ProductVariant;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string; // ISO string
  customerName: string; // Simplified for now, could be customerId
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  trackingNumber?: string;
  paymentType?: PaymentMethodType; // Updated for consistency
  deliveryType?: 'standard' | 'fast';
  deliveryCharge?: number;
  appliedCouponCode?: string;
  discountAmount?: number;
  transactionId?: string;
  paymentStatus?: 'Success' | 'Failed' | 'Pending';
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  lastUpdated: string; // ISO string
  createdAt: string; // ISO string
  messages: {
    sender: 'user' | 'admin';
    text: string;
    timestamp: string; // ISO string
  }[];
  assignedTo?: string; // Admin User ID
  seenByAdmin?: boolean;
}

// --- NEW LIVE CHAT TYPES ---
export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'admin';
  text?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  timestamp: string; // ISO string
}

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: string; // ISO string
  lastUpdated: string; // ISO string
  // For admin list view
  user?: { name: string };
  messages?: { text?: string }[]; // For preview
}


export interface AdminDashboardStats {
  totalSales: number;
  newOrders: number;
  totalCustomers: number;
  lowStockItems: number;
  revenueChartData?: { month: string; revenue: number }[]; // For 30 days
  liveVisitors?: number; // Added
  activeAdminSessions?: number; // Added
  recentOrders?: Order[];
  topSellingProducts?: { id: string; name: string; imageUrl?: string; totalSold: number; }[];
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string; // ISO string
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string; // ISO string
  profilePictureUrl?: string;
  isBlocked?: boolean; // Added
}

// Advanced Admin Dashboard Types
export interface AdminUser extends Omit<UserProfile, 'role'> {
  role: AdminRole;
  lastLogin?: string; // ISO string
  isActive: boolean;
}


export type CouponType = 'percentage' | 'fixed_amount' | 'bogo'; // BOGO = Buy One Get One

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // Percentage or fixed amount
  description?: string; // e.g., "Buy 1 Anarkali, Get 1 Kurti Free" for BOGO
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
  rules?: string; // Text field for complex rules
}

export interface HomepageBanner {
    id: string;
    title: string;
    imageUrl: string;
    ctaLink: string;
    isActive: boolean;
    order: number;
}

export interface CmsPage {
  id: string;
  type: 'page' | 'post';
  title: string;
  slug: string;
  content: string; // Holds HTML content
  metaTitle: string;
  metaDescription: string;
  status: 'Published' | 'Draft';
  lastUpdated: string; // ISO string
  lastUpdatedBy: string; // Admin User Name
  featuredImageUrl?: string;
}

export interface AdminActivityLogItem {
    id: string;
    timestamp: string; // ISO string
    adminUserId: string;
    adminUserName: string;
    action: string; // e.g., "Logged In", "Updated Product SKU-123", "Changed Order O-456 Status to Shipped"
    ipAddress?: string;
    details?: string; // Optional: More details about the action
}

// Admin NavLink Types
export interface AdminNavLinkItem extends NavLinkItem {
  subLinks?: NavLinkItem[];
  action?: () => void;
}
export interface AdminNavHeader {
    type: 'header';
    label: string;
}
export type AdminNavLink = AdminNavLinkItem | AdminNavHeader;

export interface MediaFile {
  id: string;
  name: string;
  url: string; // Can be a path or a base64 data URL
  size: number; // in bytes
  type: 'image' | 'video';
  createdAt: string; // ISO string
}
// FIX: Add missing ActivityFeedItem and FloatingInfo types
export interface ActivityFeedItem {
  id: string;
  timestamp: Date;
  message: string;
}

export interface FloatingInfo {
  id: string;
  text: string;
  corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  triggerSectionId?: string;
}

// Notification System Types
export type NotificationType = 'order' | 'user' | 'payment' | 'inventory' | 'support' | 'general';
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    seen: boolean;
    timestamp: string; // ISO String
    link?: {
        page: PageName;
        data?: any;
    };
}


// --- Site Settings ---

export interface AuthPageSettings {
  backgroundColor: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}


export interface StoreSettings {
    name: string;
    tagline: string;
    supportEmail: string;
    supportPhone: string;
    instagramUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    logoUrl?: string;
    faviconUrl?: string;
}

export interface SeoSettings {
    homepageTitle: string;
    homepageDescription: string;
    metaKeywords: string[];
}

export interface ThemeSettings {
    colorPrimary: string; 
    colorGold: string;
    colorCtaBlue: string;
    fontBody: string; 
    fontHeadingDisplay: string;
    fontHeadingCormorant: string;
}

// --- Dynamic Footer Settings ---
export interface FooterLink {
  id: string;
  label: string;
  href: string;
}
export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}
export interface FooterSettings {
  columns: FooterColumn[];
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  copyrightText: string;
}

// --- Integrations ---
export interface Integration {
  id: string;
  name: 'Facebook Pixel' | 'Razorpay' | 'Shiprocket' | 'Mailchimp';
  category: 'Marketing' | 'Payments' | 'Shipping';
  enabled: boolean;
  settings: {
    pixelId?: string;
    apiKey?: string; // For Razorpay Key ID, Shiprocket Key, Mailchimp Key
    apiSecret?: string; // For Razorpay Key Secret, Shiprocket Secret, Mailchimp Audience ID
  };
}

export interface IntegrationsSettings {
    googleAnalyticsId: string;
}

export interface SiteSettingsBundle {
    storeSettings: StoreSettings;
    seoSettings: SeoSettings;
    themeSettings: ThemeSettings;
    headerLinks: NavLinkItem[];
    footerSettings: FooterSettings;
    integrations: IntegrationsSettings;
    categoryGridItems?: CategoryGridItem[];
    topCategories?: TopCategoryItem[];
    promoGridItems?: PromoGridItem[];
    authPageSettings?: AuthPageSettings;
}


// --- New Types for Admin Panel Backend Connection ---
export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'push';
  subject?: string;
  content: string;
  status: 'Draft' | 'Sent' | 'Active';
  sentAt?: string;
  recipients?: number;
}

export interface CustomerGroup {
    id: string;
    name: string;
    memberCount: number;
    rules: string; // Text description of rules
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  condition?: 'min_order_value' | 'weight_based';
  conditionValue?: number; // e.g., 2000 for min order value of 2000
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states: string[];
  postcodes: string[];
  rates: ShippingRate[];
}

export interface ShippingProvider {
  id: string;
  name: string; // e.g., 'Shiprocket'
  apiKey?: string;
  apiSecret?: string;
  enabled: boolean;
}


export interface PaymentGateway {
    id: string;
    name: string;
    enabled: boolean;
    settings: {
        [key: string]: any;
        apiKey?: string;
        apiSecret?: string;
        merchantId?: string;
        saltKey?: string;
    }
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO string
  approved: boolean;
  user: { name: string };
  // For admin view, we include product info
  product?: { name: string; imageUrl?: string };
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}