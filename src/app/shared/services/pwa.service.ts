import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

export interface PWAPromptEvent {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: PWAPromptEvent;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PWAService {
  private promptEvent: PWAPromptEvent | null = null;
  private isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);
  private isInstallable$ = new BehaviorSubject<boolean>(false);
  private isInstalled$ = new BehaviorSubject<boolean>(false);
  private updateAvailableSubject$ = new BehaviorSubject<boolean>(false);

  // Public observables
  readonly online$ = this.isOnline$.asObservable();
  readonly installable$ = this.isInstallable$.asObservable();
  readonly installed$ = this.isInstalled$.asObservable();
  readonly updateAvailable$ = this.updateAvailableSubject$.asObservable();

  constructor(private swUpdate: SwUpdate) {
    this.initializePWA();
    this.monitorNetworkStatus();
    this.monitorServiceWorkerUpdates();
  }

  private initializePWA(): void {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.promptEvent = event;
      this.isInstallable$.next(true);
      console.log('💡 PWA install prompt available');
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled$.next(true);
      this.isInstallable$.next(false);
      this.promptEvent = null;
      console.log('🎉 PWA installed successfully');
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled$.next(true);
      console.log('📱 PWA is running in standalone mode');
    }
  }

  private monitorNetworkStatus(): void {
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe((online) => {
      this.isOnline$.next(online);
      console.log(`🌐 Network status: ${online ? 'Online' : 'Offline'}`);
    });
  }

  private monitorServiceWorkerUpdates(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('⚠️ Service Worker not enabled');
      return;
    }

    // Check for updates
    this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log('🔄 New version detected, downloading...');
          break;
        case 'VERSION_READY':
          console.log('✅ New version ready for activation');
          this.updateAvailableSubject$.next(true);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.error('❌ Failed to install new version');
          break;
      }
    });

    // Check for unrecoverable state
    this.swUpdate.unrecoverable.subscribe((event) => {
      console.error('💥 Service Worker in unrecoverable state:', event.reason);
      this.promptUserToReload();
    });
  }

  async installPWA(): Promise<boolean> {
    if (!this.promptEvent) {
      console.log('❌ No install prompt available');
      return false;
    }

    try {
      this.promptEvent.prompt();
      const choiceResult = await this.promptEvent.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted PWA installation');
        return true;
      } else {
        console.log('❌ User dismissed PWA installation');
        return false;
      }
    } catch (error) {
      console.error('💥 Error during PWA installation:', error);
      return false;
    }
  }

  async updatePWA(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      console.log('⚠️ Service Worker updates not available');
      return false;
    }

    try {
      await this.swUpdate.activateUpdate();
      console.log('✅ PWA updated successfully');
      this.promptUserToReload();
      return true;
    } catch (error) {
      console.error('💥 Error updating PWA:', error);
      return false;
    }
  }

  async checkForUpdates(): Promise<void> {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    try {
      await this.swUpdate.checkForUpdate();
      console.log('🔍 Checked for PWA updates');
    } catch (error) {
      console.error('💥 Error checking for updates:', error);
    }
  }

  private promptUserToReload(): void {
    const shouldReload = confirm(
      'A new version of the application is available. Reload to update?'
    );
    
    if (shouldReload) {
      window.location.reload();
    }
  }

  // Utility methods
  canInstall(): boolean {
    return this.isInstallable$.value && !!this.promptEvent;
  }

  isOnline(): boolean {
    return this.isOnline$.value;
  }

  isAppInstalled(): boolean {
    return this.isInstalled$.value;
  }

  hasUpdateAvailable(): boolean {
    return this.updateAvailableSubject$.value;
  }

  // PWA capabilities detection
  hasPWAFeatures(): { [key: string]: boolean } {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'PushManager' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      webShare: 'share' in navigator,
      badging: 'setAppBadge' in navigator,
      installPrompt: 'BeforeInstallPromptEvent' in window,
      fullscreen: 'requestFullscreen' in document.documentElement,
      vibration: 'vibrate' in navigator,
      geolocation: 'geolocation' in navigator
    };
  }

  // Share API
  async shareContent(data: { title: string; text: string; url: string }): Promise<boolean> {
    if (!('share' in navigator)) {
      console.log('⚠️ Web Share API not supported');
      return false;
    }

    try {
      await navigator.share(data);
      console.log('✅ Content shared successfully');
      return true;
    } catch (error) {
      console.error('💥 Error sharing content:', error);
      return false;
    }
  }
}
