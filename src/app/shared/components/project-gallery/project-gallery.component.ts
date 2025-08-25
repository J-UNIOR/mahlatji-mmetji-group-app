import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  completionDate: Date;
  location: string;
  features: string[];
}

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-section">
      <div class="container">
        <div class="section-heading text-center">
          <h2>Our Project Gallery</h2>
          <p>Showcasing successful transformations and completed projects</p>
        </div>

        <div class="category-filter">
          <button *ngFor="let category of categories" 
                  class="filter-btn"
                  [class.active]="selectedCategory === category"
                  (click)="filterProjects(category)">
            {{ category }}
          </button>
        </div>

        <div class="projects-grid">
          <div *ngFor="let project of filteredProjects" class="project-card">
            <div class="project-images">
              <div class="image-container">
                <div class="before-after-slider">
                  <img [src]="project.beforeImage" [alt]="project.title + ' - Before'" class="before-image">
                  <img [src]="project.afterImage" [alt]="project.title + ' - After'" class="after-image">
                  <div class="slider-handle">
                    <span>Before / After</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="project-info">
              <div class="project-header">
                <h3>{{ project.title }}</h3>
                <span class="category-tag">{{ project.category }}</span>
              </div>
              <p>{{ project.description }}</p>
              <div class="project-details">
                <div class="detail">
                  <i class="fa fa-map-marker-alt" aria-hidden="true"></i>
                  {{ project.location }}
                </div>
                <div class="detail">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                  {{ project.completionDate | date:'MMM yyyy' }}
                </div>
              </div>
              <div class="project-features">
                <span *ngFor="let feature of project.features" class="feature-tag">
                  {{ feature }}
                </span>
              </div>
              <button class="view-project-btn">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery-section {
      padding: 80px 0;
      background: #ffffff;
    }

    .category-filter {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 40px 0;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      color: #495057;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: #f35525;
      border-color: #f35525;
      color: white;
      transform: translateY(-2px);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 40px;
      margin-top: 50px;
    }

    .project-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .project-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }

    .project-images {
      height: 300px;
      overflow: hidden;
      position: relative;
    }

    .image-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .before-after-slider {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .before-image,
    .after-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.3s ease;
    }

    .after-image {
      clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);
    }

    .before-after-slider:hover .after-image {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    }

    .slider-handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(243, 85, 37, 0.9);
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .before-after-slider:hover .slider-handle {
      opacity: 1;
    }

    .project-info {
      padding: 25px;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .project-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.3rem;
      line-height: 1.3;
    }

    .category-tag {
      background: #f35525;
      color: white;
      padding: 5px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .project-info p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .project-details {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .detail i {
      color: #f35525;
    }

    .project-features {
      display: flex;
      gap: 8px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    .feature-tag {
      background: #e9ecef;
      color: #495057;
      padding: 4px 10px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .view-project-btn {
      background: linear-gradient(135deg, #f35525, #d63384);
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }

    .view-project-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(243, 85, 37, 0.3);
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
        gap: 25px;
      }

      .project-header {
        flex-direction: column;
        gap: 10px;
      }

      .project-details {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class ProjectGalleryComponent implements OnInit {
  projects: Project[] = [
    {
      id: 1,
      title: 'Modern Office Complex Renovation',
      description: 'Complete transformation of a commercial office space with modern amenities and sustainable features.',
      category: 'Commercial',
      beforeImage: 'assets/images/deal-01.jpg',
      afterImage: 'assets/images/deal-02.jpg',
      completionDate: new Date('2024-12-15'),
      location: 'Pretoria CBD, South Africa',
      features: ['Smart Building', 'Energy Efficient', 'Modern Design']
    },
    {
      id: 2,
      title: 'Luxury Residential Development',
      description: 'High-end residential property development with premium finishes and landscaping.',
      category: 'Residential',
      beforeImage: 'assets/images/property-01.jpg',
      afterImage: 'assets/images/property-02.jpg',
      completionDate: new Date('2024-11-20'),
      location: 'Sandton, Johannesburg',
      features: ['Luxury Finishes', 'Landscaping', 'Security Systems']
    },
    {
      id: 3,
      title: 'Industrial Warehouse Upgrade',
      description: 'Modernization of warehouse facilities for improved logistics and operations.',
      category: 'Industrial',
      beforeImage: 'assets/images/property-03.jpg',
      afterImage: 'assets/images/property-04.jpg',
      completionDate: new Date('2024-10-30'),
      location: 'Germiston Industrial Area',
      features: ['Logistics Optimization', 'Safety Upgrades', 'Technology Integration']
    }
  ];

  categories: string[] = ['All', 'Commercial', 'Residential', 'Industrial'];
  selectedCategory: string = 'All';
  filteredProjects: Project[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filteredProjects = this.projects;
  }

  filterProjects(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => project.category === category);
    }
  }
}
