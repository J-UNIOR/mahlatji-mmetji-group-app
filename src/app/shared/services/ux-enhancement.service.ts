import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';

export interface UXMetrics {
  screenSize: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  scrollPosition: number;
  viewportHeight: number;
  viewportWidth: number;
  touchSupport: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  darkMode: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  soundEffects: boolean;
  language: string;
  accessibility: {
    screenReader: boolean;
    keyboard: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UXEnhancementService {
  private uxMetrics = signal<UXMetrics>({
    screenSize: 'desktop',
    orientation: 'landscape',
    scrollPosition: 0,
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    touchSupport: 'ontouchstart' in window,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
  });

  private userPreferences = signal<UserPreferences>({
    theme: 'auto',
    fontSize: 'medium',
    animations: true,
    soundEffects: false,
    language: 'en',
    accessibility: {
      screenReader: false,
      keyboard: false,
      reducedMotion: false,
      highContrast: false
    }
  });

  private scrollSubject = new BehaviorSubject<number>(0);
  private isScrolling = signal(false);
  private lastScrollTime = 0;

  // Computed values
  readonly isMobile = computed(() => this.uxMetrics().screenSize === 'mobile');
  readonly isTablet = computed(() => this.uxMetrics().screenSize === 'tablet');
  readonly isDesktop = computed(() => this.uxMetrics().screenSize === 'desktop');
  readonly hasTouchSupport = computed(() => this.uxMetrics().touchSupport);
  readonly prefersReducedMotion = computed(() => 
    this.uxMetrics().reducedMotion || this.userPreferences().accessibility.reducedMotion
  );

  // Public getters
  getUXMetrics = computed(() => this.uxMetrics());
  getUserPreferences = computed(() => this.userPreferences());
  getScrollPosition = computed(() => this.uxMetrics().scrollPosition);
  getIsScrolling = computed(() => this.isScrolling());

  constructor() {
    this.initializeUXMonitoring();
    this.loadUserPreferences();
  }

  private initializeUXMonitoring(): void {
    // Screen size monitoring
    const updateScreenSize = () => {
      const width = window.innerWidth;
      let screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width <= 768) {
        screenSize = 'mobile';
      } else if (width <= 1024) {
        screenSize = 'tablet';
      }

      this.uxMetrics.update(metrics => ({
        ...metrics,
        screenSize,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth
      }));
    };

    // Initial setup
    updateScreenSize();

    // Resize listener with debouncing
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(() => updateScreenSize());

    // Scroll monitoring
    fromEvent(window, 'scroll')
      .pipe(debounceTime(16)) // ~60fps
      .subscribe(() => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        this.lastScrollTime = Date.now();
        
        this.uxMetrics.update(metrics => ({
          ...metrics,
          scrollPosition
        }));

        this.scrollSubject.next(scrollPosition);
        this.updateScrollingState();
      });

    // Media query listeners
    this.setupMediaQueryListeners();

    // Keyboard navigation detection
    this.setupKeyboardNavigation();
  }

  private setupMediaQueryListeners(): void {
    const mediaQueries = [
      { query: '(prefers-reduced-motion: reduce)', key: 'reducedMotion' },
      { query: '(prefers-contrast: high)', key: 'highContrast' },
      { query: '(prefers-color-scheme: dark)', key: 'darkMode' }
    ];

    mediaQueries.forEach(({ query, key }) => {
      const mediaQuery = window.matchMedia(query);
      
      const updateMetric = (e: MediaQueryListEvent) => {
        this.uxMetrics.update(metrics => ({
          ...metrics,
          [key]: e.matches
        }));
      };

      mediaQuery.addEventListener('change', updateMetric);
      
      // Initial value
      this.uxMetrics.update(metrics => ({
        ...metrics,
        [key]: mediaQuery.matches
      }));
    });
  }

