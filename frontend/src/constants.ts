
import React from 'react';
import { NavLinkItem, FooterSettings, MobileFooterLink, AdminNavLink, Product, Testimonial, SupportTicket, Brand, Category, Vendor, Coupon, AdminActivityLogItem, TeamMember, StatItem, PricingPlan } from './types';
import HomeIcon from './components/icons/HomeIcon';
import SearchIcon from './components/icons/SearchIcon';
import HeartIcon from './components/icons/HeartIcon';
import PackageIcon from './components/icons/PackageIcon';
import UserIcon from './components/icons/UserIcon';
import GridIcon from './components/icons/GridIcon'; 
import LogOutIcon from './components/icons/LogOutIcon'; 
import MapPinIcon from './components/icons/MapPinIcon'; 
import CreditCardIcon from './components/icons/CreditCardIcon'; 
import EyeIcon from './components/icons/EyeIcon';
import MessageSquareIcon from './components/icons/MessageSquareIcon';
import DashboardIcon from './components/icons/DashboardIcon';
import BellIcon from './components/icons/BellIcon';
import ShoppingBagIcon from './components/icons/ShoppingBagIcon';
import UsersIcon from './components/icons/UsersIcon';
import ListIcon from './components/icons/ListIcon';
import MegaphoneIcon from './components/icons/MegaphoneIcon';
import FileTextIcon from './components/icons/FileTextIcon';
import ReviewStarIcon from './components/icons/ReviewStarIcon';
import TruckIcon from './components/icons/TruckIcon';
import SlidersIcon from './components/icons/SlidersIcon';
import HelpCircleIcon from './components/icons/HelpCircleIcon';
import CameraIcon from './components/icons/CameraIcon';
import LayoutIcon from './components/icons/LayoutIcon';
import BrushIcon from './components/icons/BrushIcon';
import PlugIcon from './components/icons/PlugIcon';
import BarChartIcon from './components/icons/BarChartIcon';

// FIX: Replaced Vite-specific environment variable with a hardcoded URL to resolve TypeScript errors.
export const API_BASE_URL = 'http://localhost:5000/api';
export const DEFAULT_USER_ID = 'user123';
export const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/400x600/DAE7F3/2C3E50?text=ZAINA';

// *** IMPORTANT ***
// This is now only used for assets served with the application, not product media.
export const MEDIA_BASE_URL = 'https://zaina-collection.vercel.app'; 

// --- New Mock Data for Page Builder ---
export const MOCK_TEAM_MEMBERS: TeamMember[] = [];
export const MOCK_STATS: StatItem[] = [];
export const MOCK_PRICING_PLANS: PricingPlan[] = [];


export const USER_DASHBOARD_NAV_LINKS: NavLinkItem[] = [
    { id: 'profile', type: 'link', label: 'My Profile', href: '#profile', icon: UserIcon, order: 1, visible: true },
    { id: 'orders', type: 'link', label: 'My Orders', href: '#orders', icon: PackageIcon, order: 2, visible: true },
    { id: 'addresses', type: 'link', label: 'My Addresses', href: '#addresses', icon: MapPinIcon, order: 3, visible: true },
    { id: 'wishlist', type: 'link', label: 'Wishlist', href: '#wishlist', icon: HeartIcon, order: 4, visible: true },
    { id: 'support', type: 'link', label: 'Support Chat', href: '#support', icon: MessageSquareIcon, order: 5, visible: true },
    { id: 'recentlyViewed', type: 'link', label: 'Recently Viewed', href: '#recent', icon: EyeIcon, order: 6, visible: true },
    { id: 'paymentMethods', type: 'link', label: 'Payment Methods', href: '#payment', icon: CreditCardIcon, order: 7, visible: true },
    { id: 'logout', type: 'link', label: 'Logout', href: '#logout', icon: LogOutIcon, order: 8, visible: true },
];

