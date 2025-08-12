import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { 
  BusinessService, 
  ServiceCategory, 
  Employee, 
  ServiceAvailability, 
  ServicePricing, 
  PricingModel,
  Testimonial,
  ProjectGalleryItem 
} from '../models/mahlatji-business.interface';

@Injectable({
  providedIn: 'root'
})
export class MahlatjiServicesService {
  private services = signal<BusinessService[]>(this.getMockServices());
  private employees = signal<Employee[]>(this.getMockEmployees());
  private projects = signal<ProjectGalleryItem[]>(this.getMockProjects());

  constructor() {}

  getAllServices(): Observable<BusinessService[]> {
    return of(this.services()).pipe(delay(500));
  }

  getServicesByCategory(category: ServiceCategory): Observable<BusinessService[]> {
    return of(this.services().filter(s => s.category === category)).pipe(delay(400));
  }

  getServiceById(id: string): Observable<BusinessService | undefined> {
    const service = this.services().find(s => s.id === id);
    return of(service).pipe(delay(300));
  }

  getFeaturedServices(): Observable<BusinessService[]> {
    // Return one service from each category
    const featured = [
      this.services().find(s => s.category === ServiceCategory.CLEANING_SECURITY),
      this.services().find(s => s.category === ServiceCategory.CONSTRUCTION_ELECTRICAL),
      this.services().find(s => s.category === ServiceCategory.ACCOUNTING)
    ].filter(Boolean) as BusinessService[];
    
    return of(featured).pipe(delay(300));
  }

  getEmployeesByDepartment(department: ServiceCategory): Observable<Employee[]> {
    return of(this.employees().filter(e => e.department === department)).pipe(delay(300));
  }

  getProjectsByCategory(category: ServiceCategory): Observable<ProjectGalleryItem[]> {
    return of(this.projects().filter(p => p.category === category)).pipe(delay(400));
  }

  getAllProjects(): Observable<ProjectGalleryItem[]> {
    return of(this.projects()).pipe(delay(500));
  }

  private getMockEmployees(): Employee[] {
    return [
      {
        id: '1',
        name: 'Sarah Mahlatji',
        position: 'Operations Manager',
        department: ServiceCategory.CLEANING_SECURITY,
        email: 'sarah@mahlatjimmetji.co.za',
        phone: '+27 11 123 4567',
        photo: 'assets/images/team/sarah.jpg',
        bio: 'Over 10 years experience in facility management and security operations.',
        qualifications: ['Security Management Certification', 'Health & Safety Training']
      },
      {
        id: '2',
        name: 'Michael Mmetji',
        position: 'Construction Manager',
        department: ServiceCategory.CONSTRUCTION_ELECTRICAL,
        email: 'michael@mahlatjimmetji.co.za',
        phone: '+27 11 234 5678',
        photo: 'assets/images/team/michael.jpg',
        bio: 'Licensed electrician and construction project manager with 15+ years experience.',
        qualifications: ['Electrical License', 'Project Management Professional', 'NHBRC Certified']
      },
      {
        id: '3',
        name: 'Jennifer Sithole',
        position: 'Accounting Manager',
        department: ServiceCategory.ACCOUNTING,
        email: 'jennifer@mahlatjimmetji.co.za',
        phone: '+27 11 345 6789',
        photo: 'assets/images/team/jennifer.jpg',
        bio: 'Chartered Accountant specializing in small business and corporate accounting.',
        qualifications: ['CA(SA)', 'Tax Practitioner', 'CIMA Advanced Diploma']
      }
    ];
  }

