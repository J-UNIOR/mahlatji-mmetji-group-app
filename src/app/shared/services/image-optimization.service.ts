import { Injectable } from '@angular/core';

export interface ImageFormat {
  webp?: string;
  jpg?: string;
  png?: string;
  fallback: string;
}

export interface ResponsiveImage {
  src: string;
  srcset?: string;
  sizes?: string;
  alt: string;
  width?: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {

  /**
   * Generates responsive image configuration
   */
  getResponsiveImage(
    basePath: string, 
    alt: string, 
    sizes: number[] = [320, 640, 1024, 1920]
  ): ResponsiveImage {
    const extension = this.getImageExtension(basePath);
    const basePathWithoutExt = basePath.replace(/\.[^/.]+$/, '');
    
    // Generate srcset for different sizes
    const srcset = sizes
      .map(size => `${basePathWithoutExt}-${size}w.${extension} ${size}w`)
      .join(', ');
    
    return {
      src: basePath, // fallback for older browsers
      srcset: srcset,
      sizes: this.generateSizes(sizes),
      alt: alt,
      width: Math.max(...sizes),
      height: Math.round(Math.max(...sizes) * 0.6) // assume 16:10 aspect ratio
    };
  }

  /**
   * Generates WebP image with fallback
   */
  getWebPImage(imagePath: string): ImageFormat {
    const extension = this.getImageExtension(imagePath);
    const basePathWithoutExt = imagePath.replace(/\.[^/.]+$/, '');
    
    return {
      webp: `${basePathWithoutExt}.webp`,
      [extension]: imagePath,
      fallback: imagePath,
    };
  }

  /**
   * Creates optimized banner image configuration
   */
  getBannerImage(bannerNumber: number): ResponsiveImage {
    const basePath = `assets/images/banner-0${bannerNumber}`;
    
    return {
      src: `${basePath}.jpg`, // fallback
      srcset: [
        `${basePath}-480w.webp 480w`,
        `${basePath}-768w.webp 768w`, 
        `${basePath}-1024w.webp 1024w`,
        `${basePath}-1920w.webp 1920w`,
        `${basePath}-480w.jpg 480w`,
        `${basePath}-768w.jpg 768w`,
        `${basePath}-1024w.jpg 1024w`, 
        `${basePath}-1920w.jpg 1920w`
      ].join(', '),
      sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
      alt: 'Banner image',
      width: 1920,
      height: 1080
    };
  }

  /**
   * Creates placeholder data URL for smooth loading
   */
  getPlaceholder(): string {
  // ...existing code...
    // Create a simple gradient placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 6;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 10, 6);
      gradient.addColorStop(0, '#f0f0f0');
      gradient.addColorStop(1, '#e0e0e0');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 10, 6);
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages(imagePaths: string[]): Promise<void[]> {
    const promises = imagePaths.map(path => this.preloadImage(path));
    return Promise.all(promises);
  }

  /**
   * Preload a single image
   */
  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = src;
    });
  }

  /**
   * Generate sizes attribute for responsive images
   */
  private generateSizes(breakpoints: number[]): string {
    return breakpoints
      .sort((a, b) => a - b)
      .map((bp, index) => {
        if (index === breakpoints.length - 1) {
          return '100vw';
        }
        return `(max-width: ${bp}px) 100vw`;
      })
      .join(', ');
  }

  /**
   * Get file extension from image path
   */
  private getImageExtension(path: string): string {
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  }

  /**
   * Check if WebP is supported
   */
  isWebPSupported(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }
}
