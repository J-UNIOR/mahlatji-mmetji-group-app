import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: Date;
  author: string;
  category: string;
  tags: string[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="blog-section">
      <div class="container">
        <div class="section-heading text-center">
          <h2>Latest News & Insights</h2>
          <p>Stay updated with industry trends and company news</p>
        </div>

        <div class="blog-grid">
          <article *ngFor="let post of blogPosts" class="blog-card">
            <div class="blog-image">
              <img [src]="post.image" [alt]="post.title" loading="lazy">
              <div class="blog-category">{{ post.category }}</div>
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-date">{{ post.date | date:'MMM dd, yyyy' }}</span>
                <span class="blog-author">{{ post.author }}</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <div class="blog-tags">
                <span *ngFor="let tag of post.tags" class="tag">{{ tag }}</span>
              </div>
              <a href="#" class="read-more">Read More</a>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-section {
      padding: 80px 0;
      background: #f8f9fa;
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
      margin-top: 50px;
    }

    .blog-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .blog-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .blog-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .blog-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .blog-card:hover .blog-image img {
      transform: scale(1.05);
    }

    .blog-category {
      position: absolute;
      top: 15px;
      left: 15px;
      background: #f35525;
      color: white;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .blog-content {
      padding: 25px;
    }

    .blog-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 0.85rem;
      color: #666;
    }

    .blog-content h3 {
      margin: 0 0 15px 0;
      font-size: 1.3rem;
      line-height: 1.4;
      color: #333;
    }

    .blog-content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .blog-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .tag {
      background: #e9ecef;
      color: #495057;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .read-more {
      color: #f35525;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: color 0.3s ease;
    }

    .read-more:hover {
      color: #d63384;
    }

    .read-more::after {
      content: '→';
      transition: transform 0.3s ease;
    }

    .read-more:hover::after {
      transform: translateX(3px);
    }

    @media (max-width: 768px) {
      .blog-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Property Investment Trends in South Africa 2025',
      excerpt: 'Discover the latest trends shaping the South African property market and investment opportunities.',
      content: '',
      image: 'assets/images/property-01.jpg',
      date: new Date('2025-01-15'),
      author: 'Mahlatji Mmetji',
      category: 'Property Investment',
      tags: ['Investment', 'Market Trends', 'Real Estate']
    },
    {
      id: 2,
      title: 'Business Growth Strategies for 2025',
      excerpt: 'Learn about effective business expansion strategies and market opportunities.',
      content: '',
      image: 'assets/images/property-02.jpg',
      date: new Date('2025-01-10'),
      author: 'Business Team',
      category: 'Business',
      tags: ['Growth', 'Strategy', 'Business Development']
    },
    {
      id: 3,
      title: 'Sustainable Development in Property Management',
      excerpt: 'How sustainable practices are transforming the property management industry.',
      content: '',
      image: 'assets/images/property-03.jpg',
      date: new Date('2025-01-05'),
      author: 'Development Team',
      category: 'Sustainability',
      tags: ['Sustainability', 'Development', 'Green Building']
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
