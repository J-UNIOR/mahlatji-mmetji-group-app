import { Component, Input, Output, EventEmitter, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UXEnhancementService } from '../../services/ux-enhancement.service';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      *ngIf="showButton()"
      class="scroll-to-top-btn"
      [class.reduced-motion]="uxService.prefersReducedMotion()"
      (click)="scrollToTop()"
      [attr.aria-label]="ariaLabel"
      type="button">
      <i class="fa fa-chevron-up" aria-hidden="true"></i>
      <span class="sr-only">{{ ariaLabel }}</span>
    </button>
  `,
  styles: [`
    .scroll-to-top-btn {
      position: fixed;
      bottom: 30px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #f35525;
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      box-shadow: 0 4px 15px rgba(243, 85, 37, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      transform: translateY(0);
      opacity: 1;
      backdrop-filter: blur(10px);
    }

    .scroll-to-top-btn:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 6px 20px rgba(243, 85, 37, 0.4);
      background: #e64515;
    }

    .scroll-to-top-btn:active {
      transform: translateY(-1px) scale(0.98);
    }

    .scroll-to-top-btn:focus {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }

    .scroll-to-top-btn.reduced-motion {
      transition: opacity 0.2s ease;
    }

    .scroll-to-top-btn.reduced-motion:hover {
      transform: none;
      box-shadow: 0 4px 15px rgba(243, 85, 37, 0.4);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .scroll-to-top-btn {
        bottom: 20px;
        right: 15px;
        width: 50px;
        height: 50px;
        font-size: 1rem;
      }
    }

    /* Extra small screens */
    @media (max-width: 480px) {
      .scroll-to-top-btn {
        bottom: 15px;
        right: 10px;
        width: 50px;
        height: 50px;
        font-size: 0.9rem;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .scroll-to-top-btn {
        background: #000;
        border: 2px solid #fff;
      }
      
      .scroll-to-top-btn:hover {
        background: #333;
      }
    }

    /* Dark theme */
    :host-context(.dark-theme) .scroll-to-top-btn {
      background: #4caf50;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }
    
    :host-context(.dark-theme) .scroll-to-top-btn:hover {
      background: #43a047;
    }

    :host-context(.dark-theme) .scroll-to-top-btn:hover {
      background: linear-gradient(135deg, #388e3c, #43a047);
      box-shadow: 0 6px 20px rgba(67, 160, 71, 0.4);
    }
  `]
})
export class ScrollToTopComponent implements OnInit {
  @Input() threshold = 300;
  @Input() ariaLabel = 'Scroll to top of page';
  @Output() scrolled = new EventEmitter<void>();

  private scrollPosition = signal(0);
  
  readonly showButton = computed(() => this.scrollPosition() > this.threshold);

  public uxService = inject(UXEnhancementService);

  ngOnInit(): void {
    // Use effect to watch scroll position changes
    const updateScrollPosition = () => {
      this.scrollPosition.set(this.uxService.getScrollPosition());
    };
    
    // Listen to scroll events
    window.addEventListener('scroll', updateScrollPosition);
    
    // Initial update
    updateScrollPosition();
  }

  scrollToTop(): void {
    const startTime = performance.now();
    
    this.uxService.scrollToTop();
    this.scrolled.emit();
    
    // Measure interaction
    this.uxService.measureUserInteraction('scroll-to-top', startTime);
    
    // Haptic feedback on mobile
    if (this.uxService.isMobile()) {
      this.uxService.vibrate(50);
    }
  }
}
