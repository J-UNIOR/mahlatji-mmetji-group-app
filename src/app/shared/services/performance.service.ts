import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  
  platformId = inject(PLATFORM_ID);

  /**
   * Preload critical images
   */
  preloadImages(imageUrls: string[]): Promise<void[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve([]);
    }

    const promises = imageUrls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(`Failed to load ${url}`);
        img.src = url;
      });
    });

    return Promise.all(promises);
  }

  /**
   * Optimize image URL with query parameters for different sizes
   */
  getOptimizedImageUrl(
    originalUrl: string, 
  // width?: number, 
  // quality removed as unused
  ): string {
    // For now, return original URL. In production, you'd use a CDN with image optimization
    return originalUrl;
  }

  /**
   * Generate WebP fallback
   */
  getWebPUrl(originalUrl: string): string {
    return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  /**
   * Check if WebP is supported
   */
  supportsWebP(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Measure performance metrics
   */
  measurePerformance(markName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if ('performance' in window) {
      performance.mark(markName);
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Record<string, unknown> {
    if (!isPlatformBrowser(this.platformId) || !('performance' in window)) {
  return {};
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint()
    };
  }

  private getFirstPaint(): number {
    const entries = performance.getEntriesByType('paint');
    const firstPaint = entries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const entries = performance.getEntriesByType('paint');
    const firstContentfulPaint = entries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  /**
   * Debounce function for performance optimization
   */
  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle function for performance optimization
   */
  throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}
