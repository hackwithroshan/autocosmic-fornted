


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PageName, UserRole, Category, NavLinkItem, Product, TopCategoryItem } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import HeartIcon from './icons/HeartIcon';
import SearchIcon from './icons/SearchIcon';
import UserIcon from './icons/UserIcon';
import MobileMenu from './MobileMenu';
import MobileSearchOverlay from './MobileSearchOverlay';
import GridIcon from './icons/GridIcon'; 
import SunIcon from './icons/SunIcon'; 
import MoonIcon from './icons/MoonIcon'; 
import ChevronDownIcon from './icons/ChevronDownIcon';
import HeadsetIcon from './icons/HeadsetIcon';
import IndiaFlagIcon from './icons/IndiaFlagIcon';
import CloseIcon from './icons/CloseIcon';
import MenuIcon from './icons/MenuIcon';
import AnimatedSearchBar from './AnimatedSearchBar';


interface HeaderProps {
  navigateToPage: (page: PageName, data?: any) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  userRole: UserRole;
  cartItemCount: number;
  wishlistItemCount: number;
  isDarkMode: boolean; 
  toggleDarkMode: () => void; 
  storeName: string;
  tagline: string;
  headerLinks: NavLinkItem[];
  logoUrl?: string;
  products: Product[];
  categories: Category[];
  topCategories: TopCategoryItem[];
}

