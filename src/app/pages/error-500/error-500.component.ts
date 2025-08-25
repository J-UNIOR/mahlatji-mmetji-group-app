import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UXEnhancementService } from '../../shared/services/ux-enhancement.service';

@Component({
  selector: 'app-error-500',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <!-- Error Illustration -->
            <div class="error-illustration">
              <div class="error-number">500</div>
              <div class="error-icon">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
              </div>
            </div>

            <!-- Error Content -->
            <div class="error-content">
              <h1>Internal Server Error</h1>
              <p class="lead">
                We're experiencing some technical difficulties. 
                Our team has been notified and is working to fix this issue.
              </p>
              
              <div class="error-details">
                <h3>What happened?</h3>
                <p>
                  A server error occurred while processing your request. 
                  This is not your fault, and the issue is on our end.
                </p>
                
                <div class="error-actions-inline">
                  <button (click)="retryRequest()" class="btn btn-primary" [disabled]="retrying">
                    <i class="fa" [class.fa-sync]="!retrying" [class.fa-spinner]="retrying" [class.fa-spin]="retrying" aria-hidden="true"></i>
                    {{ retrying ? 'Retrying...' : 'Try Again' }}
                  </button>
                  <button (click)="reportIssue()" class="btn btn-outline-secondary">
                    <i class="fa fa-bug" aria-hidden="true"></i>
                    Report Issue
                  </button>
                </div>
              </div>
            </div>

            <!-- Status Updates -->
            <div class="status-section" *ngIf="showStatusUpdates">
              <h3>System Status</h3>
              <div class="status-items">
                <div class="status-item" [class.status-ok]="serverStatus.api" [class.status-error]="!serverStatus.api">
                  <i class="fa" [class.fa-check-circle]="serverStatus.api" [class.fa-times-circle]="!serverStatus.api" aria-hidden="true"></i>
                  <span>API Services</span>
                  <span class="status-text">{{ serverStatus.api ? 'Operational' : 'Degraded' }}</span>
                </div>
                <div class="status-item" [class.status-ok]="serverStatus.database" [class.status-error]="!serverStatus.database">
                  <i class="fa" [class.fa-check-circle]="serverStatus.database" [class.fa-times-circle]="!serverStatus.database" aria-hidden="true"></i>
                  <span>Database</span>
                  <span class="status-text">{{ serverStatus.database ? 'Operational' : 'Degraded' }}</span>
                </div>
                <div class="status-item" [class.status-ok]="serverStatus.storage" [class.status-error]="!serverStatus.storage">
                  <i class="fa" [class.fa-check-circle]="serverStatus.storage" [class.fa-times-circle]="!serverStatus.storage" aria-hidden="true"></i>
                  <span>File Storage</span>
                  <span class="status-text">{{ serverStatus.storage ? 'Operational' : 'Degraded' }}</span>
                </div>
              </div>
              <p class="status-note">
                Last updated: {{ lastStatusUpdate | date:'medium' }}
              </p>
            </div>

            <!-- Alternative Actions -->
            <div class="alternative-actions">
              <h3>What can you do?</h3>
              <div class="action-grid">
                <div class="action-card">
                  <i class="fa fa-home" aria-hidden="true"></i>
                  <h4>Visit Homepage</h4>
                  <p>Go back to our main page and browse our services</p>
                  <a routerLink="/" class="btn btn-outline-primary">Go Home</a>
                </div>
                
                <div class="action-card">
                  <i class="fa fa-phone" aria-hidden="true"></i>
                  <h4>Contact Support</h4>
                  <p>Get in touch with our team for immediate assistance</p>
                  <a routerLink="/contact" class="btn btn-outline-primary">Contact Us</a>
                </div>
                
                <div class="action-card">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                  <h4>Check Status</h4>
                  <p>Visit our status page for real-time system updates</p>
                  <button (click)="checkSystemStatus()" class="btn btn-outline-primary">
                    Check Status
                  </button>
                </div>
              </div>
            </div>

            <!-- Error Details (for developers) -->
            <div class="error-technical" *ngIf="showTechnicalDetails">
              <button (click)="toggleTechnicalDetails()" class="btn btn-link">
                <i class="fa" [class.fa-chevron-down]="!technicalDetailsExpanded" [class.fa-chevron-up]="technicalDetailsExpanded" aria-hidden="true"></i>
                Technical Details
              </button>
              
              <div class="technical-content" *ngIf="technicalDetailsExpanded">
                <div class="tech-detail">
                  <strong>Error ID:</strong> {{ errorId }}
                </div>
                <div class="tech-detail">
                  <strong>Timestamp:</strong> {{ errorTimestamp | date:'medium' }}
                </div>
                <div class="tech-detail">
                  <strong>URL:</strong> {{ requestUrl }}
                </div>
                <div class="tech-detail">
                  <strong>User Agent:</strong> {{ userAgent }}
                </div>
                <div class="tech-note">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                  Please include the Error ID when reporting this issue to our support team.
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="emergency-contact">
              <h4>Need Immediate Help?</h4>
              <p>Our emergency support team is available 24/7</p>
              <div class="emergency-contacts">
                <a href="tel:+27120010576" class="emergency-contact">
                  <i class="fa fa-phone" aria-hidden="true"></i>
                  <span>Emergency Line: +27 12 001 0576</span>
                </a>
                <a href="mailto:support@mahlatjimmetji.co.za" class="emergency-contact">
                  <i class="fa fa-envelope" aria-hidden="true"></i>
                  <span>support@mahlatjimmetji.co.za</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #fef7f0 0%, #fed7d7 100%);
      padding: 2rem 0;
    }

    .error-illustration {
      position: relative;
      margin-bottom: 3rem;
    }

    .error-number {
      font-size: 8rem;
      font-weight: 900;
      color: #e53e3e;
      line-height: 1;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }

    .error-icon {
      font-size: 3rem;
      color: #e53e3e;
      opacity: 0.8;
    }

    .error-content {
      margin-bottom: 3rem;
    }

    .error-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 1rem;
    }

    .error-content .lead {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .error-details {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #e53e3e;
      margin-bottom: 2rem;
      text-align: left;
    }

    .error-details h3 {
      color: #e53e3e;
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .error-details p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .error-actions-inline {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Status Section */
    .status-section {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .status-section h3 {
      font-size: 1.3rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .status-items {
      display: grid;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .status-item.status-ok {
      background: rgba(72, 187, 120, 0.1);
      color: #2f855a;
    }

    .status-item.status-error {
      background: rgba(229, 62, 62, 0.1);
      color: #c53030;
    }

    .status-item i {
      font-size: 1.2rem;
    }

    .status-text {
      margin-left: auto;
      font-weight: 600;
    }

    .status-note {
      font-size: 0.9rem;
      color: #666;
      text-align: center;
      margin: 0;
    }

    /* Action Grid */
    .alternative-actions {
      margin-bottom: 3rem;
    }

    .alternative-actions h3 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 2rem;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .action-card i {
      font-size: 2.5rem;
      color: #e53e3e;
      margin-bottom: 1rem;
    }

    .action-card h4 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .action-card p {
      color: #666;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    /* Technical Details */
    .error-technical {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      border: 1px dashed #dee2e6;
    }

    .technical-content {
      margin-top: 1rem;
      text-align: left;
    }

    .tech-detail {
      padding: 0.5rem 0;
      border-bottom: 1px solid #dee2e6;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .tech-detail:last-child {
      border-bottom: none;
    }

    .tech-detail strong {
      color: #333;
      display: inline-block;
      width: 120px;
    }

    .tech-note {
      background: rgba(229, 62, 62, 0.1);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      color: #c53030;
      font-size: 0.9rem;
    }

    .tech-note i {
      margin-right: 0.5rem;
    }

    /* Emergency Contact */
    .emergency-contact {
      background: #e53e3e;
      color: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
    }

    .emergency-contact h4 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .emergency-contact p {
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .emergency-contacts {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }

    .emergency-contact {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .emergency-contact:hover {
      background: rgba(255, 255, 255, 0.3);
      color: white;
      text-decoration: none;
      transform: translateY(-2px);
    }

    /* Button Styles */
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      cursor: pointer;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #e53e3e;
      color: white;
      border-color: #e53e3e;
    }

    .btn-primary:hover:not(:disabled) {
      background: #c53030;
      border-color: #c53030;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
    }

    .btn-outline-primary {
      background: transparent;
      color: #e53e3e;
      border-color: #e53e3e;
    }

    .btn-outline-primary:hover {
      background: #e53e3e;
      color: white;
      transform: translateY(-2px);
    }

    .btn-outline-secondary {
      background: transparent;
      color: #666;
      border-color: #666;
    }

    .btn-outline-secondary:hover {
      background: #666;
      color: white;
      transform: translateY(-2px);
    }

    .btn-link {
      background: none;
      border: none;
      color: #e53e3e;
      text-decoration: underline;
      padding: 0.5rem;
    }

    .btn-link:hover {
      color: #c53030;
      text-decoration: none;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .error-page {
        padding: 1rem 0;
      }

      .error-number {
        font-size: 6rem;
      }

      .error-content h1 {
        font-size: 2rem;
      }

      .error-content .lead {
        font-size: 1rem;
      }

      .error-details,
      .status-section,
      .emergency-contact {
        padding: 1.5rem;
      }

      .action-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .error-actions-inline {
        flex-direction: column;
      }

      .emergency-contacts {
        flex-direction: column;
        align-items: stretch;
      }
    }

    /* Dark Theme */
    :host-context(.dark-theme) .error-page {
      background: linear-gradient(135deg, #2d1b1b 0%, #4a1a1a 100%);
      color: #fff;
    }

    :host-context(.dark-theme) .error-details,
    :host-context(.dark-theme) .status-section,
    :host-context(.dark-theme) .action-card {
      background: #2d2d2d;
      border: 1px solid #555;
    }

    :host-context(.dark-theme) .error-technical {
      background: #404040;
      border-color: #666;
    }

    :host-context(.dark-theme) .status-item {
      background: #404040;
    }

    /* High Contrast */
    :host-context(.high-contrast) .error-page {
      background: #fff;
      color: #000;
    }

    :host-context(.high-contrast) .error-number {
      color: #cc0000;
    }

    :host-context(.high-contrast) .btn-primary {
      background: #cc0000;
      border-color: #cc0000;
    }

    :host-context(.high-contrast) .emergency-contact {
      background: #cc0000;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .error-number {
        animation: none;
      }

      .btn,
      .action-card,
      .emergency-contact {
        transition: none;
      }

      .btn:hover,
      .action-card:hover,
      .emergency-contact:hover {
        transform: none;
      }
    }

    /* Loading States */
    .fa-spin {
      animation: fa-spin 1s infinite linear;
    }

    @keyframes fa-spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `]
})
export class Error500Component implements OnInit {
  retrying = false;
  showStatusUpdates = true;
  showTechnicalDetails = true;
  technicalDetailsExpanded = false;
  
  errorId = this.generateErrorId();
  errorTimestamp = new Date();
  requestUrl = window.location.href;
  userAgent = navigator.userAgent;
  lastStatusUpdate = new Date();

  serverStatus = {
    api: false,
    database: false,
    storage: true
  };

  constructor(
    private router: Router,
    private uxService: UXEnhancementService
  ) {}

  ngOnInit(): void {
    // Track 500 errors for analytics
    this.uxService.measureUserInteraction('500-error-encountered');
    
    // Log the error for debugging
    console.error('500 Error encountered:', {
      errorId: this.errorId,
      url: this.requestUrl,
      timestamp: this.errorTimestamp,
      userAgent: this.userAgent
    });

    // Check system status on load
    this.checkSystemStatus();
  }

  private generateErrorId(): string {
    return 'ERR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  retryRequest(): void {
    this.retrying = true;
    
    // Simulate retry attempt
    setTimeout(() => {
      this.retrying = false;
      
      // For demo purposes, sometimes succeed
      if (Math.random() > 0.7) {
        this.uxService.showToast('Connection restored! Redirecting...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        this.uxService.showToast('Still experiencing issues. Please try again later.', 'error');
      }
    }, 2000);

    this.uxService.measureUserInteraction('500-retry-attempted');
  }

  reportIssue(): void {
    // Create email with error details
    const subject = encodeURIComponent(`Error Report - ${this.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.errorId}
Timestamp: ${this.errorTimestamp}
URL: ${this.requestUrl}
User Agent: ${this.userAgent}

Description of what you were trying to do:
[Please describe what action led to this error]

Additional Information:
[Any other relevant details]
    `);
    
    const mailtoLink = `mailto:support@mahlatjimmetji.co.za?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    this.uxService.measureUserInteraction('500-issue-reported');
  }

  checkSystemStatus(): void {
    // Simulate checking system status
    this.lastStatusUpdate = new Date();
    
    // Random status simulation
    setTimeout(() => {
      this.serverStatus = {
        api: Math.random() > 0.3,
        database: Math.random() > 0.4,
        storage: Math.random() > 0.1
      };
    }, 1000);

    this.uxService.measureUserInteraction('500-status-checked');
  }

  toggleTechnicalDetails(): void {
    this.technicalDetailsExpanded = !this.technicalDetailsExpanded;
    this.uxService.measureUserInteraction('500-technical-details-toggled');
  }
}
