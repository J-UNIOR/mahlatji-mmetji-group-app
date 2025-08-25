import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UXEnhancementService } from '../../services/ux-enhancement.service';

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container" 
         [attr.aria-label]="ariaLabel"
         role="progressbar"
         [attr.aria-valuenow]="currentProgress()"
         [attr.aria-valuemin]="0"
         [attr.aria-valuemax]="100">
      
      <!-- Linear Progress Bar -->
      <div *ngIf="type === 'linear'" class="linear-progress">
        <div class="progress-track">
          <div class="progress-fill" 
               [style.width.%]="currentProgress()"
               [class.indeterminate]="indeterminate">
          </div>
        </div>
        <div class="progress-label" *ngIf="showLabel">
          {{ currentProgress() }}%
        </div>
      </div>

      <!-- Circular Progress -->
      <div *ngIf="type === 'circular'" class="circular-progress">
        <svg class="progress-ring" 
             [attr.width]="size" 
             [attr.height]="size"
             viewBox="0 0 120 120">
          <circle class="progress-ring-background"
                  cx="60" 
                  cy="60" 
                  r="54"
                  fill="transparent"
                  stroke-width="12"/>
          <circle class="progress-ring-progress"
                  cx="60" 
                  cy="60" 
                  r="54"
                  fill="transparent"
                  stroke-width="12"
                  [style.stroke-dasharray]="circumference"
                  [style.stroke-dashoffset]="strokeDashoffset()"
                  [class.indeterminate]="indeterminate"/>
        </svg>
        <div class="progress-content" *ngIf="showLabel">
          <span class="progress-value">{{ currentProgress() }}%</span>
        </div>
      </div>

      <!-- Step Progress -->
      <div *ngIf="type === 'steps'" class="steps-progress">
        <div class="steps-container">
          <div *ngFor="let step of steps; let i = index; trackBy: trackByStepId" 
               class="step-item"
               [class.completed]="step.completed"
               [class.active]="step.active"
               [class.disabled]="step.disabled"
               (click)="onStepClick(step, i)"
               [attr.aria-current]="step.active ? 'step' : null"
               role="button"
               [attr.tabindex]="step.disabled ? -1 : 0"
               [attr.aria-disabled]="step.disabled"
               (keydown)="onStepKeyDown($event, step, i)">
            
            <div class="step-indicator">
              <i *ngIf="step.completed" class="fa fa-check step-icon completed" aria-hidden="true"></i>
              <i *ngIf="!step.completed && step.icon" [class]="step.icon + ' step-icon'" aria-hidden="true"></i>
              <span *ngIf="!step.completed && !step.icon" class="step-number">{{ i + 1 }}</span>
            </div>
            
            <div class="step-content">
              <div class="step-label">{{ step.label }}</div>
              <div *ngIf="step.description" class="step-description">{{ step.description }}</div>
            </div>
            
            <div *ngIf="i < steps.length - 1" class="step-connector"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
      font-family: inherit;
    }

    /* Linear Progress */
    .linear-progress {
      width: 100%;
    }

    .progress-track {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f35525, #ff6b47);
      border-radius: 4px;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .progress-fill.indeterminate {
      width: 30% !important;
      animation: indeterminate 2s infinite linear;
    }

    @keyframes indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(333%); }
    }

    .progress-label {
      text-align: center;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    /* Circular Progress */
    .circular-progress {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .progress-ring {
      transform: rotate(-90deg);
    }

    .progress-ring-background {
      stroke: #e0e0e0;
    }

    .progress-ring-progress {
      stroke: #f35525;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .progress-ring-progress.indeterminate {
      animation: rotate-indeterminate 2s linear infinite;
    }

    @keyframes rotate-indeterminate {
      0% { stroke-dasharray: 0 339.292; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 169.646 169.646; stroke-dashoffset: -42.411; }
      100% { stroke-dasharray: 0 339.292; stroke-dashoffset: -339.292; }
    }

    .progress-content {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .progress-value {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    /* Steps Progress */
    .steps-progress {
      width: 100%;
    }

    .steps-container {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      position: relative;
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
      cursor: pointer;
      padding: 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .step-item:hover:not(.disabled) {
      background: rgba(243, 85, 37, 0.05);
    }

    .step-item:focus {
      outline: 2px solid #f35525;
      outline-offset: 2px;
    }

    .step-item.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .step-indicator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
      color: #666;
      font-weight: 600;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
      border: 2px solid #e0e0e0;
    }

    .step-item.completed .step-indicator {
      background: #4caf50;
      color: white;
      border-color: #4caf50;
    }

    .step-item.active .step-indicator {
      background: #f35525;
      color: white;
      border-color: #f35525;
      box-shadow: 0 0 0 4px rgba(243, 85, 37, 0.2);
    }

    .step-icon {
      font-size: 1rem;
    }

    .step-number {
      font-size: 0.875rem;
    }

    .step-content {
      text-align: center;
      max-width: 120px;
    }

    .step-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .step-description {
      font-size: 0.75rem;
      color: #666;
      line-height: 1.4;
    }

    .step-item.active .step-label {
      color: #f35525;
    }

    .step-item.completed .step-label {
      color: #4caf50;
    }

    .step-connector {
      position: absolute;
      top: 2rem;
      left: 60%;
      right: -40%;
      height: 2px;
      background: #e0e0e0;
      z-index: -1;
    }

    .step-item.completed .step-connector {
      background: #4caf50;
    }

    .step-item:last-child .step-connector {
      display: none;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .steps-container {
        flex-direction: column;
        align-items: stretch;
      }

      .step-item {
        flex-direction: row;
        text-align: left;
        padding: 0.75rem;
      }

      .step-indicator {
        margin-bottom: 0;
        margin-right: 1rem;
        flex-shrink: 0;
      }

      .step-content {
        text-align: left;
        max-width: none;
        flex: 1;
      }

      .step-connector {
        top: auto;
        left: 2rem;
        right: auto;
        bottom: -0.75rem;
        width: 2px;
        height: 0.75rem;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .progress-fill,
      .progress-ring-progress,
      .step-indicator,
      .step-item {
        transition: none;
      }

      .progress-fill.indeterminate,
      .progress-ring-progress.indeterminate {
        animation: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .progress-track {
        background: #000;
        border: 1px solid #fff;
      }

      .progress-fill {
        background: #0066cc;
      }

      .progress-ring-background {
        stroke: #000;
      }

      .progress-ring-progress {
        stroke: #0066cc;
      }

      .step-indicator {
        background: #fff;
        border: 2px solid #000;
        color: #000;
      }

      .step-item.completed .step-indicator {
        background: #0066cc;
        color: #fff;
        border-color: #0066cc;
      }

      .step-item.active .step-indicator {
        background: #000;
        color: #fff;
        border-color: #000;
      }
    }

    /* Dark theme */
    :host-context(.dark-theme) .progress-track {
      background: #424242;
    }

    :host-context(.dark-theme) .progress-fill {
      background: linear-gradient(90deg, #66bb6a, #81c784);
    }

    :host-context(.dark-theme) .progress-ring-background {
      stroke: #424242;
    }

    :host-context(.dark-theme) .progress-ring-progress {
      stroke: #66bb6a;
    }

    :host-context(.dark-theme) .progress-label,
    :host-context(.dark-theme) .progress-value {
      color: #fff;
    }

    :host-context(.dark-theme) .step-indicator {
      background: #424242;
      color: #fff;
      border-color: #424242;
    }

    :host-context(.dark-theme) .step-item.active .step-indicator {
      background: #66bb6a;
      border-color: #66bb6a;
      box-shadow: 0 0 0 4px rgba(102, 187, 106, 0.2);
    }

    :host-context(.dark-theme) .step-label {
      color: #fff;
    }

    :host-context(.dark-theme) .step-description {
      color: #ccc;
    }

    :host-context(.dark-theme) .step-item.active .step-label {
      color: #66bb6a;
    }

    :host-context(.dark-theme) .step-connector {
      background: #424242;
    }

    :host-context(.dark-theme) .step-item.completed .step-connector {
      background: #4caf50;
    }
  `]
})
export class ProgressIndicatorComponent implements OnInit, OnDestroy {
  @Input() type: 'linear' | 'circular' | 'steps' = 'linear';
  @Input() progress: number = 0;
  @Input() indeterminate: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() size: number = 120;
  @Input() steps: ProgressStep[] = [];
  @Input() ariaLabel: string = 'Progress indicator';

  @Output() stepClicked = new EventEmitter<{ step: ProgressStep; index: number }>();
  @Output() progressChanged = new EventEmitter<number>();

  private _progress = signal(0);
  readonly currentProgress = this._progress.asReadonly();
  
  circumference = 2 * Math.PI * 54; // radius = 54

  constructor(private uxService: UXEnhancementService) {}

  ngOnInit(): void {
    this.updateProgress(this.progress);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  readonly strokeDashoffset = () => {
    const progress = this.currentProgress();
    return this.circumference - (progress / 100) * this.circumference;
  };

  updateProgress(value: number): void {
    const clampedValue = Math.max(0, Math.min(100, value));
    this._progress.set(clampedValue);
    this.progressChanged.emit(clampedValue);
  }

  onStepClick(step: ProgressStep, index: number): void {
    if (step.disabled) {
      return;
    }

    const startTime = performance.now();
    
    this.stepClicked.emit({ step, index });
    this.uxService.measureUserInteraction('step-clicked', startTime);
    
    // Haptic feedback on mobile
    if (this.uxService.isMobile()) {
      this.uxService.vibrate(30);
    }
  }

  onStepKeyDown(event: KeyboardEvent, step: ProgressStep, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onStepClick(step, index);
    }
    
    // Arrow key navigation
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.navigateSteps(event.key === 'ArrowRight' ? 1 : -1, index);
    }
  }

  private navigateSteps(direction: number, currentIndex: number): void {
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < this.steps.length) {
      const nextStepElement = document.querySelectorAll('.step-item')[nextIndex] as HTMLElement;
      if (nextStepElement && !this.steps[nextIndex].disabled) {
        nextStepElement.focus();
      }
    }
  }

  trackByStepId(index: number, step: ProgressStep): string {
    return step.id;
  }

  // Public methods to control progress
  setProgress(value: number): void {
    this.updateProgress(value);
  }

  incrementProgress(amount: number = 1): void {
    this.updateProgress(this.currentProgress() + amount);
  }

  completeStep(stepId: string): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.completed = true;
      step.active = false;
    }
    this.updateStepProgress();
  }

  activateStep(stepId: string): void {
    // Deactivate all steps
    this.steps.forEach(step => step.active = false);
    
    // Activate the target step
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.active = true;
    }
    this.updateStepProgress();
  }

  private updateStepProgress(): void {
    if (this.steps.length > 0) {
      const completedSteps = this.steps.filter(step => step.completed).length;
      const progressPercentage = (completedSteps / this.steps.length) * 100;
      this.updateProgress(progressPercentage);
    }
  }

  // Reset progress
  reset(): void {
    this.updateProgress(0);
    this.steps.forEach(step => {
      step.completed = false;
      step.active = false;
    });
    
    if (this.steps.length > 0) {
      this.steps[0].active = true;
    }
  }
}