const Header: React.FC<HeaderProps> = ({ 
    navigateToPage, 
    onLogout, 
    isLoggedIn, 
    userRole, 
    cartItemCount,
    wishlistItemCount,
    isDarkMode, 
    toggleDarkMode,
    storeName,
    tagline,
    headerLinks,
    logoUrl,
    products,
    categories,
    topCategories,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isTopStripVisible, setIsTopStripVisible] = useState(true);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  const categoryNames = useMemo(() => categories.map(c => c.name), [categories]);
  const popularChoiceNames = useMemo(() => topCategories.map(c => c.name), [topCategories]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

  const handleNavClick = (e: React.MouseEvent, link: NavLinkItem) => {
    e.preventDefault();
    setShowUserDropdown(false);
    
    if (link.pageName) {
        navigateToPage(link.pageName, { category: link.category });
    } else if (link.href?.startsWith('/')) {
        const page = link.href.split('/')[1] as PageName;
        const data = link.href.includes('/policies/') ? { title: link.label } : null;
        navigateToPage(page || 'home', data);
    } else if (link.href?.startsWith('#')) {
        const element = document.getElementById(link.href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.open(link.href, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateToPage('home');
  };

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowUserDropdown(false);
    onLogout();
  }

  let augmentedNavLinks: NavLinkItem[] = [...headerLinks];
  if (isLoggedIn && userRole?.toLowerCase() === 'admin') {
    if(!augmentedNavLinks.find(l => l.id === 'admin')) {
      augmentedNavLinks.push({ id: 'admin', label: 'ADMIN PANEL', href: '#', pageName: 'adminDashboard', icon: GridIcon, type: 'link', order: 99, visible: true });
    }
  }

  const visibleLinks = augmentedNavLinks
    .filter(link => link.visible)
    .sort((a, b) => a.order - b.order);

  const Logo = () => (
     <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group">
        {logoUrl ? (
            <img src={logoUrl} alt={storeName} className="h-10 max-h-10 object-contain" />
        ) : (
            <>
                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                    <path d="M20 7.00018L18.41 18.0602C18.2705 19.1352 17.3824 19.9602 16.304 19.9602H7.69601C6.61759 19.9602 5.72954 19.1352 5.59001 18.0602L4 7.00018" stroke="currentColor" className="text-zaina-primary dark:text-dark-zaina-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 7.00018C8 5.00018 9 4.00018 12 4.00018C15 4.00018 16 5.00018 16 7.00018" stroke="currentColor" className="text-zaina-primary dark:text-dark-zaina-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="hidden sm:block">
                    <span className="text-2xl font-bold font-heading-cormorant text-zaina-text-primary dark:text-dark-zaina-text-primary group-hover:text-zaina-primary dark:group-hover:text-dark-zaina-primary transition-colors">{storeName}</span>
                    <p className="text-xs text-zaina-text-secondary dark:text-dark-zaina-text-secondary tracking-widest uppercase">{tagline}</p>
                </div>
            </>
        )}
    </a>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-shadow duration-300 ease-in-out">
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isTopStripVisible ? 'max-h-12' : 'max-h-0'}`}>
            <div className="relative bg-zaina-primary dark:bg-dark-zaina-primary text-zaina-white dark:text-dark-zaina-text-primary text-center py-1.5 px-8 text-xs sm:text-sm font-body-jost font-medium">
                <span>✨ Get 10% OFF on your first order — Use code ZAINA10</span>
                <button 
                    onClick={() => setIsTopStripVisible(false)} 
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Dismiss offer"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="flex flex-col bg-zaina-white dark:bg-dark-zaina-bg-card shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-8 h-[68px] lg:h-[88px] border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex-1 flex justify-start">
                    <button onClick={toggleMobileMenu} className="lg:hidden p-2 -ml-2 text-zaina-text-primary dark:text-dark-zaina-text-primary" aria-label="Open menu">
                        <MenuIcon className="w-6 h-6"/>
                    </button>
                    <div className="hidden lg:flex flex-shrink-0">
                       <Logo />
                    </div>
                </div>

                 <div className="lg:hidden flex-shrink-0">
                    <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group">
                        {logoUrl ? (
                             <img src={logoUrl} alt={storeName} className="h-9 max-h-9 object-contain" />
                        ) : (
                            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
                                <path d="M20 7.00018L18.41 18.0602C18.2705 19.1352 17.3824 19.9602 16.304 19.9602H7.69601C6.61759 19.9602 5.72954 19.1352 5.59001 18.0602L4 7.00018" stroke="currentColor" className="text-zaina-gold" strokeWidth="1.5"/>
                                <path d="M8 7.00018C8 5.00018 9 4.00018 12 4.00018C15 4.00018 16 5.00018 16 7.00018" stroke="currentColor" className="text-zaina-gold" strokeWidth="1.5"/>
                            </svg>
                        )}
                    </a>
                </div>
                
                <div className="hidden lg:flex flex-1 px-8 lg:px-12">
                    <AnimatedSearchBar 
                        categories={categoryNames}
                        popularChoices={popularChoiceNames}
                        navigateToPage={navigateToPage}
                    />
                </div>

                <div className="flex-1 flex justify-end items-center space-x-2 md:space-x-4 lg:space-x-5">
                    <button onClick={toggleMobileSearch} className="lg:hidden p-2 text-zaina-text-primary dark:text-dark-zaina-text-primary" aria-label="Open search">
                        <SearchIcon className="w-6 h-6"/>
                    </button>
                    <a href="#" onClick={(e) => handleNavClick(e, {id:'cart', pageName: 'cart', href: '#', type: 'link', label: 'Cart', order:0, visible: true})} className="relative p-2" aria-label="Shopping Cart">
                        <ShoppingCartIcon className="w-6 h-6 text-zaina-text-primary dark:text-dark-zaina-text-primary"/>
                        {cartItemCount > 0 && <span className="absolute top-0 right-0 bg-zaina-primary text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">{cartItemCount}</span>}
                    </a>
                    
                    <div className="hidden lg:flex items-center space-x-4 lg:space-x-5">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-dark-zaina-neutral-medium transition-colors">
                            <IndiaFlagIcon className="w-5 h-5 rounded-sm"/>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">India</span>
                            <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('userDashboard', {section: 'wishlist'});}} className="relative flex items-center gap-1.5 p-2" aria-label="Wishlist">
                            <HeartIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                            <span className="text-sm text-gray-700 dark:text-gray-200 hidden xl:inline">Wishlist</span>
                            {wishlistItemCount > 0 && <span className="absolute top-0 right-0 bg-zaina-primary text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">{wishlistItemCount}</span>}
                        </a>
                    </div>
                    
                    <div className="relative flex-shrink-0" ref={userDropdownRef}>
                        <button
                            onClick={() => {
                                if (isLoggedIn) {
                                    setShowUserDropdown(prev => !prev);
                                } else {
                                    navigateToPage('auth');
                                }
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-zaina-neutral-medium"
                            aria-label={isLoggedIn ? "User Menu" : "Login or Register"}
                            aria-haspopup={isLoggedIn}
                            aria-expanded={isLoggedIn ? showUserDropdown : undefined}
                        >
                            <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                        {isLoggedIn && showUserDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-zaina-white dark:bg-dark-zaina-bg-card rounded-md shadow-lg py-1 z-50 ring-1 ring-black dark:ring-dark-zaina-neutral-medium ring-opacity-5">
                                <a href="#" onClick={(e) => {
                                    const page = userRole?.toLowerCase() === 'admin' ? 'adminDashboard' : 'userDashboard';
                                    handleNavClick(e, {id: page, pageName: page, href: '#', type: 'link', label: 'Dashboard', order:0, visible:true});
                                }} className="block px-4 py-2 text-sm text-zaina-text-primary dark:text-dark-zaina-text-primary hover:bg-zaina-sky-blue-light dark:hover:bg-dark-zaina-sky-blue-light">{userRole?.toLowerCase() === 'admin' ? 'Admin Panel' : 'Dashboard'}</a>
                                <hr className="my-1 border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium" />
                                <button onClick={handleLogoutClick} className="w-full text-left block px-4 py-2 text-sm text-zaina-text-primary dark:text-dark-zaina-text-primary hover:bg-zaina-sky-blue-light dark:hover:bg-dark-zaina-sky-blue-light">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex items-center justify-between px-6 lg:px-8 h-[50px]">
                 <button onClick={() => navigateToPage('shop')} className="bg-zaina-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-zaina-cta-blue transition-colors flex items-center gap-2">
                    <GridIcon className="w-4 h-4"/>
                    Browse All Categories
                </button>
                <nav className="flex-1 flex justify-center">
                    <ul className="flex items-center space-x-6 lg:space-x-8">
                        {visibleLinks.map(link => (
                            <li key={link.id} className="relative group h-full flex items-center">
                                <a href={link.href} onClick={(e) => handleNavClick(e, link)} className="flex items-center gap-1.5 font-body-jost text-sm font-medium tracking-wide transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-zaina-primary dark:hover:text-dark-zaina-primary nav-link-underline relative">
                                    {link.label}
                                    {link.type !== 'link' && link.subLinks && link.subLinks.length > 0 && <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-3">
                     <button onClick={toggleDarkMode} className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary hover:text-zaina-gold dark:hover:text-zaina-gold transition-colors p-1.5" aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                        {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-zaina-primary" />}
                    </button>
                    <HeadsetIcon className="w-8 h-8 text-gray-700 dark:text-gray-200"/>
                    <div>
                        <p className="text-base font-semibold text-zaina-primary">1900-888</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">24/7 Support Center</p>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} navLinks={augmentedNavLinks} navigateToPage={navigateToPage} onLogout={onLogout} isLoggedIn={isLoggedIn} userRole={userRole} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} storeName={storeName} />
      <MobileSearchOverlay isOpen={isMobileSearchOpen} onClose={toggleMobileSearch} navigateToPage={navigateToPage} products={products} popularChoices={popularChoiceNames} />
    </>
  );
};

export default Header;