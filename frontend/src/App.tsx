
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// --- Import all components and constants ---
// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSlider from './components/HeroSlider';
import ProductGrid from './components/ProductGrid';
import TestimonialsSlider from './components/TestimonialsSlider';
import QuickViewModal from './components/QuickViewModal';
import QuickShopModal from './components/QuickShopModal';
import ShopByEmotion from './components/ShopByEmotion';
import ShopByLook from './components/ShopByLook';
import BlogPreviewSection from './components/BlogPreviewSection';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import MobileStickyFooter from './components/MobileStickyFooter';
import FirstOrderOfferModal from './components/FirstOrderOfferModal';
import GuidedDiscovery from './components/GuidedDiscovery';
import TrendingProductStrip from './components/TrendingProductStrip';
import ShoppableVideoCarouselSection from './components/ShoppableVideoCarouselSection';
import ShopByOccasion from './components/ShopByOccasion';
import InstagramBanner from './components/InstagramBanner';
import CategoryGrid from './components/CategoryGrid';
import TopCategories from './components/TopCategories';
import PromoGrid2 from './components/PromoGrid2';
import TabbedProductGrid from './components/TabbedProductGrid';
import Preloader from './components/Preloader';
import CompareTray from './components/CompareTray';
import VirtualTryOnPopup from './components/VirtualTryOnPopup';


// Page builder components
import CtaSection from './components/CtaSection';
import TeamSection from './components/TeamSection';
import FaqSection from './components/FaqSection';
import StatsCounterSection from './components/StatsCounterSection';
import DividerSection from './components/DividerSection';
import ColumnsSection from './components/ColumnsSection';
import HeadingSection from './components/HeadingSection';
import RichTextSection from './components/RichTextSection';
import ImageWithTextSection from './components/ImageWithTextSection';
import PricingTableSection from './components/PricingTableSection';
import VideoEmbedSection from './components/VideoEmbedSection';
import GoogleMapSection from './components/GoogleMapSection';
import ColumnComponent from './components/ColumnComponent';
import ElementHeading from './components/elements/ElementHeading';
import ElementText from './components/elements/ElementText';
import ElementImage from './components/elements/ElementImage';
import ElementButton from './components/elements/ElementButton';
import CategoryGridCard from './components/CategoryGridCard';
import TopCategoryCard from './components/TopCategoryCard';


// Pages
import ShopPage from './components/pages/ShopPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import AboutUsPage from './components/pages/AboutUsPage';
import ContactPage from './components/pages/ContactPage';
import AuthPage from './components/pages/AuthPage';
import CartPage from './components/pages/CartPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import PolicyPage from './components/pages/PolicyPage';
import UserDashboardPage from './components/pages/UserDashboardPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import BlogIndexPage from './components/pages/BlogIndexPage';
import BlogPostPage from './components/pages/BlogPostPage';
import NotFoundPage from './components/pages/NotFoundPage';
import HomepageEditorPage from './components/pages/HomepageEditorPage';


// Constants and Types
import {
    API_BASE_URL,
    INITIAL_FOOTER_SETTINGS
} from './constants';
import { Product, NavLinkItem, CartItemForCheckout, CartItem, ShoppableVideo, CmsPage, Testimonial, PageName, ProductVariant, UserRole, Category, HeroSlide, OccasionContent, CuratedLook, EmotionCategory, StoreSettings, ThemeSettings, UserProfile, FooterSettings, GuidedDiscoveryPath, AdminUser, SupportTicket, SiteSettingsBundle, MarketingCampaign, Order, ProductReview, Faq, VariantAttribute, OrderStatus, MediaFile, ShippingZone, ShippingProvider, PaymentGateway, Address, PaymentMethod, Coupon, IntegrationsSettings, Integration, HomepageSection, CategoryGridItem, TopCategoryItem, TeamMember, StatItem, PricingPlan, FaqItem, PromoGrid2CardData, PromoGridItem, AuthPageSettings, Customer, ActivityFeedItem, FloatingInfo } from './types';
import { useScrollAnimation } from './hooks/useScrollAnimation';


export const INITIAL_HOMEPAGE_LAYOUT: HomepageSection[] = [
    { id: 'hero1', type: 'HeroSlider', name: 'Hero Slider' },
    { 
        id: 'featured_categories1', 
        type: 'TopCategories', 
        name: 'Featured Categories', 
        props: { title: 'Featured Categories' },
        children: [
            { id: 'tccard1', type: 'TopCategoryCard', name: 'Kurtis', props: { name: 'Kurtis', imageUrl: 'https://i.imgur.com/y88ERy0.png', link: 'Kurtis' }},
            { id: 'tccard2', type: 'TopCategoryCard', name: 'Sarees', props: { name: 'Sarees', imageUrl: 'https://i.imgur.com/Jxg9v1x.png', link: 'Sarees' }},
            { id: 'tccard3', type: 'TopCategoryCard', name: 'Lehengas', props: { name: 'Lehengas', imageUrl: 'https://i.imgur.com/m4sF9aF.png', link: 'Lehengas' }},
            { id: 'tccard4', type: 'TopCategoryCard', name: 'Anarkalis', props: { name: 'Anarkalis', imageUrl: 'https://i.imgur.com/J3o522x.png', link: 'Anarkalis' }},
            { id: 'tccard5', type: 'TopCategoryCard', name: 'Jewellery', props: { name: 'Jewellery', imageUrl: 'https://i.imgur.com/QCY0sY8.png', link: 'Jewellery' }},
            { id: 'tccard6', type: 'TopCategoryCard', name: 'Accessories', props: { name: 'Accessories', imageUrl: 'https://i.imgur.com/qLwFHd3.png', link: 'Accessories' }},
        ]
    },
    { id: 'bestsellers1', type: 'ProductGrid', name: 'Best Sellers', props: { title: 'Our Best Sellers', filter: 'isBestSeller' } },
    { id: 'new_arrivals1', type: 'TrendingProductStrip', name: 'New Arrivals', props: { title: 'New Arrivals', filter: 'isNew' } },
    { id: 'shop_by_look1', type: 'ShopByLook', name: 'Shop By Look' },
    { id: 'videos1', type: 'ShoppableVideoCarouselSection', name: 'Shoppable Videos' },
    { id: 'testimonials1', type: 'TestimonialsSlider', name: 'Testimonials' },
];


