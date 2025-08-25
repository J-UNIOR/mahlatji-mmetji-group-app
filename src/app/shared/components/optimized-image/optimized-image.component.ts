import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageDirective } from '../../directives/lazy-load-image.directive';
import { PerformanceService } from '../../services/performance.service';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule, LazyLoadImageDirective],
  template: `
    <div class="optimized-image-container" [ngClass]="containerClass">
      <!-- Loading state -->
      <div *ngIf="isLoading" class="image-skeleton">
        <div class="skeleton-shimmer"></div>
      </div>
      
      <!-- Optimized Picture with WebP support -->
      <picture *ngIf="!hasError">
        <!-- WebP format for modern browsers -->
        <source 
          *ngIf="webpSrc" 
          [srcset]="webpSrcset" 
          [sizes]="sizes"
          type="image/webp">
        
        <!-- Fallback for older browsers -->
        <img
          [appLazyLoad]="imageSrc"
          [alt]="alt"
          [ngClass]="imageClass"
          [style.width]="width"
          [style.height]="height"
          [attr.srcset]="srcset"
          [attr.sizes]="sizes"
          (load)="onImageLoad()"
          (error)="onImageError($event)"
          [class.loaded]="!isLoading"
          [class.error]="hasError"
          loading="lazy"
          decoding="async"
        />
      </picture>
      
      <!-- Error state -->
      <div *ngIf="hasError" class="image-error">
        <i class="fa fa-image"></i>
        <span>Failed to load image</span>
      </div>
    </div>
  `,
  styles: [`
    .optimized-image-container {
      position: relative;
      display: inline-block;
      overflow: hidden;
    }

    .image-skeleton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .skeleton-shimmer {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
      );
      animation: shimmer 1.5s ease-in-out infinite;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      transition: opacity 0.3s ease;
      opacity: 0;
    }

    img.loaded {
      opacity: 1;
    }

    img.lazy-loading {
      filter: blur(2px);
    }

    img.lazy-loaded {
      filter: none;
    }

    .image-error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #666;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .image-error i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      display: block;
      color: #adb5bd;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* Responsive optimizations */
    @media (max-width: 768px) {
      .optimized-image-container {
        width: 100%;
      }
    }
  `]
})
export class OptimizedImageComponent implements OnInit, OnDestroy {
  @Input() src!: string;
  @Input() alt: string = '';
  @Input() width?: string;
  @Input() height?: string;
  @Input() containerClass: string = '';
  @Input() imageClass: string = '';
  @Input() quality: number = 80;
  @Input() enableWebP: boolean = true;
  @Input() sizes?: string;
  @Input() srcset?: string;

  imageSrc: string = '';
  webpSrc: string = '';
  webpSrcset: string = '';
  isLoading: boolean = true;
  hasError: boolean = false;
  private supportsWebP: boolean = false;

  constructor(private performanceService: PerformanceService) {}

  async ngOnInit() {
    this.performanceService.measurePerformance('image-component-init');
    
    if (this.enableWebP) {
      this.supportsWebP = await this.performanceService.supportsWebP();
    }
    
    this.setOptimizedImageSrc();
    this.setupWebPSources();
  }

  ngOnDestroy() {
    this.performanceService.measurePerformance('image-component-destroy');
  }

  private setOptimizedImageSrc() {
    let optimizedSrc = this.src;
    
    // Use WebP if supported and enabled
    if (this.supportsWebP && this.enableWebP) {
      optimizedSrc = this.performanceService.getWebPUrl(this.src);
    }
    
    // Apply additional optimizations
    this.imageSrc = this.performanceService.getOptimizedImageUrl(optimizedSrc, undefined, this.quality);
  }

  private setupWebPSources() {
    if (this.enableWebP && this.src) {
      // Generate WebP source
      this.webpSrc = this.convertToWebP(this.src);
      
      // Generate WebP srcset if original srcset exists
      if (this.srcset) {
        this.webpSrcset = this.convertSrcsetToWebP(this.srcset);
      }
    }
  }

  private convertToWebP(url: string): string {
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  private convertSrcsetToWebP(srcset: string): string {
    return srcset.replace(/\.(jpg|jpeg|png)(\s+\d+w)/gi, '.webp$2');
  }

  onImageLoad() {
    this.isLoading = false;
    this.hasError = false;
    this.performanceService.measurePerformance('image-loaded');
  }

  onImageError(event: any) {
    this.isLoading = false;
    this.hasError = true;
    console.warn('Image failed to load:', this.imageSrc, event);
    
    // Fallback to original format if WebP failed
    if (this.supportsWebP && this.enableWebP && this.imageSrc.includes('.webp')) {
      this.imageSrc = this.src;
      this.hasError = false;
      this.isLoading = true;
    }
  }
}
