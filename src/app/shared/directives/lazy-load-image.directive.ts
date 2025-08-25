import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  @Input('appLazyLoad') targetSrc!: string;
  @Input() placeholder: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=';
  
  private observer!: IntersectionObserver;
  private isLoaded = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Set placeholder initially
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholder);
    this.renderer.addClass(this.el.nativeElement, 'lazy-loading');
    
    // Set up intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isLoaded) {
            this.loadImage();
          }
        });
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    const img = new Image();
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.targetSrc);
      this.renderer.removeClass(this.el.nativeElement, 'lazy-loading');
      this.renderer.addClass(this.el.nativeElement, 'lazy-loaded');
      this.isLoaded = true;
      this.observer.unobserve(this.el.nativeElement);
    };
    
    img.onerror = () => {
      this.renderer.removeClass(this.el.nativeElement, 'lazy-loading');
      this.renderer.addClass(this.el.nativeElement, 'lazy-error');
      console.error(`Failed to load image: ${this.targetSrc}`);
    };
    
    img.src = this.targetSrc;
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
