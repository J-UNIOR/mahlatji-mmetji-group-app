import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  Testimonial, 
  TestimonialFilter,
  ProjectGalleryItem,
  ProjectCategory,
  ProjectFilter,
  ProjectImage 
} from '../models/content.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private testimonialsSubject = new BehaviorSubject<Testimonial[]>([]);
  private projectsSubject = new BehaviorSubject<ProjectGalleryItem[]>([]);
  private categoriesSubject = new BehaviorSubject<ProjectCategory[]>([]);

  // Mock data for testimonials
  private mockTestimonials: Testimonial[] = [
    {
      id: '1',
      clientName: 'Michael Johnson',
      clientTitle: 'Property Developer',
      company: 'Johnson Developments',
      avatar: '/assets/images/testimonials/michael-johnson.jpg',
      rating: 5,
      content: 'Mahlatji Mmetji Group exceeded our expectations on the Riverside Estate project. Their attention to detail, professionalism, and commitment to deadlines was outstanding. The quality of construction is exceptional.',
      projectType: 'Residential Development',
      projectName: 'Riverside Estate',
      projectImage: '/assets/images/projects/riverside-estate.jpg',
      location: 'Centurion, Pretoria',
      date: new Date('2024-07-20'),
      featured: true,
      verified: true,
      tags: ['Residential', 'Quality', 'Professional']
    },
    {
      id: '2',
      clientName: 'Sarah Williams',
      clientTitle: 'Business Owner',
      company: 'Williams & Associates',
      avatar: '/assets/images/testimonials/sarah-williams.jpg',
      rating: 5,
      content: 'The commercial office building project was completed on time and within budget. The team\'s communication throughout the process was excellent, and they handled all challenges professionally.',
      projectType: 'Commercial Construction',
      projectName: 'Williams Office Complex',
      projectImage: '/assets/images/projects/williams-office.jpg',
      location: 'Sandton, Johannesburg',
      date: new Date('2024-06-15'),
      featured: true,
      verified: true,
      tags: ['Commercial', 'On-time', 'Budget']
    },
    {
      id: '3',
      clientName: 'David Thompson',
      clientTitle: 'Homeowner',
      company: undefined,
      avatar: '/assets/images/testimonials/david-thompson.jpg',
      rating: 4,
      content: 'Our family home renovation was handled with great care. The team was respectful of our daily routine and the final result exceeded our expectations. Highly recommended!',
      projectType: 'Home Renovation',
      projectName: 'Thompson Family Home',
      projectImage: '/assets/images/projects/thompson-home.jpg',
      location: 'Pretoria East',
      date: new Date('2024-05-10'),
      featured: false,
      verified: true,
      tags: ['Renovation', 'Residential', 'Family']
    },
    {
      id: '4',
      clientName: 'Lisa Chen',
      clientTitle: 'Restaurant Owner',
      company: 'Chen\'s Cuisine',
      avatar: '/assets/images/testimonials/lisa-chen.jpg',
      rating: 5,
      content: 'The restaurant renovation was completed flawlessly. They understood our business needs and worked around our operating hours. The design is both functional and beautiful.',
      projectType: 'Commercial Renovation',
      projectName: 'Chen\'s Cuisine Restaurant',
      projectImage: '/assets/images/projects/chens-restaurant.jpg',
      location: 'Hatfield, Pretoria',
      date: new Date('2024-04-25'),
      featured: true,
      verified: true,
      tags: ['Commercial', 'Renovation', 'Design']
    }
  ];

  // Mock project categories
  private mockCategories: ProjectCategory[] = [
    {
      id: '1',
      name: 'Residential Construction',
      slug: 'residential-construction',
      description: 'Custom homes and residential developments',
      icon: 'fa-home',
      color: '#f35525',
      projectCount: 25
    },
    {
      id: '2',
      name: 'Commercial Construction',
      slug: 'commercial-construction',
      description: 'Office buildings and commercial spaces',
      icon: 'fa-building',
      color: '#2ecc71',
      projectCount: 18
    },
    {
      id: '3',
      name: 'Renovations',
      slug: 'renovations',
      description: 'Home and commercial renovations',
      icon: 'fa-tools',
      color: '#3498db',
      projectCount: 32
    },
    {
      id: '4',
      name: 'Infrastructure',
      slug: 'infrastructure',
      description: 'Roads, bridges, and public works',
      icon: 'fa-road',
      color: '#9b59b6',
      projectCount: 12
    }
  ];

  // Mock project gallery items
  private mockProjects: ProjectGalleryItem[] = [
    {
      id: '1',
      title: 'Riverside Estate Development',
      description: 'A premium residential estate featuring 50 luxury homes with modern amenities and sustainable design.',
      category: this.mockCategories[0],
      location: 'Centurion, Pretoria',
      completionDate: new Date('2024-06-30'),
      duration: '18 months',
      budget: 'R 25 million',
      client: 'Johnson Developments',
      images: [
        {
          id: '1-1',
          url: '/assets/images/projects/riverside/main.jpg',
          thumbnail: '/assets/images/projects/riverside/main-thumb.jpg',
          alt: 'Riverside Estate aerial view',
          caption: 'Completed Riverside Estate with 50 luxury homes',
          type: 'completed',
          order: 1
        },
        {
          id: '1-2',
          url: '/assets/images/projects/riverside/before.jpg',
          thumbnail: '/assets/images/projects/riverside/before-thumb.jpg',
          alt: 'Empty land before development',
          caption: 'Original undeveloped land',
          type: 'before',
          order: 2
        },
        {
          id: '1-3',
          url: '/assets/images/projects/riverside/progress.jpg',
          thumbnail: '/assets/images/projects/riverside/progress-thumb.jpg',
          alt: 'Construction in progress',
          caption: 'Foundation and framing phase',
          type: 'progress',
          order: 3
        }
      ],
      beforeAfter: {
        before: '/assets/images/projects/riverside/before-wide.jpg',
        after: '/assets/images/projects/riverside/after-wide.jpg',
        description: 'Transformation from empty land to thriving residential community'
      },
      featured: true,
      tags: ['Luxury', 'Sustainable', 'Residential'],
      testimonial: this.mockTestimonials[0],
      specifications: [
        { label: 'Total Area', value: '15 hectares', type: 'area' },
        { label: 'Number of Homes', value: '50', type: 'number' },
        { label: 'Project Value', value: 'R 25,000,000', type: 'currency' },
        { label: 'Completion Date', value: '2024-06-30', type: 'date' }
      ]
    },
    {
      id: '2',
      title: 'Williams Office Complex',
      description: 'Modern 5-story office building with state-of-the-art facilities and energy-efficient design.',
      category: this.mockCategories[1],
      location: 'Sandton, Johannesburg',
      completionDate: new Date('2024-05-15'),
      duration: '12 months',
      budget: 'R 18 million',
      client: 'Williams & Associates',
      images: [
        {
          id: '2-1',
          url: '/assets/images/projects/williams/main.jpg',
          thumbnail: '/assets/images/projects/williams/main-thumb.jpg',
          alt: 'Williams Office Complex exterior',
          caption: 'Completed Williams Office Complex',
          type: 'completed',
          order: 1
        },
        {
          id: '2-2',
          url: '/assets/images/projects/williams/interior.jpg',
          thumbnail: '/assets/images/projects/williams/interior-thumb.jpg',
          alt: 'Modern office interior',
          caption: 'Contemporary office spaces with natural lighting',
          type: 'completed',
          order: 2
        }
      ],
      featured: true,
      tags: ['Commercial', 'Modern', 'Energy-efficient'],
      testimonial: this.mockTestimonials[1],
      specifications: [
        { label: 'Floor Area', value: '5,000 m²', type: 'area' },
        { label: 'Number of Floors', value: '5', type: 'number' },
        { label: 'Project Value', value: 'R 18,000,000', type: 'currency' },
        { label: 'Parking Spaces', value: '120', type: 'number' }
      ]
    },
    {
      id: '3',
      title: 'Thompson Family Home Renovation',
      description: 'Complete renovation of a family home including kitchen, bathrooms, and living areas.',
      category: this.mockCategories[2],
      location: 'Pretoria East',
      completionDate: new Date('2024-04-20'),
      duration: '6 months',
      budget: 'R 800,000',
      client: 'Thompson Family',
      images: [
        {
          id: '3-1',
          url: '/assets/images/projects/thompson/kitchen-after.jpg',
          thumbnail: '/assets/images/projects/thompson/kitchen-after-thumb.jpg',
          alt: 'Renovated kitchen',
          caption: 'Modern kitchen with island and premium appliances',
          type: 'after',
          order: 1
        },
        {
          id: '3-2',
          url: '/assets/images/projects/thompson/kitchen-before.jpg',
          thumbnail: '/assets/images/projects/thompson/kitchen-before-thumb.jpg',
          alt: 'Original kitchen',
          caption: 'Original outdated kitchen',
          type: 'before',
          order: 2
        }
      ],
      beforeAfter: {
        before: '/assets/images/projects/thompson/home-before.jpg',
        after: '/assets/images/projects/thompson/home-after.jpg',
        description: 'Complete transformation of family living spaces'
      },
      featured: false,
      tags: ['Renovation', 'Family', 'Kitchen'],
      testimonial: this.mockTestimonials[2],
      specifications: [
        { label: 'Renovation Area', value: '200 m²', type: 'area' },
        { label: 'Rooms Renovated', value: '6', type: 'number' },
        { label: 'Project Value', value: 'R 800,000', type: 'currency' }
      ]
    }
  ];

  constructor() {
    this.testimonialsSubject.next(this.mockTestimonials);
    this.projectsSubject.next(this.mockProjects);
    this.categoriesSubject.next(this.mockCategories);
  }

  /**
   * Get all testimonials with optional filtering
   */
  getTestimonials(filter?: TestimonialFilter): Observable<Testimonial[]> {
    return this.testimonialsSubject.asObservable().pipe(
      map(testimonials => {
        let filtered = [...testimonials];

        if (filter) {
          if (filter.rating) {
            filtered = filtered.filter(t => t.rating >= filter.rating!);
          }

          if (filter.projectType) {
            filtered = filtered.filter(t => t.projectType === filter.projectType);
          }

          if (filter.featured !== undefined) {
            filtered = filtered.filter(t => t.featured === filter.featured);
          }

          if (filter.verified !== undefined) {
            filtered = filtered.filter(t => t.verified === filter.verified);
          }

          if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filtered = filtered.filter(t =>
              t.clientName.toLowerCase().includes(searchTerm) ||
              t.content.toLowerCase().includes(searchTerm) ||
              t.projectName?.toLowerCase().includes(searchTerm)
            );
          }
        }

        return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
      }),
      delay(200)
    );
  }

  /**
   * Get featured testimonials
   */
  getFeaturedTestimonials(limit: number = 3): Observable<Testimonial[]> {
    return this.getTestimonials({ featured: true }).pipe(
      map(testimonials => testimonials.slice(0, limit))
    );
  }

  /**
   * Get project gallery items with optional filtering
   */
  getProjects(filter?: ProjectFilter): Observable<ProjectGalleryItem[]> {
    return this.projectsSubject.asObservable().pipe(
      map(projects => {
        let filtered = [...projects];

        if (filter) {
          if (filter.categories?.length) {
            filtered = filtered.filter(p => 
              filter.categories?.includes(p.category.slug)
            );
          }

          if (filter.location) {
            filtered = filtered.filter(p => 
              p.location.toLowerCase().includes(filter.location!.toLowerCase())
            );
          }

          if (filter.featured !== undefined) {
            filtered = filtered.filter(p => p.featured === filter.featured);
          }

          if (filter.tags?.length) {
            filtered = filtered.filter(p => 
              p.tags.some(tag => filter.tags?.includes(tag))
            );
          }

          if (filter.dateRange) {
            filtered = filtered.filter(p =>
              p.completionDate >= filter.dateRange!.start &&
              p.completionDate <= filter.dateRange!.end
            );
          }

          if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filtered = filtered.filter(p =>
              p.title.toLowerCase().includes(searchTerm) ||
              p.description.toLowerCase().includes(searchTerm) ||
              p.location.toLowerCase().includes(searchTerm)
            );
          }
        }

        return filtered.sort((a, b) => b.completionDate.getTime() - a.completionDate.getTime());
      }),
      delay(200)
    );
  }

  /**
   * Get featured projects
   */
  getFeaturedProjects(limit: number = 6): Observable<ProjectGalleryItem[]> {
    return this.getProjects({ featured: true }).pipe(
      map(projects => projects.slice(0, limit))
    );
  }

  /**
   * Get project categories
   */
  getProjectCategories(): Observable<ProjectCategory[]> {
    return this.categoriesSubject.asObservable().pipe(delay(100));
  }

  /**
   * Get project by ID
   */
  getProjectById(id: string): Observable<ProjectGalleryItem | null> {
    return this.projectsSubject.asObservable().pipe(
      map(projects => projects.find(p => p.id === id) || null),
      delay(200)
    );
  }

  /**
   * Get related projects based on category and tags
   */
  getRelatedProjects(project: ProjectGalleryItem, limit: number = 3): Observable<ProjectGalleryItem[]> {
    return this.projectsSubject.asObservable().pipe(
      map(projects => {
        return projects
          .filter(p => p.id !== project.id)
          .filter(p => 
            p.category.id === project.category.id ||
            p.tags.some(tag => project.tags.includes(tag))
          )
          .slice(0, limit);
      }),
      delay(200)
    );
  }

  /**
   * Format project value for display
   */
  formatCurrency(amount: string): string {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Calculate project duration in months
   */
  calculateDuration(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 30);
  }

  /**
   * Get average rating from testimonials
   */
  getAverageRating(): Observable<number> {
    return this.testimonialsSubject.asObservable().pipe(
      map(testimonials => {
        if (testimonials.length === 0) return 0;
        const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
        return Math.round((sum / testimonials.length) * 10) / 10;
      })
    );
  }
}
