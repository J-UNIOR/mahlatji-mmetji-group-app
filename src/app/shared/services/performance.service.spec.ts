import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PerformanceService } from './performance.service';

describe('PerformanceService', () => {
  let service: PerformanceService;
  let mockPerformance: { mark: jasmine.Spy, getEntriesByType: jasmine.Spy };

  beforeEach(() => {
    // Mock Performance API
    mockPerformance = {
      mark: jasmine.createSpy('mark'),
      getEntriesByType: jasmine.createSpy('getEntriesByType').and.returnValue([])
    };

    Object.defineProperty(window, 'performance', {
      writable: true,
      value: mockPerformance
    });

    TestBed.configureTestingModule({
      providers: [
        PerformanceService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(PerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('preloadImages', () => {
    it('should preload images successfully', async () => {
  const mockImages: HTMLImageElement[] = [];
      
      spyOn(window, 'Image').and.callFake(() => {
        const mockImage = {
          onload: null,
          onerror: null,
          src: ''
        } as HTMLImageElement;
        mockImages.push(mockImage);
        return mockImage;
      });

      const promise = service.preloadImages(['test1.jpg', 'test2.jpg']);
      
      // Simulate successful image loads
      setTimeout(() => {
        mockImages.forEach(img => {
          if (img.onload) img.onload(new Event('load'));
        });
      }, 0);

      await expectAsync(promise).toBeResolved();
    });

    it('should handle image load failures', async () => {
  let mockImage: HTMLImageElement;
      
      spyOn(window, 'Image').and.callFake(() => {
        mockImage = {
          onload: null,
          onerror: null,
          src: ''
        } as HTMLImageElement;
        return mockImage;
      });

      const promise = service.preloadImages(['invalid.jpg']);
      
      // Simulate image load failure
      setTimeout(() => {
  if (mockImage.onerror) mockImage.onerror(new Event('error'));
      }, 0);

      await expectAsync(promise).toBeRejected();
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should return original URL for now', () => {
      const originalUrl = 'test.jpg';
  const optimizedUrl = service.getOptimizedImageUrl(originalUrl, 300);
      
      expect(optimizedUrl).toBe(originalUrl);
    });
  });

  describe('getWebPUrl', () => {
    it('should convert jpg to webp', () => {
      const jpgUrl = 'test.jpg';
      const webpUrl = service.getWebPUrl(jpgUrl);
      
      expect(webpUrl).toBe('test.webp');
    });

    it('should convert png to webp', () => {
      const pngUrl = 'test.png';
      const webpUrl = service.getWebPUrl(pngUrl);
      
      expect(webpUrl).toBe('test.webp');
    });

    it('should convert jpeg to webp', () => {
      const jpegUrl = 'test.jpeg';
      const webpUrl = service.getWebPUrl(jpegUrl);
      
      expect(webpUrl).toBe('test.webp');
    });
  });

  describe('supportsWebP', () => {
    it('should check WebP support', async () => {
  let mockImage: HTMLImageElement;
      
      spyOn(window, 'Image').and.callFake(() => {
        mockImage = {
          onload: null,
          onerror: null,
          src: '',
          height: 2
        } as HTMLImageElement;
        return mockImage;
      });

      const promise = service.supportsWebP();
      
      // Simulate image load
      setTimeout(() => {
  if (mockImage.onload) mockImage.onload(new Event('load'));
      }, 0);

      const supportsWebP = await promise;
      expect(supportsWebP).toBe(true);
    });

    it('should return false when WebP is not supported', async () => {
  let mockImage: HTMLImageElement;
      
      spyOn(window, 'Image').and.callFake(() => {
        mockImage = {
          onload: null,
          onerror: null,
          src: '',
          height: 0
        } as HTMLImageElement;
        return mockImage;
      });

      const promise = service.supportsWebP();
      
      // Simulate image load
      setTimeout(() => {
  if (mockImage.onload) mockImage.onload(new Event('load'));
      }, 0);

      const supportsWebP = await promise;
      expect(supportsWebP).toBe(false);
    });
  });

  describe('measurePerformance', () => {
    it('should create performance mark', () => {
      service.measurePerformance('test-mark');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-mark');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics when available', () => {
      const mockNavigationTiming = {
        loadEventEnd: 3000,
        loadEventStart: 2900,
        domContentLoadedEventEnd: 2000,
        domContentLoadedEventStart: 1900
      };

      const mockPaintEntries = [
        { name: 'first-paint', startTime: 1500 },
        { name: 'first-contentful-paint', startTime: 1600 }
      ];

      mockPerformance.getEntriesByType.and.callFake((type: string) => {
        if (type === 'navigation') return [mockNavigationTiming];
        if (type === 'paint') return mockPaintEntries;
        return [];
      });

      const metrics = service.getPerformanceMetrics();
      
      expect(metrics).toEqual({
        loadTime: 100,
        domContentLoaded: 100,
        firstPaint: 1500,
        firstContentfulPaint: 1600
      });
    });

    it('should return null when not in browser', () => {
  const serverService = new PerformanceService();
      const metrics = serverService.getPerformanceMetrics();
      
      expect(metrics).toBeNull();
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      const mockFn = jasmine.createSpy('mockFn');
      const debouncedFn = service.debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', (done) => {
      const mockFn = jasmine.createSpy('mockFn');
      const throttledFn = service.throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      setTimeout(() => {
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
        done();
      }, 150);
    });
  });

  describe('platform independence', () => {
    it('should handle server-side rendering', () => {
  const serverService = new PerformanceService();
      
      expect(serverService.preloadImages(['test.jpg'])).toEqual(Promise.resolve([]));
      expect(serverService.supportsWebP()).toEqual(Promise.resolve(false));
      expect(() => serverService.measurePerformance('test')).not.toThrow();
      expect(serverService.getPerformanceMetrics()).toBeNull();
    });
  });
});
