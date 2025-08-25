import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  position: string;
  content: string;
  image: string;
  rating: number;
  project: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="testimonials-section">
      <div class="container">
        <div class="section-heading text-center">
          <h2>What Our Clients Say</h2>
          <p>Real feedback from our valued clients and partners</p>
        </div>

        <div class="testimonials-grid">
          <div *ngFor="let testimonial of testimonials" class="testimonial-card">
            <div class="testimonial-header">
              <div class="client-image">
                <img [src]="testimonial.image" [alt]="testimonial.name" loading="lazy">
              </div>
              <div class="client-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.position }}</p>
                <span class="company">{{ testimonial.company }}</span>
              </div>
              <div class="rating">
                <i *ngFor="let star of getStars(testimonial.rating)" 
                   class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-footer">
              <span class="project">{{ testimonial.project }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .testimonials-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
      margin-top: 50px;
    }

    .testimonial-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .testimonial-card::before {
      content: '"';
      position: absolute;
      top: -10px;
      left: 20px;
      font-size: 4rem;
      color: #f35525;
      opacity: 0.3;
      font-family: serif;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .testimonial-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      gap: 15px;
    }

    .client-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .client-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .client-info {
      flex: 1;
    }

    .client-info h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .client-info p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .company {
      color: #f35525;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .rating {
      color: #ffc107;
      font-size: 0.9rem;
    }

    .testimonial-content {
      margin: 20px 0;
    }

    .testimonial-content p {
      color: #555;
      line-height: 1.7;
      font-style: italic;
      margin: 0;
    }

    .testimonial-footer {
      border-top: 1px solid #eee;
      padding-top: 15px;
      margin-top: 20px;
    }

    .project {
      color: #666;
      font-size: 0.85rem;
      background: #f8f9fa;
      padding: 5px 10px;
      border-radius: 12px;
      display: inline-block;
    }

    @media (max-width: 768px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .testimonial-header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
    }
  `]
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Property Investments Ltd',
      position: 'CEO',
      content: 'Mahlatji Mmetji Group provided exceptional property management services. Their attention to detail and professional approach exceeded our expectations.',
      image: 'assets/images/3.png',
      rating: 5,
      project: 'Commercial Property Management'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'Urban Development Co',
      position: 'Project Manager',
      content: 'Outstanding business consulting and development services. They helped us navigate complex market challenges and achieve our growth targets.',
      image: 'assets/images/5.png',
      rating: 5,
      project: 'Business Development Consulting'
    },
    {
      id: 3,
      name: 'Linda Williams',
      company: 'Residential Properties',
      position: 'Operations Director',
      content: 'Professional, reliable, and results-driven. Their team consistently delivers high-quality services that drive real business value.',
      image: 'assets/images/7.png',
      rating: 5,
      project: 'Residential Property Portfolio'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
