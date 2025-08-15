import { Suspense, lazy, useState, useEffect, useRef, type ComponentType } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500"></div>
  </div>
);

export function LazyComponent({ 
  fallback = <LoadingSpinner />, 
  children 
}: LazyComponentProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyLoadedComponent = lazy(importFunc);
  
  return function WrappedComponent(props: P) {
    return (
      <LazyComponent fallback={fallback}>
        <LazyLoadedComponent {...props} />
      </LazyComponent>
    );
  };
}

// Intersection Observer based lazy loading for heavy components
export function LazyIntersectionComponent({ 
  children, 
  fallback = <LoadingSpinner />,
  rootMargin = '50px',
  threshold = 0.1 
}: LazyComponentProps & {
  rootMargin?: string;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}
