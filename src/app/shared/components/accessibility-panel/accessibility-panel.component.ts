import { Component, Input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UXEnhancementService } from '../../services/ux-enhancement.service';

export interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: 'visual' | 'motor' | 'cognitive' | 'audio';
}

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accessibility-panel" 
         [class.open]="isOpen()"
         [attr.aria-hidden]="!isOpen()"
         role="dialog"
         aria-labelledby="accessibility-title"
         aria-describedby="accessibility-description">
      
      <!-- Toggle Button -->
      <button class="accessibility-toggle"
              (click)="togglePanel()"
              [attr.aria-expanded]="isOpen()"
              aria-controls="accessibility-content"
              type="button"
              [attr.title]="isOpen() ? 'Close accessibility options' : 'Open accessibility options'">
        <i class="fa fa-universal-access" aria-hidden="true"></i>
        <span class="sr-only">{{ isOpen() ? 'Close' : 'Open' }} accessibility options</span>
      </button>

      <!-- Panel Content -->
      <div id="accessibility-content" 
           class="accessibility-content"
           *ngIf="isOpen()">
        
        <div class="accessibility-header">
          <h2 id="accessibility-title">Accessibility Options</h2>
          <p id="accessibility-description">Customize your experience</p>
          <button class="close-btn" 
                  (click)="closePanel()"
                  aria-label="Close accessibility panel"
                  type="button">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div class="accessibility-body">
          <!-- Visual Adjustments -->
          <div class="feature-category">
            <h3>
              <i class="fa fa-eye" aria-hidden="true"></i>
              Visual Adjustments
            </h3>
            
            <div class="feature-grid">
              <!-- Font Size -->
              <div class="feature-item">
                <label for="font-size-select">Text Size</label>
                <select id="font-size-select" 
                        [value]="currentFontSize()"
                        (change)="onFontSizeChange($event)"
                        class="feature-control">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <!-- Theme -->
              <div class="feature-item">
                <label for="theme-select">Theme</label>
                <select id="theme-select" 
                        [value]="currentTheme()"
                        (change)="onThemeChange($event)"
                        class="feature-control">
                  <option value="auto">Auto</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <!-- High Contrast -->
              <div class="feature-item">
                <label class="toggle-label">
                  <input type="checkbox" 
                         [checked]="highContrast()"
                         (change)="toggleHighContrast()"
                         class="feature-checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">High Contrast</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Motion & Animation -->
          <div class="feature-category">
            <h3>
              <i class="fa fa-play-circle" aria-hidden="true"></i>
              Motion & Animation
            </h3>
            
            <div class="feature-grid">
              <!-- Reduce Motion -->
              <div class="feature-item">
                <label class="toggle-label">
                  <input type="checkbox" 
                         [checked]="reducedMotion()"
                         (change)="toggleReducedMotion()"
                         class="feature-checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">Reduce Motion</span>
                </label>
              </div>

              <!-- Animations -->
              <div class="feature-item">
                <label class="toggle-label">
                  <input type="checkbox" 
                         [checked]="animations()"
                         (change)="toggleAnimations()"
                         class="feature-checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">Page Animations</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="feature-category">
            <h3>
              <i class="fa fa-keyboard" aria-hidden="true"></i>
              Navigation
            </h3>
            
            <div class="feature-grid">
              <!-- Keyboard Navigation -->
              <div class="feature-item">
                <label class="toggle-label">
                  <input type="checkbox" 
                         [checked]="keyboardNavigation()"
                         (change)="toggleKeyboardNavigation()"
                         class="feature-checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">Enhanced Keyboard Navigation</span>
                </label>
              </div>

              <!-- Focus Indicators -->
              <div class="feature-item">
                <label class="toggle-label">
                  <input type="checkbox" 
                         [checked]="focusIndicators()"
                         (change)="toggleFocusIndicators()"
                         class="feature-checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">Enhanced Focus Indicators</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="feature-category">
            <h3>
              <i class="fa fa-bolt" aria-hidden="true"></i>
              Quick Actions
            </h3>
            
            <div class="quick-actions">
              <button class="quick-action-btn" 
                      (click)="resetToDefaults()"
                      type="button">
                <i class="fa fa-refresh" aria-hidden="true"></i>
                Reset to Defaults
              </button>
              
              <button class="quick-action-btn" 
                      (click)="skipToContent()"
                      type="button">
                <i class="fa fa-forward" aria-hidden="true"></i>
                Skip to Main Content
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay -->
      <div *ngIf="isOpen()" 
           class="accessibility-overlay"
           (click)="closePanel()"
           aria-hidden="true"></div>
    </div>
  `,
  styles: [`
    .accessibility-panel {
      position: fixed;
      bottom: 30px;
      left: 20px;
      transform: none;
      z-index: 10000;
      font-family: inherit;
    }

    .accessibility-toggle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #2196f3;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
      transition: all 0.3s ease;
      position: relative;
    }

    .accessibility-toggle:hover {
      transform: scale(1.1);
      background: #1976d2;
      box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
    }

    .accessibility-toggle:focus {
      outline: 3px solid #fff;
      outline-offset: 2px;
    }

    .accessibility-content {
      position: absolute;
      left: 0;
      bottom: 80px;
      transform: none;
      width: 380px;
      max-width: 90vw;
      max-height: 80vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      animation: slideInFromBottom 0.3s ease-out;
    }

    @keyframes slideInFromBottom {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .accessibility-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
      position: relative;
    }

    .accessibility-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .accessibility-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.875rem;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .accessibility-body {
      max-height: 60vh;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .feature-category {
      margin-bottom: 2rem;
    }

    .feature-category:last-child {
      margin-bottom: 0;
    }

    .feature-category h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .feature-category h3 i {
      color: #2196f3;
    }

    .feature-grid {
      display: grid;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .feature-item label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
    }

    .feature-control {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.875rem;
      background: white;
      transition: border-color 0.2s ease;
    }

    .feature-control:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    }

    /* Toggle Switches */
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
    }

    .feature-checkbox {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .toggle-slider {
      position: relative;
      width: 44px;
      height: 24px;
      background: #ccc;
      border-radius: 24px;
      transition: background 0.3s ease;
      flex-shrink: 0;
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .feature-checkbox:checked + .toggle-slider {
      background: #2196f3;
    }

    .feature-checkbox:checked + .toggle-slider::before {
      transform: translateX(20px);
    }

    .feature-checkbox:focus + .toggle-slider {
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    }

    /* Quick Actions */
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .quick-action-btn {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      color: #333;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .quick-action-btn:hover {
      background: #f5f5f5;
      border-color: #2196f3;
    }

    .quick-action-btn:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    }

    .accessibility-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
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
      .accessibility-panel {
        left: 15px;
        bottom: 20px;
      }

      .accessibility-toggle {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
      }

      .accessibility-content {
        left: 0;
        bottom: 70px;
        width: 320px;
        max-width: calc(100vw - 20px);
      }

      .accessibility-header {
        padding: 1rem;
      }

      .accessibility-body {
        padding: 1rem;
      }
    }

    /* Extra small screens */
    @media (max-width: 480px) {
      .accessibility-panel {
        left: 10px;
        bottom: 15px;
      }

      .accessibility-toggle {
        width: 50px;
        height: 50px;
        font-size: 1.1rem;
      }

      .accessibility-content {
        left: 0;
        bottom: 65px;
        width: 280px;
        max-width: calc(100vw - 20px);
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .accessibility-toggle {
        background: #000;
        border: 2px solid #fff;
      }

      .accessibility-content {
        background: #fff;
        border: 2px solid #000;
      }

      .accessibility-header {
        background: #000;
        color: #fff;
      }

      .feature-control {
        border: 2px solid #000;
      }

      .toggle-slider {
        background: #666;
        border: 1px solid #000;
      }

      .feature-checkbox:checked + .toggle-slider {
        background: #000;
      }
    }

    /* Dark theme */
    :host-context(.dark-theme) .accessibility-content {
      background: #2d2d2d;
      color: #fff;
    }

    :host-context(.dark-theme) .feature-category h3 {
      color: #fff;
    }

    :host-context(.dark-theme) .toggle-label {
      color: #ccc;
    }

    :host-context(.dark-theme) .feature-control {
      background: #404040;
      border-color: #555;
      color: #fff;
    }

    :host-context(.dark-theme) .quick-action-btn {
      background: #404040;
      border-color: #555;
      color: #fff;
    }

    :host-context(.dark-theme) .quick-action-btn:hover {
      background: #505050;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .accessibility-toggle,
      .accessibility-content,
      .toggle-slider,
      .toggle-slider::before,
      .quick-action-btn {
        transition: none;
      }

      .accessibility-content {
        animation: none;
      }
    }
  `]
})
export class AccessibilityPanelComponent implements OnInit, OnDestroy {
  @Input() position: 'left' | 'right' = 'right';
  @Input() autoShow: boolean = false;

  private panelOpen = signal(false);
  private userPrefs = signal({
    fontSize: 'medium',
    theme: 'auto',
    highContrast: false,
    reducedMotion: false,
    animations: true,
    keyboardNavigation: false,
    focusIndicators: false
  });

  // Computed properties
  readonly isOpen = this.panelOpen.asReadonly();
  readonly currentFontSize = computed(() => this.userPrefs().fontSize);
  readonly currentTheme = computed(() => this.userPrefs().theme);
  readonly highContrast = computed(() => this.userPrefs().highContrast);
  readonly reducedMotion = computed(() => this.userPrefs().reducedMotion);
  readonly animations = computed(() => this.userPrefs().animations);
  readonly keyboardNavigation = computed(() => this.userPrefs().keyboardNavigation);
  readonly focusIndicators = computed(() => this.userPrefs().focusIndicators);

  constructor(private uxService: UXEnhancementService) {}

  ngOnInit(): void {
    this.loadUserPreferences();
    
    if (this.autoShow) {
      // Auto-show if user prefers accessibility features
      const hasAccessibilityPrefs = this.highContrast() || this.reducedMotion() || 
                                  this.keyboardNavigation() || this.currentFontSize() !== 'medium';
      if (hasAccessibilityPrefs) {
        this.showPanel();
      }
    }

    // Listen for keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Alt + A to toggle accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        this.togglePanel();
      }
      
      // Escape to close panel
      if (e.key === 'Escape' && this.isOpen()) {
        this.closePanel();
      }
    });
  }

  togglePanel(): void {
    if (this.isOpen()) {
      this.closePanel();
    } else {
      this.showPanel();
    }
  }

  showPanel(): void {
    this.panelOpen.set(true);
    this.uxService.measureUserInteraction('accessibility-panel-opened');
    
    // Focus the first interactive element
    setTimeout(() => {
      const firstButton = document.querySelector('.accessibility-content button') as HTMLElement;
      firstButton?.focus();
    }, 100);
  }

  closePanel(): void {
    this.panelOpen.set(false);
    this.uxService.measureUserInteraction('accessibility-panel-closed');
  }

  onFontSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = target.value as 'small' | 'medium' | 'large';
    
    this.userPrefs.update(prefs => ({ ...prefs, fontSize: size }));
    this.uxService.setFontSize(size);
    this.saveUserPreferences();
    
    this.uxService.showToast(`Font size changed to ${size}`, 'success', 2000);
  }

  onThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const theme = target.value as 'light' | 'dark' | 'auto';
    
    this.userPrefs.update(prefs => ({ ...prefs, theme }));
    this.uxService.setTheme(theme);
    this.saveUserPreferences();
    
    this.uxService.showToast(`Theme changed to ${theme}`, 'success', 2000);
  }

  toggleHighContrast(): void {
    const enabled = !this.highContrast();
    this.userPrefs.update(prefs => ({ ...prefs, highContrast: enabled }));
    this.uxService.toggleHighContrast(enabled);
    this.saveUserPreferences();
    
    this.uxService.showToast(
      `High contrast ${enabled ? 'enabled' : 'disabled'}`, 
      'success', 
      2000
    );
  }

  toggleReducedMotion(): void {
    const enabled = !this.reducedMotion();
    this.userPrefs.update(prefs => ({ ...prefs, reducedMotion: enabled }));
    this.uxService.toggleReducedMotion(enabled);
    this.saveUserPreferences();
    
    this.uxService.showToast(
      `Reduced motion ${enabled ? 'enabled' : 'disabled'}`, 
      'success', 
      2000
    );
  }

  toggleAnimations(): void {
    const enabled = !this.animations();
    this.userPrefs.update(prefs => ({ ...prefs, animations: enabled }));
    this.uxService.toggleAnimations(enabled);
    this.saveUserPreferences();
    
    this.uxService.showToast(
      `Animations ${enabled ? 'enabled' : 'disabled'}`, 
      'success', 
      2000
    );
  }

  toggleKeyboardNavigation(): void {
    const enabled = !this.keyboardNavigation();
    this.userPrefs.update(prefs => ({ ...prefs, keyboardNavigation: enabled }));
    
    // Add keyboard navigation enhancements
    if (enabled) {
      document.body.classList.add('enhanced-keyboard-nav');
    } else {
      document.body.classList.remove('enhanced-keyboard-nav');
    }
    
    this.saveUserPreferences();
    this.uxService.showToast(
      `Enhanced keyboard navigation ${enabled ? 'enabled' : 'disabled'}`, 
      'success', 
      2000
    );
  }

  toggleFocusIndicators(): void {
    const enabled = !this.focusIndicators();
    this.userPrefs.update(prefs => ({ ...prefs, focusIndicators: enabled }));
    
    // Add enhanced focus indicators
    if (enabled) {
      document.body.classList.add('enhanced-focus-indicators');
    } else {
      document.body.classList.remove('enhanced-focus-indicators');
    }
    
    this.saveUserPreferences();
    this.uxService.showToast(
      `Enhanced focus indicators ${enabled ? 'enabled' : 'disabled'}`, 
      'success', 
      2000
    );
  }

  resetToDefaults(): void {
    this.userPrefs.set({
      fontSize: 'medium',
      theme: 'auto',
      highContrast: false,
      reducedMotion: false,
      animations: true,
      keyboardNavigation: false,
      focusIndicators: false
    });

    // Apply defaults
    this.uxService.setFontSize('medium');
    this.uxService.setTheme('auto');
    this.uxService.toggleHighContrast(false);
    this.uxService.toggleReducedMotion(false);
    this.uxService.toggleAnimations(true);
    
    // Remove classes
    document.body.classList.remove('enhanced-keyboard-nav', 'enhanced-focus-indicators');
    
    this.saveUserPreferences();
    this.uxService.showToast('Settings reset to defaults', 'success', 2000);
  }

  skipToContent(): void {
    const mainContent = document.querySelector('main') || 
                       document.querySelector('[role="main"]') ||
                       document.querySelector('#main-content') ||
                       document.querySelector('.main-content');
    
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      this.uxService.showToast('Skipped to main content', 'info', 1500);
    } else {
      this.uxService.showToast('Main content not found', 'warning', 2000);
    }
    
    this.closePanel();
  }

  private saveUserPreferences(): void {
    localStorage.setItem('accessibility-preferences', JSON.stringify(this.userPrefs()));
  }

  private loadUserPreferences(): void {
    try {
      const saved = localStorage.getItem('accessibility-preferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        this.userPrefs.set({ ...this.userPrefs(), ...prefs });
        
        // Apply loaded preferences
        this.uxService.setFontSize(prefs.fontSize || 'medium');
        this.uxService.setTheme(prefs.theme || 'auto');
        
        if (prefs.highContrast) {
          this.uxService.toggleHighContrast(true);
        }
        if (prefs.reducedMotion) {
          this.uxService.toggleReducedMotion(true);
        }
        if (prefs.animations !== undefined) {
          this.uxService.toggleAnimations(prefs.animations);
        }
        if (prefs.keyboardNavigation) {
          document.body.classList.add('enhanced-keyboard-nav');
        }
        if (prefs.focusIndicators) {
          document.body.classList.add('enhanced-focus-indicators');
        }
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
  }
}
