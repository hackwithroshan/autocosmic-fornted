
import React, { useState } from 'react';
import { NavLinkItem, Notification, PageName, UserProfile, AdminUser } from '../../../types';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  navLinks: any[];
  activeNavLinkId: string;
  onNavLinkClick: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  pageTitle: string;
  onLogout: () => void;
  children: React.ReactNode;
  onNavigate: (page: PageName | string, data?: any) => void;
  currentUser: UserProfile | AdminUser | null;
  storeName: string;
  hasNewTicketNotification: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  navLinks,
  activeNavLinkId,
  onNavLinkClick,
  isDarkMode,
  toggleDarkMode,
  pageTitle,
  onLogout,
  onNavigate,
  currentUser,
  storeName,
  hasNewTicketNotification,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-admin-bg dark:bg-dark-admin-bg min-h-screen font-inter text-admin-text-primary dark:text-dark-admin-text-primary">
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        navLinks={navLinks}
        activeNavLinkId={activeNavLinkId}
        onNavLinkClick={onNavLinkClick}
        storeName={storeName}
        hasNewTicketNotification={hasNewTicketNotification}
      />
      <div
        className={`relative min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <AdminHeader
          pageTitle={pageTitle}
          onLogout={onLogout}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onNavigate={onNavigate}
          currentUser={currentUser}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
       {/* Mobile Overlay */}
       <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
    </div>
  );
};

export default AdminLayout;
