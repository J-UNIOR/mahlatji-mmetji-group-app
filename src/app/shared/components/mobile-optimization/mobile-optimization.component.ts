import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { TouchGestureService } from '../../services/touch-gesture.service';
import { AppShellService } from '../../services/app-shell.service';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-mobile-optimization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mobile-optimization-container" *ngIf="isMobile">
      <!-- Loading Skeleton -->
      <div *ngIf="isLoading" class="skeleton-loader">
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
          <div class="skeleton-line" *ngFor="let line of [1,2,3,4,5]"></div>
        </div>
      </div>

      <!-- Touch Gesture Status -->
      <div class="touch-status" *ngIf="showTouchStatus">
        <div class="gesture-info">
          <span class="gesture-type">{{ currentGesture }}</span>
          <span class="gesture-direction" *ngIf="gestureDirection">{{ gestureDirection }}</span>
        </div>
      </div>

      <!-- Push Notification Status -->
      <div class="notification-controls" *ngIf="showNotificationControls">
        <button 
          class="notification-btn"
          [class.enabled]="notificationPermission === 'granted'"
          [class.denied]="notificationPermission === 'denied'"
          (click)="toggleNotifications()"
          [disabled]="notificationPermission === 'denied'">
          <i class="fas fa-bell" [class.fa-bell-slash]="notificationPermission !== 'granted'"></i>
          <span>{{ getNotificationButtonText() }}</span>
        </button>
      </div>

      <!-- Performance Metrics -->
      <div class="performance-info" *ngIf="showPerformanceInfo && performanceMetrics">
        <div class="metric">
          <span class="label">Load Time:</span>
          <span class="value">{{ performanceMetrics.loadTime }}ms</span>
        </div>
        <div class="metric">
          <span class="label">First Paint:</span>
          <span class="value">{{ performanceMetrics.firstPaint }}ms</span>
        </div>
        <div class="metric">
          <span class="label">LCP:</span>
          <span class="value">{{ performanceMetrics.largestContentfulPaint }}ms</span>
        </div>
      </div>

      <!-- Mobile Navigation Hints -->
      <div class="mobile-hints" *ngIf="showMobileHints">
        <div class="hint" *ngFor="let hint of mobileHints">
          <i [class]="hint.icon"></i>
          <span>{{ hint.text }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./mobile-optimization.component.css']
})
export class MobileOptimizationComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private touchGestureService = inject(TouchGestureService);
  private appShellService = inject(AppShellService);
  private pushNotificationService = inject(PushNotificationService);

  private subscriptions = new Subscription();

  // Component State
  isMobile = false;
  isLoading = true;
  showTouchStatus = false;
  showNotificationControls = true;
  showPerformanceInfo = false;
  showMobileHints = true;

  // Gesture State
  currentGesture = '';
  gestureDirection = '';

  // Notification State
  notificationPermission: NotificationPermission = 'default';

  // Performance State
  performanceMetrics: any = null;

  // Mobile Hints
  mobileHints = [
    { icon: 'fas fa-hand-paper', text: 'Swipe left/right to navigate' },
    { icon: 'fas fa-arrows-alt-v', text: 'Pull down to refresh' },
    { icon: 'fas fa-expand-arrows-alt', text: 'Pinch to zoom images' },
    { icon: 'fas fa-bell', text: 'Enable notifications for updates' }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMobileOptimization();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeMobileOptimization(): void {
    // Check if device is mobile
    this.isMobile = this.isMobileDevice();

    if (this.isMobile) {
      this.setupGestureTracking();
      this.setupAppShell();
      this.setupPushNotifications();
      this.loadPerformanceMetrics();
    }
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  private setupGestureTracking(): void {
    // Subscribe to swipe gestures - TouchGestureService provides swipe$ observable
    this.subscriptions.add(
      this.touchGestureService.swipe$.subscribe((gesture: any) => {
        this.currentGesture = 'Swipe';
        this.gestureDirection = gesture.direction;
        this.showTouchStatus = true;
        
        // Hide status after 2 seconds
        setTimeout(() => {
          this.showTouchStatus = false;
        }, 2000);
      })
    );

    // Check if device supports touch
    const touchInfo = this.touchGestureService.getTouchInfo();
    if (touchInfo.hasTouch) {
      console.log('Touch support detected:', touchInfo.touchSupport);
    }
  }

  private setupAppShell(): void {
    // Subscribe to loading state
    this.subscriptions.add(
      this.appShellService.getLoadingState().subscribe((loadingState: any) => {
        this.isLoading = loadingState.isLoading;
      })
    );

    // Just show loading skeleton manually for now
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  private setupPushNotifications(): void {
    // Get current permission status using the correct method
    const stats = this.pushNotificationService.getNotificationStats();
    this.notificationPermission = stats.permission;

    // Subscribe to permission state changes
    this.subscriptions.add(
      this.pushNotificationService.getPermissionState().subscribe((state: any) => {
        this.notificationPermission = state.permission;
      })
    );

    // Auto-request permission if not determined
    if (this.notificationPermission === 'default') {
      setTimeout(() => {
        this.requestNotificationPermission();
      }, 3000); // Wait 3 seconds after page load
    }
  }

  private loadPerformanceMetrics(): void {
    // Get performance metrics from app shell service
    this.performanceMetrics = this.appShellService.getPerformanceMetrics();
  }

  // Public Methods
  toggleNotifications(): void {
    if (this.notificationPermission === 'default') {
      this.requestNotificationPermission();
    } else if (this.notificationPermission === 'granted') {
      // Show test notification
      this.pushNotificationService.showNotification({
        title: 'Mahlatji-Mmetji Group',
        body: 'Notifications are enabled! You\'ll receive updates about our services.',
        icon: '/assets/images/logo.png',
        tag: 'test-notification'
      });
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    try {
      const granted = await this.pushNotificationService.requestPermission();
      if (granted) {
        // Subscribe to push notifications
        const subscription = await this.pushNotificationService.subscribeToPush();
        if (subscription) {
          // Send welcome notification
          this.pushNotificationService.showNotification({
            title: 'Welcome to Mahlatji-Mmetji Group!',
            body: 'You\'ll now receive important updates about our real estate services.',
            icon: '/assets/images/logo.png',
            tag: 'welcome-notification'
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  getNotificationButtonText(): string {
    switch (this.notificationPermission) {
      case 'granted':
        return 'Notifications Enabled';
      case 'denied':
        return 'Notifications Blocked';
      default:
        return 'Enable Notifications';
    }
  }

  togglePerformanceInfo(): void {
    this.showPerformanceInfo = !this.showPerformanceInfo;
  }

  hideMobileHints(): void {
    this.showMobileHints = false;
  }

  // Gesture handlers for testing
  onSwipeLeft(): void {
    // Handle swipe left - could navigate to next page
    console.log('Swipe left detected - navigate to next page');
  }

  onSwipeRight(): void {
    // Handle swipe right - could navigate to previous page
    console.log('Swipe right detected - navigate to previous page');
  }

  onPullToRefresh(): void {
    // Handle pull to refresh
    console.log('Pull to refresh detected - refreshing content');
    window.location.reload();
  }
}
