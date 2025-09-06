

import React, { useState } from 'react';
import { AdminNavLink, AdminNavLinkItem, NavLinkItem } from '../../../types';
import LogOutIcon from '../../icons/LogOutIcon';
import ChevronLeftIcon from '../../icons/ChevronLeftIcon';
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import ChevronUpIcon from '../../icons/ChevronUpIcon';
import PlusIcon from '../../icons/PlusIcon';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import CloseIcon from '../../icons/CloseIcon';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navLinks: AdminNavLink[];
  activeNavLinkId: string;
  onNavLinkClick: (id: string) => void;
  storeName: string;
  hasNewTicketNotification: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  setIsOpen,
  navLinks,
  activeNavLinkId,
  onNavLinkClick,
  storeName,
  hasNewTicketNotification
}) => {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const handleNavLinkClick = (link: AdminNavLinkItem) => {
    // If it's an item with sublinks, just toggle its open state and do not navigate.
    if (link.subLinks && link.subLinks.length > 0) {
        setOpenMenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(link.id)) {
                newSet.delete(link.id);
            } else {
                newSet.add(link.id);
            }
            return newSet;
        });
    } else {
      // If it's a clickable item without sublinks, perform its action.
      if (link.action) {
        link.action();
      } else {
        onNavLinkClick(link.id);
      }
      // Close mobile sidebar on any nav click that causes navigation.
      if (window.innerWidth < 1024) {
          setIsOpen(false);
      }
    }
  };
  
  const isMenuActive = (link: AdminNavLinkItem): boolean => {
    if (link.id === activeNavLinkId) return true;
    if (link.subLinks) {
        return link.subLinks.some((subLink: NavLinkItem) => subLink.id === activeNavLinkId);
    }
    return false;
  }
  
  React.useEffect(() => {
    // Automatically open the parent menu of the active sublink on load
    const parentMenu = navLinks.find(link => 'subLinks' in link && link.subLinks && link.subLinks.some(sl => sl.id === activeNavLinkId));
    if (parentMenu && 'id' in parentMenu) {
        setOpenMenus(prev => new Set(prev).add(parentMenu.id));
    }
  }, [activeNavLinkId, navLinks]);


  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-admin-sidebar dark:bg-dark-admin-sidebar z-40 transition-all duration-300 ease-in-out border-r border-admin-border dark:border-dark-admin-border flex flex-col 
      ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}`}
    >
      {/* Collapse/Expand Toggle for Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-14 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full p-1 border border-gray-200 dark:border-gray-600 shadow-md hover:scale-110 transition-transform hidden lg:block"
        title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {isOpen ? <ChevronLeftIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
      </button>

       {/* Logo & Mobile Close */}
      <div className={`flex items-center gap-3 px-4 h-16 flex-shrink-0 border-b border-admin-border dark:border-dark-admin-border ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-admin-accent rounded-lg flex items-center justify-center font-bold text-white text-xl">
             {storeName.charAt(0)}
          </div>
          <div className={`flex-grow transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              <h3 className="font-semibold text-sm text-admin-text-primary dark:text-dark-admin-text-primary whitespace-nowrap">{storeName}</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-admin-text-secondary dark:text-dark-admin-text-secondary">
            <CloseIcon className="w-5 h-5"/>
          </button>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-grow px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navLinks.map((link, index) => {
          if ('type' in link && link.type === 'header') {
            return (
              <p key={`header-${index}`} className={`text-xs font-bold text-admin-text-secondary uppercase px-2 mb-2 mt-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}>
                {link.label}
              </p>
            );
          } else {
            const navItem = link as AdminNavLinkItem;
            const isActive = isMenuActive(navItem);
            const showNotification = navItem.id === 'support' && hasNewTicketNotification;
            return (
              <div key={navItem.id}>
                <button
                  onClick={() => handleNavLinkClick(navItem)}
                  title={!isOpen ? navItem.label : ''}
                  className={`w-full flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200 group relative ${
                    isActive
                      ? 'bg-admin-accent-light dark:bg-dark-admin-accent-light text-admin-accent font-semibold'
                      : 'text-admin-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-admin-text-primary'
                  }`}
                >
                  {navItem.icon && <navItem.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-admin-accent' : ''}`} />}
                  <span className={`ml-4 flex-grow text-left transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {navItem.label}
                  </span>
                   {showNotification && isOpen && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                  {navItem.subLinks && isOpen && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ml-2 ${openMenus.has(navItem.id) ? 'rotate-180' : 'rotate-0'}`} />
                  )}
                  {showNotification && !isOpen && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>

                {/* Submenu inline (for expanded sidebar) */}
                {navItem.subLinks && isOpen && openMenus.has(navItem.id) && (
                    <div className="pl-6 mt-1 space-y-1">
                        {navItem.subLinks.map(subLink => (
                             <button key={subLink.id} onClick={() => onNavLinkClick(subLink.id)} className={`w-full text-left flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${activeNavLinkId === subLink.id ? 'text-admin-accent font-semibold' : 'text-admin-text-secondary hover:text-admin-text-primary'}`}>
                                {subLink.label}
                             </button>
                        ))}
                    </div>
                )}
              </div>
            );
          }
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;