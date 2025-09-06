
import React, { useState } from 'react';
import { ZainaColor, NavLinkItem } from '../../../types';
import MenuIcon from '../../icons/MenuIcon';
import CloseIcon from '../../icons/CloseIcon';

interface DashboardLayoutProps {
  sidebarType: 'tabs' | 'sticky';
  navLinks: (NavLinkItem & { action?: () => void })[];
  activeNavLinkId: string;
  onNavLinkClick: (id: string) => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  brandName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarType,
  navLinks,
  activeNavLinkId,
  onNavLinkClick,
  children,
  headerContent,
  brandName = "Dashboard"
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const SidebarNav = () => (
    <nav className="space-y-1">
      {navLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => {
            if(link.action) {
                link.action();
            } else {
                onNavLinkClick(link.id);
            }
            setIsMobileSidebarOpen(false); // Close sidebar on nav click
          }}
          className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out group
            ${activeNavLinkId === link.id
              ? 'bg-zaina-primary text-zaina-white shadow-sm'
              : `text-zaina-text-primary dark:text-dark-zaina-text-primary hover:bg-zaina-sky-blue-light dark:hover:bg-dark-zaina-sky-blue-light hover:text-zaina-primary dark:hover:text-dark-zaina-primary`}
          `}
          aria-current={activeNavLinkId === link.id ? 'page' : undefined}
        >
          {link.icon && <link.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${activeNavLinkId === link.id ? 'text-zaina-white' : 'text-zaina-primary dark:text-dark-zaina-primary group-hover:text-zaina-primary'}`} />}
          <span>{link.label}</span>
        </button>
      ))}
    </nav>
  );

  const TabNav = () => (
    <nav className="flex flex-wrap border-b border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
      {navLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => link.action ? link.action() : onNavLinkClick(link.id)}
          className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ease-in-out focus:outline-none whitespace-nowrap
            ${activeNavLinkId === link.id
              ? 'border-zaina-primary text-zaina-primary dark:border-dark-zaina-primary dark:text-dark-zaina-primary'
              : 'border-transparent text-zaina-text-secondary dark:text-dark-zaina-text-secondary hover:text-zaina-text-primary dark:hover:text-dark-zaina-text-primary hover:border-zaina-neutral-medium dark:hover:border-dark-zaina-neutral-medium'}
          `}
          aria-current={activeNavLinkId === link.id ? 'page' : undefined}
        >
          {link.icon && <link.icon className="w-4 h-4 mr-1.5 inline-block relative -top-px" />}
          {link.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className={`min-h-[calc(100vh-var(--header-height,142px))] bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light font-body-inter flex ${sidebarType === 'sticky' ? 'flex-row' : 'flex-col'}`}>
      {sidebarType === 'sticky' && (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
                isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
            <aside
                className={`w-64 bg-zaina-white dark:bg-dark-zaina-bg-card p-4 space-y-6 border-r border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium fixed left-0 overflow-y-auto transition-transform duration-300 ease-in-out z-50
                        lg:shadow-sm lg:top-[var(--header-height)] lg:h-[calc(100vh-var(--header-height))] lg:translate-x-0
                        top-0 h-full shadow-2xl 
                        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex justify-between items-center lg:block">
                    <div className="text-xl font-heading-playfair text-zaina-primary dark:text-dark-zaina-primary mb-0 lg:mb-6 text-center pt-2">
                        {brandName}
                    </div>
                    <button className="lg:hidden text-zaina-text-primary dark:text-dark-zaina-text-primary p-1" onClick={() => setIsMobileSidebarOpen(false)}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <SidebarNav />
            </aside>
        </>
      )}

      <main className={`flex-1 ${sidebarType === 'sticky' ? 'lg:ml-64' : ''} p-4 sm:p-6 lg:p-8`}>
        {headerContent && (
            <div className={`mb-6 ${sidebarType === 'tabs' ? 'pb-4' : ''}`}>
                 <div className="flex items-center gap-4">
                    {sidebarType === 'sticky' && (
                    <button
                        className="lg:hidden text-zaina-text-primary dark:text-dark-zaina-text-primary p-1"
                        onClick={() => setIsMobileSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    )}
                    <div className="flex-grow">{headerContent}</div>
                </div>
            </div>
        )}
        {sidebarType === 'tabs' && <TabNav />}
        <div className="bg-zaina-white dark:bg-dark-zaina-bg-card p-4 sm:p-6 rounded-lg shadow-lg">
          {children}
        </div>
      </main>
      
    </div>
  );
};

export default DashboardLayout;