export const ADMIN_DASHBOARD_NAV_LINKS: AdminNavLink[] = [
    // MAIN
    { type: 'header', label: 'Main' },
    { id: 'dashboard', type: 'link', label: 'Dashboard', href: '#dashboard', icon: DashboardIcon, order: 1, visible: true },
    { id: 'notifications', type: 'link', label: 'Notifications', href: '#notifications', icon: BellIcon, order: 2, visible: true },
    // E-COMMERCE
    { type: 'header', label: 'E-Commerce' },
    { 
        id: 'orders', 
        type: 'dropdown',
        label: 'Orders', 
        href: '#orders_all', 
        icon: ShoppingBagIcon,
        order: 3, 
        visible: true,
        subLinks: [
            { id: 'orders_all', type: 'link', label: 'All Orders', href: '#orders_all', order: 1, visible: true },
            { id: 'orders_pending', type: 'link', label: 'Pending Orders', href: '#orders_pending', order: 2, visible: true },
            { id: 'orders_shipped', type: 'link', label: 'Shipped Orders', href: '#orders_shipped', order: 3, visible: true },
            { id: 'orders_returned', type: 'link', label: 'Returned/Cancelled', href: '#orders_returned', order: 4, visible: true },
            { id: 'orders_tracker', type: 'link', label: 'Order Status Tracker', href: '#orders_tracker', order: 5, visible: true },
        ]
    },
    { 
        id: 'products', 
        type: 'dropdown',
        label: 'Products', 
        href: '#products_all', 
        icon: PackageIcon,
        order: 4, 
        visible: true,
        subLinks: [
            { id: 'products_all', type: 'link', label: 'All Products', href: '#products_all', order: 1, visible: true },
            { id: 'products_add', type: 'link', label: 'Add New Product', href: '#products_add', order: 2, visible: true },
            { id: 'products_categories', type: 'link', label: 'Categories', href: '#products_categories', order: 3, visible: true },
            { id: 'products_tags', type: 'link', label: 'Tags/Collections', href: '#products_tags', order: 4, visible: true },
            { id: 'products_variants', type: 'link', label: 'Variants', href: '#products_variants', order: 5, visible: true },
        ]
    },
     { 
        id: 'inventory', 
        type: 'dropdown',
        label: 'Inventory', 
        href: '#inventory', 
        icon: ListIcon,
        order: 5, 
        visible: true,
        subLinks: [
            { id: 'inventory_all', type: 'link', label: 'Inventory Management', href: '#inventory_all', order: 1, visible: true },
            { id: 'inventory_upload', type: 'link', label: 'Bulk Upload (CSV)', href: '#inventory_upload', order: 2, visible: true },
        ]
    },
    { 
        id: 'customers', 
        type: 'dropdown',
        label: 'Customers', 
        href: '#customers_all', 
        icon: UsersIcon,
        order: 6, 
        visible: true,
        subLinks: [
            { id: 'customers_all', type: 'link', label: 'All Customers', href: '#customers_all', order: 1, visible: true },
            { id: 'customers_groups', type: 'link', label: 'Customer Groups', href: '#customers_groups', order: 2, visible: true },
            { id: 'customers_wishlist', type: 'link', label: 'Customer Wishlist', href: '#customers_wishlist', order: 3, visible: true },
            { id: 'customers_feedback', type: 'link', label: 'Customer Feedback', href: '#customers_feedback', order: 4, visible: true },
        ]
    },
    { 
        id: 'marketing', 
        type: 'dropdown',
        label: 'Marketing', 
        href: '#marketing_coupons', 
        icon: MegaphoneIcon,
        order: 7, 
        visible: true,
        subLinks: [
             { id: 'marketing_coupons', type: 'link', label: 'Coupons & Discounts', href: '#marketing_coupons', order: 1, visible: true },
             { id: 'marketing_email', type: 'link', label: 'Email Campaigns', href: '#marketing_email', order: 2, visible: true },
             { id: 'marketing_push', type: 'link', label: 'Push Notifications', href: '#marketing_push', order: 3, visible: true },
             { id: 'marketing_social', type: 'link', label: 'Social Media Ads', href: '#marketing_social', order: 4, visible: true },
        ]
    },
    // CONTENT
    { type: 'header', label: 'Content' },
    { id: 'media', type: 'link', label: 'Media Manager', href: '#media', icon: CameraIcon, order: 8, visible: true },
    { 
        id: 'cms', 
        type: 'dropdown',
        label: 'Content (CMS)', 
        href: '#cms_pages', 
        icon: FileTextIcon,
        order: 9, 
        visible: true,
        subLinks: [
            { id: 'cms_homepage', type: 'link', label: 'Homepage Editor', href: '#', pageName: 'homepageEditor', order: 0, visible: true },
            { id: 'cms_sliders', type: 'link', label: 'Hero Sliders', href: '#cms_sliders', order: 1, visible: true },
            { id: 'cms_banners', type: 'link', label: 'Shoppable Videos', href: '#cms_banners', order: 2, visible: true },
            { id: 'cms_testimonials', type: 'link', label: 'Testimonials', href: '#cms_testimonials', order: 3, visible: true },
            { id: 'cms_occasions', type: 'link', label: 'Shop by Occasion', href: '#cms_occasions', order: 4, visible: true },
            { id: 'cms_looks', type: 'link', label: 'Shop by Look', href: '#cms_looks', order: 5, visible: true },
            { id: 'cms_emotions', type: 'link', label: 'Shop by Emotion', href: '#cms_emotions', order: 6, visible: true },
            { id: 'cms_team', type: 'link', label: 'Team Members', href: '#cms_team', order: 7, visible: true },
            { id: 'cms_stats', type: 'link', label: 'Stats Counters', href: '#cms_stats', order: 8, visible: true },
            { id: 'cms_pricing', type: 'link', label: 'Pricing Tables', href: '#cms_pricing', order: 9, visible: true },
            { id: 'cms_blog', type: 'link', label: 'Blog Manager', href: '#cms_blog', order: 10, visible: true },
            { id: 'cms_faq', type: 'link', label: 'FAQs', href: '#cms_faq', order: 11, visible: true },
            { id: 'cms_pages', type: 'link', label: 'Custom Pages', href: '#cms_pages', order: 12, visible: true },
            { id: 'cms_authpage', type: 'link', label: 'Auth Page Settings', href: '#cms_authpage', order: 13, visible: true },
        ]
    },
    { 
        id: 'reviews', 
        type: 'dropdown',
        label: 'Reviews', 
        href: '#reviews_all', 
        icon: ReviewStarIcon,
        order: 10, 
        visible: true,
        subLinks: [
            { id: 'reviews_all', type: 'link', label: 'Product Reviews', href: '#reviews_all', order: 1, visible: true },
        ]
    },
     // PLATFORM
    { type: 'header', label: 'Platform' },
    { 
        id: 'shipping', 
        type: 'dropdown',
        label: 'Shipping & Delivery', 
        href: '#shipping_zones', 
        icon: TruckIcon,
        order: 11, 
        visible: true,
        subLinks: [
            { id: 'shipping_zones', type: 'link', label: 'Shipping Zones', href: '#shipping_zones', order: 1, visible: true },
        ]
    },
    { 
        id: 'payments', 
        type: 'dropdown',
        label: 'Payments', 
        href: '#payments_methods', 
        icon: CreditCardIcon,
        order: 12, 
        visible: true,
        subLinks: [
            { id: 'payments_methods', type: 'link', label: 'Payment Methods', href: '#payments_methods', order: 1, visible: true },
            { id: 'payments_logs', type: 'link', label: 'Transaction Logs', href: '#payments_logs', order: 2, visible: true },
        ]
    },
    { 
        id: 'analytics', 
        type: 'dropdown',
        label: 'Analytics', 
        href: '#analytics_sales', 
        icon: BarChartIcon,
        order: 13, 
        visible: true,
        subLinks: [
            { id: 'analytics_sales', type: 'link', label: 'Sales Analytics', href: '#analytics_sales', order: 1, visible: true },
        ]
    },
    { 
        id: 'settings', 
        type: 'dropdown',
        label: 'Settings', 
        href: '#settings_store', 
        icon: SlidersIcon,
        order: 14, 
        visible: true,
        subLinks: [
            { id: 'settings_store', type: 'link', label: 'Store Settings', href: '#settings_store', order: 1, visible: true },
            { id: 'settings_header', type: 'link', label: 'Header & Navigation', href: '#settings_header', icon: LayoutIcon, order: 2, visible: true },
            { id: 'settings_footer', type: 'link', label: 'Footer Settings', href: '#settings_footer', icon: LayoutIcon, order: 3, visible: true },
            { id: 'settings_seo', type: 'link', label: 'SEO Settings', href: '#settings_seo', order: 4, visible: true },
            { id: 'settings_theme', type: 'link', label: 'Theme & Appearance', href: '#settings_theme', icon: BrushIcon, order: 5, visible: true },
            { id: 'settings_integrations', type: 'link', label: 'Integrations', href: '#settings_integrations', icon: PlugIcon, order: 6, visible: true },
            { id: 'settings_policies', type: 'link', label: 'Product Page Policies', href: '#settings_policies', icon: FileTextIcon, order: 7, visible: true },
        ]
    },
    { 
        id: 'users', 
        type: 'dropdown',
        label: 'Users & Roles', 
        href: '#users_admins', 
        icon: UsersIcon,
        order: 15, 
        visible: true,
        subLinks: [
            { id: 'users_admins', type: 'link', label: 'Admin Users', href: '#users_admins', order: 1, visible: true },
            { id: 'users_roles', type: 'link', label: 'Role Permissions', href: '#users_roles', order: 2, visible: true },
            { id: 'users_history', type: 'link', label: 'Security Logs', href: '#users_history', order: 3, visible: true },
        ]
    },
    // SUPPORT
    { type: 'header', label: 'Support' },
    { 
        id: 'support', 
        type: 'dropdown',
        label: 'Support', 
        href: '#support_tickets', 
        icon: HelpCircleIcon,
        order: 16, 
        visible: true,
        subLinks: [
            { id: 'support_tickets', type: 'link', label: 'Tickets & Queries', href: '#support_tickets', order: 1, visible: true },
            { id: 'support_help', type: 'link', label: 'Help Articles', href: '#support_help', order: 2, visible: true },
            { id: 'support_chat', type: 'link', label: 'Customer Chat Logs', href: '#support_chat', order: 3, visible: true },
        ]
    },
    { id: 'logout', type: 'link', label: 'Logout', href: '#logout', icon: LogOutIcon, order: 17, visible: true },
];

