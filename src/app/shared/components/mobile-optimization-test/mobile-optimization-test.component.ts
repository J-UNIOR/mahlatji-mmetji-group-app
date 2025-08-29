/**
 * Mobile Optimization Integration Test
 * Tests the integration of TouchGestureService, AppShellService, and PushNotificationService
 */

import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TouchGestureService } from '../../services/touch-gesture.service';
import { AppShellService } from '../../services/app-shell.service';
import { PushNotificationService } from '../../services/push-notification.service';
import { MobileOptimizationComponent } from '../mobile-optimization/mobile-optimization.component';

@Component({
  selector: 'app-mobile-optimization-test',
  standalone: true,
  imports: [CommonModule, MobileOptimizationComponent],
  template: `
    <div class="mobile-test-container">
      <!-- Mobile Optimization Component -->
      <app-mobile-optimization></app-mobile-optimization>
      <!-- Test Controls -->
      <div class="test-controls" *ngIf="isBrowser">
        <h2>🧪 Mobile Optimization Test Suite</h2>
        <!-- Service Status -->
        <div class="service-status">
          <div class="status-item">
            <span class="service-name">Touch Gestures:</span>
            <span [class]="touchGestureStatus.class">{{ touchGestureStatus.text }}</span>
          </div>
          <div class="status-item">
            <span class="service-name">App Shell:</span>
            <span [class]="appShellStatus.class">{{ appShellStatus.text }}</span>
          </div>
          <div class="status-item">
            <span class="service-name">Push Notifications:</span>
            <span [class]="pushNotificationStatus.class">{{ pushNotificationStatus.text }}</span>
          </div>
        </div>
        <!-- Test Buttons -->
        <div class="test-buttons">
          <button class="test-btn primary" (click)="testTouchGestures()">Test Touch Gestures</button>
          <button class="test-btn secondary" (click)="testAppShell()">Test App Shell</button>
          <button class="test-btn warning" (click)="testPushNotifications()">Test Notifications</button>
          <button class="test-btn success" (click)="runFullTest()" [disabled]="isRunningTest">
            {{ isRunningTest ? 'Running...' : 'Run Full Test' }}
          </button>
        </div>
        <!-- Test Results -->
        <div class="test-results" *ngIf="testResults.length > 0">
          <h3>📊 Test Results</h3>
          <div class="result-item" *ngFor="let result of testResults">
            <span [class]="result.status">{{ result.icon }}</span>
            <span class="result-text">{{ result.text }}</span>
            <span class="result-time">{{ result.time }}ms</span>
          </div>
        </div>
        <!-- Performance Metrics -->
        <div class="performance-section" *ngIf="performanceData">
          <h3>⚡ Performance Metrics</h3>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-label">Load Time</span>
              <span class="metric-value">{{ performanceData['timeToInteractive'] }}ms</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">First Paint</span>
              <span class="metric-value">{{ performanceData['firstContentfulPaint'] }}ms</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Shell Load</span>
              <span class="metric-value">{{ performanceData['shellLoadTime'] }}ms</span>
            </div>
          </div>
        </div>
        <!-- Device Information -->
        <div class="device-info" *ngIf="deviceInfo">
          <h3>📱 Device Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Device Type:</span>
              <span class="info-value">{{ deviceInfo['type'] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Touch Support:</span>
              <span class="info-value">{{ deviceInfo['touchSupport'] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Screen Size:</span>
              <span class="info-value">{{ deviceInfo['screenSize'] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Pixel Ratio:</span>
              <span class="info-value">{{ deviceInfo['pixelRatio'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-test-container {
      position: relative;
      min-height: 100vh;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .test-controls {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin: 0 0 24px 0;
      font-size: 24px;
      font-weight: 600;
     import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';

    h3 {
      color: #555;
      margin: 24px 0 16px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .service-status {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .status-item:last-child {
      margin-bottom: 0;
    }

    .service-name {
      font-weight: 500;
      color: #666;
    }

    .status-active {
      color: #4CAF50;
      font-weight: 600;
    }

    .status-inactive {
      color: #f44336;
      font-weight: 600;
    }

    .status-loading {
      color: #FF9800;
      font-weight: 600;
    }

    .test-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .test-btn {
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .test-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .test-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .test-btn.primary {
      background: #2196F3;
      color: white;
    }

    .test-btn.secondary {
      background: #607D8B;
      color: white;
    }

    .test-btn.warning {
      background: #FF9800;
      color: white;
    }

    .test-btn.success {
      background: #4CAF50;
      color: white;
    }

    .test-results {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      padding: 8px;
      border-radius: 4px;
      background: white;
    }

    .result-item:last-child {
      margin-bottom: 0;
    }

    .success {
      color: #4CAF50;
    }

    .error {
      color: #f44336;
    }

    .warning {
      color: #FF9800;
    }

    .result-text {
      flex: 1;
      font-size: 14px;
    }

    .result-time {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .performance-section,
    .device-info {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .metric-grid,
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    .metric-card,
    .info-item {
      background: white;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
    }

    .metric-label,
    .info-label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .metric-value,
    .info-value {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 768px) {
      .mobile-test-container {
        padding: 10px;
      }

      .test-controls {
        padding: 16px;
      }

      .test-buttons {
        grid-template-columns: 1fr;
      }

      .metric-grid,
      .info-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }
    }
  `]
})
export class MobileOptimizationTestComponent implements OnInit {
  // ...existing code...
  // Required by OnDestroy interface. Add cleanup logic if needed in the future.



