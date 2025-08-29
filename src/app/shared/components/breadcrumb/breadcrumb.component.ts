import { Component, Input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { inject } from '@angular/core';
import { UXEnhancementService } from '../../services/ux-enhancement.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="breadcrumb-nav" 
         [attr.aria-label]="ariaLabel"
         *ngIf="shouldShowBreadcrumb() && items().length > 0">
      <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li *ngFor="let item of items(); let i = index; trackBy: trackByIndex" 
            class="breadcrumb-item"
            [class.active]="item.active"
            itemprop="itemListElement" 
            itemscope 
            itemtype="https://schema.org/ListItem">
          
          <a *ngIf="!item.active && item.url" 
             [href]="item.url"
             itemprop="item"
             class="breadcrumb-link"
             [attr.aria-current]="item.active ? 'page' : null">
            <span itemprop="name">{{ item.label }}</span>
          </a>
          
          <span *ngIf="item.active || !item.url" 
                itemprop="name"
                class="breadcrumb-current"
                [attr.aria-current]="item.active ? 'page' : null">
            {{ item.label }}
          </span>
          
          <meta itemprop="position" [content]="i + 1">
          
          <span *ngIf="i < items().length - 1" 
                class="breadcrumb-separator">
            /
          </span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-nav {
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      margin: 0;
      padding: 0.6rem 1.2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      backdrop-filter: blur(15px);
      border-radius: 25px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.2);
      min-width: 200px;
      max-width: 600px;
    }

    .breadcrumb {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      list-style: none;
      gap: 0.4rem;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #fff;
      font-weight: 500;
    }

    .breadcrumb-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .breadcrumb-link:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
      text-decoration: none;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .breadcrumb-link:focus {
      outline: 2px solid rgba(255, 255, 255, 0.8);
      outline-offset: 2px;
    }

    .breadcrumb-current {
      color: #fff;
      font-weight: 700;
      display: flex;
      align-items: center;
      padding: 0.3rem 0.8rem;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .breadcrumb-item.active .breadcrumb-current {
      background: rgba(255, 255, 255, 0.4);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .breadcrumb-separator {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      margin: 0 0.3rem;
      font-weight: 300;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .breadcrumb-nav {
        top: 70px;
        padding: 0.5rem 1rem;
        min-width: 180px;
        max-width: 90%;
      }

      .breadcrumb {
        font-size: 0.8rem;
        gap: 0.2rem;
      }

      .breadcrumb-link,
      .breadcrumb-current {
        padding: 0.25rem 0.6rem;
        font-size: 0.8rem;
      }

      .breadcrumb-separator {
        margin: 0 0.2rem;
        font-size: 0.9rem;
      }
    }

    /* Extra small screens */
    @media (max-width: 480px) {
      .breadcrumb-nav {
        top: 65px;
        padding: 0.4rem 0.8rem;
        min-width: 160px;
      }

      .breadcrumb-link,
      .breadcrumb-current {
        padding: 0.2rem 0.5rem;
        font-size: 0.75rem;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .breadcrumb-link {
        transition: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .breadcrumb-nav {
        background: #000;
        border: 2px solid #fff;
      }

      .breadcrumb-link {
        color: #00ccff;
        background: transparent;
        border: 1px solid #00ccff;
      }

      .breadcrumb-link:hover,
      .breadcrumb-link:focus {
        background: #00ccff;
        color: #000;
        border-color: #fff;
      }

      .breadcrumb-current {
        color: #fff;
        background: #333;
        border: 1px solid #fff;
      }

      .breadcrumb-separator {
        color: #fff;
      }
    }

    /* Dark theme */
    :host-context(.dark-theme) .breadcrumb-nav {
      background: linear-gradient(135deg, #2d3561 0%, #1a1d3a 100%);
      border-color: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark-theme) .breadcrumb-item {
      color: #e0e6ed;
    }

    :host-context(.dark-theme) .breadcrumb-link {
      color: rgba(224, 230, 237, 0.9);
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark-theme) .breadcrumb-link:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    :host-context(.dark-theme) .breadcrumb-current {
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    :host-context(.dark-theme) .breadcrumb-separator {
      color: rgba(224, 230, 237, 0.7);
    }
  `]
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() ariaLabel = 'Breadcrumb navigation';
  @Input() showHome = true;
  @Input() homeLabel = 'Home';

  private breadcrumbItems = signal<BreadcrumbItem[]>([]);
  private currentRoute = signal<string>('');
  private routerSubscription?: Subscription;
  
  readonly items = computed(() => {
    const items = this.breadcrumbItems();
    if (this.showHome && items.length > 0 && !items[0].url?.includes('/home')) {
      return [
        { 
          label: this.homeLabel, 
          url: '/home'
        },
        ...items
      ];
    }
    return items;
  });

  private uxService = inject(UXEnhancementService);
  private router = inject(Router);

  // Removed empty constructor

  ngOnInit(): void {
    this.currentRoute.set(this.router.url);
    this.generateBreadcrumbs();

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
        this.generateBreadcrumbs();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  shouldShowBreadcrumb(): boolean {
    const route = this.currentRoute();
    // Hide breadcrumb on home page, error pages, and root
    return !['/', '/home', '/error/404', '/error/500'].includes(route);
  }

  private generateBreadcrumbs(): void {
    const url = this.currentRoute();
    const segments = url.split('/').filter(segment => segment);
    
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      const item: BreadcrumbItem = {
        label: this.formatSegmentLabel(segment),
        url: isLast ? undefined : currentPath,
        active: isLast
      };
      
      breadcrumbs.push(item);
    });

    this.breadcrumbItems.set(breadcrumbs);
  }

  private formatSegmentLabel(segment: string): string {
    // Convert URL segments to readable labels
    const labelMap: Record<string, string> = {
      'home': 'Home',
      'about': 'About Us',
      'services': 'Our Companies',
      'projects': 'Portfolio',
      'contact': 'Contact Us',
      'cleaning-security': 'Cleaning & Security',
      'construction-electrical': 'Construction & Electrical',
      'accounting': 'Accounting & Corporate',
      'property-development': 'Property Development'
    };

    return labelMap[segment] || this.capitalizeWords(segment.replace(/-/g, ' '));
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, letter => letter.toUpperCase());
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Method to manually set breadcrumbs
  setBreadcrumbs(items: BreadcrumbItem[]): void {
    this.breadcrumbItems.set(items);
  }

  // Method to add a breadcrumb item
  addBreadcrumb(item: BreadcrumbItem): void {
    this.breadcrumbItems.update(items => [...items, item]);
  }

  // Method to clear breadcrumbs
  clearBreadcrumbs(): void {
    this.breadcrumbItems.set([]);
  }
}
