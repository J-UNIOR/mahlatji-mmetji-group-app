import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly THEME_KEY = 'mahlatji-theme-preference';
  
  private themeMode$ = new BehaviorSubject<ThemeMode>('auto');
  private darkModeState$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeTheme();
    this.setupMediaQueryListener();
  }

  /**
   * Get current theme mode observable
   */
  get currentThemeMode$(): Observable<ThemeMode> {
    return this.themeMode$.asObservable();
  }

  /**
   * Get current dark mode state observable
   */
  get isDarkMode$(): Observable<boolean> {
    return this.darkModeState$.asObservable();
  }

  /**
   * Get current theme mode value
   */
  get currentThemeMode(): ThemeMode {
    return this.themeMode$.value;
  }

  /**
   * Get current dark mode state value
   */
  get isDarkMode(): boolean {
    return this.darkModeState$.value;
  }

  /**
   * Set theme mode
   */
  setThemeMode(mode: ThemeMode): void {
    this.themeMode$.next(mode);
    this.saveThemePreference(mode);
    this.applyTheme(mode);
  }

  /**
   * Toggle between light and dark modes
   */
  toggleTheme(): void {
    const currentMode = this.themeMode$.value;
    if (currentMode === 'auto') {
      // If auto, switch to opposite of current system preference
      const systemPrefersDark = this.getSystemPreference();
      this.setThemeMode(systemPrefersDark ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      this.setThemeMode(currentMode === 'light' ? 'dark' : 'light');
    }
  }

  /**
   * Initialize theme on service startup
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedThemePreference();
    this.themeMode$.next(savedTheme);
    this.applyTheme(savedTheme);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(mode: ThemeMode): void {
    const shouldUseDark = this.shouldUseDarkMode(mode);
    
    // Update body classes
    document.body.classList.toggle('dark-theme', shouldUseDark);
    document.body.classList.toggle('light-theme', !shouldUseDark);
    
    // Update HTML data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
    
    // Update meta theme-color for mobile browsers
    this.updateThemeColor(shouldUseDark);
    
    // Update dark mode state
    this.darkModeState$.next(shouldUseDark);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { mode, isDark: shouldUseDark }
    }));
  }

  /**
   * Determine if dark mode should be used based on mode
   */
  private shouldUseDarkMode(mode: ThemeMode): boolean {
    switch (mode) {
      case 'dark':
        return true;
      case 'light':
        return false;
      case 'auto':
        return this.getSystemPreference();
      default:
        return false;
    }
  }

  /**
   * Get system dark mode preference
   */
  private getSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Setup media query listener for auto mode
   */
  private setupMediaQueryListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
      if (this.themeMode$.value === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  /**
   * Save theme preference to localStorage
   */
  private saveThemePreference(mode: ThemeMode): void {
    try {
      localStorage.setItem(this.THEME_KEY, mode);
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  }

  /**
   * Get saved theme preference from localStorage
   */
  private getSavedThemePreference(): ThemeMode {
    try {
      const saved = localStorage.getItem(this.THEME_KEY) as ThemeMode;
      return saved && ['light', 'dark', 'auto'].includes(saved) ? saved : 'auto';
    } catch (error) {
      console.warn('Could not load theme preference:', error);
      return 'auto';
    }
  }

  /**
   * Update theme color meta tag for mobile browsers
   */
  private updateThemeColor(isDark: boolean): void {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const color = isDark ? '#1a1a1a' : '#f35525'; // Dark bg or brand color
    
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', color);
    } else {
      // Create meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  /**
   * Get theme colors for current mode
   */
  getThemeColors(): { primary: string; background: string; surface: string; text: string } {
    const isDark = this.darkModeState$.value;
    
    return {
      primary: '#f35525',
      background: isDark ? '#121212' : '#ffffff',
      surface: isDark ? '#1e1e1e' : '#f5f5f5',
      text: isDark ? '#ffffff' : '#333333'
    };
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if user prefers high contrast
   */
  prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
}
