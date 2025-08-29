import { inject } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService, ThemeMode } from '../../services/dark-mode.service';
import { Subject, takeUntil, combineLatest } from 'rxjs';

@Component({
  selector: 'app-dark-mode-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dark-mode-toggle" 
         [class.active]="isDarkMode"
         [class.compact]="isCompact"
         [attr.aria-label]="toggleLabel">
      
      <!-- Simple Toggle Button -->
      <button 
        *ngIf="!showAdvanced"
        class="toggle-btn simple"
        [class.compact]="isCompact"
        (click)="toggleTheme()"
        [attr.aria-pressed]="isDarkMode"
        [attr.title]="toggleLabel"
        type="button">
        <div class="toggle-track">
          <div class="toggle-thumb" 
               [class.dark]="isDarkMode">
            <i class="fa" 
               [class.fa-moon]="isDarkMode"
               [class.fa-sun]="!isDarkMode"
               aria-hidden="true"></i>
          </div>
        </div>
        <!-- Only show text in non-compact mode -->
        <span class="toggle-text" *ngIf="!isCompact">{{ isDarkMode ? 'Dark' : 'Light' }}</span>
      </button>

      <!-- Advanced Toggle with Options -->
      <div *ngIf="showAdvanced" class="toggle-advanced">
        <div class="theme-options">
          <button 
            *ngFor="let option of themeOptions"
            class="theme-option"
            [class.active]="currentTheme === option.value"
            (click)="setTheme(option.value)"
            [attr.aria-pressed]="currentTheme === option.value"
            type="button">
            <i [class]="'fa ' + option.icon" aria-hidden="true"></i>
            <span>{{ option.label }}</span>
          </button>
        </div>
        
        <div class="theme-info" *ngIf="currentTheme === 'auto'">
          <small>
            <i class="fa fa-info-circle" aria-hidden="true"></i>
            Following system preference: {{ systemPreference }}
          </small>
        </div>
      </div>

      <!-- Keyboard Shortcut Hint -->
      <div class="keyboard-hint" *ngIf="showKeyboardHint">
        <small>
          <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd> to toggle
        </small>
      </div>
    </div>
  `,
  styles: [`
    .dark-mode-toggle {
      position: relative;
      user-select: none;
    }

    /* Simple Toggle Button */
    .toggle-btn.simple {
      background: none;
      border: 2px solid #e0e0e0;
      border-radius: 25px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      color: #666;
    }

    .toggle-btn.simple.compact {
      padding: 4px 8px;
      gap: 6px;
      font-size: 0.8rem;
      border-radius: 20px;
      width: 42px;
      min-width: 42px;
      max-width: 42px;
      justify-content: center;
      flex-shrink: 0;
    }

    .toggle-btn.simple:hover {
      border-color: #f35525;
      color: #f35525;
    }

    .toggle-track {
      position: relative;
      width: 36px;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      transition: background-color 0.3s ease;
    }

    .compact .toggle-track {
      width: 30px;
      height: 16px;
      border-radius: 8px;
    }

    .toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      color: #666;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    .compact .toggle-thumb {
      width: 12px;
      height: 12px;
      font-size: 0.5rem;
    }

    .toggle-thumb.dark {
      transform: translateX(16px);
      background: #2c2c2c;
      color: #ffd700;
    }

    .compact .toggle-thumb.dark {
      transform: translateX(14px);
    }

    .active .toggle-track {
      background: #f35525;
    }

    .toggle-text {
      font-weight: 500;
      min-width: 35px;
      text-align: left;
    }

    /* Advanced Toggle */
    .toggle-advanced {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .theme-options {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .theme-option {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.75rem;
      color: #666;
      min-width: 60px;
    }

    .theme-option:hover {
      background: #e9ecef;
      border-color: #f35525;
    }

    .theme-option.active {
      background: #f35525;
      border-color: #f35525;
      color: white;
    }

    .theme-option i {
      font-size: 1.2rem;
      margin-bottom: 2px;
    }

    .theme-info {
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      color: #666;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .keyboard-hint {
      margin-top: 8px;
      text-align: center;
      color: #999;
      font-size: 0.7rem;
    }

    .keyboard-hint kbd {
      background: #f1f3f4;
      border: 1px solid #dadce0;
      border-radius: 3px;
      padding: 1px 4px;
      font-size: 0.65rem;
      font-family: monospace;
    }

    /* Dark theme styles */
    :host-context(.dark-theme) .toggle-btn.simple {
      border-color: #444;
      color: #ccc;
    }

    :host-context(.dark-theme) .toggle-btn.simple:hover {
      border-color: #f35525;
      color: #f35525;
    }

    :host-context(.dark-theme) .toggle-advanced {
      background: #2c2c2c;
      border-color: #444;
    }

    :host-context(.dark-theme) .theme-option {
      background: #3c3c3c;
      border-color: #555;
      color: #ccc;
    }

    :host-context(.dark-theme) .theme-option:hover {
      background: #4c4c4c;
    }

    :host-context(.dark-theme) .theme-info {
      background: #3c3c3c;
      color: #ccc;
    }

    :host-context(.dark-theme) .keyboard-hint {
      color: #888;
    }

    :host-context(.dark-theme) .keyboard-hint kbd {
      background: #444;
      border-color: #555;
      color: #ccc;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .theme-options {
        flex-direction: column;
      }

      .theme-option {
        flex-direction: row;
        justify-content: flex-start;
        min-width: auto;
      }

      .keyboard-hint {
        display: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .toggle-btn.simple,
      .theme-option {
        border-width: 2px;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .toggle-btn.simple,
      .toggle-track,
      .toggle-thumb,
      .theme-option {
        transition: none;
      }
    }

    /* Focus styles for accessibility */
    .toggle-btn.simple:focus,
    .theme-option:focus {
      outline: 2px solid #f35525;
      outline-offset: 2px;
    }

    :host-context(.dark-theme) .toggle-btn.simple:focus,
    :host-context(.dark-theme) .theme-option:focus {
      outline-color: #ff8a65;
    }
  `]
})
export class DarkModeToggleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isDarkMode = false;
  currentTheme: ThemeMode = 'auto';
  systemPreference = 'light';
  showAdvanced = false;
  showKeyboardHint = false;
  isCompact = true; // Default to compact mode for header usage

  themeOptions = [
    { value: 'light' as ThemeMode, label: 'Light', icon: 'fa-sun' },
    { value: 'dark' as ThemeMode, label: 'Dark', icon: 'fa-moon' },
    { value: 'auto' as ThemeMode, label: 'Auto', icon: 'fa-adjust' }
  ];

  private darkModeService = inject(DarkModeService);

  // Removed empty constructor

  ngOnInit(): void {
    // Subscribe to theme changes
    combineLatest([
      this.darkModeService.isDarkMode$,
      this.darkModeService.currentThemeMode$
    ] as [import('rxjs').Observable<boolean>, import('rxjs').Observable<ThemeMode>])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isDarkMode, themeMode]: [boolean, ThemeMode]) => {
        this.isDarkMode = isDarkMode;
        this.currentTheme = themeMode;
        this.updateSystemPreference();
      });

    // Setup keyboard shortcut
    this.setupKeyboardShortcut();

    // Show keyboard hint after a delay
    setTimeout(() => {
      this.showKeyboardHint = true;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get toggleLabel(): string {
    return `Switch to ${this.isDarkMode ? 'light' : 'dark'} mode`;
  }

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }

  setTheme(mode: ThemeMode): void {
    this.darkModeService.setThemeMode(mode);
  }

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  private updateSystemPreference(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPreference = mediaQuery.matches ? 'dark' : 'light';
  }

  private setupKeyboardShortcut(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl + Shift + T
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        this.toggleTheme();
        
        // Show visual feedback
        this.showKeyboardHint = true;
        setTimeout(() => {
          this.showKeyboardHint = false;
        }, 2000);
      }
    });
  }
}
