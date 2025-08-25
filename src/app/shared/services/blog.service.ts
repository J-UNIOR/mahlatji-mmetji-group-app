import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  BlogPost, 
  BlogAuthor, 
  BlogCategory, 
  BlogTag, 
  BlogFilter, 
  BlogResponse 
} from '../models/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private postsSubject = new BehaviorSubject<BlogPost[]>([]);
  private categoriesSubject = new BehaviorSubject<BlogCategory[]>([]);
  private tagsSubject = new BehaviorSubject<BlogTag[]>([]);

  // Mock data for demonstration
  private mockAuthors: BlogAuthor[] = [
    {
      id: '1',
      name: 'John Mahlatji',
      bio: 'CEO and Founder with over 20 years in construction industry',
      avatar: '/assets/images/team/john-mahlatji.jpg',
      email: 'john@mahlatjimmetji.co.za',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johnmahlatji'
      }
    },
    {
      id: '2',
      name: 'Sarah Mmetji',
      bio: 'Project Manager specializing in residential developments',
      avatar: '/assets/images/team/sarah-mmetji.jpg',
      email: 'sarah@mahlatjimmetji.co.za'
    }
  ];

  private mockCategories: BlogCategory[] = [
    {
      id: '1',
      name: 'Construction Tips',
      slug: 'construction-tips',
      description: 'Expert advice and industry best practices',
      color: '#f35525',
      postCount: 8
    },
    {
      id: '2',
      name: 'Project Updates',
      slug: 'project-updates',
      description: 'Latest news from our ongoing projects',
      color: '#2ecc71',
      postCount: 12
    },
    {
      id: '3',
      name: 'Industry News',
      slug: 'industry-news',
      description: 'Latest trends and regulations in construction',
      color: '#3498db',
      postCount: 6
    },
    {
      id: '4',
      name: 'Company News',
      slug: 'company-news',
      description: 'Updates about Mahlatji Mmetji Group',
      color: '#9b59b6',
      postCount: 4
    }
  ];

  private mockTags: BlogTag[] = [
    { id: '1', name: 'Residential', slug: 'residential', postCount: 15 },
    { id: '2', name: 'Commercial', slug: 'commercial', postCount: 8 },
    { id: '3', name: 'Sustainability', slug: 'sustainability', postCount: 6 },
    { id: '4', name: 'Safety', slug: 'safety', postCount: 10 },
    { id: '5', name: 'Technology', slug: 'technology', postCount: 5 },
    { id: '6', name: 'Design', slug: 'design', postCount: 7 }
  ];

  private mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Sustainable Building Practices for Modern Homes',
      slug: 'sustainable-building-practices-modern-homes',
      excerpt: 'Discover how we incorporate eco-friendly materials and energy-efficient designs in our residential projects.',
      content: `<p>In today's construction industry, sustainability is not just a trend—it's a necessity. At Mahlatji Mmetji Group, we've been pioneering sustainable building practices that benefit both our clients and the environment.</p>

      <h3>Key Sustainable Practices</h3>
      <ul>
        <li><strong>Energy-Efficient Design:</strong> Proper orientation, insulation, and window placement to minimize energy consumption</li>
        <li><strong>Water Conservation:</strong> Rainwater harvesting systems and greywater recycling</li>
        <li><strong>Sustainable Materials:</strong> Locally sourced, recycled, and low-impact building materials</li>
        <li><strong>Waste Reduction:</strong> Comprehensive waste management and recycling programs</li>
      </ul>

      <h3>Benefits for Homeowners</h3>
      <p>Sustainable homes offer significant long-term benefits including reduced utility costs, improved indoor air quality, and increased property value. Our clients typically see 30-40% reduction in energy costs compared to traditional construction methods.</p>

      <h3>Our Commitment</h3>
      <p>We're committed to staying at the forefront of sustainable construction, continuously updating our practices based on the latest research and technology in green building.</p>`,
      author: this.mockAuthors[0],
      publishedDate: new Date('2024-08-15'),
      featuredImage: '/assets/images/blog/sustainable-building.jpg',
      tags: ['Sustainability', 'Residential', 'Design'],
      categories: ['Construction Tips'],
      status: 'published',
      readingTime: 5,
      seoTitle: 'Sustainable Building Practices for Modern Homes | Mahlatji Mmetji Group',
      seoDescription: 'Learn about eco-friendly construction methods and energy-efficient designs for modern homes. Expert insights from Mahlatji Mmetji Group.',
      featured: true
    },
    {
      id: '2',
      title: 'Safety First: Our Construction Site Protocol',
      slug: 'safety-first-construction-site-protocol',
      excerpt: 'An in-depth look at the comprehensive safety measures we implement on every construction site.',
      content: `<p>Safety is our top priority at every Mahlatji Mmetji Group construction site. Our comprehensive safety protocol ensures the wellbeing of our workers, subcontractors, and visitors.</p>

      <h3>Safety Standards</h3>
      <p>We exceed industry safety requirements and maintain certifications from leading safety organizations. Our safety record speaks for itself with zero major incidents in the past five years.</p>

      <h3>Daily Safety Practices</h3>
      <ul>
        <li>Morning safety briefings for all team members</li>
        <li>Regular equipment inspections and maintenance</li>
        <li>Personal protective equipment (PPE) mandatory for all site personnel</li>
        <li>Continuous safety monitoring and hazard identification</li>
      </ul>

      <h3>Training and Certification</h3>
      <p>All our employees undergo regular safety training and certification programs. We invest heavily in keeping our team updated with the latest safety protocols and emergency procedures.</p>`,
      author: this.mockAuthors[1],
      publishedDate: new Date('2024-08-10'),
      featuredImage: '/assets/images/blog/construction-safety.jpg',
      tags: ['Safety', 'Commercial'],
      categories: ['Construction Tips'],
      status: 'published',
      readingTime: 4,
      featured: false
    },
    {
      id: '3',
      title: 'Technology Integration in Modern Construction',
      slug: 'technology-integration-modern-construction',
      excerpt: 'How we leverage cutting-edge technology to improve project efficiency and quality.',
      content: `<p>The construction industry is rapidly evolving with new technologies that enhance efficiency, accuracy, and safety. At Mahlatji Mmetji Group, we embrace these innovations to deliver superior results.</p>

      <h3>Digital Tools We Use</h3>
      <ul>
        <li><strong>3D Modeling and BIM:</strong> Building Information Modeling for precise planning and visualization</li>
        <li><strong>Drone Surveys:</strong> Aerial photography and site monitoring for better project oversight</li>
        <li><strong>Project Management Software:</strong> Real-time tracking and communication tools</li>
        <li><strong>Quality Control Apps:</strong> Digital checklists and inspection reports</li>
      </ul>

      <h3>Benefits for Our Clients</h3>
      <p>Technology integration allows us to provide better project transparency, faster completion times, and more accurate cost estimates. Clients can track progress through our online portal and receive regular updates.</p>`,
      author: this.mockAuthors[0],
      publishedDate: new Date('2024-08-05'),
      featuredImage: '/assets/images/blog/construction-technology.jpg',
      tags: ['Technology', 'Commercial', 'Residential'],
      categories: ['Industry News'],
      status: 'published',
      readingTime: 6,
      featured: true
    }
  ];

  constructor() {
    this.postsSubject.next(this.mockPosts);
    this.categoriesSubject.next(this.mockCategories);
    this.tagsSubject.next(this.mockTags);
  }

  /**
   * Get all blog posts with optional filtering and pagination
   */
  getPosts(filter?: BlogFilter, page: number = 1, limit: number = 10): Observable<BlogResponse> {
    return this.postsSubject.asObservable().pipe(
      map(posts => {
        let filteredPosts = [...posts];

        // Apply filters
        if (filter) {
          if (filter.categories?.length) {
            filteredPosts = filteredPosts.filter(post => 
              post.categories.some(cat => filter.categories?.includes(cat))
            );
          }

          if (filter.tags?.length) {
            filteredPosts = filteredPosts.filter(post => 
              post.tags.some(tag => filter.tags?.includes(tag))
            );
          }

          if (filter.author) {
            filteredPosts = filteredPosts.filter(post => 
              post.author.id === filter.author
            );
          }

          if (filter.featured !== undefined) {
            filteredPosts = filteredPosts.filter(post => 
              post.featured === filter.featured
            );
          }

          if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filteredPosts = filteredPosts.filter(post =>
              post.title.toLowerCase().includes(searchTerm) ||
              post.excerpt.toLowerCase().includes(searchTerm) ||
              post.content.toLowerCase().includes(searchTerm)
            );
          }

          if (filter.dateRange) {
            filteredPosts = filteredPosts.filter(post =>
              post.publishedDate >= filter.dateRange!.start &&
              post.publishedDate <= filter.dateRange!.end
            );
          }
        }

        // Sort by published date (newest first)
        filteredPosts.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

        // Apply pagination
        const total = filteredPosts.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        return {
          posts: paginatedPosts,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        };
      }),
      delay(300) // Simulate API delay
    );
  }

  /**
   * Get a single blog post by slug
   */
  getPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.postsSubject.asObservable().pipe(
      map(posts => posts.find(post => post.slug === slug) || null),
      delay(200)
    );
  }

  /**
   * Get featured blog posts
   */
  getFeaturedPosts(limit: number = 3): Observable<BlogPost[]> {
    return this.postsSubject.asObservable().pipe(
      map(posts => posts.filter(post => post.featured).slice(0, limit)),
      delay(200)
    );
  }

  /**
   * Get recent blog posts
   */
  getRecentPosts(limit: number = 5): Observable<BlogPost[]> {
    return this.postsSubject.asObservable().pipe(
      map(posts => {
        return [...posts]
          .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
          .slice(0, limit);
      }),
      delay(200)
    );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<BlogCategory[]> {
    return this.categoriesSubject.asObservable().pipe(delay(100));
  }

  /**
   * Get all tags
   */
  getTags(): Observable<BlogTag[]> {
    return this.tagsSubject.asObservable().pipe(delay(100));
  }

  /**
   * Get related posts based on tags and categories
   */
  getRelatedPosts(post: BlogPost, limit: number = 3): Observable<BlogPost[]> {
    return this.postsSubject.asObservable().pipe(
      map(posts => {
        return posts
          .filter(p => p.id !== post.id)
          .filter(p => 
            p.categories.some(cat => post.categories.includes(cat)) ||
            p.tags.some(tag => post.tags.includes(tag))
          )
          .slice(0, limit);
      }),
      delay(200)
    );
  }

  /**
   * Search posts
   */
  searchPosts(query: string): Observable<BlogPost[]> {
    return this.postsSubject.asObservable().pipe(
      map(posts => {
        const searchTerm = query.toLowerCase();
        return posts.filter(post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          post.categories.some(cat => cat.toLowerCase().includes(searchTerm))
        );
      }),
      delay(300)
    );
  }

  /**
   * Get posts by category
   */
  getPostsByCategory(categorySlug: string): Observable<BlogPost[]> {
    return this.postsSubject.asObservable().pipe(
      map(posts => posts.filter(post => 
        post.categories.some(cat => 
          this.mockCategories.find(c => c.name === cat)?.slug === categorySlug
        )
      )),
      delay(200)
    );
  }

  /**
   * Get posts by tag
   */
  getPostsByTag(tagSlug: string): Observable<BlogPost[]> {
    return this.postsSubject.asObservable().pipe(
      map(posts => posts.filter(post => 
        post.tags.some(tag => 
          this.mockTags.find(t => t.name === tag)?.slug === tagSlug
        )
      )),
      delay(200)
    );
  }

  /**
   * Calculate reading time based on content length
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