export const MOBILE_FOOTER_LINKS_DATA: MobileFooterLink[] = [
    { id: 'home', label: 'Home', icon: HomeIcon, href: '/', ariaLabel: 'Go to Homepage', pageName: 'home' },
    { id: 'explore', label: 'Explore', icon: SearchIcon, href: '/shop', ariaLabel: 'Explore products', pageName: 'shop' },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, href: '#', ariaLabel: 'View your wishlist', pageName: 'userDashboard' },
    { id: 'orders', label: 'Orders', icon: PackageIcon, href: '#', ariaLabel: 'View your orders', pageName: 'userDashboard' },
    { id: 'profile', label: 'Profile', icon: UserIcon, href: '#', ariaLabel: 'View your profile', pageName: 'userDashboard' },
];

export const INITIAL_FOOTER_SETTINGS: FooterSettings = {
    columns: [
        {
            id: 'col1',
            title: 'Shop',
            links: [
                { id: 'f_link_1', label: 'New Arrivals', href: '/shop' },
                { id: 'f_link_2', label: 'Best Sellers', href: '/shop' },
                { id: 'f_link_3', label: 'Sale', href: '/shop' },
            ]
        },
        {
            id: 'col2',
            title: 'Information',
            links: [
                { id: 'f_link_4', label: 'About Us', href: '/about' },
                { id: 'f_link_5', label: 'Contact Us', href: '/contact' },
                { id: 'f_link_6', label: 'Blog', href: '/blog' },
            ]
        },
         {
            id: 'col3',
            title: 'Customer Service',
            links: [
                { id: 'f_link_7', label: 'Shipping Policy', href: '/policies/shipping' },
                { id: 'f_link_8', label: 'Returns & Exchanges', href: '/policies/returns' },
                { id: 'f_link_9', label: 'Privacy Policy', href: '/policies/privacy' },
                { id: 'f_link_10', label: 'Terms of Service', href: '/policies/terms' },
            ]
        }
    ],
    socialLinks: {
        facebook: '#',
        instagram: '#',
        twitter: '#',
    },
    copyrightText: `© ${new Date().getFullYear()} %STORE_NAME%. All Rights Reserved.`
};

export const PLACEHOLDER_PRODUCTS: Product[] = [];
export const USER_TESTIMONIALS_DATA: Testimonial[] = [];
export const MOCK_USER_SUPPORT_TICKETS: SupportTicket[] = [];
export const MOCK_BRANDS: Brand[] = [];
export const MOCK_CATEGORIES: Category[] = [{ id: 'cat1', name: 'Default Category', subCategories: [] }];
export const MOCK_SIZES: string[] = ['S', 'M', 'L'];
export const MOCK_VENDORS: Vendor[] = [];
export const MOCK_USER_WISHLIST: any[] = [];
export const MOCK_COUPONS: Coupon[] = [];
export const MOCK_ADMIN_ACTIVITY_LOGS: AdminActivityLogItem[] = [];
