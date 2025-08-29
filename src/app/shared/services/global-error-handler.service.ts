// Helper type guard for property access
function hasProp<T extends object, K extends PropertyKey>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
import { Injectable, ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UXEnhancementService } from './ux-enhancement.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private router = inject(Router);
  private uxService = inject(UXEnhancementService);

  handleError(error: unknown): void {
    console.error('Global error caught:', error);

    // Extract error information
  // const errorInfo = this.extractErrorInfo(error);
    
    // Log error for analytics
    this.uxService.measureUserInteraction('global-error-caught');

    // Determine error type and handle accordingly
    if (this.isNetworkError(error)) {
  this.handleNetworkError();
    } else if (this.isChunkLoadError(error)) {
  this.handleChunkLoadError();
    } else if (this.isPermissionError(error)) {
      this.handlePermissionError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private extractErrorInfo(error: unknown): { message: string; stack?: string } {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack
      };
    } else if (typeof error === 'object' && error !== null && hasProp(error, 'error') && (error as Record<string, unknown>)['error'] instanceof Error) {
      const err = (error as Record<string, unknown>)['error'] as Error;
      return {
        message: err.message,
        stack: err.stack
      };
    } else if (typeof error === 'string') {
      return { message: error };
    } else {
      return {
        message: 'Unknown error occurred',
        stack: JSON.stringify(error, null, 2)
      };
    }
  }

  private isNetworkError(error: unknown): boolean {
    return (
      typeof error === 'object' && error !== null && (
  (hasProp(error, 'status') && (error as Record<string, unknown>)['status'] === 0) ||
  (hasProp(error, 'message') && typeof (error as Record<string, unknown>)['message'] === 'string' && (((error as Record<string, unknown>)['message'] as string).includes('Network Error') || ((error as Record<string, unknown>)['message'] as string).includes('fetch'))) ||
  (hasProp(error, 'name') && (error as Record<string, unknown>)['name'] === 'NetworkError')
      )
    );
  }

  private isChunkLoadError(error: unknown): boolean {
    return (
      typeof error === 'object' && error !== null && (
  (hasProp(error, 'message') && typeof (error as Record<string, unknown>)['message'] === 'string' && (((error as Record<string, unknown>)['message'] as string).includes('Loading chunk') || ((error as Record<string, unknown>)['message'] as string).includes('Loading CSS chunk'))) ||
  (hasProp(error, 'name') && (error as Record<string, unknown>)['name'] === 'ChunkLoadError')
      )
    );
  }

  private isPermissionError(error: unknown): boolean {
    return (
      typeof error === 'object' && error !== null && (
  (hasProp(error, 'status') && (((error as Record<string, unknown>)['status'] === 403) || ((error as Record<string, unknown>)['status'] === 401))) ||
  (hasProp(error, 'message') && typeof (error as Record<string, unknown>)['message'] === 'string' && ((error as Record<string, unknown>)['message'] as string).includes('Permission denied'))
      )
    );
  }

  private handleNetworkError(): void {
    this.uxService.showToast(
      'Network connection error. Please check your internet connection.',
      'error',
      5000
    );

    // Don't navigate away from current page for network errors
  console.warn('Network error handled');
  }

  private handleChunkLoadError(): void {
    this.uxService.showToast(
      'Application update detected. Refreshing page...',
      'info',
      3000
    );

    // Chunk load errors usually mean the app was updated
    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  private handlePermissionError(error: unknown): void {
    this.uxService.showToast(
      'Access denied. Please check your permissions.',
      'error',
      5000
    );

    // Could redirect to login or contact page
    console.warn('Permission error handled:', error);
  }

  private handleGenericError(error: unknown): void {
    // Check if we're already on an error page to prevent infinite loops
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('/error/')) {
      console.error('Error occurred on error page, not redirecting:', error);
      return;
    }

    // Show user-friendly message
    this.uxService.showToast(
      'An unexpected error occurred. You will be redirected to our error page.',
      'error',
      4000
    );

    // Navigate to 500 error page after a brief delay
    setTimeout(() => {
      this.router.navigate(['/error/500'], {
        state: {
          originalError: this.extractErrorInfo(error),
          originalUrl: currentUrl,
          timestamp: new Date().toISOString()
        }
      });
    }, 2000);
  }

  // Public method to manually trigger 500 error page
  public navigateToError500(customMessage?: string): void {
    this.router.navigate(['/error/500'], {
      state: {
        customMessage,
        originalUrl: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Public method to manually trigger 404 error page
  public navigateToError404(): void {
    this.router.navigate(['/error/404']);
  }
}
