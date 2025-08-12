// Business Service Models for Mahlatji Mmetji Group

export interface BusinessService {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  features: string[];
  pricing?: ServicePricing;
  images: ServiceImage[];
  contactPerson: Employee;
  availability: ServiceAvailability;
  certifications?: string[];
  testimonials?: Testimonial[];
  dateAdded: Date;
  dateUpdated?: Date;
}

export interface ServiceImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  caption?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: ServiceCategory;
  email: string;
  phone: string;
  photo?: string;
  bio?: string;
  qualifications?: string[];
}

export interface ServicePricing {
  basePrice?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  pricingModel: PricingModel;
  currency: string;
  details?: string;
}

export interface ServiceAvailability {
  daysOfWeek: string[];
  hours: {
    start: string;
    end: string;
  };
  emergencyService: boolean;
  coverage: string[]; // Areas covered
}

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  rating: number;
  comment: string;
  serviceCategory: ServiceCategory;
  date: Date;
  verified: boolean;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  serviceCategory?: ServiceCategory;
  class?: string; // CSS class for styling
  
  // Legacy properties for backward compatibility
  location?: string;
  country?: string;
  heading?: string;
  subHeading?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
  target?: string;
  rel?: string;
}

export interface ContactForm {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest: ServiceCategory | '';
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'either';
}

export interface ProjectGalleryItem {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  images: ServiceImage[];
  completionDate: Date;
  client?: string;
  location: string;
  tags: string[];
}

// Enums
export enum ServiceCategory {
  CLEANING_SECURITY = 'cleaning-security',
  CONSTRUCTION_ELECTRICAL = 'construction-electrical',
  ACCOUNTING = 'accounting'
}

export enum PricingModel {
  HOURLY = 'hourly',
  FIXED = 'fixed',
  MONTHLY = 'monthly',
  PROJECT_BASED = 'project-based',
  QUOTE_REQUIRED = 'quote-required'
}

export enum ServiceStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  EMERGENCY_ONLY = 'emergency-only',
  UNAVAILABLE = 'unavailable'
}

// Legacy Property interfaces (keep for backward compatibility or remove if not needed)
export interface Property {
  id: string;
  title: string;
  price: number;
  location: {
    street: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number; // in square feet/meters
    lotSize?: number;
    yearBuilt?: number;
    propertyType: PropertyType;
    listingType: ListingType;
  };
  images: PropertyImage[];
  description: string;
  features: string[];
  agent: Agent;
  status: PropertyStatus;
  dateAdded: Date;
  dateUpdated?: Date;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  caption?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  bio?: string;
}

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  VILLA = 'villa',
  LAND = 'land',
  COMMERCIAL = 'commercial'
}

export enum ListingType {
  FOR_SALE = 'for-sale',
  FOR_RENT = 'for-rent',
  SOLD = 'sold',
  RENTED = 'rented'
}

export enum PropertyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SOLD = 'sold',
  RENTED = 'rented',
  DRAFT = 'draft'
}
