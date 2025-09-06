
import React from 'react';
import { MobileFooterLink, ZainaColor, PageName, UserRole } from '../types';
import { MOBILE_FOOTER_LINKS_DATA } from '../constants';

interface MobileStickyFooterProps {
  navigateToPage: (page: PageName, data?: any) => void;
  userRole: UserRole;
}

const MobileStickyFooter: React.FC<MobileStickyFooterProps> = ({ navigateToPage, userRole }) => {
  if (!MOBILE_FOOTER_LINKS_DATA || MOBILE_FOOTER_LINKS_DATA.length === 0) return null;

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, link: MobileFooterLink) => {
    event.preventDefault(); 
    let pageName: PageName | undefined = link.pageName as PageName;

    if (!pageName) {
        const labelLower = link.label.toLowerCase();
        if (labelLower === 'home') pageName = 'home';
        else if (labelLower === 'explore' || labelLower === 'search') pageName = 'shop';
        else if (labelLower === 'profile' || labelLower === 'login') pageName = 'auth'; // Default for logged out
        else {
            alert(`Navigating to ${link.label} (placeholder action). Full functionality to be implemented.`);
            return;
        }
    }
    
    // Authorization override for profile link
    if (link.id === 'profile') {
        if (userRole === 'admin' || (typeof userRole === 'string' && userRole.toLowerCase().includes('admin'))) {
            pageName = 'adminDashboard';
        } else if (userRole === 'user') {
            pageName = 'userDashboard';
        } else {
            pageName = 'auth'; // If not logged in, go to auth
        }
    }
    
    if (pageName) {
        navigateToPage(pageName);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zaina-white/95 dark:bg-dark-zaina-bg-card/95 backdrop-blur-sm border-t border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium shadow-top-strong z-[80] flex justify-around items-stretch h-16"
         aria-label="Mobile Bottom Navigation">
      {MOBILE_FOOTER_LINKS_DATA.map((link) => (
        <a
          key={link.id}
          href={link.href} 
          onClick={(e) => handleLinkClick(e, link)}
          aria-label={link.ariaLabel}
          className="flex flex-col items-center justify-center text-zaina-text-primary dark:text-dark-zaina-text-secondary hover:text-zaina-primary active:text-zaina-primary transition-colors p-1 flex-1 text-center focus:outline-none focus:bg-zaina-neutral-light dark:focus:bg-dark-zaina-neutral-medium"
        >
          <link.icon className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">{link.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default MobileStickyFooter;