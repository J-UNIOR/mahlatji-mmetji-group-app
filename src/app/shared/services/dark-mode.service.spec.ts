import { TestBed } from '@angular/core/testing';
import { DarkModeService, ThemeMode } from './dark-mode.service';

describe('DarkModeService', () => {
  let service: DarkModeService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jasmine.createSpy('matchMedia').and.returnValue({
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      })
    });

    // Mock document
    spyOn(document.body.classList, 'toggle');
    spyOn(document.body.classList, 'contains').and.returnValue(false);
    spyOn(document.documentElement, 'setAttribute');

    TestBed.configureTestingModule({
      providers: [DarkModeService]
    });

    service = TestBed.inject(DarkModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with auto theme mode', () => {
    expect(service.currentThemeMode).toBe('auto');
  });

  describe('setThemeMode', () => {
    it('should update theme mode', () => {
      service.setThemeMode('dark');
      expect(service.currentThemeMode).toBe('dark');
    });

    it('should save theme preference to localStorage', () => {
      service.setThemeMode('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('mahlatji-theme-preference', 'light');
    });

    it('should apply dark theme classes when dark mode is set', () => {
      service.setThemeMode('dark');
      expect(document.body.classList.toggle).toHaveBeenCalledWith('dark-theme', true);
      expect(document.body.classList.toggle).toHaveBeenCalledWith('light-theme', false);
    });

    it('should apply light theme classes when light mode is set', () => {
      service.setThemeMode('light');
      expect(document.body.classList.toggle).toHaveBeenCalledWith('dark-theme', false);
      expect(document.body.classList.toggle).toHaveBeenCalledWith('light-theme', true);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from auto to dark when system prefers light', () => {
      // Mock system preference as light
      (window.matchMedia as jasmine.Spy).and.returnValue({
        matches: false,
        addEventListener: jasmine.createSpy(),
        removeEventListener: jasmine.createSpy()
      });

      service.setThemeMode('auto');
      service.toggleTheme();
      
      expect(service.currentThemeMode).toBe('dark');
    });

    it('should toggle from light to dark', () => {
      service.setThemeMode('light');
      service.toggleTheme();
      
      expect(service.currentThemeMode).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.setThemeMode('dark');
      service.toggleTheme();
      
      expect(service.currentThemeMode).toBe('light');
    });
  });

  describe('theme observables', () => {
    it('should emit theme mode changes', (done) => {
      service.currentThemeMode$.subscribe(mode => {
        if (mode === 'dark') {
          expect(mode).toBe('dark');
          done();
        }
      });
      
      service.setThemeMode('dark');
    });

    it('should emit dark mode state changes', (done) => {
      service.isDarkMode$.subscribe(isDark => {
        if (isDark === true) {
          expect(isDark).toBe(true);
          done();
        }
      });
      
      service.setThemeMode('dark');
    });
  });

  describe('getThemeColors', () => {
    it('should return light theme colors when in light mode', () => {
      service.setThemeMode('light');
      const colors = service.getThemeColors();
      
      expect(colors.background).toBe('#ffffff');
      expect(colors.text).toBe('#333333');
    });

    it('should return dark theme colors when in dark mode', () => {
      service.setThemeMode('dark');
      const colors = service.getThemeColors();
      
      expect(colors.background).toBe('#121212');
      expect(colors.text).toBe('#ffffff');
    });

    it('should always return brand primary color', () => {
      const colors = service.getThemeColors();
      expect(colors.primary).toBe('#f35525');
    });
  });

  describe('accessibility helpers', () => {
    it('should check for reduced motion preference', () => {
      (window.matchMedia as jasmine.Spy).and.returnValue({ matches: true });
      expect(service.prefersReducedMotion()).toBe(true);
    });

    it('should check for high contrast preference', () => {
      (window.matchMedia as jasmine.Spy).and.returnValue({ matches: true });
      expect(service.prefersHighContrast()).toBe(true);
    });
  });
});
