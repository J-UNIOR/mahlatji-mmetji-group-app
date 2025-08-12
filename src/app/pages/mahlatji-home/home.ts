import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MahlatjiServicesService } from '../../shared/services/mahlatji-services.service';
import { BusinessService, BannerSlide, ServiceCategory } from '../../shared/models/mahlatji-business.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  menuOpen = false;
  featuredServices = signal<BusinessService[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(private businessServicesService: MahlatjiServicesService) {}

  ngOnInit(): void {
    this.loadFeaturedServices();
  }

  ngAfterViewInit(): void {
    // Delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.setupCountingAnimations();
    }, 100);
  }

  private setupCountingAnimations(): void {
    const statNumbers = document.querySelectorAll('.stat-number-modern[data-target]');
    console.log('Found stat elements:', statNumbers.length);
    
    statNumbers.forEach((element, index) => {
      const target = parseInt((element as HTMLElement).getAttribute('data-target') || '0');
      console.log(`Element ${index}: target=${target}`);
      
      // Set initial value to 0 for animation
      element.textContent = '0';
      
      // Animate to target value after delay
      setTimeout(() => {
        this.animateCounterToTarget(element as HTMLElement, target);
      }, 500 + (index * 200)); // Staggered animation
    });
  }

  private animateCounterToTarget(element: HTMLElement, target: number): void {
    const duration = 2000; // 2 seconds
    const start = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
      
      element.textContent = currentValue.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toString();
      }
    };
    
    requestAnimationFrame(animate);
  }

  private animateCounter(element: HTMLElement, target: number): void {
    // Add pulse effect for manual triggers
    element.classList.add('counting');
    element.style.transform = 'scale(1.1)';
    element.style.textShadow = '0 2px 12px rgba(243, 85, 37, 0.6)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.textShadow = '0 2px 8px rgba(243, 85, 37, 0.3)';
      element.classList.remove('counting');
      
      setTimeout(() => {
        element.style.transform = '';
        element.style.textShadow = '';
      }, 200);
    }, 150);
  }

  private loadFeaturedServices(): void {
    this.isLoading.set(true);
    this.businessServicesService.getFeaturedServices().subscribe({
      next: (services) => {
        this.featuredServices.set(services);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured services:', error);
        this.error.set('Failed to load services. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  bannerSlides: BannerSlide[] = [
    {
      id: '1',
      title: 'Mahlatji Mmetji Group',
      subtitle: 'Professional Business Solutions',
      description: 'Comprehensive cleaning, security, construction, electrical, and accounting services across South Africa',
      backgroundImage: 'assets/images/banner-01.png',
      ctaText: 'Our Services',
      ctaLink: '/services',
      serviceCategory: ServiceCategory.CLEANING_SECURITY,
      class: 'item-1',
      // Legacy properties for template compatibility
      location: 'Johannesburg',
      country: 'South Africa',
      heading: 'Mahlatji Mmetji Group',
      subHeading: 'Professional Business Solutions'
    },
    {
      id: '2',
      title: 'Cleaning & Security',
      subtitle: 'Safety & Cleanliness First',
      description: 'Professional cleaning services and comprehensive security solutions for residential and commercial properties',
      backgroundImage: 'assets/images/banner-02.png',
      ctaText: 'Learn More',
      ctaLink: '/services',
      serviceCategory: ServiceCategory.CLEANING_SECURITY,
      class: 'item-2',
      // Legacy properties for template compatibility
      location: 'Pretoria',
      country: 'South Africa',
      heading: 'Cleaning & Security',
      subHeading: 'Safety & Cleanliness First'
    },
    {
      id: '3',
      title: 'Construction & Electrical',
      subtitle: 'Building Excellence',
      description: 'Quality construction projects and professional electrical installations with certified expertise',
      backgroundImage: 'assets/images/banner-03.png',
      ctaText: 'View Projects',
      ctaLink: '/services',
      serviceCategory: ServiceCategory.CONSTRUCTION_ELECTRICAL,
      class: 'item-3',
      // Legacy properties for template compatibility
      location: 'Cape Town',
      country: 'South Africa',
      heading: 'Construction & Electrical',
      subHeading: 'Building Excellence'
    },
    {
      id: '4',
      title: 'Accounting Services',
      subtitle: 'Financial Excellence',
      description: 'Complete accounting solutions including bookkeeping, tax preparation, and financial consulting',
      backgroundImage: 'assets/images/banner-04.png',
      ctaText: 'Get Quote',
      ctaLink: '/services',
      serviceCategory: ServiceCategory.ACCOUNTING,
      class: 'item-4',
      // Legacy properties for template compatibility
      location: 'Durban',
      country: 'South Africa',
      heading: 'Accounting Services',
      subHeading: 'Financial Excellence'
    }
  ];

  bannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
  };

  propertiesOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    },
    nav: true,
    autoplay: false
  };
}