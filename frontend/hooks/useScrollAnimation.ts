
import { useEffect } from 'react';

// Defines the CSS classes to be toggled
const FADE_IN_CLASS = 'opacity-0'; // Initial state
const FADE_IN_ACTIVE_CLASS = 'opacity-100'; // Visible state
const SLIDE_UP_CLASS = 'translate-y-10'; // Initial state for slide up
// Active state for slide up is simply removing translate-y-10 and relying on transition

export const useScrollAnimation = (dependency: any, rootMargin = '0px') => {
  useEffect(() => {
    const targets = document.querySelectorAll('.animate-on-scroll');

    if (!targets.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animation-triggered');
          // unobserve after animation as it should only happen once per page view
          obs.unobserve(entry.target); 
        }
      });
    }, {
      rootMargin: rootMargin, // Trigger as soon as element enters the viewport
      threshold: 0.01 // Trigger as soon as a small part of the element is visible
    });

    targets.forEach(target => {
      // Always reset the state before observing, to handle SPA navigations.
      target.classList.remove('animation-triggered');
      observer.observe(target);
    });

    // Cleanup when dependency changes (e.g., page navigation) or component unmounts.
    return () => {
      observer.disconnect();
    };
  }, [dependency, rootMargin]);
};