export const App: React.FC = () => {
    // --- State Management ---
    // App Navigation
    const [currentPage, setCurrentPage] = useState<PageName>('home');
    const [pageData, setPageData] = useState<any>(null); // For passing data between pages

    // User & Auth
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | AdminUser | null>(null);

    // E-commerce Data (to be fetched)
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [buyNowItem, setBuyNowItem] = useState<CartItemForCheckout | null>(null);
    const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());
    const [compareItems, setCompareItems] = useState<Product[]>([]);
    const [isCompareTrayOpen, setIsCompareTrayOpen] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [userAddresses, setUserAddresses] = useState<Address[]>([]);
    const [userSupportTickets, setUserSupportTickets] = useState<SupportTicket[]>([]);
    const [userPaymentMethods, setUserPaymentMethods] = useState<PaymentMethod[]>([]);
    const [homepageLayout, setHomepageLayout] = useState<HomepageSection[]>(INITIAL_HOMEPAGE_LAYOUT);
    
    // Site-wide content (to be fetched)
    const [siteSettings, setSiteSettings] = useState<SiteSettingsBundle | null>(null);
    const [allCmsPages, setAllCmsPages] = useState<CmsPage[]>([]);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [shoppableVideos, setShoppableVideos] = useState<ShoppableVideo[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [occasions, setOccasions] = useState<OccasionContent[]>([]);
    const [looks, setLooks] = useState<CuratedLook[]>([]);
    const [emotions, setEmotions] = useState<EmotionCategory[]>([]);
    const [guidedDiscovery, setGuidedDiscovery] = useState<GuidedDiscoveryPath[]>([]);
    const [fashionGalleryImages, setFashionGalleryImages] = useState<string[]>([]);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
    const [categoryGridItems, setCategoryGridItems] = useState<CategoryGridItem[]>([]);
    const [promoGridItems, setPromoGridItems] = useState<PromoGridItem[]>([]);
    const [topCategories, setTopCategories] = useState<TopCategoryItem[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [stats, setStats] = useState<StatItem[]>([]);
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);

    // Admin-specific data
    const [adminData, setAdminData] = useState<{
        allOrders: Order[];
        allCustomers: Customer[];
        allCoupons: Coupon[];
        adminUsers: AdminUser[];
        supportTickets: SupportTicket[];
        marketingCampaigns: MarketingCampaign[];
        reviews: ProductReview[];
        variantAttributes: VariantAttribute[];
        wishlistAnalytics: any[];
        mediaLibrary: MediaFile[];
        shippingZones: ShippingZone[];
        shippingProviders: ShippingProvider[];
        integrations: Integration[];
        paymentGateways: PaymentGateway[];
    }>({
        allOrders: [], allCustomers: [], allCoupons: [], adminUsers: [], supportTickets: [], marketingCampaigns: [],
        reviews: [], variantAttributes: [], wishlistAnalytics: [], mediaLibrary: [],
        shippingZones: [], shippingProviders: [], integrations: [], paymentGateways: []
    });

    // UI State
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [quickShopProduct, setQuickShopProduct] = useState<Product | null>(null);
    const [showFirstOrderModal, setShowFirstOrderModal] = useState(false);
    const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
    const [virtualTryOnProduct, setVirtualTryOnProduct] = useState<Product | null>(null);
    const [newTicketNotification, setNewTicketNotification] = useState(false);
    
    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('zaina-authToken');
            if (!token) return;
            const { data } = await axios.get(`${API_BASE_URL}/admin/dashboard-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdminData(prev => ({
                ...prev,
                ...data,
            }));
        } catch (error) {
            console.error("Failed to fetch admin dashboard data", error);
        }
    };

    // Check for existing auth token on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('zaina-authToken');
            if (token) {
                 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                 try {
                     const { data } = await axios.get(`${API_BASE_URL}/user/dashboard-data`);
                     if(data.profile) {
                         setCurrentUser(data.profile);
                         setWishlistProductIds(new Set(data.profile.wishlistProductIds || []));
                         setUserOrders(data.orders || []);
                         setUserAddresses(data.addresses || []);
                         setUserSupportTickets(data.supportTickets || []);
                         setUserPaymentMethods(data.paymentMethods || []);
                         setIsLoggedIn(true);
                         if (data.profile.role === 'ADMIN') {
                           await fetchAdminData();
                         }
                     }
                 } catch (error) {
                     console.error("Session expired or invalid token.", error);
                     localStorage.removeItem('zaina-authToken');
                 }
            }
        };
        checkAuthStatus();
    }, []); 

    // --- Data Fetching and Initialization ---
    const fetchData = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/site-data`);
            setProducts(data.products || []);
            setCategories(data.categories || []);
            setAllCmsPages(data.cmsPages || []);
            setHeroSlides(data.heroSlides || []);
            setShoppableVideos(data.shoppableVideos || []);
            setTestimonials(data.testimonials || []);
            setOccasions(data.occasions || []);
            setLooks(data.looks || []);
            setEmotions(data.emotions || []);
            setGuidedDiscovery(data.guidedDiscoveryPaths || []);
            setFashionGalleryImages(data.fashionGalleryImages || []);
            setFaqs(data.faqs || []);
            setPaymentGateways(data.paymentGateways || []);
            setCategoryGridItems(data.categoryGridItems || []);
            setPromoGridItems(data.promoGridItems || []);
            setTopCategories(data.topCategories || []);
            setTeamMembers(data.teamMembers || []);
            setStats(data.stats || []);
            setPricingPlans(data.pricingPlans || []);

            if (data.homepageLayout && Array.isArray(data.homepageLayout) && data.homepageLayout.length > 0) {
                setHomepageLayout(data.homepageLayout);
            }

            if (data.siteSettings) {
                setSiteSettings(data.siteSettings);
            } else {
                 const defaultSettings: SiteSettingsBundle = {
                    storeSettings: { name: "My Store", tagline: "My Awesome Store", supportEmail: "support@example.com", supportPhone: "123-456-7890", instagramUrl: "", facebookUrl: "", twitterUrl: "" },
                    seoSettings: { homepageTitle: "My Store", homepageDescription: "Welcome to my awesome store", metaKeywords: [] },
                    themeSettings: { colorPrimary: "#4A90E2", colorGold: "#D4AF37", colorCtaBlue: "#1F3FBA", fontBody: 'Poppins', fontHeadingDisplay: 'Playfair Display', fontHeadingCormorant: 'Cormorant Garamond' },
                    headerLinks: [],
                    footerSettings: INITIAL_FOOTER_SETTINGS,
                    integrations: { googleAnalyticsId: '' },
                    authPageSettings: { backgroundColor: '#FADADD', imageUrl: '/media/auth-image.jpg', title: "Find your signature style.", subtitle: "Elegance in every thread, for every occasion." }
                };
                setSiteSettings(defaultSettings);
            }
        } catch (error: any) {
            console.error("Failed to fetch initial site data:", error);
            if (error.response) {
                setError(`Error: Could not connect to the server. (Status: ${error.response.status})`);
            } else if (error.request) {
                setError("Error: No response from the server. Please ensure the backend server is running.");
            } else {
                setError(`An error occurred: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Check for first visit to show offer modal
        if (!localStorage.getItem('zaina-visited')) {
            setTimeout(() => setShowFirstOrderModal(true), 3000);
            localStorage.setItem('zaina-visited', 'true');
        }
    }, [fetchData]);

    useEffect(() => {
        if (siteSettings) {
            // Apply Theme
            const root = document.documentElement;
            root.style.setProperty('--theme-color-primary', siteSettings.themeSettings.colorPrimary);
            root.style.setProperty('--theme-color-gold', siteSettings.themeSettings.colorGold);
            root.style.setProperty('--theme-color-cta-blue', siteSettings.themeSettings.colorCtaBlue);
            
            // Set Page Title
            document.title = siteSettings.storeSettings.name || "E-commerce Store";

            // Set Favicon
            const favicon = document.getElementById('favicon') as HTMLLinkElement;
            if (favicon && siteSettings.storeSettings.faviconUrl) {
                favicon.href = siteSettings.storeSettings.faviconUrl;
            }
        }
    }, [siteSettings]);


    // --- Core Functions ---
    const navigateToPage = useCallback((page: PageName, data: any = null) => {
        window.scrollTo(0, 0); // Scroll to top on page change
        setPageData(data);
        setCurrentPage(page);
        if (page === 'checkout' && data?.buyNowItem) {
            setBuyNowItem(data.buyNowItem);
        } else {
            setBuyNowItem(null);
        }
    }, []);
    
    // Custom hook for scroll animations, re-triggers on page change
    useScrollAnimation(currentPage);

    // --- User & Auth Functions ---
    const onLogin = async (credentials: {email: string, password: string}) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
            const { token, user } = response.data;

            localStorage.setItem('zaina-authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
             // After successful login, fetch all user-specific data
            const { data: dashboardData } = await axios.get(`${API_BASE_URL}/user/dashboard-data`);
            
            setCurrentUser(dashboardData.profile);
            setWishlistProductIds(new Set(dashboardData.profile.wishlistProductIds || []));
            setUserOrders(dashboardData.orders || []);
            setUserAddresses(dashboardData.addresses || []);
            setUserSupportTickets(dashboardData.supportTickets || []);
            setUserPaymentMethods(dashboardData.paymentMethods || []);
            setIsLoggedIn(true);
            
            if (user.role === 'ADMIN') {
                await fetchAdminData();
                navigateToPage('adminDashboard');
            } else {
                navigateToPage('home');
            }
            
            return { success: true, role: user.role };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            return { success: false, error: errorMessage };
        }
    };
    const onRegister = async (credentials: {name: string, email: string, password: string}) => {
         try {
            await axios.post(`${API_BASE_URL}/auth/register`, credentials);
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            const errorList = error.response?.data?.errors;
            return { success: false, error: errorMessage, errors: errorList };
        }
    };
    const onLogout = () => {
        // Clear all user-specific state
        setIsLoggedIn(false);
        setCurrentUser(null);
        setWishlistProductIds(new Set());
        setCartItems([]);
        setBuyNowItem(null);
        setRecentlyViewed([]);
        setUserOrders([]);
        setUserAddresses([]);
        setUserSupportTickets([]);
        setUserPaymentMethods([]);
        
        // Clear authentication token
        localStorage.removeItem('zaina-authToken');
        delete axios.defaults.headers.common['Authorization'];
        
        // Navigate to home
        navigateToPage('home');
    };

    // --- Cart & Wishlist Functions ---
    const handleAddToCart = (product: Product, quantity: number, selectedVariant: ProductVariant) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.selectedVariant.id === selectedVariant.id
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: newQuantity,
                };
                 alert(`${quantity} more "${product.name}" added. Total: ${newQuantity}`);
                return updatedItems;
            } else {
                const newItem: CartItem = {
                    ...product,
                    quantity: quantity,
                    selectedVariant: selectedVariant,
                };
                 const variantDescription = Object.entries(selectedVariant.attributes).map(([key, value]) => `${key}: ${value}`).join(', ');
                 alert(`${quantity} x "${product.name}" (${variantDescription}) added to cart!`);
                return [...prevItems, newItem];
            }
        });
    };

    const handleDirectBuyNow = (product: Product, quantity: number, selectedVariant: ProductVariant) => {
        const itemForCheckout: CartItemForCheckout = {
            productId: product.id!,
            quantity: quantity,
            variant: selectedVariant
        };
        navigateToPage('checkout', { buyNowItem: itemForCheckout });
    };
    
    const handlePlaceOrder = async (orderData: Omit<Order, 'id'>, guestDetails?: any, paymentDetails?: any): Promise<{success: boolean; error?: string; orderId?: string}> => {
        try {
            const token = localStorage.getItem('zaina-authToken');
            const response = await axios.post(`${API_BASE_URL}/orders`, { order: orderData, guestDetails, paymentDetails }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                // Order was successful, now clear the cart/buyNowItem
                if (buyNowItem) {
                    setBuyNowItem(null);
                } else {
                    setCartItems([]);
                }
                return { success: true, orderId: response.data.order.id };
            } else {
                return { success: false, error: 'Failed to place order.' };
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'There was an error placing your order.';
            return { success: false, error: errorMessage };
        }
    };

    const handleToggleWishlist = async (product: Product) => {
        if (!isLoggedIn) {
            navigateToPage('auth');
            return;
        }
        if (!product.id) return;

        // Optimistic update
        const isCurrentlyWishlisted = wishlistProductIds.has(product.id);
        setWishlistProductIds(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyWishlisted) {
                newSet.delete(product.id!);
            } else {
                newSet.add(product.id!);
            }
            return newSet;
        });

        try {
            await axios.post(`${API_BASE_URL}/user/wishlist/toggle`, { productId: product.id });
        } catch (error) {
            console.error("Failed to update wishlist on server", error);
            // Revert on error
             setWishlistProductIds(prev => {
                const newSet = new Set(prev);
                if (isCurrentlyWishlisted) {
                    newSet.add(product.id!);
                } else {
                    newSet.delete(product.id!);
                }
                return newSet;
            });
             alert("Could not update your wishlist. Please try again.");
        }
    };
    const isProductInWishlist = (productId?: string) => productId ? wishlistProductIds.has(productId) : false;

     // --- Compare Functions ---
    const handleToggleCompare = (product: Product) => {
        setCompareItems(prev => {
            const isCompared = prev.some(p => p.id === product.id);
            if (isCompared) {
                return prev.filter(p => p.id !== product.id);
            } else {
                if (prev.length >= 4) {
                    alert('You can compare a maximum of 4 products.');
                    return prev;
                }
                return [...prev, product];
            }
        });
        setIsCompareTrayOpen(true);
    };

    const isProductInCompare = (productId?: string) => productId ? compareItems.some(p => p.id === productId) : false;

    const handleSaveSupportTicket = async (ticket: SupportTicket) => {
        const isNewTicket = ticket.id.startsWith('ticket_');
        const token = localStorage.getItem('zaina-authToken');
        if (!token) {
            alert('You must be logged in to manage support tickets.');
            navigateToPage('auth');
            return;
        }

        try {
            let updatedTicket;
            if (currentUser?.role && currentUser.role.toLowerCase().includes('admin')) {
                // Admin is updating status or replying
                const { id, ...ticketData } = ticket;
                const response = await axios.put(`${API_BASE_URL}/admin/support-tickets/${id}`, ticketData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedTicket = response.data;
            } else {
                // User is creating or replying
                if (isNewTicket) {
                    const { id, ...ticketData } = ticket;
                    const response = await axios.post(`${API_BASE_URL}/user/support-tickets`, ticketData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    updatedTicket = response.data;
                    setNewTicketNotification(true); // Notify admin for new tickets
                } else {
                    const response = await axios.put(`${API_BASE_URL}/user/support-tickets/${ticket.id}/message`, { messages: ticket.messages }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    updatedTicket = response.data;
                }
            }

            // Refetch all tickets for the relevant user type to ensure state is in sync
            if (currentUser?.role && currentUser.role.toLowerCase().includes('admin')) {
                await fetchAdminData();
            } else {
                 const { data: dashboardData } = await axios.get(`${API_BASE_URL}/user/dashboard-data`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserSupportTickets(dashboardData.supportTickets || []);
            }

        } catch (error) {
            console.error("Failed to save support ticket:", error);
            alert("There was an error saving your support ticket. Please try again.");
            // Optionally, implement logic to revert optimistic UI updates here
        }
    };
    
    const handleClearSupportNotification = () => {
        setNewTicketNotification(false);
    };

    const userActionHandlers = {
        onUpdateProfile: async (updatedProfile: UserProfile) => {
            try {
                const response = await axios.put(`${API_BASE_URL}/user/profile`, updatedProfile);
                setCurrentUser(response.data);
                alert('Profile updated successfully!');
            } catch (error) {
                console.error("Failed to update profile", error);
                alert('Error: Could not update profile.');
            }
        },
        onChangePassword: async (passwords: { current: string; new: string }) => {
            try {
                const response = await axios.put(`${API_BASE_URL}/user/change-password`, passwords);
                return { success: true, message: response.data.message };
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'An error occurred.';
                return { success: false, message: errorMessage };
            }
        },
        onSaveAddress: async (address: Address) => {
             try {
                const isUpdating = userAddresses.some(a => a.id === address.id);
                const url = isUpdating ? `${API_BASE_URL}/user/addresses/${address.id}` : `${API_BASE_URL}/user/addresses`;
                const method = isUpdating ? 'put' : 'post';
                
                const response = await axios[method](url, address);
                
                if (isUpdating) {
                    setUserAddresses(prev => prev.map(a => a.id === address.id ? response.data : a));
                } else {
                    setUserAddresses(prev => [...prev, response.data]);
                }
                alert('Address saved!');
            } catch (error) {
                 console.error("Failed to save address:", error);
                 alert('Error: Could not save address.');
            }
        },
        onDeleteAddress: async (addressId: string) => {
             try {
                await axios.delete(`${API_BASE_URL}/user/addresses/${addressId}`);
                setUserAddresses(prev => prev.filter(a => a.id !== addressId));
                alert('Address deleted!');
            } catch (error) {
                 console.error("Failed to delete address:", error);
                 alert('Error: Could not delete address.');
            }
        },
        onSaveSupportTicket: handleSaveSupportTicket,
    };

    const fetchAdminCategories = async () => {
        try {
            const token = localStorage.getItem('zaina-authToken');
            if (!token) return;
            const { data } = await axios.get(`${API_BASE_URL}/admin/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch admin categories", error);
        }
    };

    // --- Admin Data Handlers ---
    const adminActionHandlers = {
        onUpdateOrderStatus: async (orderId: string, status: OrderStatus) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
                setAdminData(prev => ({ ...prev, allOrders: prev.allOrders.map(o => o.id === orderId ? response.data : o) }));
            } catch (error) { console.error("Failed to update order status", error); alert('Error updating status.'); }
        },
        onSaveAdminUser: async (user: AdminUser) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = adminData.adminUsers.some(u => u.id === user.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/users/${user.id}` : `${API_BASE_URL}/admin/users`;
                const method = isUpdating ? 'put' : 'post';
                
                const response = await axios[method](url, user, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setAdminData(prev => {
                    const newUsers = isUpdating
                        ? prev.adminUsers.map(u => u.id === user.id ? response.data : u)
                        : [response.data, ...prev.adminUsers];
                    return { ...prev, adminUsers: newUsers };
                });
                alert(`Admin user ${isUpdating ? 'updated' : 'created'} successfully!`);
                return true;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Could not save admin user.';
                console.error("Failed to save admin user:", error);
                alert(`Error: ${errorMessage}`);
                return false;
            }
        },
        onDeleteAdminUser: async (userId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                setAdminData(prev => ({
                    ...prev,
                    adminUsers: prev.adminUsers.filter(u => u.id !== userId)
                }));
                alert('Admin user deleted successfully!');
                return true;
            } catch (error) {
                console.error("Failed to delete admin user:", error);
                alert('Error: Could not delete admin user.');
                return false;
            }
        },
        onSaveCoupon: async (coupon: Coupon) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = adminData.allCoupons.some(c => c.id === coupon.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/coupons/${coupon.id}` : `${API_BASE_URL}/admin/coupons`;
                const method = isUpdating ? 'put' : 'post';

                const response = await axios[method](url, coupon, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAdminData(prev => {
                    const newCoupons = isUpdating
                        ? prev.allCoupons.map(c => c.id === coupon.id ? response.data : c)
                        : [response.data, ...prev.allCoupons];
                    return { ...prev, allCoupons: newCoupons };
                });
                return true;
            } catch (error) {
                console.error("Failed to save coupon:", error);
                alert("Error: Could not save coupon.");
                return false;
            }
        },
        onDeleteCoupon: async (couponId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/coupons/${couponId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAdminData(prev => {
                    const newCoupons = prev.allCoupons.filter(c => c.id !== couponId);
                    return { ...prev, allCoupons: newCoupons };
                });
                return true;
            } catch (error) {
                console.error("Failed to delete coupon:", error);
                alert("Error: Could not delete coupon.");
                return false;
            }
        },
        onSaveSupportTicket: handleSaveSupportTicket,
        onBulkUploadProducts: (products: Product[], counts: { created: number; updated: number }) => console.log('onBulkUploadProducts', products, counts),
        onSaveSiteSettings: async (settings: SiteSettingsBundle) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/settings/site`, settings, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSiteSettings(response.data);
                return true;
            } catch (error) {
                console.error("Failed to save site settings:", error);
                alert('Error: Could not save site settings to the server.');
                return false;
            }
        },
        onSaveReview: (review: ProductReview) => console.log('onSaveReview', review),
        onDeleteReview: (reviewId: string) => console.log('onDeleteReview', reviewId),
        onSaveFaq: async (faq: Faq) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = faqs.some(f => f.id === faq.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/faqs/${faq.id}` : `${API_BASE_URL}/admin/faqs`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, faq, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setFaqs(prev => prev.map(f => f.id === faq.id ? response.data : f));
                } else {
                    setFaqs(prev => [...prev, response.data]);
                }
                alert('FAQ saved successfully!');
                return true;
            } catch (error) {
                console.error("Failed to save FAQ:", error);
                alert('Error: Could not save FAQ.');
                return false;
            }
        },
        onDeleteFaq: async (faqId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/faqs/${faqId}`, { headers: { Authorization: `Bearer ${token}` } });
                setFaqs(prev => prev.filter(f => f.id !== faqId));
                alert('FAQ deleted successfully!');
                return true;
            } catch (error) {
                console.error("Failed to delete FAQ:", error);
                alert('Error: Could not delete FAQ.');
                return false;
            }
        },
        onSaveProduct: async (product: Product) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = products.some(p => p.id === product.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/products/${product.id}` : `${API_BASE_URL}/admin/products`;
                const method = isUpdating ? 'put' : 'post';
                
                const response = await axios[method](url, product, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                setProducts(prev => {
                    if (isUpdating) {
                        return prev.map(p => p.id === product.id ? response.data : p);
                    } else {
                        return [response.data, ...prev];
                    }
                });
                alert('Product saved successfully!');
                return true;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Could not save product.';
                console.error("Failed to save product:", error);
                alert(`Error: ${errorMessage}`);
                return false;
            }
        },
        onUpdateProductStatus: async (productId: string, status: Product['publishStatus']) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/products/${productId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
                setProducts(prev => prev.map(p => p.id === productId ? response.data : p));
                return true;
            } catch (error) {
                console.error("Failed to update product status", error);
                alert('Error updating status.');
                return false;
            }
        },
        onDeleteProduct: async (productId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
                setProducts(prev => prev.filter(p => p.id !== productId));
                alert('Product deleted successfully!');
                return true;
            } catch (error) {
                console.error("Failed to delete product", error);
                alert('Error deleting product.');
                return false;
            }
        },
        onUpdateStock: (productId: string, newStock: number, variantSku?: string) => console.log('onUpdateStock', productId, newStock, variantSku),
        onSaveCategory: async (category: Partial<Category>, parentId: string | null) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = category.id && !category.id.startsWith('cat_');
                
                const dataToSend = { ...category, parentId: parentId || null };
                if (!isUpdating) {
                    delete dataToSend.id;
                }
        
                const url = isUpdating ? `${API_BASE_URL}/admin/categories/${category.id}` : `${API_BASE_URL}/admin/categories`;
                const method = isUpdating ? 'put' : 'post';
        
                await axios[method](url, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                await fetchAdminCategories();
                
                alert('Category saved successfully!');
                return true;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Could not save category.';
                console.error("Failed to save category:", error);
                alert(`Error: ${errorMessage}`);
                return false;
            }
        },
        onDeleteCategory: async (categoryId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/categories/${categoryId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                await fetchAdminCategories();
                
                alert('Category deleted successfully!');
                return true;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Could not delete category.';
                console.error("Failed to delete category:", error);
                alert(`Error: ${errorMessage}`);
                return false;
            }
        },
        onSaveVariantAttribute: async (attribute: Partial<VariantAttribute>) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const headers = { Authorization: `Bearer ${token}` };
                
                const { id, ...newAttributeData } = attribute;
                
                const response = await axios.post(`${API_BASE_URL}/admin/variant-attributes`, newAttributeData, { headers });
        
                setAdminData(prev => ({
                    ...prev,
                    variantAttributes: [response.data, ...prev.variantAttributes]
                }));
        
                return true;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Could not save attribute.';
                console.error("Failed to save variant attribute:", error);
                alert(`Error: ${errorMessage}`);
                return false;
            }
        },
        onDeleteVariantAttribute: async (attributeId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/variant-attributes/${attributeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdminData(prev => ({
                    ...prev,
                    variantAttributes: prev.variantAttributes.filter(a => a.id !== attributeId)
                }));
                return true;
            } catch (error) {
                console.error("Failed to delete variant attribute:", error);
                alert('Error: Could not delete attribute.');
                return false;
            }
        },
        onAddValueToAttribute: async (attributeId: string, value: string) => {
            const attribute = adminData.variantAttributes.find(a => a.id === attributeId);
            if (!attribute) return false;
            
            if (attribute.values.find(v => v.toLowerCase() === value.toLowerCase())) {
                alert(`Value "${value}" already exists for this attribute.`);
                return false;
            }
        
            const updatedAttribute = { ...attribute, values: [...attribute.values, value] };
            
            try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/variant-attributes/${attributeId}`, updatedAttribute, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                setAdminData(prev => ({
                    ...prev,
                    variantAttributes: prev.variantAttributes.map(a => a.id === attributeId ? response.data : a)
                }));
                return true;
            } catch (error) {
                console.error("Failed to add value:", error);
                alert('Error: Could not add value.');
                return false;
            }
        },
        onDeleteValueFromAttribute: async (attributeId: string, value: string) => {
            const attribute = adminData.variantAttributes.find(a => a.id === attributeId);
            if (!attribute) return false;
        
            const updatedAttribute = { ...attribute, values: attribute.values.filter(v => v !== value) };
            
             try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/variant-attributes/${attributeId}`, updatedAttribute, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                setAdminData(prev => ({
                    ...prev,
                    variantAttributes: prev.variantAttributes.map(a => a.id === attributeId ? response.data : a)
                }));
                return true;
            } catch (error) {
                console.error("Failed to delete value:", error);
                alert('Error: Could not delete value.');
                return false;
            }
        },
        onUploadMedia: (files: File[]) => console.log('onUploadMedia', files),
        onDeleteMedia: (fileId: string) => console.log('onDeleteMedia', fileId),
        onToggleCustomerBlock: async (customerId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/customers/${customerId}/toggle-block`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdminData(prev => ({
                    ...prev,
                    allCustomers: prev.allCustomers.map(c =>
                        c.id === customerId ? { ...c, isBlocked: response.data.isBlocked } : c
                    )
                }));
                alert('Customer block status updated.');
                return true;
            } catch (error) {
                 console.error("Failed to toggle customer block status:", error);
                 alert('Error: Could not update customer status.');
                 return false;
            }
        },
        onSaveShippingZone: async (zone: ShippingZone) => { console.log('onSaveShippingZone', zone); return true; },
        onSaveShippingProvider: async (provider: ShippingProvider) => { console.log('onSaveShippingProvider', provider); return true; },
        onSavePaymentGateway: async (gateway: PaymentGateway) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const response = await axios.put(`${API_BASE_URL}/admin/payments/gateways/${gateway.id}`, gateway, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdminData(prev => ({
                    ...prev,
                    paymentGateways: prev.paymentGateways.map(g => g.id === gateway.id ? response.data : g)
                }));
                alert('Payment method updated!');
                return true;
            } catch (error) {
                console.error("Failed to save payment gateway:", error);
                alert('Error: Could not save payment gateway settings.');
                return false;
            }
        },
        onSaveIntegration: async (integration: Integration) => { console.log('onSaveIntegration', integration); return true; },
        onSaveHeroSlide: async (slide: HeroSlide) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = heroSlides.some(s => s.id === slide.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/content/hero-slides/${slide.id}` : `${API_BASE_URL}/admin/content/hero-slides`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, slide, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setHeroSlides(prev => prev.map(s => s.id === slide.id ? response.data : s));
                } else {
                    setHeroSlides(prev => [...prev, response.data]);
                }
                alert('Hero slide saved successfully!');
            } catch (error) {
                console.error("Failed to save hero slide:", error);
                alert('Error: Could not save hero slide.');
            }
        },
        onDeleteHeroSlide: async (slideId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/content/hero-slides/${slideId}`, { headers: { Authorization: `Bearer ${token}` } });
                setHeroSlides(prev => prev.filter(s => s.id !== slideId));
                alert('Hero slide deleted successfully!');
            } catch (error) {
                console.error("Failed to delete hero slide:", error);
                alert('Error: Could not delete hero slide.');
            }
        },
        onSaveShoppableVideo: async (video: ShoppableVideo) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = shoppableVideos.some(v => v.id === video.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/content/shoppable-videos/${video.id}` : `${API_BASE_URL}/admin/content/shoppable-videos`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, video, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setShoppableVideos(prev => prev.map(v => v.id === video.id ? response.data : v));
                } else {
                    setShoppableVideos(prev => [...prev, response.data]);
                }
                alert('Shoppable video saved!');
            } catch (error) {
                console.error("Failed to save shoppable video:", error);
                alert('Error: Could not save shoppable video.');
            }
        },
        onDeleteShoppableVideo: async (videoId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/content/shoppable-videos/${videoId}`, { headers: { Authorization: `Bearer ${token}` } });
                setShoppableVideos(prev => prev.filter(v => v.id !== videoId));
                alert('Shoppable video deleted!');
            } catch (error) {
                console.error("Failed to delete shoppable video:", error);
                alert('Error: Could not delete shoppable video.');
            }
        },
        onSaveTestimonial: async (testimonial: Testimonial) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = testimonials.some(t => t.id === testimonial.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/testimonials/${testimonial.id}` : `${API_BASE_URL}/admin/testimonials`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, testimonial, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setTestimonials(prev => prev.map(t => t.id === testimonial.id ? response.data : t));
                } else {
                    setTestimonials(prev => [...prev, response.data]);
                }
                alert('Testimonial saved!');
            } catch (error) {
                console.error("Failed to save testimonial:", error);
                alert('Error: Could not save testimonial.');
            }
        },
        onDeleteTestimonial: async (testimonialId: string) => {
             try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/testimonials/${testimonialId}`, { headers: { Authorization: `Bearer ${token}` } });
                setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
                alert('Testimonial deleted!');
            } catch (error) {
                console.error("Failed to delete testimonial:", error);
                alert('Error: Could not delete testimonial.');
            }
        },
        onSaveOccasion: async (occasion: OccasionContent) => {
             try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = occasions.some(o => o.id === occasion.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/content/occasions/${occasion.id}` : `${API_BASE_URL}/admin/content/occasions`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, occasion, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setOccasions(prev => prev.map(o => o.id === occasion.id ? response.data : o));
                } else {
                    setOccasions(prev => [...prev, response.data]);
                }
                alert('Occasion saved!');
            } catch (error) {
                console.error("Failed to save occasion:", error);
                alert('Error: Could not save occasion.');
            }
        },
        onDeleteOccasion: async (occasionId: string) => {
             try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/content/occasions/${occasionId}`, { headers: { Authorization: `Bearer ${token}` } });
                setOccasions(prev => prev.filter(o => o.id !== occasionId));
                alert('Occasion deleted!');
            } catch (error) {
                console.error("Failed to delete occasion:", error);
                alert('Error: Could not delete occasion.');
            }
        },
        onSaveLook: async (look: CuratedLook) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = looks.some(l => l.id === look.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/content/looks/${look.id}` : `${API_BASE_URL}/admin/content/looks`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, look, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setLooks(prev => prev.map(l => l.id === look.id ? response.data : l));
                } else {
                    setLooks(prev => [...prev, response.data]);
                }
                alert('Look saved!');
            } catch (error) {
                console.error("Failed to save look:", error);
                alert('Error: Could not save look.');
            }
        },
        onDeleteLook: async (lookId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/content/looks/${lookId}`, { headers: { Authorization: `Bearer ${token}` } });
                setLooks(prev => prev.filter(l => l.id !== lookId));
                alert('Look deleted!');
            } catch (error) {
                console.error("Failed to delete look:", error);
                alert('Error: Could not delete look.');
            }
        },
        onSaveEmotion: async (emotion: EmotionCategory) => {
             try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = emotions.some(e => e.id === emotion.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/content/emotions/${emotion.id}` : `${API_BASE_URL}/admin/content/emotions`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, emotion, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setEmotions(prev => prev.map(e => e.id === emotion.id ? response.data : e));
                } else {
                    setEmotions(prev => [...prev, response.data]);
                }
                alert('Emotion saved!');
            } catch (error) {
                console.error("Failed to save emotion:", error);
                alert('Error: Could not save emotion.');
            }
        },
        onDeleteEmotion: async (emotionId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/content/emotions/${emotionId}`, { headers: { Authorization: `Bearer ${token}` } });
                setEmotions(prev => prev.filter(e => e.id !== emotionId));
                alert('Emotion deleted!');
            } catch (error) {
                console.error("Failed to delete emotion:", error);
                alert('Error: Could not delete emotion.');
            }
        },
        onSaveCmsPage: async (page: CmsPage) => {
             try {
                const token = localStorage.getItem('zaina-authToken');
                const isUpdating = allCmsPages.some(p => p.id === page.id);
                const url = isUpdating ? `${API_BASE_URL}/admin/content/cms-pages/${page.id}` : `${API_BASE_URL}/admin/content/cms-pages`;
                const method = isUpdating ? 'put' : 'post';
                const response = await axios[method](url, page, { headers: { Authorization: `Bearer ${token}` } });
                if (isUpdating) {
                    setAllCmsPages(prev => prev.map(p => p.id === page.id ? response.data : p));
                } else {
                    setAllCmsPages(prev => [...prev, response.data]);
                }
                alert('Page/Post saved!');
                 return true;
            } catch (error) {
                console.error("Failed to save page/post:", error);
                alert('Error: Could not save page/post.');
                 return false;
            }
        },
        onDeleteCmsPage: async (pageId: string) => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                await axios.delete(`${API_BASE_URL}/admin/content/cms-pages/${pageId}`, { headers: { Authorization: `Bearer ${token}` } });
                setAllCmsPages(prev => prev.filter(p => p.id !== pageId));
                alert('Page/Post deleted!');
                 return true;
            } catch (error) {
                console.error("Failed to delete page/post:", error);
                alert('Error: Could not delete page/post.');
                 return false;
            }
        },
        onUpdateHomepageContent: (type: 'categoryGrid' | 'promoGrid' | 'topCategories', items: any[]) => {
            if (!siteSettings) return;
            const keyMap = {
                categoryGrid: 'categoryGridItems',
                promoGrid: 'promoGridItems',
                topCategories: 'topCategories'
            };
            const updatedSettings = { ...siteSettings, [keyMap[type]]: items };
            adminActionHandlers.onSaveSiteSettings(updatedSettings);
        },
        onSaveTeamMember: async (member: TeamMember) => {
            // ... (API call implementation)
        },
        onDeleteTeamMember: async (memberId: string) => {
            // ... (API call implementation)
        },
        onSaveStatItem: async (stat: StatItem) => {
            // ... (API call implementation)
        },
        onDeleteStatItem: async (statId: string) => {
             // ... (API call implementation)
        },
        onSavePricingPlan: async (plan: PricingPlan) => {
            // ... (API call implementation)
        },
        onDeletePricingPlan: async (planId: string) => {
             // ... (API call implementation)
        },
    };
    
    if (isLoading) {
        return <Preloader />;
    }
    
    if (error) {
        return (
            <div className="fixed inset-0 bg-red-50 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold text-red-700">Failed to Load Store</h1>
                <p className="mt-2 text-red-600">{error}</p>
                <p className="mt-4 text-sm text-gray-600">Please check your internet connection and ensure the backend server is running correctly. Refer to the `README.md` file in the `backend` folder for setup instructions.</p>
            </div>
        );
    }
    
    if (!siteSettings) {
        // This case should ideally not be reached if error handling is correct, but serves as a fallback.
        return <Preloader />;
    }

    const { storeSettings, seoSettings, themeSettings, headerLinks, footerSettings, authPageSettings } = siteSettings;

    // --- Page Rendering Logic ---
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <HomePage
                        homepageLayout={homepageLayout}
                        products={products.filter(p => p.publishStatus === 'Published')}
                        heroSlides={heroSlides}
                        testimonials={testimonials}
                        shoppableVideos={shoppableVideos}
                        occasions={occasions}
                        cmsPages={allCmsPages}
                        fashionGalleryImages={fashionGalleryImages}
                        guidedDiscovery={guidedDiscovery}
                        looks={looks}
                        emotions={emotions}
                        navigateToPage={navigateToPage}
                        onQuickView={setQuickViewProduct}
                        onQuickShop={setQuickShopProduct}
                        onToggleWishlist={handleToggleWishlist}
                        isProductInWishlist={isProductInWishlist}
                        onToggleCompare={handleToggleCompare}
                        isProductInCompare={isProductInCompare}
                        categoryGridItems={categoryGridItems}
                        promoGridItems={promoGridItems}
                        topCategories={topCategories}
                        teamMembers={teamMembers}
                        stats={stats}
                        faqItems={faqs}
                        pricingPlans={pricingPlans}
                        storeName={storeSettings.name}
                    />
                );
            case 'shop': return <ShopPage products={products} categories={categories} onProductQuickView={setQuickViewProduct} onProductQuickShop={setQuickShopProduct} onViewProductDetail={(p) => navigateToPage('productDetail', p)} initialCategory={pageData?.category} initialSearchTerm={pageData?.searchTerm} onToggleWishlist={handleToggleWishlist} isProductInWishlist={isProductInWishlist} onToggleCompare={handleToggleCompare} isProductInCompare={isProductInCompare} initialProductIds={pageData?.filterByProductIds} pageTitle={pageData?.title} />;
            case 'productDetail': return <ProductDetailPage product={pageData} allProducts={products} onAddToCart={handleAddToCart} onNavigateToPage={navigateToPage} onProductQuickView={setQuickViewProduct} onProductQuickShop={setQuickShopProduct} isLoggedIn={isLoggedIn} onDirectBuyNow={handleDirectBuyNow} onToggleWishlist={handleToggleWishlist} isWishlisted={isProductInWishlist(pageData.id)} onToggleCompare={handleToggleCompare} isCompared={isProductInCompare(pageData.id)} isProductInWishlist={isProductInWishlist} recentlyViewedProducts={products.filter(p => recentlyViewed.includes(p.id))} siteSettings={siteSettings} />;
            case 'about': return <AboutUsPage storeName={storeSettings.name} />;
            case 'contact': return <ContactPage storeSettings={storeSettings} />;
            case 'auth': return <AuthPage onLogin={onLogin} onRegister={onRegister} navigateToPage={navigateToPage} settings={authPageSettings} storeName={storeSettings.name} />;
            case 'cart': return <CartPage navigateToPage={navigateToPage} initialCartItems={cartItems} updateCartItems={setCartItems} />;
            case 'checkout': return <CheckoutPage cartItems={cartItems} buyNowItem={buyNowItem} navigateToPage={navigateToPage} onPlaceOrder={handlePlaceOrder} products={products} currentUser={currentUser} paymentGateways={paymentGateways} />;
            case 'policy': return <PolicyPage title={pageData?.title || 'Policy'} htmlContent={allCmsPages.find(p => p.slug === pageData?.slug)?.content || 'Content not found.'} />;
            case 'userDashboard': return <UserDashboardPage navigateToPage={navigateToPage} initialSection={pageData?.section} onLogout={onLogout} wishlistProducts={products.filter(p => isProductInWishlist(p.id))} recentlyViewedProducts={products.filter(p => recentlyViewed.includes(p.id))} onToggleWishlist={onToggleWishlist} currentUser={currentUser} storeName={storeSettings.name} orders={userOrders} addresses={userAddresses} supportTickets={userSupportTickets} paymentMethods={userPaymentMethods} {...userActionHandlers} />;
            case 'adminDashboard': return <AdminDashboardPage navigateToPage={navigateToPage} initialSection={pageData?.section} onLogout={onLogout} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} currentUser={currentUser as AdminUser} storeName={storeSettings.name} products={products} allOrders={adminData.allOrders} allCustomers={adminData.allCustomers} allCoupons={adminData.allCoupons} adminUsers={adminData.adminUsers} supportTickets={adminData.supportTickets} siteSettings={siteSettings} marketingCampaigns={adminData.marketingCampaigns} reviews={adminData.reviews} faqs={faqs} categories={categories} variantAttributes={adminData.variantAttributes} wishlistAnalytics={adminData.wishlistAnalytics} mediaLibrary={adminData.mediaLibrary} shippingZones={adminData.shippingZones} shippingProviders={adminData.shippingProviders} paymentGateways={adminData.paymentGateways} integrations={adminData.integrations} heroSlides={heroSlides} shoppableVideos={shoppableVideos} testimonials={testimonials} occasions={occasions} looks={looks} emotions={emotions} cmsPages={allCmsPages} categoryGridItems={categoryGridItems} promoGridItems={promoGridItems} topCategories={topCategories} teamMembers={teamMembers} stats={stats} pricingPlans={pricingPlans} hasNewTicketNotification={newTicketNotification} onClearSupportNotification={handleClearSupportNotification} {...adminActionHandlers} />;
            case 'blogIndex': return <BlogIndexPage posts={allCmsPages.filter(p => p.type === 'post')} navigateToPage={navigateToPage} />;
            case 'blogPost': return <BlogPostPage post={pageData} />;
// FIX: Changed cmsPages to allCmsPages as cmsPages is not defined.
            case 'homepageEditor': return <HomepageEditorPage products={products} heroSlides={heroSlides} testimonials={testimonials} shoppableVideos={shoppableVideos} occasions={occasions} cmsPages={allCmsPages} categoryGridItems={categoryGridItems} topCategories={topCategories} teamMembers={teamMembers} stats={stats} faqItems={faqs} pricingPlans={pricingPlans} navigateToPage={navigateToPage} />;
            default: return <NotFoundPage navigateToPage={navigateToPage} />;
        }
    };
    
    // --- HomePage Component ---
    interface HomePageProps {
        homepageLayout: HomepageSection[];
        products: Product[];
        heroSlides: HeroSlide[];
        testimonials: Testimonial[];
        shoppableVideos: ShoppableVideo[];
        occasions: OccasionContent[];
        cmsPages: CmsPage[];
        fashionGalleryImages: string[];
        guidedDiscovery: GuidedDiscoveryPath[];
        looks: CuratedLook[];
        emotions: EmotionCategory[];
        categoryGridItems: CategoryGridItem[];
        promoGridItems: PromoGridItem[];
        topCategories: TopCategoryItem[];
        teamMembers: TeamMember[];
        stats: StatItem[];
        faqItems: FaqItem[];
        pricingPlans: PricingPlan[];
        navigateToPage: (page: PageName, data?: any) => void;
        onQuickView: (product: Product) => void;
        onQuickShop: (product: Product) => void;
        onToggleWishlist: (product: Product) => void;
        isProductInWishlist: (productId?: string) => boolean;
        onToggleCompare: (product: Product) => void;
        isProductInCompare: (productId?: string) => boolean;
        storeName: string;
    }

    const HomePage: React.FC<HomePageProps> = (props) => {
        const renderNode = (section: HomepageSection): React.ReactNode => {
            const { id, type, props: sectionProps, children } = section;

            const componentProps: any = {
                ...sectionProps as any,
            };

            if ((type === 'CategoryGrid' || type === 'TopCategories') && (!children || children.length === 0)) {
                if (type === 'CategoryGrid') {
                    componentProps.children = props.categoryGridItems.map(item => <CategoryGridCard key={item.id} {...item} />);
                }
                if (type === 'TopCategories') {
                    componentProps.children = props.topCategories.map(item => <TopCategoryCard key={item.id} {...item} />);
                }
            } else if (children) {
                componentProps.children = children.map(child => renderNode(child));
            }

            switch (type) {
                case 'HeroSlider': return <HeroSlider key={id} slides={props.heroSlides} storeName={props.storeName} />;
                
                case 'TrendingProductStrip':
                    let stripProducts = props.products;
                    if (componentProps.filter === 'isNew') {
                        stripProducts = props.products.filter(p => p.isNew);
                    }
                    // FIX: Corrected passing of onToggleWishlist prop, which was causing an error. The prop is available on `props`, not directly in scope.
                    return <TrendingProductStrip key={id} {...componentProps} products={stripProducts.slice(0,10)} onProductQuickView={props.onQuickView} onProductQuickShop={props.onQuickShop} onProductCardClick={(p) => props.navigateToPage('productDetail', p)} onToggleWishlist={props.onToggleWishlist} isProductInWishlist={props.isProductInWishlist} />;
                    
                case 'ShoppableVideoCarouselSection': return <ShoppableVideoCarouselSection key={id} {...componentProps} videos={props.shoppableVideos} allProducts={props.products} onQuickShop={props.onQuickShop} />;
                
                case 'ProductGrid':
                    let gridProducts = props.products;
                    if (componentProps.filter === 'isBestSeller') {
                        gridProducts = props.products.filter(p => p.isBestSeller);
                    }
// FIX: Corrected passing of onToggleWishlist prop, which was causing an error. The prop is available on `props`, not directly in scope.
                    return <ProductGrid key={id} {...componentProps} products={gridProducts.slice(0,8)} onProductQuickView={props.onQuickView} onProductQuickShop={props.onQuickShop} onProductCardClick={(p) => props.navigateToPage('productDetail', p)} onToggleWishlist={props.onToggleWishlist} isProductInWishlist={props.isProductInWishlist} onToggleCompare={props.onToggleCompare} isProductInCompare={props.isProductInCompare} />;

                case 'ShopByLook': 
                    return <ShopByLook key={id} {...componentProps} looks={props.looks} onGetTheLook={(lookTitle, productIds) => props.navigateToPage('shop', { filterByProductIds: productIds, title: lookTitle })} />;
                
                case 'ShopByOccasion': return <ShopByOccasion key={id} {...componentProps} occasions={props.occasions} onOccasionSelect={(o) => props.navigateToPage('shop', { occasion: o })} />;
                
                case 'TestimonialsSlider': return <TestimonialsSlider key={id} {...componentProps} testimonials={props.testimonials} storeName={props.storeName} />;
                
                case 'BlogPreviewSection': return <BlogPreviewSection key={id} {...componentProps} posts={props.cmsPages.filter(p => p.type === 'post').slice(0, 3)} navigateToPage={props.navigateToPage} />;
                
                case 'InstagramBanner': return <InstagramBanner key={id} {...componentProps} storeName={props.storeName} />;
                
                case 'CategoryGrid': return <CategoryGrid key={id} {...componentProps} />;
                
                case 'TopCategories': return <TopCategories key={id} {...componentProps} onCategoryClick={(category) => props.navigateToPage('shop', { category })}>{componentProps.children}</TopCategories>;
                
                case 'PromoGrid2': return <PromoGrid2 key={id} {...componentProps} />;
                case 'TabbedProductGrid': return <TabbedProductGrid key={id} {...componentProps} />;
                case 'CtaSection': return <CtaSection key={id} {...componentProps} />;
                case 'TeamSection': return <TeamSection key={id} {...componentProps} teamMembers={props.teamMembers} />;
                case 'FaqSection': return <FaqSection key={id} {...componentProps} items={props.faqItems} />;
                case 'StatsCounterSection': return <StatsCounterSection key={id} {...componentProps} stats={props.stats} />;
                case 'DividerSection': return <DividerSection key={id} {...componentProps} />;
                case 'ColumnsSection': return <ColumnsSection key={id} {...componentProps}>{componentProps.children}</ColumnsSection>;
                case 'HeadingSection': return <HeadingSection key={id} {...componentProps} />;
                case 'RichTextSection': return <RichTextSection key={id} {...componentProps} />;
                case 'ImageWithTextSection': return <ImageWithTextSection key={id} {...componentProps} />;
                case 'PricingTableSection': return <PricingTableSection key={id} {...componentProps} plans={props.pricingPlans} />;
                case 'VideoEmbedSection': return <VideoEmbedSection key={id} {...componentProps} />;
                case 'GoogleMapSection': return <GoogleMapSection key={id} {...componentProps} />;
                case 'Column': return <ColumnComponent key={id}>{componentProps.children}</ColumnComponent>;
                case 'Element_Heading': return <ElementHeading key={id} {...componentProps} />;
                case 'Element_Text': return <ElementText key={id} {...componentProps} />;
                case 'Element_Image': return <ElementImage key={id} {...componentProps} />;
                case 'Element_Button': return <ElementButton key={id} {...componentProps} />;
                case 'CategoryGridCard': return <CategoryGridCard key={id} {...componentProps} />;
                case 'TopCategoryCard': return <TopCategoryCard key={id} {...componentProps} />;
                default: return <div key={id} className="text-center p-4 bg-red-100">Unsupported Section Type: {type}</div>;
            }
        };

        return (
            <main>
                {props.homepageLayout.map(section => renderNode(section))}
                {/* These components are not part of the editable layout system */}
                <GuidedDiscovery paths={props.guidedDiscovery} onPathSelect={(filters) => props.navigateToPage('shop', { filters })} />
            </main>
        );
    };
    
    // Main App Layout
    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className={`page-content ${currentPage === 'home' || currentPage === 'homepageEditor' || currentPage === 'adminDashboard' ? 'is-home' : ''}`}>
                {(currentPage !== 'adminDashboard' && currentPage !== 'homepageEditor') && (
                    <Header
                        navigateToPage={navigateToPage}
                        onLogout={onLogout}
                        isLoggedIn={isLoggedIn}
                        userRole={currentUser?.role || null}
                        cartItemCount={cartItems.length}
                        wishlistItemCount={wishlistProductIds.size}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        storeName={storeSettings.name}
                        tagline={storeSettings.tagline}
                        headerLinks={headerLinks}
                        logoUrl={storeSettings.logoUrl}
                        products={products}
                        categories={categories}
                        topCategories={topCategories}
                    />
                )}
                {renderPage()}
                {(currentPage !== 'adminDashboard' && currentPage !== 'checkout' && currentPage !== 'homepageEditor') && (
                    <>
                        <Footer 
                            navigateToPage={navigateToPage} 
                            footerSettings={footerSettings} 
                            storeName={storeSettings.name}
                            logoUrl={storeSettings.logoUrl}
                        />
                        <FloatingWhatsAppButton storeName={storeSettings.name}/>
                        <MobileStickyFooter 
                            navigateToPage={navigateToPage} 
                            userRole={currentUser?.role || null}
                        />
                    </>
                )}
            </div>

            {/* Global Modals & Trays */}
            <QuickViewModal
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                product={quickViewProduct}
            />
            <QuickShopModal
                isOpen={!!quickShopProduct}
                onClose={() => setQuickShopProduct(null)}
                product={quickShopProduct}
                onAddToCart={handleAddToCart}
            />
             <CompareTray
                isOpen={isCompareTrayOpen}
                products={compareItems}
                onClose={() => setIsCompareTrayOpen(false)}
                onRemoveFromComparison={(productId) => setCompareItems(prev => prev.filter(p => p.id !== productId))}
                onViewProductDetail={(p) => navigateToPage('productDetail', p)}
            />
             <VirtualTryOnPopup
                isOpen={isVirtualTryOnOpen}
                product={virtualTryOnProduct}
                onClose={() => setIsVirtualTryOnOpen(false)}
            />
            <FirstOrderOfferModal 
                isOpen={showFirstOrderModal}
                onClose={() => setShowFirstOrderModal(false)}
                couponCode="WELCOME100"
                storeName={storeSettings.name}
            />
        </div>
    );
};
