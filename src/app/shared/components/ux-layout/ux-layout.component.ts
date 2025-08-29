import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityPanelComponent } from '../accessibility-panel/accessibility-panel.component';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'app-ux-layout',
  standalone: true,
  imports: [
    CommonModule,
    AccessibilityPanelComponent,
    ScrollToTopComponent
  ],
  template: `
    <!-- Global UX Enhancement Components (positioned strategically) -->
    <app-accessibility-panel></app-accessibility-panel>
    <app-scroll-to-top></app-scroll-to-top>
  `,
  styles: [`
    :host {
      display: contents;
    }
    
    .hidden {
      display: none !important;
    }

    /* Ensure UX components don't interfere with page content */
    :host ::ng-deep app-accessibility-panel,
    :host ::ng-deep app-scroll-to-top {
      pointer-events: auto;
    }

    /* Visual guide for component positioning (remove in production) */
    @media (max-width: 768px) {
      :host ::ng-deep .accessibility-panel,
      :host ::ng-deep .scroll-to-top-btn {
        transition: all 0.3s ease;
      }
    }
  `]
})
export class UxLayoutComponent {

}
