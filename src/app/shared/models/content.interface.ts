export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  company?: string;
  avatar?: string;
  rating: number;
  content: string;
  projectType?: string;
  projectName?: string;
  projectImage?: string;
  location?: string;
  date: Date;
  featured: boolean;
  verified: boolean;
  tags?: string[];
}

export interface TestimonialFilter {
  rating?: number;
  projectType?: string;
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

export interface ProjectGalleryItem {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  location: string;
  completionDate: Date;
  duration?: string;
  budget?: string;
  client?: string;
  images: ProjectImage[];
  beforeAfter?: {
    before: string;
    after: string;
    description?: string;
  };
  featured: boolean;
  tags: string[];
  testimonial?: Testimonial;
  specifications?: ProjectSpecification[];
}

export interface ProjectImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  caption?: string;
  type: 'before' | 'after' | 'progress' | 'completed';
  order: number;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  projectCount: number;
}

export interface ProjectSpecification {
  label: string;
  value: string;
  type: 'text' | 'number' | 'area' | 'currency' | 'date';
}

export interface ProjectFilter {
  categories?: string[];
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
  featured?: boolean;
  search?: string;
  tags?: string[];
}
