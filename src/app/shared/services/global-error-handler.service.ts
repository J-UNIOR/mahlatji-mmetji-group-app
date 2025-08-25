import { Injectable, ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UXEnhancementService } from './ux-enhancement.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private router = inject(Router);
  private uxService = inject(UXEnhancementService);

  handleError(error: any): void {
    console.error('Global error caught:', error);

    // Extract error information
    const errorInfo = this.extractErrorInfo(error);
    
    // Log error for analytics
    this.uxService.measureUserInteraction('global-error-caught');

    // Determine error type and handle accordingly
    if (this.isNetworkError(error)) {
      this.handleNetworkError(error);
    } else if (this.isChunkLoadError(error)) {
      this.handleChunkLoadError(error);
    } else if (this.isPermissionError(error)) {
      this.handlePermissionError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private extractErrorInfo(error: any): { message: string; stack?: string } {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack
      };
    } else if (error?.error instanceof Error) {
      return {
        message: error.error.message,
        stack: error.error.stack
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

  private isNetworkError(error: any): boolean {
    return (
      error?.status === 0 ||
      error?.message?.includes('Network Error') ||
      error?.message?.includes('fetch') ||
      error?.name === 'NetworkError'
    );
  }

  private isChunkLoadError(error: any): boolean {
    return (
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Loading CSS chunk') ||
      error?.name === 'ChunkLoadError'
    );
  }

  private isPermissionError(error: any): boolean {
    return (
      error?.status === 403 ||
      error?.status === 401 ||
      error?.message?.includes('Permission denied')
    );
  }

  private handleNetworkError(error: any): void {
    this.uxService.showToast(
      'Network connection error. Please check your internet connection.',
      'error',
      5000
    );

    // Don't navigate away from current page for network errors
    console.warn('Network error handled:', error);
  }

  private handleChunkLoadError(error: any): void {
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

  private handlePermissionError(error: any): void {
    this.uxService.showToast(
      'Access denied. Please check your permissions.',
      'error',
      5000
    );

    // Could redirect to login or contact page
    console.warn('Permission error handled:', error);
  }

  private handleGenericError(error: any): void {
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
