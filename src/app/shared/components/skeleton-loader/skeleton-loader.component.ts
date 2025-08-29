import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [ngClass]="wrapperClass">
      <div class="skeleton" [ngClass]="skeletonClass" [ngStyle]="skeletonStyle">
        <div class="skeleton-shimmer"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      display: inline-block;
      width: 100%;
    }

    .skeleton {
      background: #f2f2f2;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .skeleton-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
      );
      animation: skeleton-shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-card {
      height: 200px;
      border-radius: 12px;
    }

    .skeleton-text {
      height: 16px;
      margin-bottom: 8px;
    }

    .skeleton-title {
      height: 24px;
      margin-bottom: 12px;
    }

    .skeleton-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .skeleton-banner {
      height: 400px;
      width: 100%;
    }

    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    @keyframes skeleton-shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton,
      .skeleton-shimmer {
        animation: none;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() wrapperClass = '';
  @Input() skeletonClass = '';
  @Input() skeletonStyle: Record<string, string> = {};
}
