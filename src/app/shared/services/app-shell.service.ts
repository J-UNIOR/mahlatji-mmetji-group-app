import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppShellConfig {
  cacheVersion: string;
  criticalResources: string[];
  preloadRoutes: string[];
  shellTemplate: string;
}

export interface LoadingState {
  isLoading: boolean;
  stage: 'initial' | 'critical' | 'secondary' | 'complete';
  progress: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppShellService {
  private loadingState$ = new BehaviorSubject<LoadingState>({
    isLoading: true,
    stage: 'initial',
    progress: 0,
    message: 'Initializing...'
  });

  private criticalResourcesLoaded = false;
  private secondaryResourcesLoaded = false;

  private defaultConfig: AppShellConfig = {
    cacheVersion: 'v1.0.0',
    criticalResources: [
      '/assets/css/mahlatji-mmetji-group.css',
      '/assets/css/animate.css',
      '/assets/vendor/bootstrap/css/bootstrap.min.css',
      '/assets/images/banner-01.jpg',
      '/assets/vendor/jquery/jquery.min.js'
    ],
    preloadRoutes: [
      '/',
      '/about',
      '/services',
      '/contact'
    ],
    shellTemplate: 'app-shell'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAppShell();
    }
  }

  /**
   * Get current loading state
   */
  getLoadingState(): Observable<LoadingState> {
    return this.loadingState$.asObservable();
  }

  /**
   * Initialize app shell loading process
   */
  private async initializeAppShell(): Promise<void> {
    try {
      this.updateLoadingState('initial', 10, 'Loading app shell...');
      
      // Load critical resources first
      await this.loadCriticalResources();
      this.updateLoadingState('critical', 40, 'Loading critical resources...');
      
      // Initialize app shell template
      await this.initializeShellTemplate();
      this.updateLoadingState('critical', 60, 'Initializing interface...');
      
      // Load secondary resources
      await this.loadSecondaryResources();
      this.updateLoadingState('secondary', 80, 'Loading additional resources...');
      
      // Preload routes
      await this.preloadRoutes();
      this.updateLoadingState('complete', 100, 'Ready!');
      
      // Mark as complete
      setTimeout(() => {
        this.updateLoadingState('complete', 100, 'Complete', false);
      }, 500);
      
    } catch (error) {
      console.error('App shell initialization failed:', error);
      this.updateLoadingState('complete', 100, 'Loaded with errors', false);
    }
  }

  /**
   * Update loading state
   */
  private updateLoadingState(
    stage: LoadingState['stage'], 
    progress: number, 
    message: string, 
    isLoading: boolean = true
  ): void {
    this.loadingState$.next({
      isLoading,
      stage,
      progress,
      message
    });
  }

  /**
   * Load critical resources for initial render
   */
  private async loadCriticalResources(): Promise<void> {
    const promises = this.defaultConfig.criticalResources.map(resource => {
      return this.preloadResource(resource);
    });

    try {
      await Promise.all(promises);
      this.criticalResourcesLoaded = true;
    } catch (error) {
      console.warn('Some critical resources failed to load:', error);
    }
  }

  /**
   * Load secondary resources in background
   */
  private async loadSecondaryResources(): Promise<void> {
    const secondaryResources = [
      '/assets/css/flex-slider.css',
      '/assets/css/owl.css',
      '/assets/css/fontawesome.css',
      '/assets/js/custom.js',
      '/assets/js/owl-carousel.js',
      '/assets/vendor/bootstrap/js/bootstrap.min.js'
    ];

    const promises = secondaryResources.map(resource => {
      return this.preloadResource(resource, { priority: 'low' });
    });

    try {
      await Promise.allSettled(promises);
      this.secondaryResourcesLoaded = true;
    } catch (error) {
      console.warn('Some secondary resources failed to load:', error);
    }
  }

