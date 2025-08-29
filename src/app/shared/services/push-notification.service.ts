import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: unknown;
  actions?: {
    action: string;
    title: string;
    icon?: string;
  }[];
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
}

export interface PushSubscriptionInfo {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
  serviceWorkerReady: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private permissionState$ = new BehaviorSubject<NotificationPermissionState>({
    permission: 'default',
    supported: false,
    serviceWorkerReady: false
  });

  private subscription: PushSubscription | null = null;
  private publicVapidKey = 'BKaOKqJPZKClvjzH5OEfLRxJ2qRJ9L3kYgC8r2YRa2wQd5kO8F4Cc3K4KFHB2JGm3oR8u6QQ2TfG7DsRw9J5N8A'; // Replace with your VAPID key

  platformId = inject(PLATFORM_ID);
  private swUpdate = inject(SwUpdate);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeNotificationService();
    }
  }

  /**
   * Initialize notification service
   */
  private async initializeNotificationService(): Promise<void> {
    try {
      const supported = this.isNotificationSupported();
      const permission = supported ? Notification.permission : 'denied';
      const serviceWorkerReady = await this.isServiceWorkerReady();

      this.updatePermissionState({
        permission,
        supported,
        serviceWorkerReady
      });

      if (supported && serviceWorkerReady) {
        await this.setupServiceWorkerMessageListener();
      }
    } catch (error) {
      console.error('Failed to initialize push notification service:', error);
    }
  }

  /**
   * Get current permission state
   */
  getPermissionState(): Observable<NotificationPermissionState> {
    return this.permissionState$.asObservable();
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isNotificationSupported()) {
      throw new Error('Notifications are not supported in this browser');
    }

    try {
      const permission = await Notification.requestPermission();
      
      this.updatePermissionState({
        ...this.permissionState$.value,
        permission
      });

      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      throw error;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(): Promise<PushSubscriptionInfo> {
    if (!this.isNotificationSupported()) {
      throw new Error('Push notifications are not supported');
    }

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey) as BufferSource
      });

      this.subscription = subscription;

      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      const result = await this.subscription.unsubscribe();
      this.subscription = null;
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Show local notification
   */
  async showNotification(config: NotificationConfig): Promise<void> {
    if (!this.isNotificationSupported()) {
      throw new Error('Notifications are not supported');
    }

    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options: NotificationOptions = {
        body: config.body,
        icon: config.icon || '/assets/images/logo.png',
        badge: config.badge || '/assets/images/badge.png',
        tag: config.tag,
        data: config.data,
        requireInteraction: config.requireInteraction || false,
        silent: config.silent || false
      };

      // Add actions if supported
      if (config.actions && 'actions' in options) {
  (options as Record<string, unknown>)['actions'] = config.actions;
      }

      await registration.showNotification(config.title, options);
    } catch (error) {
      console.error('Failed to show notification:', error);
      throw error;
    }
  }

  /**
   * Show business update notification
   */
  async showBusinessUpdate(message: string, type: 'info' | 'success' | 'warning' = 'info'): Promise<void> {
    const icons = {
      info: '/assets/images/notification-info.png',
      success: '/assets/images/notification-success.png',
      warning: '/assets/images/notification-warning.png'
    };

    await this.showNotification({
      title: 'Mahlatji Mmetji Group',
      body: message,
      icon: icons[type],
      tag: 'business-update',
      data: { type, timestamp: Date.now() },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  }

  /**
   * Show property alert notification
   */
  async showPropertyAlert(propertyTitle: string, alertType: 'new-listing' | 'price-change' | 'status-update'): Promise<void> {
    const messages = {
      'new-listing': `New property listing: ${propertyTitle}`,
      'price-change': `Price updated for: ${propertyTitle}`,
      'status-update': `Status changed for: ${propertyTitle}`
    };

    await this.showNotification({
      title: 'Property Alert',
      body: messages[alertType],
      icon: '/assets/images/property-alert.png',
      tag: 'property-alert',
      data: { 
        propertyTitle, 
        alertType, 
        timestamp: Date.now() 
      },
      actions: [
        {
          action: 'view-property',
          title: 'View Property'
        },
        {
          action: 'view-all',
          title: 'View All Properties'
        }
      ],
      requireInteraction: true
    });
  }

  /**
   * Show service reminder notification
   */
  async showServiceReminder(serviceType: string, scheduledDate: Date): Promise<void> {
    await this.showNotification({
      title: 'Service Reminder',
      body: `Upcoming ${serviceType} scheduled for ${scheduledDate.toLocaleDateString()}`,
      icon: '/assets/images/service-reminder.png',
      tag: 'service-reminder',
      data: { 
        serviceType, 
        scheduledDate: scheduledDate.toISOString(),
        timestamp: Date.now() 
      },
      actions: [
        {
          action: 'reschedule',
          title: 'Reschedule'
        },
        {
          action: 'contact',
          title: 'Contact Us'
        }
      ]
    });
  }

  /**
   * Setup service worker message listener
   */
  private async setupServiceWorkerMessageListener(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        this.handleNotificationClick(event.data);
      }
    });

    // Listen for push events from service worker
  fromEvent<MessageEvent>(navigator.serviceWorker, 'message').subscribe((event: MessageEvent) => {
      if (event.data?.type === 'PUSH_RECEIVED') {
        console.log('Push notification received:', event.data.payload);
      }
    });
  }

  /**
   * Handle notification click events
   */
  private handleNotificationClick(data: unknown): void {
  const { action } = data as { action: string };

    switch (action) {
      case 'view':
        window.open('/', '_blank');
        break;
      case 'view-property':
        window.open('/portfolio', '_blank');
        break;
      case 'view-all':
        window.open('/portfolio', '_blank');
        break;
      case 'contact':
        window.open('/contact', '_blank');
        break;
      case 'reschedule':
        window.open('/contact?action=reschedule', '_blank');
        break;
      default:
        window.focus();
    }
  }

  /**
   * Check if notifications are supported
   */
  isNotificationSupported(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Check if service worker is ready
   */
  private async isServiceWorkerReady(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      return !!registration;
    } catch {
      return false;
    }
  }

  /**
   * Update permission state
   */
  private updatePermissionState(state: NotificationPermissionState): void {
    this.permissionState$.next(state);
  }

  /**
   * Convert URL-safe base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return window.btoa(binary);
  }

  /**
   * Get current subscription
   */
  getCurrentSubscription(): PushSubscription | null {
    return this.subscription;
  }

  /**
   * Test notification functionality
   */
  async testNotification(): Promise<void> {
    await this.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification from Mahlatji Mmetji Group',
      icon: '/assets/images/logo.png',
      tag: 'test',
      data: { test: true }
    });
  }

  /**
   * Schedule a notification (requires service worker support)
   */
  async scheduleNotification(config: NotificationConfig, delay: number): Promise<void> {
    if (!this.isNotificationSupported()) {
      throw new Error('Scheduled notifications are not supported');
    }

    // This would typically be handled by the service worker
    setTimeout(async () => {
      await this.showNotification(config);
    }, delay);
  }

  /**
   * Get notification statistics
   */
  getNotificationStats(): {
    supported: boolean;
    permission: NotificationPermission;
    subscribed: boolean;
    serviceWorkerReady: boolean;
  } {
    const state = this.permissionState$.value;
    
    return {
      supported: state.supported,
      permission: state.permission,
      subscribed: !!this.subscription,
      serviceWorkerReady: state.serviceWorkerReady
    };
  }
}
