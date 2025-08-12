import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Property, PropertyType, ListingType, PropertyStatus, Agent } from '../models/mahlatji-business.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private properties = signal<Property[]>(this.getMockProperties());
  private featuredProperties = signal<Property[]>([]);

  constructor() {
    // Set featured properties on initialization
    this.featuredProperties.set(
      this.properties().filter(p => p.status === PropertyStatus.ACTIVE).slice(0, 6)
    );
  }

  getAllProperties(): Observable<Property[]> {
    return of(this.properties()).pipe(delay(500)); // Simulate API delay
  }

  getFeaturedProperties(): Observable<Property[]> {
    return of(this.featuredProperties()).pipe(delay(300));
  }

  getPropertyById(id: string): Observable<Property | undefined> {
    const property = this.properties().find(p => p.id === id);
    return of(property).pipe(delay(300));
  }

  getPropertiesByType(type: PropertyType): Observable<Property[]> {
    return of(this.properties().filter(p => p.details.propertyType === type)).pipe(delay(400));
  }

  searchProperties(criteria: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    propertyType?: PropertyType;
    listingType?: ListingType;
  }): Observable<Property[]> {
    return of(this.properties()).pipe(
      delay(600),
      map(properties => properties.filter(property => {
        if (criteria.location && !property.location.city.toLowerCase().includes(criteria.location.toLowerCase())) {
          return false;
        }
        if (criteria.minPrice && property.price < criteria.minPrice) {
          return false;
        }
        if (criteria.maxPrice && property.price > criteria.maxPrice) {
          return false;
        }
        if (criteria.bedrooms && property.details.bedrooms < criteria.bedrooms) {
          return false;
        }
        if (criteria.propertyType && property.details.propertyType !== criteria.propertyType) {
          return false;
        }
        if (criteria.listingType && property.details.listingType !== criteria.listingType) {
          return false;
        }
        return true;
      }))
    );
  }

  private getMockProperties(): Property[] {
    const agents: Agent[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@mahlatjimmetji.co.za',
        phone: '+27 11 123 4567',
        photo: 'assets/images/agent-01.jpg'
      },
      {
        id: '2',
        name: 'Michael Brown',
        email: 'michael@mahlatjimmetji.co.za',
        phone: '+27 11 234 5678',
        photo: 'assets/images/agent-02.jpg'
      }
    ];

    return [
      {
        id: '1',
        title: 'Modern Villa in Sandton',
        price: 4500000,
        location: {
          street: '123 Rivonia Road',
          city: 'Sandton',
          state: 'Gauteng',
          country: 'South Africa',
          coordinates: { lat: -26.1076, lng: 28.0567 }
        },
        details: {
          bedrooms: 4,
          bathrooms: 3,
          area: 350,
          lotSize: 800,
          yearBuilt: 2020,
          propertyType: PropertyType.VILLA,
          listingType: ListingType.FOR_SALE
        },
        images: [
          {
            id: '1',
            url: 'assets/images/property-01.jpg',
            alt: 'Modern Villa in Sandton - Main View',
            isPrimary: true
          },
          {
            id: '2',
            url: 'assets/images/property-02.jpg',
            alt: 'Modern Villa in Sandton - Interior',
            isPrimary: false
          }
        ],
        description: 'Luxurious modern villa featuring contemporary design, spacious living areas, and premium finishes throughout.',
        features: ['Swimming Pool', 'Double Garage', 'Garden', 'Security System', 'Solar Panels'],
        agent: agents[0],
        status: PropertyStatus.ACTIVE,
        dateAdded: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Penthouse Apartment in Cape Town',
        price: 8900000,
        location: {
          street: '45 Waterfront Boulevard',
          city: 'Cape Town',
          state: 'Western Cape',
          country: 'South Africa',
          coordinates: { lat: -33.9249, lng: 18.4241 }
        },
        details: {
          bedrooms: 3,
          bathrooms: 2,
          area: 280,
          yearBuilt: 2019,
          propertyType: PropertyType.APARTMENT,
          listingType: ListingType.FOR_SALE
        },
        images: [
          {
            id: '3',
            url: 'assets/images/property-03.jpg',
            alt: 'Penthouse Apartment in Cape Town - Ocean View',
            isPrimary: true
          }
        ],
        description: 'Stunning penthouse with panoramic ocean views, featuring high-end finishes and exclusive amenities.',
        features: ['Ocean View', 'Balcony', 'Concierge', 'Gym Access', 'Wine Cellar'],
        agent: agents[1],
        status: PropertyStatus.ACTIVE,
        dateAdded: new Date('2024-02-10')
      },
      {
        id: '3',
        title: 'Family Home in Durban',
        price: 2800000,
        location: {
          street: '78 Marine Drive',
          city: 'Durban',
          state: 'KwaZulu-Natal',
          country: 'South Africa'
        },
        details: {
          bedrooms: 5,
          bathrooms: 4,
          area: 420,
          lotSize: 1200,
          yearBuilt: 2015,
          propertyType: PropertyType.HOUSE,
          listingType: ListingType.FOR_SALE
        },
        images: [
          {
            id: '4',
            url: 'assets/images/property-04.jpg',
            alt: 'Family Home in Durban - Front View',
            isPrimary: true
          }
        ],
        description: 'Spacious family home perfect for large families, with beautiful gardens and close to excellent schools.',
        features: ['Large Garden', 'Study Room', 'Playroom', 'Double Garage', 'Pool'],
        agent: agents[0],
        status: PropertyStatus.ACTIVE,
        dateAdded: new Date('2024-03-05')
      }
    ];
  }
}
