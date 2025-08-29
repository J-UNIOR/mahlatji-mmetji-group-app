import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit, OnDestroy {
  @Input() appLazyImage!: string;
  @Input() placeholder?: string;
  @Input() alt?: string;

  private observer?: IntersectionObserver;

  el = inject(ElementRef<HTMLImageElement>);
  renderer = inject(Renderer2);


  ngOnInit(): void {
    this.setupLazyLoading();
  }

  private setupLazyLoading(): void {
    const img = this.el.nativeElement;
    
    // Set placeholder if provided
    if (this.placeholder) {
      this.renderer.setAttribute(img, 'src', this.placeholder);
    }
    
    // Set alt text
    if (this.alt) {
      this.renderer.setAttribute(img, 'alt', this.alt);
    }

    // Set up intersection observer for lazy loading
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    this.observer.observe(img);
  }

  private loadImage(): void {
    const img = this.el.nativeElement;
    
    // Add loading class
    this.renderer.addClass(img, 'loading');
    
    // Create new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Image loaded successfully
      this.renderer.setAttribute(img, 'src', this.appLazyImage);
      this.renderer.removeClass(img, 'loading');
      this.renderer.addClass(img, 'loaded');
      
      // Disconnect observer
      if (this.observer) {
        this.observer.unobserve(img);
        this.observer.disconnect();
      }
    };
    
    imageLoader.onerror = () => {
      // Image failed to load
      this.renderer.removeClass(img, 'loading');
      this.renderer.addClass(img, 'error');
      
      // Set fallback image if available
      if (this.placeholder) {
        this.renderer.setAttribute(img, 'src', this.placeholder);
      }
    };
    
    // Start loading
    imageLoader.src = this.appLazyImage;
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
