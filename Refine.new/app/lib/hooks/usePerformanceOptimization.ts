import { useEffect, useCallback } from 'react';

export function usePerformanceOptimization() {
  // Debounce function for expensive operations
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Throttle function for scroll/resize events
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Preload critical resources
  useEffect(() => {
    const preloadCriticalResources = () => {
      // Preload critical images
      const logoImg = new Image();
      logoImg.src = '/bolt-logo.svg';

      const logoDarkImg = new Image();
      logoDarkImg.src = '/bolt-logo-dark.svg';
    };

    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 100);
    }
  }, []);

  // Optimize images with intersection observer
  useEffect(() => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  }, []);

  // Memory cleanup for large objects
  const cleanupMemory = useCallback(() => {
    // Force garbage collection if available (dev mode)
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  }, []);

  return {
    debounce,
    throttle,
    cleanupMemory,
  };
}
