import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PWAService } from '../../services/pwa.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- PWA Install Prompt -->
    <div class="pwa-install-banner" 
         *ngIf="showInstallBanner"
         [@slideDown]="showInstallBanner">
      <div class="install-content">
        <div class="install-info">
          <div class="install-icon">
            <i class="fa fa-mobile-alt" aria-hidden="true"></i>
          </div>
          <div class="install-text">
            <h4>Install Mahlatji Mmetji Group App</h4>
            <p>Get quick access and work offline</p>
          </div>
        </div>
        <div class="install-actions">
          <button class="btn-install" 
                  (click)="installApp()"
                  type="button">
            <i class="fa fa-download" aria-hidden="true"></i>
            Install
          </button>
          <button class="btn-dismiss" 
                  (click)="dismissInstall()"
                  type="button"
                  aria-label="Dismiss install prompt">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- PWA Update Banner -->
    <div class="pwa-update-banner" 
         *ngIf="showUpdateBanner"
         [@slideDown]="showUpdateBanner">
      <div class="update-content">
        <div class="update-info">
          <div class="update-icon">
            <i class="fa fa-sync-alt" aria-hidden="true"></i>
          </div>
          <div class="update-text">
            <h4>Update Available</h4>
            <p>A new version is ready to install</p>
          </div>
        </div>
        <div class="update-actions">
          <button class="btn-update" 
                  (click)="updateApp()"
                  type="button">
            <i class="fa fa-refresh" aria-hidden="true"></i>
            Update
          </button>
          <button class="btn-dismiss" 
                  (click)="dismissUpdate()"
                  type="button"
                  aria-label="Dismiss update prompt">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Network Status -->
    <div class="network-status" 
         *ngIf="!isOnline"
         [@slideDown]="!isOnline">
      <div class="offline-content">
        <i class="fa fa-wifi" aria-hidden="true"></i>
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>

    <!-- PWA Features Indicator -->
    <div class="pwa-status" 
         *ngIf="isInstalled"
         title="Running as installed app">
      <i class="fa fa-mobile-alt" aria-hidden="true"></i>
      <span class="sr-only">App is installed</span>
    </div>
  `,
  styles: [`
    .pwa-install-banner,
    .pwa-update-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .pwa-update-banner {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .install-content,
    .update-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .install-info,
    .update-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .install-icon,
    .update-icon {
      font-size: 1.5rem;
      opacity: 0.9;
    }

    .install-text h4,
    .update-text h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .install-text p,
    .update-text p {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .install-actions,
    .update-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-install,
    .btn-update {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-install:hover,
    .btn-update:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }

    .btn-dismiss {
      background: none;
      border: none;
      color: white;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .btn-dismiss:hover {
      opacity: 1;
    }

    .network-status {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #ff6b6b;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(255,107,107,0.3);
      z-index: 9998;
      animation: pulse 2s infinite;
    }

    .offline-content {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
    }

    .pwa-status {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      box-shadow: 0 2px 8px rgba(76,175,80,0.3);
      z-index: 9997;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .install-content,
      .update-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .install-info,
      .update-info {
        justify-content: center;
      }

      .network-status {
        left: 10px;
        right: 10px;
        bottom: 10px;
      }

      .pwa-status {
        top: 10px;
        right: 10px;
      }
    }

    /* Dark theme support */
    :host-context(.dark-theme) .network-status {
      background: #d32f2f;
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .pwa-install-banner,
      .pwa-update-banner {
        border: 2px solid currentColor;
      }
      
      .btn-install,
      .btn-update {
        border: 2px solid currentColor;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .btn-install,
      .btn-update,
      .btn-dismiss {
        transition: none;
      }

      .btn-install:hover,
      .btn-update:hover {
        transform: none;
      }

      .network-status {
        animation: none;
      }
    }
  `],
  animations: [
    // Angular animations would go here if needed
  ]
})
export class PWAInstallComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  showInstallBanner = false;
  showUpdateBanner = false;
  isOnline = true;
  isInstalled = false;

  constructor(private pwaService: PWAService) {}

  ngOnInit(): void {
    // Monitor PWA status
    this.pwaService.installable$
      .pipe(takeUntil(this.destroy$))
      .subscribe(installable => {
        this.showInstallBanner = installable && !this.isInstalled;
      });

    this.pwaService.updateAvailable$
      .pipe(takeUntil(this.destroy$))
      .subscribe(updateAvailable => {
        this.showUpdateBanner = updateAvailable;
      });

    this.pwaService.online$
      .pipe(takeUntil(this.destroy$))
      .subscribe(online => {
        this.isOnline = online;
      });

    this.pwaService.installed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(installed => {
        this.isInstalled = installed;
        if (installed) {
          this.showInstallBanner = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async installApp(): Promise<void> {
    const success = await this.pwaService.installPWA();
    if (success) {
      this.showInstallBanner = false;
      this.showSuccessMessage('App installed successfully!');
    } else {
      this.showErrorMessage('Installation was cancelled or failed.');
    }
  }

  async updateApp(): Promise<void> {
    const success = await this.pwaService.updatePWA();
    if (success) {
      this.showUpdateBanner = false;
      this.showSuccessMessage('App will update after reload.');
    } else {
      this.showErrorMessage('Update failed. Please try again.');
    }
  }

  dismissInstall(): void {
    this.showInstallBanner = false;
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }

  dismissUpdate(): void {
    this.showUpdateBanner = false;
    localStorage.setItem('pwa-update-dismissed', Date.now().toString());
  }

  private showSuccessMessage(message: string): void {
    // This could integrate with a toast service
    console.log('✅', message);
  }

  private showErrorMessage(message: string): void {
    // This could integrate with a toast service  
    console.error('❌', message);
  }
}
