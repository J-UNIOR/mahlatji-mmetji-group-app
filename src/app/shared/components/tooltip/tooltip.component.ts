import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UXEnhancementService } from '../../services/ux-enhancement.service';

export interface TooltipConfig {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  theme: 'light' | 'dark' | 'auto';
  showDelay: number;
  hideDelay: number;
  arrow: boolean;
  interactive: boolean;
  maxWidth: string;
}

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tooltip-container" 
         (mouseenter)="showTooltip()"
         (mouseleave)="hideTooltip()"
         (focusin)="showTooltip()"
         (focusout)="hideTooltip()"
         (touchstart)="toggleTooltip()"
         #container>
      
      <!-- Content that triggers the tooltip -->
      <ng-content></ng-content>
      
      <!-- Tooltip popup -->
      <div *ngIf="isVisible()" 
           class="tooltip-popup"
           [class]="getTooltipClasses()"
           [style.max-width]="config.maxWidth"
           [attr.role]="'tooltip'"
           [attr.aria-hidden]="!isVisible()"
           #tooltip>
        
        <div class="tooltip-content">
          <ng-container *ngIf="!isHtmlContent; else htmlContent">
            {{ config.content }}
          </ng-container>
          <ng-template #htmlContent>
            <div [innerHTML]="config.content"></div>
          </ng-template>
        </div>
        
        <div *ngIf="config.arrow" class="tooltip-arrow"></div>
      </div>
    </div>
  `,
  styles: [`
    .tooltip-container {
      position: relative;
      display: inline-block;
    }

    .tooltip-popup {
      position: absolute;
      z-index: 1000;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      line-height: 1.4;
      white-space: nowrap;
      max-width: 300px;
      word-wrap: break-word;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: tooltipFadeIn 0.2s ease-out;
      backdrop-filter: blur(10px);
      pointer-events: none;
    }

    .tooltip-popup.interactive {
      pointer-events: auto;
      white-space: normal;
    }

    .tooltip-content {
      position: relative;
      z-index: 1;
    }

    /* Positioning */
    .tooltip-popup.position-top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
    }

    .tooltip-popup.position-bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
    }

    .tooltip-popup.position-left {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 8px;
    }

    .tooltip-popup.position-right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 8px;
    }

    /* Themes */
    .tooltip-popup.theme-light {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .tooltip-popup.theme-dark {
      background: rgba(51, 51, 51, 0.95);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Arrows */
    .tooltip-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border: 6px solid transparent;
    }

    .tooltip-popup.position-top .tooltip-arrow {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: inherit;
      border-bottom: none;
    }

    .tooltip-popup.position-bottom .tooltip-arrow {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: inherit;
      border-top: none;
    }

    .tooltip-popup.position-left .tooltip-arrow {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: inherit;
      border-right: none;
    }

    .tooltip-popup.position-right .tooltip-arrow {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: inherit;
      border-left: none;
    }

    /* Light theme arrows */
    .tooltip-popup.theme-light .tooltip-arrow {
      border-color: rgba(255, 255, 255, 0.95);
    }

    .tooltip-popup.theme-light.position-top .tooltip-arrow {
      border-top-color: rgba(255, 255, 255, 0.95);
    }

    .tooltip-popup.theme-light.position-bottom .tooltip-arrow {
      border-bottom-color: rgba(255, 255, 255, 0.95);
    }

    .tooltip-popup.theme-light.position-left .tooltip-arrow {
      border-left-color: rgba(255, 255, 255, 0.95);
    }

    .tooltip-popup.theme-light.position-right .tooltip-arrow {
      border-right-color: rgba(255, 255, 255, 0.95);
    }

    /* Dark theme arrows */
    .tooltip-popup.theme-dark .tooltip-arrow {
      border-color: rgba(51, 51, 51, 0.95);
    }

    .tooltip-popup.theme-dark.position-top .tooltip-arrow {
      border-top-color: rgba(51, 51, 51, 0.95);
    }

    .tooltip-popup.theme-dark.position-bottom .tooltip-arrow {
      border-bottom-color: rgba(51, 51, 51, 0.95);
    }

    .tooltip-popup.theme-dark.position-left .tooltip-arrow {
      border-left-color: rgba(51, 51, 51, 0.95);
    }

    .tooltip-popup.theme-dark.position-right .tooltip-arrow {
      border-right-color: rgba(51, 51, 51, 0.95);
    }

    /* Animations */
    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .tooltip-popup.position-left {
      animation-name: tooltipFadeInLeft;
    }

    .tooltip-popup.position-right {
      animation-name: tooltipFadeInRight;
    }

    .tooltip-popup.position-bottom {
      animation-name: tooltipFadeInBottom;
    }

    @keyframes tooltipFadeInLeft {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(4px);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }

    @keyframes tooltipFadeInRight {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }

    @keyframes tooltipFadeInBottom {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .tooltip-popup {
        font-size: 0.8rem;
        padding: 0.4rem 0.6rem;
        max-width: 250px;
      }

      .tooltip-popup.position-left,
      .tooltip-popup.position-right {
        position: fixed;
        left: 50% !important;
        right: auto !important;
        top: auto !important;
        bottom: 20px;
        transform: translateX(-50%) !important;
        margin: 0 !important;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .tooltip-popup {
        animation: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .tooltip-popup.theme-light {
        background: #fff;
        color: #000;
        border: 2px solid #000;
      }

      .tooltip-popup.theme-dark {
        background: #000;
        color: #fff;
        border: 2px solid #fff;
      }
    }

    /* Auto theme based on system preference */
    @media (prefers-color-scheme: dark) {
      .tooltip-popup.theme-auto {
        background: rgba(51, 51, 51, 0.95);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .tooltip-popup.theme-auto .tooltip-arrow {
        border-color: rgba(51, 51, 51, 0.95);
      }

      .tooltip-popup.theme-auto.position-top .tooltip-arrow {
        border-top-color: rgba(51, 51, 51, 0.95);
      }

      .tooltip-popup.theme-auto.position-bottom .tooltip-arrow {
        border-bottom-color: rgba(51, 51, 51, 0.95);
      }

      .tooltip-popup.theme-auto.position-left .tooltip-arrow {
        border-left-color: rgba(51, 51, 51, 0.95);
      }

      .tooltip-popup.theme-auto.position-right .tooltip-arrow {
        border-right-color: rgba(51, 51, 51, 0.95);
      }
    }

    @media (prefers-color-scheme: light) {
      .tooltip-popup.theme-auto {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .tooltip-popup.theme-auto .tooltip-arrow {
        border-color: rgba(255, 255, 255, 0.95);
      }

      .tooltip-popup.theme-auto.position-top .tooltip-arrow {
        border-top-color: rgba(255, 255, 255, 0.95);
      }

      .tooltip-popup.theme-auto.position-bottom .tooltip-arrow {
        border-bottom-color: rgba(255, 255, 255, 0.95);
      }

      .tooltip-popup.theme-auto.position-left .tooltip-arrow {
        border-left-color: rgba(255, 255, 255, 0.95);
      }

      .tooltip-popup.theme-auto.position-right .tooltip-arrow {
        border-right-color: rgba(255, 255, 255, 0.95);
      }
    }
  `]
})
export class TooltipComponent implements OnInit, OnDestroy {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'top';
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  @Input() showDelay: number = 500;
  @Input() hideDelay: number = 100;
  @Input() arrow: boolean = true;
  @Input() interactive: boolean = false;
  @Input() maxWidth: string = '300px';
  @Input() disabled: boolean = false;

  @Output() shown = new EventEmitter<void>();
  @Output() hidden = new EventEmitter<void>();

  private visible = signal(false);
  private showTimeout?: number;
  private hideTimeout?: number;
  private touchTimeout?: number;

  readonly isVisible = this.visible.asReadonly();

  readonly config: TooltipConfig = {
    content: this.content,
    position: this.position,
    theme: this.theme,
    showDelay: this.showDelay,
    hideDelay: this.hideDelay,
    arrow: this.arrow,
    interactive: this.interactive,
    maxWidth: this.maxWidth
  };

  readonly isHtmlContent = () => {
    return this.config.content.includes('<') && this.config.content.includes('>');
  };

  constructor(private uxService: UXEnhancementService) {}

  ngOnInit(): void {
    this.updateConfig();
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
  }

  private updateConfig(): void {
    this.config.content = this.content;
    this.config.position = this.position;
    this.config.theme = this.theme;
    this.config.showDelay = this.showDelay;
    this.config.hideDelay = this.hideDelay;
    this.config.arrow = this.arrow;
    this.config.interactive = this.interactive;
    this.config.maxWidth = this.maxWidth;
  }

  showTooltip(): void {
    if (this.disabled) return;

    this.clearTimeouts();
    
    this.showTimeout = window.setTimeout(() => {
      this.visible.set(true);
      this.shown.emit();
      
      // Measure interaction
      this.uxService.measureUserInteraction('tooltip-shown');
    }, this.config.showDelay);
  }

  hideTooltip(): void {
    this.clearTimeouts();
    
    this.hideTimeout = window.setTimeout(() => {
      this.visible.set(false);
      this.hidden.emit();
    }, this.config.hideDelay);
  }

  toggleTooltip(): void {
    if (this.disabled) return;

    // Handle touch devices
    if (this.isVisible()) {
      this.hideTooltip();
    } else {
      this.showTooltip();
      
      // Auto-hide on touch devices after 3 seconds
      this.touchTimeout = window.setTimeout(() => {
        this.hideTooltip();
      }, 3000);
    }
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    if (this.touchTimeout) {
      clearTimeout(this.touchTimeout);
      this.touchTimeout = undefined;
    }
  }

  getTooltipClasses(): string {
    const classes = [];
    
    // Position
    const finalPosition = this.getFinalPosition();
    classes.push(`position-${finalPosition}`);
    
    // Theme
    classes.push(`theme-${this.config.theme}`);
    
    // Interactive
    if (this.config.interactive) {
      classes.push('interactive');
    }
    
    return classes.join(' ');
  }

  private getFinalPosition(): string {
    if (this.config.position !== 'auto') {
      return this.config.position;
    }
    
    // Auto-positioning logic based on viewport
    // For now, return a sensible default - this could be enhanced with element positioning
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    // Simple heuristic: if we're in the top half of the viewport, show below
    if (scrollY < viewportHeight / 2) {
      return 'bottom';
    } else {
      return 'top';
    }
  }

  // Public methods
  show(): void {
    this.showTooltip();
  }

  hide(): void {
    this.hideTooltip();
  }

  toggle(): void {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  updateContent(content: string): void {
    this.content = content;
    this.config.content = content;
  }

  updatePosition(position: 'top' | 'bottom' | 'left' | 'right' | 'auto'): void {
    this.position = position;
    this.config.position = position;
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled && this.isVisible()) {
      this.hide();
    }
  }
}
