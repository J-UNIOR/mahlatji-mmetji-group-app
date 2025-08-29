import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UXEnhancementService } from '../../shared/services/ux-enhancement.service';
import { SearchComponent } from '../../shared/components/search/search.component';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  template: `
    <div class="error-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <!-- Error Illustration -->
            <div class="error-illustration">
              <div class="error-number">404</div>
              <div class="error-icon">
                <i class="fa fa-map-marker-alt" aria-hidden="true"></i>
              </div>
            </div>

            <!-- Error Content -->
            <div class="error-content">
              <h1>Oops! Page Not Found</h1>
              <p class="lead">
                The page you're looking for seems to have wandered off. 
                Don't worry, it happens to the best of us!
              </p>
              
              <div class="error-details">
                <p>Here are some things you can try:</p>
                <ul class="error-suggestions">
                  <li>Check the URL for typos</li>
                  <li>Use the search function below</li>
                  <li>Navigate using our main menu</li>
                  <li>Return to our homepage</li>
                </ul>
              </div>
            </div>

            <!-- Search Section -->
            <div class="error-search">
              <h3>Search for what you're looking for:</h3>
              <app-search 
                placeholder="Search our services, projects, or pages..."
                [showFilters]="true"
                [overlay]="false">
              </app-search>
            </div>

            <!-- Quick Actions -->
            <div class="error-actions">
              <a routerLink="/" class="btn btn-primary">
                <i class="fa fa-home" aria-hidden="true"></i>
                Go to Homepage
              </a>
              <a routerLink="/services" class="btn btn-outline-primary">
                <i class="fa fa-building" aria-hidden="true"></i>
                Our Services
              </a>
              <a routerLink="/contact" class="btn btn-outline-primary">
                <i class="fa fa-envelope" aria-hidden="true"></i>
                Contact Us
              </a>
              <button (click)="goBack()" class="btn btn-outline-secondary">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                Go Back
              </button>
            </div>

            <!-- Popular Links -->
            <div class="popular-links">
              <h4>Popular Pages</h4>
              <div class="link-grid">
                <a routerLink="/about" class="popular-link">
                  <i class="fa fa-users" aria-hidden="true"></i>
                  <span>About Us</span>
                </a>
                <a routerLink="/services" class="popular-link">
                  <i class="fa fa-cogs" aria-hidden="true"></i>
                  <span>Our Services</span>
                </a>
                <a routerLink="/projects" class="popular-link">
                  <i class="fa fa-briefcase" aria-hidden="true"></i>
                  <span>Portfolio</span>
                </a>
                <a routerLink="/contact" class="popular-link">
                  <i class="fa fa-phone" aria-hidden="true"></i>
                  <span>Contact</span>
                </a>
              </div>
            </div>

            <!-- Help Section -->
            <div class="help-section">
              <h4>Still need help?</h4>
              <p>Our team is here to assist you. Get in touch with us directly.</p>
              <div class="help-contacts">
                <a href="tel:+27120010576" class="help-contact">
                  <i class="fa fa-phone" aria-hidden="true"></i>
                  <span>+27 12 001 0576</span>
                </a>
                <a href="mailto:info@mahlatjimmetji.co.za" class="help-contact">
                  <i class="fa fa-envelope" aria-hidden="true"></i>
                  <span>info@mahlatjimmetji.co.za</span>
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
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 2rem 0;
    }

    .error-illustration {
      position: relative;
      margin-bottom: 3rem;
    }

    .error-number {
      font-size: 8rem;
      font-weight: 900;
      color: #f35525;
      line-height: 1;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      animation: bounce 2s infinite ease-in-out;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    .error-icon {
      font-size: 3rem;
      color: #666;
      opacity: 0.7;
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
      margin-bottom: 2rem;
      text-align: left;
    }

    .error-details p {
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .error-suggestions {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .error-suggestions li {
      padding: 0.5rem 0;
      color: #666;
      position: relative;
      padding-left: 1.5rem;
    }

    .error-suggestions li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #f35525;
      font-weight: bold;
    }

    /* Search Section */
    .error-search {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .error-search h3 {
      font-size: 1.3rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    /* Action Buttons */
    .error-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 3rem;
    }

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
    }

    .btn-primary {
      background: #f35525;
      color: white;
      border-color: #f35525;
    }

    .btn-primary:hover {
      background: #e64515;
      border-color: #e64515;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(243, 85, 37, 0.3);
    }

    .btn-outline-primary {
      background: transparent;
      color: #f35525;
      border-color: #f35525;
    }

    .btn-outline-primary:hover {
      background: #f35525;
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

    /* Popular Links */
    .popular-links {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .popular-links h4 {
      font-size: 1.3rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .link-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .popular-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1rem;
      background: #f8f9fa;
      border-radius: 10px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
    }

    .popular-link:hover {
      background: rgba(243, 85, 37, 0.1);
      color: #f35525;
      transform: translateY(-3px);
      text-decoration: none;
    }

    .popular-link i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #f35525;
    }

    .popular-link span {
      font-weight: 500;
    }

    /* Help Section */
    .help-section {
      background: #f35525;
      color: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
    }

    .help-section h4 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .help-section p {
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .help-contacts {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }

    .help-contact {
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

    .help-contact:hover {
      background: rgba(255, 255, 255, 0.3);
      color: white;
      text-decoration: none;
      transform: translateY(-2px);
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
      .error-search,
      .popular-links,
      .help-section {
        padding: 1.5rem;
      }

      .error-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .btn {
        justify-content: center;
      }

      .link-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }

      .help-contacts {
        flex-direction: column;
        align-items: stretch;
      }
    }

    /* Dark Theme */
    :host-context(.dark-theme) .error-page {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }

    :host-context(.dark-theme) .error-details,
    :host-context(.dark-theme) .error-search,
    :host-context(.dark-theme) .popular-links {
      background: #2d2d2d;
      border: 1px solid #555;
    }

    :host-context(.dark-theme) .error-content h1,
    :host-context(.dark-theme) .error-details p,
    :host-context(.dark-theme) .error-search h3,
    :host-context(.dark-theme) .popular-links h4 {
      color: #fff;
    }

    :host-context(.dark-theme) .popular-link {
      background: #404040;
      color: #fff;
    }

    :host-context(.dark-theme) .popular-link:hover {
      background: rgba(102, 187, 106, 0.1);
      color: #66bb6a;
    }

    :host-context(.dark-theme) .popular-link i {
      color: #66bb6a;
    }

    /* High Contrast */
    :host-context(.high-contrast) .error-page {
      background: #fff;
      color: #000;
    }

    :host-context(.high-contrast) .error-number {
      color: #0066cc;
    }

    :host-context(.high-contrast) .btn-primary {
      background: #0066cc;
      border-color: #0066cc;
    }

    :host-context(.high-contrast) .btn-outline-primary {
      color: #0066cc;
      border-color: #0066cc;
    }

    :host-context(.high-contrast) .help-section {
      background: #0066cc;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .error-number {
        animation: none;
      }

      .btn,
      .popular-link,
      .help-contact {
        transition: none;
      }

      .btn:hover,
      .popular-link:hover,
      .help-contact:hover {
        transform: none;
      }
    }
  `]
})
export class Error404Component implements OnInit {
  private router = inject(Router);
  private uxService = inject(UXEnhancementService);


  ngOnInit(): void {
    // Track 404 errors for analytics
    this.uxService.measureUserInteraction('404-page-viewed');
    
    // Log the attempted URL for debugging
    console.warn('404 Error - Page not found:', window.location.pathname);
  }

  goBack(): void {
    // Try to go back in history, fallback to home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
    
    this.uxService.measureUserInteraction('404-go-back-clicked');
  }
}