  private platformId = inject(PLATFORM_ID);
  private touchGestureService = inject(TouchGestureService);
  private appShellService = inject(AppShellService);
  private pushNotificationService = inject(PushNotificationService);

  isBrowser = false;
  isRunningTest = false;

  touchGestureStatus = { text: 'Checking...', class: 'status-loading' };
  appShellStatus = { text: 'Checking...', class: 'status-loading' };
  pushNotificationStatus = { text: 'Checking...', class: 'status-loading' };

  testResults: {
    icon: string;
    text: string;
    status: string;
    time: number;
  }[] = [];

  performanceData: Record<string, unknown> | null = null;
  deviceInfo: Record<string, unknown> | null = null;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      this.checkServiceStatus();
      this.loadDeviceInfo();
      this.loadPerformanceData();
    }
  }



  private checkServiceStatus(): void {
    // Check TouchGestureService
    const touchInfo = this.touchGestureService.getTouchInfo();
    this.touchGestureStatus = {
      text: touchInfo.hasTouch ? `Active (${touchInfo.touchSupport})` : 'No touch support',
      class: touchInfo.hasTouch ? 'status-active' : 'status-inactive'
    };

    // Check AppShellService
    const criticalLoaded = this.appShellService.areCriticalResourcesLoaded();
    this.appShellStatus = {
      text: criticalLoaded ? 'Resources loaded' : 'Loading resources',
      class: criticalLoaded ? 'status-active' : 'status-loading'
    };

    // Check PushNotificationService
    const notificationStats = this.pushNotificationService.getNotificationStats();
    this.pushNotificationStatus = {
      text: notificationStats.supported ? 
        `${notificationStats.permission.charAt(0).toUpperCase() + notificationStats.permission.slice(1)}` : 
        'Not supported',
      class: notificationStats.permission === 'granted' ? 'status-active' : 
             notificationStats.permission === 'denied' ? 'status-inactive' : 'status-loading'
    };
  }

  private loadDeviceInfo(): void {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const touchInfo = this.touchGestureService.getTouchInfo();

    this.deviceInfo = {
      type: isMobile ? 'Mobile' : 'Desktop',
      touchSupport: touchInfo.touchSupport,
      screenSize: `${window.innerWidth}×${window.innerHeight}`,
      pixelRatio: `${window.devicePixelRatio || 1}x`
    };
  }

  private loadPerformanceData(): void {
    this.performanceData = this.appShellService.getPerformanceMetrics();
  }

  async testTouchGestures(): Promise<void> {
    const startTime = performance.now();
    
    try {
      const touchInfo = this.touchGestureService.getTouchInfo();
      const endTime = performance.now();
      
      this.addTestResult({
        icon: '✅',
        text: `Touch gesture detection: ${touchInfo.hasTouch ? 'Working' : 'No touch device'}`,
        status: 'success',
        time: Math.round(endTime - startTime)
      });

      // Test swipe subscription
      const subscription = this.touchGestureService.swipe$.subscribe(swipe => {
        this.addTestResult({
          icon: '👆',
          text: `Swipe ${swipe.direction} detected (${Math.round(swipe.distance)}px)`,
          status: 'success',
          time: Math.round(swipe.velocity * 1000)
        });
      });

      // Clean up after 5 seconds
      setTimeout(() => subscription.unsubscribe(), 5000);

    } catch (error) {
      const endTime = performance.now();
      this.addTestResult({
        icon: '❌',
        text: `Touch gesture test failed: ${error}`,
        status: 'error',
        time: Math.round(endTime - startTime)
      });
    }
  }

  async testAppShell(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Test loading state
      const loadingState = await new Promise(resolve => {
        const subscription = this.appShellService.getLoadingState().subscribe(state => {
          subscription.unsubscribe();
          resolve(state);
        });
      });

      const endTime = performance.now();
      
      this.addTestResult({
        icon: '✅',
  text: `App shell loading state: ${(loadingState as { stage: string }).stage}`,
        status: 'success',
        time: Math.round(endTime - startTime)
      });

      // Test performance metrics
      const metrics = this.appShellService.getPerformanceMetrics();
      this.addTestResult({
        icon: '⚡',
        text: `Performance metrics loaded: ${metrics.timeToInteractive.toFixed(2)}ms TTI`,
        status: 'success',
        time: Math.round(performance.now() - startTime)
      });

    } catch (error) {
      const endTime = performance.now();
      this.addTestResult({
        icon: '❌',
        text: `App shell test failed: ${error}`,
        status: 'error',
        time: Math.round(endTime - startTime)
      });
    }
  }

  async testPushNotifications(): Promise<void> {
    const startTime = performance.now();
    
    try {
      const stats = this.pushNotificationService.getNotificationStats();
      const endTime = performance.now();
      
      this.addTestResult({
        icon: '🔔',
        text: `Notification support: ${stats.supported ? 'Available' : 'Not supported'}`,
        status: stats.supported ? 'success' : 'warning',
        time: Math.round(endTime - startTime)
      });

      if (stats.supported && stats.permission === 'granted') {
        // Test notification
        await this.pushNotificationService.testNotification();
        this.addTestResult({
          icon: '✅',
          text: 'Test notification sent successfully',
          status: 'success',
          time: Math.round(performance.now() - startTime)
        });
      } else if (stats.permission === 'default') {
        const granted = await this.pushNotificationService.requestPermission();
        this.addTestResult({
          icon: granted ? '✅' : '⚠️',
          text: `Permission request: ${granted ? 'Granted' : 'Denied'}`,
          status: granted ? 'success' : 'warning',
          time: Math.round(performance.now() - startTime)
        });
      }

    } catch (error) {
      const endTime = performance.now();
      this.addTestResult({
        icon: '❌',
        text: `Push notification test failed: ${error}`,
        status: 'error',
        time: Math.round(endTime - startTime)
      });
    }
  }

  async runFullTest(): Promise<void> {
    this.isRunningTest = true;
    this.testResults = [];
    
    this.addTestResult({
      icon: '🚀',
      text: 'Starting full mobile optimization test...',
      status: 'success',
      time: 0
    });

    try {
      await this.testTouchGestures();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testAppShell();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testPushNotifications();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Final summary
      const successCount = this.testResults.filter(r => r.status === 'success').length;
      const totalCount = this.testResults.length;
      
      this.addTestResult({
        icon: '🎉',
        text: `Test complete: ${successCount}/${totalCount} tests passed`,
        status: successCount === totalCount ? 'success' : 'warning',
        time: 0
      });

    } catch (error) {
      this.addTestResult({
        icon: '❌',
        text: `Full test failed: ${error}`,
        status: 'error',
        time: 0
      });
    } finally {
      this.isRunningTest = false;
    }
  }

  private addTestResult(result: { icon: string; text: string; status: string; time: number }): void {
    this.testResults.push(result);
  }
}
