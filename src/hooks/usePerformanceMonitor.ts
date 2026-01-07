import { useEffect, useState } from 'react';
import { analytics } from '@/lib/analytics';

interface PerformanceMetrics {
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  pageLoadTime: number;
  domContentLoaded: number;
}

interface ResourceMetrics {
  totalResources: number;
  totalSize: number;
  slowResources: Array<{
    name: string;
    duration: number;
    size: number;
  }>;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [resources, setResources] = useState<ResourceMetrics>({ 
    totalResources: 0, 
    totalSize: 0, 
    slowResources: [] 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectMetrics = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const newMetrics: Partial<PerformanceMetrics> = {};

      // Basic timing metrics
      if (navigation) {
        newMetrics.timeToFirstByte = navigation.responseStart - navigation.requestStart;
        newMetrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        newMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      }

      // Paint metrics
      paint.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          newMetrics.firstContentfulPaint = entry.startTime;
        }
      });

      setMetrics(newMetrics);

      // Track performance metrics
      Object.entries(newMetrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          analytics.track({
            action: 'performance_metric',
            category: 'performance',
            label: key,
            value: Math.round(value),
          });
        }
      });
    };

    const collectResourceMetrics = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;
      const slowResources: ResourceMetrics['slowResources'] = [];

      resourceEntries.forEach((entry) => {
        const duration = entry.responseEnd - entry.startTime;
        const size = entry.transferSize || 0;
        totalSize += size;

        // Flag slow resources (>1000ms)
        if (duration > 1000) {
          slowResources.push({
            name: entry.name.split('/').pop() || entry.name,
            duration: Math.round(duration),
            size: Math.round(size / 1024), // KB
          });
        }
      });

      setResources({
        totalResources: resourceEntries.length,
        totalSize: Math.round(totalSize / 1024), // KB
        slowResources,
      });

      // Track resource performance
      analytics.track({
        action: 'resource_performance',
        category: 'performance',
        label: 'total_resources',
        value: resourceEntries.length,
      });

      analytics.track({
        action: 'resource_performance',
        category: 'performance',
        label: 'total_size_kb',
        value: Math.round(totalSize / 1024),
      });
    };

  const collectWebVitals = async () => {
    try {
      // Dynamic import for web-vitals
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
      
      onCLS((metric) => {
        setMetrics(prev => ({ ...prev, cumulativeLayoutShift: metric.value }));
      });
      
      onINP((metric) => {
        setMetrics(prev => ({ ...prev, firstInputDelay: metric.value }));
      });
      
      onFCP((metric) => {
        setMetrics(prev => ({ ...prev, firstContentfulPaint: metric.value }));
      });
      
      onLCP((metric) => {
        setMetrics(prev => ({ ...prev, largestContentfulPaint: metric.value }));
      });
      
      onTTFB((metric) => {
        setMetrics(prev => ({ ...prev, timeToFirstByte: metric.value }));
      });
    } catch (error) {
      console.warn('Web Vitals library not available');
    }
  };

    // Wait for page load
    if (document.readyState === 'complete') {
      collectMetrics();
      collectResourceMetrics();
      setIsLoading(false);
    } else {
      window.addEventListener('load', () => {
        // Slight delay to ensure all metrics are available
        setTimeout(() => {
          collectMetrics();
          collectResourceMetrics();
          setIsLoading(false);
        }, 100);
      });
    }

    // Collect Web Vitals
    collectWebVitals();

    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, []);

  const getPerformanceGrade = (): 'excellent' | 'good' | 'needs-improvement' | 'poor' => {
    const { largestContentfulPaint, firstInputDelay, cumulativeLayoutShift } = metrics;
    
    let score = 0;
    let total = 0;

    if (largestContentfulPaint) {
      total++;
      if (largestContentfulPaint <= 2500) score++;
      else if (largestContentfulPaint <= 4000) score += 0.5;
    }

    if (firstInputDelay) {
      total++;
      if (firstInputDelay <= 100) score++;
      else if (firstInputDelay <= 300) score += 0.5;
    }

    if (cumulativeLayoutShift !== undefined) {
      total++;
      if (cumulativeLayoutShift <= 0.1) score++;
      else if (cumulativeLayoutShift <= 0.25) score += 0.5;
    }

    if (total === 0) return 'good';

    const percentage = score / total;
    if (percentage >= 0.9) return 'excellent';
    if (percentage >= 0.7) return 'good';
    if (percentage >= 0.5) return 'needs-improvement';
    return 'poor';
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize largest contentful paint by reducing image sizes');
    }
    
    if (metrics.firstInputDelay && metrics.firstInputDelay > 100) {
      recommendations.push('Reduce JavaScript execution time to improve interactivity');
    }
    
    if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Add size attributes to images to prevent layout shifts');
    }
    
    if (resources.slowResources.length > 0) {
      recommendations.push(`Optimize ${resources.slowResources.length} slow-loading resources`);
    }
    
    if (resources.totalSize > 3000) {
      recommendations.push('Consider reducing total page size for faster loading');
    }

    return recommendations;
  };

  return {
    metrics,
    resources,
    isLoading,
    grade: getPerformanceGrade(),
    recommendations: getRecommendations(),
  };
};