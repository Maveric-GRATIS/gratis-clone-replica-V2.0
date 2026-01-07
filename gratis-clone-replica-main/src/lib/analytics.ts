// Analytics tracking with enhanced Web Vitals monitoring
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

class AnalyticsManager {
  private isInitialized = false;
  private events: AnalyticsEvent[] = [];

  init(measurementId?: string) {
    if (typeof window === 'undefined') return;
    
    // Initialize Google Analytics if measurement ID provided
    if (measurementId && !this.isInitialized) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', measurementId);
      
      this.isInitialized = true;
    }

    // Initialize Web Vitals monitoring
    this.initWebVitals();
  }

  track(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return;

    // Store event for debugging
    this.events.push({ ...event, timestamp: Date.now() } as any);

    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  trackPageView(path: string, title?: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: path,
    });

    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title,
      });
    }
  }

  trackError(error: Error, context?: string) {
    this.track({
      action: 'javascript_error',
      category: 'error',
      label: `${context || 'unknown'}: ${error.message}`,
    });

    // Send to error tracking service
    console.error('🚨 Error tracked:', error, context);
  }

  trackPerformance(metric: WebVitalsMetric) {
    this.track({
      action: 'web_vital',
      category: 'performance',
      label: metric.name,
      value: Math.round(metric.value),
    });
  }

  trackEcommerce(event: 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'view_item', data: any) {
    this.track({
      action: event,
      category: 'ecommerce',
      label: data.item_name || data.item_id,
      value: data.value || data.price,
    });

    if (window.gtag) {
      window.gtag('event', event, data);
    }
  }

  private async initWebVitals() {
    try {
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
      
      onCLS(this.trackPerformance.bind(this));
      onINP(this.trackPerformance.bind(this));
      onFCP(this.trackPerformance.bind(this));
      onLCP(this.trackPerformance.bind(this));
      onTTFB(this.trackPerformance.bind(this));
    } catch (error) {
      console.warn('Web Vitals not available:', error);
    }
  }

  getEvents() {
    return this.events;
  }
}

// Extend window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const analytics = new AnalyticsManager();
export type { AnalyticsEvent, WebVitalsMetric };