  /**
   * Preload a single resource
   */
  private preloadResource(
    url: string, 
    options: { priority?: 'high' | 'low'; timeout?: number } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 5000;
      const timer = setTimeout(() => {
        reject(new Error(`Resource timeout: ${url}`));
      }, timeout);

      if (url.endsWith('.css')) {
        this.preloadCSS(url)
          .then(() => {
            clearTimeout(timer);
            resolve();
          })
          .catch(reject);
      } else if (url.endsWith('.js')) {
        this.preloadJS(url)
          .then(() => {
            clearTimeout(timer);
            resolve();
          })
          .catch(reject);
      } else if (this.isImageFile(url)) {
        this.preloadImage(url)
          .then(() => {
            clearTimeout(timer);
            resolve();
          })
          .catch(reject);
      } else {
        // Generic fetch for other resources
        fetch(url)
          .then(() => {
            clearTimeout(timer);
            resolve();
          })
          .catch(reject);
      }
    });
  }

  /**
   * Preload CSS file
   */
  private preloadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload CSS: ${url}`));
      
      document.head.appendChild(link);
      
      // Also create actual stylesheet
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = url;
      document.head.appendChild(stylesheet);
    });
  }

  /**
   * Preload JavaScript file
   */
  private preloadJS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload JS: ${url}`));
      
      document.head.appendChild(link);
    });
  }

  /**
   * Preload image
   */
  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    });
  }

  /**
   * Check if URL is an image file
   */
  private isImageFile(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  /**
   * Initialize shell template
   */
  private async initializeShellTemplate(): Promise<void> {
    // Create app shell skeleton
    const shellElement = document.querySelector('app-shell') || document.body;
    
    if (shellElement && !shellElement.querySelector('.app-shell-skeleton')) {
      const skeleton = this.createSkeletonTemplate();
      shellElement.insertAdjacentHTML('afterbegin', skeleton);
    }
    
    // Add shell styles
    this.addShellStyles();
    
    return Promise.resolve();
  }

  /**
   * Create skeleton template for app shell
   */
  private createSkeletonTemplate(): string {
    return `
      <div class="app-shell-skeleton">
        <div class="shell-header">
          <div class="shell-logo"></div>
          <div class="shell-nav">
            <div class="shell-nav-item"></div>
            <div class="shell-nav-item"></div>
            <div class="shell-nav-item"></div>
            <div class="shell-nav-item"></div>
          </div>
        </div>
        <div class="shell-hero">
          <div class="shell-hero-content">
            <div class="shell-title"></div>
            <div class="shell-subtitle"></div>
            <div class="shell-button"></div>
          </div>
        </div>
        <div class="shell-content">
          <div class="shell-section">
            <div class="shell-section-title"></div>
            <div class="shell-section-content">
              <div class="shell-card"></div>
              <div class="shell-card"></div>
              <div class="shell-card"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Add CSS for app shell skeleton
   */
  private addShellStyles(): void {
    if (document.querySelector('#app-shell-styles')) {
      return; // Already added
    }

    const styles = `
      <style id="app-shell-styles">
        .app-shell-skeleton {
          width: 100%;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .shell-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .shell-logo {
          width: 120px;
          height: 40px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        .shell-nav {
          display: flex;
          gap: 2rem;
        }
        
        .shell-nav-item {
          width: 80px;
          height: 20px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        .shell-hero {
          height: 400px;
          background: linear-gradient(135deg, #f35525, #ff6b3d);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .shell-hero-content {
          text-align: center;
          max-width: 600px;
        }
        
        .shell-title {
          width: 400px;
          height: 48px;
          background: rgba(255,255,255,0.2);
          margin: 0 auto 1rem;
          border-radius: 4px;
          animation: pulse 2s infinite;
        }
        
        .shell-subtitle {
          width: 300px;
          height: 24px;
          background: rgba(255,255,255,0.15);
          margin: 0 auto 2rem;
          border-radius: 4px;
          animation: pulse 2s infinite 0.5s;
        }
        
        .shell-button {
          width: 150px;
          height: 48px;
          background: rgba(255,255,255,0.2);
          margin: 0 auto;
          border-radius: 24px;
          animation: pulse 2s infinite 1s;
        }
        
        .shell-content {
          padding: 4rem 2rem;
        }
        
        .shell-section {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .shell-section-title {
          width: 250px;
          height: 32px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          margin: 0 auto 3rem;
          border-radius: 4px;
        }
        
        .shell-section-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .shell-card {
          height: 200px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          animation: cardPulse 2s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        
        @keyframes cardPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.01); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .shell-header {
            padding: 1rem;
          }
          
          .shell-nav {
            display: none;
          }
          
          .shell-hero {
            height: 300px;
            padding: 2rem;
          }
          
          .shell-title {
            width: 280px;
            height: 36px;
          }
          
          .shell-subtitle {
            width: 220px;
            height: 20px;
          }
          
          .shell-section-content {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  /**
   * Preload route components
   */
  private async preloadRoutes(): Promise<void> {
    // This would typically preload route modules
    // For now, we'll simulate the process
    return new Promise(resolve => {
      setTimeout(resolve, 200);
    });
  }

  /**
   * Remove app shell when app is ready
   */
  hideAppShell(): void {
    const shellElement = document.querySelector('.app-shell-skeleton') as HTMLElement;
    const shellStyles = document.querySelector('#app-shell-styles');
    
    if (shellElement) {
      shellElement.style.opacity = '0';
      shellElement.style.transition = 'opacity 0.3s ease-out';
      
      setTimeout(() => {
        shellElement.remove();
        shellStyles?.remove();
      }, 300);
    }
  }

  /**
   * Check if critical resources are loaded
   */
  areCriticalResourcesLoaded(): boolean {
    return this.criticalResourcesLoaded;
  }

  /**
   * Check if secondary resources are loaded
   */
  areSecondaryResourcesLoaded(): boolean {
    return this.secondaryResourcesLoaded;
  }

  /**
   * Get app shell performance metrics
   */
  getPerformanceMetrics(): {
    timeToInteractive: number;
    firstContentfulPaint: number;
    shellLoadTime: number;
  } {
    if (!isPlatformBrowser(this.platformId)) {
      return { timeToInteractive: 0, firstContentfulPaint: 0, shellLoadTime: 0 };
    }

    const performance = window.performance;
    const entries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      timeToInteractive: entries.loadEventEnd - entries.fetchStart,
      firstContentfulPaint: this.getFirstContentfulPaint(),
      shellLoadTime: entries.domContentLoadedEventEnd - entries.fetchStart
    };
  }

  /**
   * Get First Contentful Paint timing
   */
  private getFirstContentfulPaint(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 0;
    }

    const entries = performance.getEntriesByType('paint');
    const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }
}
