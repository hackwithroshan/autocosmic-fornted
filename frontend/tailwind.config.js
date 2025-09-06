/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      borderRadius: {
          '2xl': '1rem', // 16px
      },
      colors: {
        // --- NEW ADMIN PALETTE ---
        'admin-bg': '#F8F9FE',
        'admin-sidebar': '#FFFFFF',
        'admin-card': '#FFFFFF',
        'admin-text-primary': '#1F2937',
        'admin-text-secondary': '#6B7280',
        'admin-accent': '#8A5CF5',
        'admin-accent-light': '#F5F3FF',
        'admin-border': '#E5E7EB',
        'admin-green': '#10B981',
        'admin-red': '#EF4444',

        // Custom Footer Colors
        'zaina-footer-bg': '#2C3E50',
        'dark-zaina-footer-bg': '#182533',
        'zaina-cool-white-text': '#F0F4F8',
        'dark-zaina-cool-white-text': '#F0F4F8',
        'zaina-footer-link-hover': 'var(--theme-color-gold, #D4AF37)',
        'dark-zaina-footer-link-hover': 'var(--theme-color-gold, #D4AF37)',
        'zaina-slate-gray-text': '#A0AEC0',
        'dark-zaina-slate-gray-text': '#A0AEC0',
        'zaina-input-bg-footer': '#34495E',
        'dark-zaina-input-bg-footer': '#2C3E50',

        // Existing Elegant Palette - NOW USING CSS VARIABLES
        'zaina-primary': 'var(--theme-color-primary, #4A90E2)',         // Powdery Blue (accents, links, secondary buttons)
        'zaina-gold': 'var(--theme-color-gold, #D4AF37)',            // Gold (Primary CTAs, prices, highlights)
        'zaina-sky-blue-light': '#DAE7F3',  // Soft Pastel Blue (main light backgrounds)
        'zaina-cta-blue': 'var(--theme-color-cta-blue, #1F3FBA)',        // New CTA Blue for specific buttons
        
        'zaina-white': '#FFFFFF',
        'zaina-neutral-light': '#F8F9FA',   // Off White / Cool White (cards, alternative light backgrounds)
        'zaina-neutral-medium': '#E9ECEF',  // Light Cool Gray (borders, disabled states, subtle UI elements)
        
        'zaina-text-primary': '#2C3E50',    // Deep Slate Blue (main text)
        'zaina-text-secondary': '#7F8C9A',  // Softer Slate Gray for secondary text (was #BDC3C7, making it a bit darker for better readability)
        'zaina-slate-gray': '#7F8C9A',      // Alias for new zaina-text-secondary

        // Retain specific utility colors if necessary, or map them
        'zaina-deep-red-accent': '#B42B2B', // For errors or critical alerts
        'zaina-alert-orange': '#F39C12', // For low stock warnings
        
        // Dark Mode Specific Colors
        'dark': {
          'zaina-primary': '#63B3ED',          // Lighter Blue for dark mode accents/links
          'zaina-gold': 'var(--theme-color-gold, #D4AF37)',            // Gold remains gold
          'zaina-sky-blue-light': '#2A4B6D',  // Darker Pastel Blue for some dark backgrounds/accents
          'zaina-cta-blue': '#3B65CE',        // Darker variant of CTA Blue
          
          'zaina-neutral-light': '#182533',    // Main dark bg (Deep Navy/Charcoal)
          'zaina-bg-card': '#2C3E50',          // Card backgrounds (Deep Slate Blue)
          'zaina-neutral-medium': '#34495E',   // Darker Gray for borders/UI elements in dark
          
          'zaina-text-primary': '#F0F4F8',     // Main text in dark (Light Gray/Off-White)
          'zaina-text-secondary': '#A0AEC0',   // Lighter slate gray for dark mode secondary text
          'zaina-alert-orange': '#E67E22',      // Dark mode alert orange

          // --- NEW DARK ADMIN COLORS ---
          'admin-bg': '#111827',
          'admin-sidebar': '#1F2937',
          'admin-card': '#1F2937',
          'admin-text-primary': '#F9FAFB',
          'admin-text-secondary': '#9CA3AF',
          'admin-accent-light': '#3730A3', 
          'admin-border': '#374151',
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'], // Default sans-serif
        'heading-display': ['Playfair Display', 'serif'], // For main page titles
        'heading-cinzel': ['Cinzel', 'serif'],       // For very large, impactful titles (e.g., Hero)
        'heading-cormorant': ['Cormorant Garamond', 'serif'], // For other headings, card titles
        'body-inter': ['Inter', 'sans-serif'], 
        'body-jost': ['Poppins', 'sans-serif'], 
        'body-work-sans': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'top-strong': '0 -3px 12px rgba(42, 75, 109, 0.08)', // dark-zaina-sky-blue-light with opacity
        'dark-top-strong': '0 -3px 12px rgba(212, 175, 55, 0.08)', // zaina-gold with opacity
        'floating-bar': '0 -2px 10px rgba(224, 224, 224, 0.2)', // For floating add to cart bar (using #E0E0E0 at 20%)
        'dark-floating-bar': '0 -2px 10px rgba(0, 0, 0, 0.25)', // Darker shadow for dark mode
        'admin-soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'dark-admin-soft': '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: [],
}