  private getMockServices(): BusinessService[] {
    const employees = this.getMockEmployees();
    
    return [
      // Cleaning & Security Services
      {
        id: '1',
        title: 'Office Cleaning Services',
        category: ServiceCategory.CLEANING_SECURITY,
        description: 'Professional office cleaning services for commercial buildings, ensuring a clean and healthy work environment.',
        features: [
          'Daily office cleaning',
          'Deep cleaning services',
          'Sanitization and disinfection',
          'Window cleaning',
          'Carpet cleaning',
          'Restroom maintenance'
        ],
        pricing: {
          priceRange: { min: 1500, max: 5000 },
          pricingModel: PricingModel.MONTHLY,
          currency: 'ZAR',
          details: 'Pricing based on office size and cleaning frequency'
        },
        images: [
          {
            id: '1',
            url: 'assets/images/services/office-cleaning.jpg',
            alt: 'Professional office cleaning service',
            isPrimary: true
          }
        ],
        contactPerson: employees[0],
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          hours: { start: '06:00', end: '18:00' },
          emergencyService: true,
          coverage: ['Johannesburg', 'Pretoria', 'Sandton', 'Midrand']
        },
        certifications: ['IOSH Certified', 'Green Cleaning Certified'],
        dateAdded: new Date('2024-01-10')
      },
      {
        id: '2',
        title: 'Security Guard Services',
        category: ServiceCategory.CLEANING_SECURITY,
        description: 'Professional security guard services for commercial and residential properties.',
        features: [
          '24/7 security guard services',
          'Access control management',
          'CCTV monitoring',
          'Patrol services',
          'Emergency response',
          'Incident reporting'
        ],
        pricing: {
          priceRange: { min: 8000, max: 25000 },
          pricingModel: PricingModel.MONTHLY,
          currency: 'ZAR',
          details: 'Pricing varies by location, hours, and number of guards required'
        },
        images: [
          {
            id: '2',
            url: 'assets/images/services/security-guard.jpg',
            alt: 'Professional security guard service',
            isPrimary: true
          }
        ],
        contactPerson: employees[0],
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          hours: { start: '00:00', end: '23:59' },
          emergencyService: true,
          coverage: ['Gauteng Province', 'Limpopo Province']
        },
        certifications: ['PSIRA Registered', 'Grade A Security License'],
        dateAdded: new Date('2024-01-15')
      },

