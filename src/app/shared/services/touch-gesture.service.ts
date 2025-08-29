import { Injectable, PLATFORM_ID, OnDestroy, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  target: HTMLElement;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface TouchGestureConfig {
  threshold: number; // Minimum distance for swipe
  restraint: number; // Maximum distance perpendicular to swipe direction
  allowedTime: number; // Maximum time for swipe
  velocity: number; // Minimum velocity for swipe
}

@Injectable({
  providedIn: 'root'
})
export class TouchGestureService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private swipeSubject = new Subject<SwipeEvent>();
  
  public swipe$ = this.swipeSubject.asObservable();
  
  private defaultConfig: TouchGestureConfig = {
    threshold: 50,
    restraint: 100,
    allowedTime: 300,
    velocity: 0.5
  };

  platformId = inject(PLATFORM_ID);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeGlobalSwipeListener();
    }
  }

  /**
   * Initialize global swipe listener for the entire document
   */
  private initializeGlobalSwipeListener(): void {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isTracking = false;

    // Touch start
    fromEvent<TouchEvent>(document, 'touchstart', { passive: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;
          startTime = Date.now();
          isTracking = true;
        }
      });

    // Touch end
    fromEvent<TouchEvent>(document, 'touchend', { passive: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (isTracking && e.changedTouches.length === 1) {
          const touch = e.changedTouches[0];
          const endX = touch.clientX;
          const endY = touch.clientY;
          const endTime = Date.now();
          
          this.processSwipe(
            startX, startY, endX, endY, 
            startTime, endTime, 
            e.target as HTMLElement
          );
          
          isTracking = false;
        }
      });
  }

  /**
   * Process touch coordinates and determine if it's a valid swipe
   */
  private processSwipe(
    startX: number, startY: number, 
    endX: number, endY: number,
    startTime: number, endTime: number,
    target: HTMLElement,
    config: TouchGestureConfig = this.defaultConfig
  ): void {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if swipe meets criteria
    if (deltaTime <= config.allowedTime && distance >= config.threshold && velocity >= config.velocity) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      let direction: 'left' | 'right' | 'up' | 'down';

      // Determine primary direction
      if (absDeltaX >= absDeltaY) {
        // Horizontal swipe
        if (absDeltaY <= config.restraint) {
          direction = deltaX < 0 ? 'left' : 'right';
        } else {
          return; // Too much vertical movement
        }
      } else {
        // Vertical swipe
        if (absDeltaX <= config.restraint) {
          direction = deltaY < 0 ? 'up' : 'down';
        } else {
          return; // Too much horizontal movement
        }
      }

      const swipeEvent: SwipeEvent = {
        direction,
        distance,
        velocity,
        target,
        startX,
        startY,
        endX,
        endY
      };

      this.swipeSubject.next(swipeEvent);
    }
  }

  /**
   * Enable swipe navigation for a specific element
   */
  enableSwipeNavigation(
    element: HTMLElement, 
    callbacks: {
      onSwipeLeft?: () => void;
      onSwipeRight?: () => void;
      onSwipeUp?: () => void;
      onSwipeDown?: () => void;
    },
  // config?: Partial<TouchGestureConfig>
  ): () => void {
    if (!isPlatformBrowser(this.platformId)) {
      return () => undefined;
    }

  // const mergedConfig = { ...this.defaultConfig, ...config };
    const subscription = this.swipe$
      .pipe(
        filter(swipe => swipe.target === element || element.contains(swipe.target)),
        takeUntil(this.destroy$)
      )
      .subscribe(swipe => {
        switch (swipe.direction) {
          case 'left':
            callbacks.onSwipeLeft?.();
            break;
          case 'right':
            callbacks.onSwipeRight?.();
            break;
          case 'up':
            callbacks.onSwipeUp?.();
            break;
          case 'down':
            callbacks.onSwipeDown?.();
            break;
        }
      });

    // Return cleanup function
    return () => subscription.unsubscribe();
  }

  /**
   * Create swipe navigation for image galleries
   */
  createImageGallerySwipe(
    galleryElement: HTMLElement,
    images: string[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ): () => void {
    return this.enableSwipeNavigation(galleryElement, {
      onSwipeLeft: () => {
        const nextIndex = (currentIndex + 1) % images.length;
        onIndexChange(nextIndex);
      },
      onSwipeRight: () => {
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        onIndexChange(prevIndex);
      }
    });
  }

  /**
   * Create swipe navigation for carousel/slider
   */
  createCarouselSwipe(
    carouselElement: HTMLElement,
    totalSlides: number,
    currentSlide: number,
    onSlideChange: (slide: number) => void
  ): () => void {
    return this.enableSwipeNavigation(carouselElement, {
      onSwipeLeft: () => {
        const nextSlide = Math.min(currentSlide + 1, totalSlides - 1);
        onSlideChange(nextSlide);
      },
      onSwipeRight: () => {
        const prevSlide = Math.max(currentSlide - 1, 0);
        onSlideChange(prevSlide);
      }
    });
  }

  /**
   * Create pull-to-refresh functionality
   */
  createPullToRefresh(
    element: HTMLElement,
    onRefresh: () => void,
    threshold = 80
  ): () => void {
    let startY = 0;
    let isAtTop = false;

    const touchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        isAtTop = element.scrollTop === 0;
      }
    };

    const touchMove = (e: TouchEvent) => {
      if (isAtTop && e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > threshold) {
          // Add visual feedback here (e.g., loading spinner)
          element.style.transform = `translateY(${Math.min(deltaY - threshold, 50)}px)`;
        }
      }
    };

    const touchEnd = (e: TouchEvent) => {
      if (isAtTop && e.changedTouches.length === 1) {
        const endY = e.changedTouches[0].clientY;
        const deltaY = endY - startY;
        
        element.style.transform = 'translateY(0)';
        
        if (deltaY > threshold) {
          onRefresh();
        }
      }
    };

    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('touchmove', touchMove, { passive: true });
    element.addEventListener('touchend', touchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('touchmove', touchMove);
      element.removeEventListener('touchend', touchEnd);
    };
  }

  /**
   * Check if device supports touch
   */
  isTouchDevice(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Get touch capabilities info
   */
  getTouchInfo(): {
    hasTouch: boolean;
    maxTouchPoints: number;
    touchSupport: string;
  } {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        hasTouch: false,
        maxTouchPoints: 0,
        touchSupport: 'Not available (SSR)'
      };
    }

    const hasTouch = this.isTouchDevice();
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    
    let touchSupport = 'None';
    if (hasTouch) {
      if (maxTouchPoints > 1) {
        touchSupport = `Multi-touch (${maxTouchPoints} points)`;
      } else {
        touchSupport = 'Single touch';
      }
    }

    return {
      hasTouch,
      maxTouchPoints,
      touchSupport
    };
  }

  /**
   * Cleanup resources
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