  private setupKeyboardNavigation(): void {
    let isUsingKeyboard = false;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('using-keyboard');
        
        this.userPreferences.update(prefs => ({
          ...prefs,
          accessibility: {
            ...prefs.accessibility,
            keyboard: true
          }
        }));
      }
    });

    document.addEventListener('mousedown', () => {
      if (isUsingKeyboard) {
        isUsingKeyboard = false;
        document.body.classList.remove('using-keyboard');
      }
    });
  }

  private updateScrollingState(): void {
    this.isScrolling.set(true);
    
    // Debounce scrolling state
    setTimeout(() => {
      if (Date.now() - this.lastScrollTime >= 150) {
        this.isScrolling.set(false);
      }
    }, 150);
  }

  // Scroll utilities
  scrollToElement(elementId: string, offset: number = 80): void {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      
      if (this.prefersReducedMotion()) {
        window.scrollTo(0, elementPosition);
      } else {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  scrollToTop(): void {
    if (this.prefersReducedMotion()) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // Theme management
  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.userPreferences.update(prefs => ({
      ...prefs,
      theme
    }));
    
    this.applyTheme(theme);
    this.saveUserPreferences();
  }

  private applyTheme(theme: string): void {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark-theme', prefersDark);
    } else {
      root.classList.toggle('dark-theme', theme === 'dark');
    }
  }

  // Font size management
  setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.userPreferences.update(prefs => ({
      ...prefs,
      fontSize: size
    }));
    
    const root = document.documentElement;
    root.className = root.className.replace(/font-size-\w+/g, '');
    root.classList.add(`font-size-${size}`);
    
    this.saveUserPreferences();
  }

  // Animation control
  toggleAnimations(enabled: boolean): void {
    this.userPreferences.update(prefs => ({
      ...prefs,
      animations: enabled
    }));
    
    document.body.classList.toggle('animations-disabled', !enabled);
    this.saveUserPreferences();
  }

  // Accessibility features
  toggleReducedMotion(enabled: boolean): void {
    this.userPreferences.update(prefs => ({
      ...prefs,
      accessibility: {
        ...prefs.accessibility,
        reducedMotion: enabled
      }
    }));
    
    document.body.classList.toggle('reduced-motion', enabled);
    this.saveUserPreferences();
  }

  toggleHighContrast(enabled: boolean): void {
    this.userPreferences.update(prefs => ({
      ...prefs,
      accessibility: {
        ...prefs.accessibility,
        highContrast: enabled
      }
    }));
    
    document.body.classList.toggle('high-contrast', enabled);
    this.saveUserPreferences();
  }

  // Focus management
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocusHandler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', trapFocusHandler);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', trapFocusHandler);
    };
  }

  // Haptic feedback for touch devices
  vibrate(pattern: number | number[] = 10): void {
    if ('vibrate' in navigator && this.hasTouchSupport()) {
      navigator.vibrate(pattern);
    }
  }

  // Toast notifications
  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    // Add to DOM
    const toastContainer = this.getOrCreateToastContainer();
    toastContainer.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  private getOrCreateToastContainer(): HTMLElement {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }

  // Persistence
  private saveUserPreferences(): void {
    localStorage.setItem('ux-preferences', JSON.stringify(this.userPreferences()));
  }

  private loadUserPreferences(): void {
    try {
      const saved = localStorage.getItem('ux-preferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        this.userPreferences.set({ ...this.userPreferences(), ...prefs });
        
        // Apply saved preferences
        this.applyTheme(prefs.theme || 'auto');
        this.setFontSize(prefs.fontSize || 'medium');
        this.toggleAnimations(prefs.animations !== false);
        
        if (prefs.accessibility?.reducedMotion) {
          this.toggleReducedMotion(true);
        }
        if (prefs.accessibility?.highContrast) {
          this.toggleHighContrast(true);
        }
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }

  // Performance monitoring
  measureUserInteraction(action: string, startTime?: number): void {
    const endTime = performance.now();
    const duration = startTime ? endTime - startTime : 0;
    
    // You can send this data to analytics
    console.log(`User interaction: ${action}, Duration: ${duration}ms`);
  }

  // Smooth scroll with callback
  smoothScrollWithCallback(target: number, callback?: () => void): void {
    if (this.prefersReducedMotion()) {
      window.scrollTo(0, target);
      callback?.();
      return;
    }

    const start = window.pageYOffset;
    const distance = target - start;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, start + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        callback?.();
      }
    };

    requestAnimationFrame(animateScroll);
  }
}