      // Construction & Electrical Services
      {
        id: '3',
        title: 'Electrical Installation & Maintenance',
        category: ServiceCategory.CONSTRUCTION_ELECTRICAL,
        description: 'Complete electrical services including installation, maintenance, and emergency repairs.',
        features: [
          'Electrical installations',
          'Wiring and rewiring',
          'Lighting installations',
          'Electrical maintenance',
          'Emergency electrical repairs',
          'Electrical inspections',
          'Solar panel installations'
        ],
        pricing: {
          pricingModel: PricingModel.QUOTE_REQUIRED,
          currency: 'ZAR',
          details: 'Free quotations provided based on project scope'
        },
        images: [
          {
            id: '3',
            url: 'assets/images/services/electrical-work.jpg',
            alt: 'Professional electrical installation service',
            isPrimary: true
          }
        ],
        contactPerson: employees[1],
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          hours: { start: '07:00', end: '17:00' },
          emergencyService: true,
          coverage: ['Johannesburg', 'Pretoria', 'East Rand', 'West Rand']
        },
        certifications: ['Electrical License', 'NHBRC Certified', 'Department of Labour Certified'],
        dateAdded: new Date('2024-02-01')
      },
      {
        id: '4',
        title: 'Construction & Renovation',
        category: ServiceCategory.CONSTRUCTION_ELECTRICAL,
        description: 'Full construction and renovation services for residential and commercial properties.',
        features: [
          'Building construction',
          'Home renovations',
          'Office fit-outs',
          'Tiling and flooring',
          'Painting and decorating',
          'Plumbing installations',
          'Project management'
        ],
        pricing: {
          pricingModel: PricingModel.PROJECT_BASED,
          currency: 'ZAR',
          details: 'Project-based pricing with detailed quotations'
        },
        images: [
          {
            id: '4',
            url: 'assets/images/services/construction.jpg',
            alt: 'Construction and renovation services',
            isPrimary: true
          }
        ],
        contactPerson: employees[1],
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          hours: { start: '07:00', end: '17:00' },
          emergencyService: false,
          coverage: ['Gauteng Province', 'North West Province']
        },
        certifications: ['NHBRC Registered', 'CIDB Graded', 'Construction Industry Certification'],
        dateAdded: new Date('2024-02-10')
      },

      // Accounting Services
      {
        id: '5',
        title: 'Small Business Accounting',
        category: ServiceCategory.ACCOUNTING,
        description: 'Comprehensive accounting services for small and medium businesses.',
        features: [
          'Bookkeeping services',
          'Financial statement preparation',
          'Tax preparation and filing',
          'VAT returns',
          'Payroll processing',
          'Business advisory services',
          'SARS compliance'
        ],
        pricing: {
          priceRange: { min: 1500, max: 8000 },
          pricingModel: PricingModel.MONTHLY,
          currency: 'ZAR',
          details: 'Monthly retainer based on business size and complexity'
        },
        images: [
          {
            id: '5',
            url: 'assets/images/services/accounting.jpg',
            alt: 'Professional accounting services',
            isPrimary: true
          }
        ],
        contactPerson: employees[2],
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: { start: '08:00', end: '17:00' },
          emergencyService: false,
          coverage: ['Nationwide (Remote Services Available)']
        },
        certifications: ['SAICA Registered', 'SAIT Member', 'Tax Practitioner Registration'],
        dateAdded: new Date('2024-01-20')
      },
      {
        id: '6',
        title: 'Corporate Tax Services',
        category: ServiceCategory.ACCOUNTING,
        description: 'Specialized tax services for corporations and high-net-worth individuals.',
        features: [
          'Corporate tax returns',
          'Tax planning and strategy',
          'SARS audit support',
          'Transfer pricing',
          'International tax compliance',
          'Tax dispute resolution',
          'BEE compliance certificates'
        ],
        pricing: {
          pricingModel: PricingModel.QUOTE_REQUIRED,
          currency: 'ZAR',
          details: 'Customized pricing based on complexity and requirements'
        },
        images: [
          {
            id: '6',
            url: 'assets/images/services/tax-services.jpg',
            alt: 'Corporate tax services',
            isPrimary: true
          }
        ],
        contactPerson: employees[2],
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: { start: '08:00', end: '17:00' },
          emergencyService: false,
          coverage: ['Nationwide']
        },
        certifications: ['CA(SA)', 'Registered Tax Practitioner', 'SARS Practitioner'],
        dateAdded: new Date('2024-02-15')
      }
    ];
  }

  private getMockProjects(): ProjectGalleryItem[] {
    return [
      {
        id: '1',
        title: 'Corporate Office Complex Cleaning',
        category: ServiceCategory.CLEANING_SECURITY,
        description: 'Complete cleaning and maintenance services for a 15-story office complex in Sandton.',
        images: [
          {
            id: '1',
            url: 'assets/images/projects/office-complex-1.jpg',
            alt: 'Corporate office cleaning project',
            isPrimary: true
          }
        ],
        completionDate: new Date('2024-03-15'),
        client: 'Sandton Business Centre',
        location: 'Sandton, Johannesburg',
        tags: ['Office Cleaning', 'Commercial', 'Long-term Contract']
      },
      {
        id: '2',
        title: 'Residential Estate Electrical Installation',
        category: ServiceCategory.CONSTRUCTION_ELECTRICAL,
        description: 'Complete electrical installation for a new residential estate including smart home features.',
        images: [
          {
            id: '2',
            url: 'assets/images/projects/residential-electrical.jpg',
            alt: 'Residential electrical installation project',
            isPrimary: true
          }
        ],
        completionDate: new Date('2024-02-28'),
        client: 'Lifestyle Estates',
        location: 'Centurion, Pretoria',
        tags: ['Electrical Installation', 'Residential', 'Smart Home']
      },
      {
        id: '3',
        title: 'Manufacturing Company Financial Restructuring',
        category: ServiceCategory.ACCOUNTING,
        description: 'Complete financial restructuring and accounting system implementation for manufacturing company.',
        images: [
          {
            id: '3',
            url: 'assets/images/projects/financial-restructuring.jpg',
            alt: 'Financial restructuring project',
            isPrimary: true
          }
        ],
        completionDate: new Date('2024-01-30'),
        client: 'Industrial Solutions Ltd',
        location: 'Germiston, Johannesburg',
        tags: ['Financial Restructuring', 'Manufacturing', 'System Implementation']
      }
    ];
  }
}
