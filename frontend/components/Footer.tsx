
import React from 'react';
import { PageName, FooterSettings } from '../types';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import TwitterIcon from './icons/TwitterIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import PriceTagIcon from './icons/PriceTagIcon';
import TruckIcon from './icons/TruckIcon';
import DealIcon from './icons/DealIcon';
import LayersIcon from './icons/LayersIcon';
import ReturnIcon from './icons/ReturnIcon';
import MapPinIcon from './icons/MapPinIcon';
import HeadsetIcon from './icons/HeadsetIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import ClockIcon from './icons/ClockIcon';

interface FooterProps {
  navigateToPage: (page: PageName, data?: any) => void;
  footerSettings: FooterSettings;
  storeName: string;
  logoUrl?: string;
}

const FeatureCard = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <div className="bg-white dark:bg-dark-zaina-bg-card p-4 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="flex-shrink-0 text-zaina-primary dark:text-dark-zaina-primary">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-dark-zaina-text-primary">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-dark-zaina-text-secondary">{subtitle}</p>
    </div>
  </div>
);

const Footer: React.FC<FooterProps> = ({ navigateToPage, footerSettings, storeName, logoUrl }) => {
  
  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
        const page = href.split('/')[1] as PageName;
        const policySlug = href.includes('/policies/') ? href.split('/').pop() : null;

        if (policySlug) {
             navigateToPage('policy', { title: policySlug.replace(/-/g, ' ') });
        } else {
            navigateToPage(page);
        }
    } else {
        window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const copyrightText = (footerSettings?.copyrightText || '').replace('%STORE_NAME%', storeName);

  const features = [
    { icon: <PriceTagIcon className="w-8 h-8"/>, title: "Best prices & offers", subtitle: "Orders $50 or more" },
    { icon: <TruckIcon className="w-8 h-8"/>, title: "Free delivery", subtitle: "24/7 amazing services" },
    { icon: <DealIcon className="w-8 h-8"/>, title: "Great daily deal", subtitle: "When you sign up" },
    { icon: <LayersIcon className="w-8 h-8"/>, title: "Wide assortment", subtitle: "Mega Discounts" },
    { icon: <ReturnIcon className="w-8 h-8"/>, title: "Easy returns", subtitle: "Within 30 days" },
  ];

  return (
    <>
      <section className="bg-gray-100 dark:bg-dark-zaina-neutral-light/50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
          </div>
        </div>
      </section>
      
      <footer className="bg-white dark:bg-dark-zaina-bg-card font-body-jost text-gray-700 dark:text-zaina-slate-gray-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
            
            {/* Brand and Contact Column */}
            <div className="lg:col-span-4">
               <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('home'); }} className="flex items-center gap-2 group mb-4">
                  {logoUrl ? (
                      <img src={logoUrl} alt={storeName} className="h-10 max-h-10 object-contain" />
                  ) : (
                    <>
                        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7.00018L18.41 18.0602C18.2705 19.1352 17.3824 19.9602 16.304 19.9602H7.69601C6.61759 19.9602 5.72954 19.1352 5.59001 18.0602L4 7.00018" stroke="currentColor" className="text-zaina-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 7.00018C8 5.00018 9 4.00018 12 4.00018C15 4.00018 16 5.00018 16 7.00018" stroke="currentColor" className="text-zaina-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div>
                            <span className="text-2xl font-bold font-heading-cormorant text-gray-800 dark:text-gray-100 group-hover:text-zaina-primary transition-colors">{storeName}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">Elegant Ethnic Fashion</p>
                        </div>
                    </>
                  )}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discover timeless elegance and meticulous craftsmanship.</p>
              <div className="space-y-3 mt-6 text-sm">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 mt-1 text-zaina-primary flex-shrink-0" />
                  <div><strong className="text-gray-800 dark:text-gray-200">Address:</strong> 5171 W Campbell Ave undefined Kent, Utah 53127 United States</div>
                </div>
                 <div className="flex items-start gap-3">
                  <HeadsetIcon className="w-5 h-5 mt-1 text-zaina-primary flex-shrink-0" />
                  <div><strong className="text-gray-800 dark:text-gray-200">Call Us:</strong> (+91) - 540-025-124553</div>
                </div>
                 <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 mt-1 text-zaina-primary flex-shrink-0" />
                  <div><strong className="text-gray-800 dark:text-gray-200">Email:</strong> sale@{storeName.toLowerCase().replace(/\s+/g, '')}.com</div>
                </div>
                 <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 mt-1 text-zaina-primary flex-shrink-0" />
                  <div><strong className="text-gray-800 dark:text-gray-200">Hours:</strong> 10:00 - 18:00, Mon - Sat</div>
                </div>
              </div>
            </div>
            
            {/* Dynamic Columns */}
            {footerSettings.columns.map((col) => (
              <div key={col.id} className="lg:col-span-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.id}>
                      <a href={link.href} onClick={(e) => handleFooterLinkClick(e, link.href)} className="text-sm hover:text-zaina-primary dark:hover:text-dark-zaina-primary transition-all duration-300">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-dark-zaina-neutral-medium py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
              {copyrightText}
            </p>
            <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Follow Us</span>
                <div className="flex space-x-3">
                    {footerSettings.socialLinks.facebook && (
                        <a href={footerSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center bg-zaina-primary/10 dark:bg-dark-zaina-primary/20 text-zaina-primary dark:text-dark-zaina-primary rounded-full hover:bg-zaina-primary hover:text-white transition-colors duration-300">
                        <FacebookIcon className="w-4 h-4" />
                        </a>
                    )}
                    {footerSettings.socialLinks.twitter && (
                        <a href={footerSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 flex items-center justify-center bg-zaina-primary/10 dark:bg-dark-zaina-primary/20 text-zaina-primary dark:text-dark-zaina-primary rounded-full hover:bg-zaina-primary hover:text-white transition-colors duration-300">
                        <TwitterIcon className="w-4 h-4" />
                        </a>
                    )}
                    {footerSettings.socialLinks.instagram && (
                        <a href={footerSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center bg-zaina-primary/10 dark:bg-dark-zaina-primary/20 text-zaina-primary dark:text-dark-zaina-primary rounded-full hover:bg-zaina-primary hover:text-white transition-colors duration-300">
                        <InstagramIcon className="w-4 h-4" />
                        </a>
                    )}
                    <a href="#" aria-label="YouTube" className="w-8 h-8 flex items-center justify-center bg-zaina-primary/10 dark:bg-dark-zaina-primary/20 text-zaina-primary dark:text-dark-zaina-primary rounded-full hover:bg-zaina-primary hover:text-white transition-colors duration-300">
                        <YouTubeIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
