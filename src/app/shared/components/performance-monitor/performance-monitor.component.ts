import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PerformanceService } from '../../services/performance.service';

@Component({
  selector: 'app-performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showMetrics && isVisible" class="performance-monitor" [class.minimized]="isMinimized">
      <div class="monitor-header" (click)="toggleMinimized()">
        <h6>Performance Monitor</h6>
        <span class="toggle-btn">{{ isMinimized ? '▲' : '▼' }}</span>
      </div>
      
      <div *ngIf="!isMinimized" class="monitor-content">
        <div class="metric-row" *ngFor="let metric of displayMetrics">
          <span class="metric-label">{{ metric.label }}:</span>
          <span class="metric-value" [ngClass]="getMetricClass(metric.value, metric.threshold)">
            {{ metric.value }}{{ metric.unit }}
          </span>
        </div>
        
        <div class="actions">
          <button (click)="refreshMetrics()" class="btn-refresh">
            <i class="fa fa-refresh"></i> Refresh
          </button>
          <button (click)="toggleVisibility()" class="btn-close">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Toggle button when hidden -->
    <button *ngIf="!isVisible" (click)="toggleVisibility()" class="performance-toggle">
      <i class="fa fa-tachometer-alt"></i>
    </button>
  `,
  styles: [`
    .performance-monitor {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #dee2e6;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 9999;
      min-width: 280px;
      backdrop-filter: blur(10px);
    }

    .performance-monitor.minimized {
      min-width: auto;
    }

    .monitor-header {
      background: #f35525;
      color: white;
      padding: 8px 12px;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .monitor-header h6 {
      margin: 0;
      font-size: 11px;
      font-weight: 600;
    }

    .toggle-btn {
      font-size: 10px;
    }

    .monitor-content {
      padding: 12px;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      padding: 2px 0;
    }

    .metric-label {
      color: #666;
      font-weight: 500;
    }

    .metric-value {
      font-weight: 600;
    }

    .metric-value.good {
      color: #28a745;
    }

    .metric-value.warning {
      color: #ffc107;
    }

    .metric-value.poor {
      color: #dc3545;
    }

    .actions {
      margin-top: 8px;
      display: flex;
      gap: 6px;
    }

    .btn-refresh,
    .btn-close {
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-refresh:hover {
      background: #5a6268;
    }

    .btn-close:hover {
      background: #dc3545;
    }

    .performance-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f35525;
      color: white;
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      transition: all 0.3s ease;
    }

    .performance-toggle:hover {
      background: #e63946;
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .performance-monitor {
        bottom: 10px;
        right: 10px;
        left: 10px;
        min-width: auto;
      }

      .performance-toggle {
        bottom: 10px;
        right: 10px;
      }
    }
  `]
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  showMetrics = false;
  isVisible = false;
  isMinimized = false;
  displayMetrics: any[] = [];
  private metricsInterval: any;

  constructor(
    private performanceService: PerformanceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Only show in development mode
      this.showMetrics = !environment.production;
      this.isVisible = this.showMetrics;
      
      if (this.showMetrics) {
        this.refreshMetrics();
        this.metricsInterval = setInterval(() => {
          this.refreshMetrics();
        }, 5000);
      }
    }
  }

  ngOnDestroy() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  refreshMetrics() {
    if (!isPlatformBrowser(this.platformId)) return;

    const metrics = this.performanceService.getPerformanceMetrics();
    if (metrics) {
      this.displayMetrics = [
        {
          label: 'Load Time',
          value: Math.round(metrics.loadTime),
          unit: 'ms',
          threshold: { good: 1000, warning: 2000 }
        },
        {
          label: 'DOM Ready',
          value: Math.round(metrics.domContentLoaded),
          unit: 'ms',
          threshold: { good: 800, warning: 1500 }
        },
        {
          label: 'First Paint',
          value: Math.round(metrics.firstPaint),
          unit: 'ms',
          threshold: { good: 1000, warning: 2000 }
        },
        {
          label: 'First Content',
          value: Math.round(metrics.firstContentfulPaint),
          unit: 'ms',
          threshold: { good: 1500, warning: 3000 }
        }
      ];
    }
  }

  getMetricClass(value: number, threshold: any): string {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.warning) return 'warning';
    return 'poor';
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  toggleMinimized() {
    this.isMinimized = !this.isMinimized;
  }
}

// Environment check (you may need to adjust this import)
const environment = { production: false };
