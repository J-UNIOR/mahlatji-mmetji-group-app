import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  locale?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private defaultSEO: SEOData = {
    title: 'Mahlatji Mmetji Group - Premier Construction & Property Development',
    description: 'Leading construction company and property development group in South Africa. Specializing in residential, commercial, and industrial projects with over 20 years of experience.',
    keywords: 'construction, property development, South Africa, residential construction, commercial building, industrial projects, Pretoria construction',
    image: '/assets/images/mahlatji-mmetji-og.jpg',
    url: 'https://mahlatjimmetji.co.za',
    type: 'website',
    author: 'Mahlatji Mmetji Group',
    siteName: 'Mahlatji Mmetji Group',
    locale: 'en_ZA'
  };

  private meta = inject(Meta);
  private title = inject(Title);
  private document = inject(DOCUMENT);

  /**
   * Update page SEO data
   */
  updateSEO(seoData: Partial<SEOData>): void {
    const data = { ...this.defaultSEO, ...seoData };

    // Update title
    if (data.title) {
      this.title.setTitle(data.title);
    }

    // Update meta tags
    this.updateMetaTags(data);

    // Update Open Graph tags
    this.updateOpenGraphTags(data);

    // Update Twitter Card tags
    this.updateTwitterCardTags(data);

    // Update canonical URL
    if (data.url) {
      this.updateCanonicalUrl(data.url);
    }
  }

  /**
   * Add structured data (JSON-LD)
   */
  addStructuredData(data: StructuredData): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    
    // Remove existing structured data with same type
    const existing = this.document.querySelector(`script[type="application/ld+json"]`);
    if (existing && existing.textContent?.includes(`"@type":"${data['@type']}"`)) {
      existing.remove();
    }
    
    this.document.head.appendChild(script);
  }

  /**
   * Generate organization structured data
   */
  addOrganizationData(): void {
    const organizationData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Mahlatji Mmetji Group',
      'url': 'https://mahlatjimmetji.co.za',
      'logo': 'https://mahlatjimmetji.co.za/assets/images/logo.png',
      'description': 'Leading construction company and property development group in South Africa',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '8 John Street, Eldorette, Akasia',
        'addressLocality': 'Pretoria',
        'postalCode': '0182',
        'addressCountry': 'ZA'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+27-12-001-0576',
        'contactType': 'customer service',
        'email': 'info@mahlatjimmetji.co.za'
      },
      'sameAs': [
        'https://www.facebook.com/mahlatjimmetji',
        'https://www.linkedin.com/company/mahlatji-mmetji-group'
      ],
      'foundingDate': '2000',
      'numberOfEmployees': '50-100',
      'industry': 'Construction',
      'services': [
        'Residential Construction',
        'Commercial Construction',
        'Property Development',
        'Project Management'
      ]
    };

    this.addStructuredData(organizationData);
  }

  /**
   * Generate breadcrumb structured data
   */
  addBreadcrumbData(breadcrumbs: {name: string, url: string}[]): void {
    const breadcrumbData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };

    this.addStructuredData(breadcrumbData);
  }

  /**
   * Generate article structured data for blog posts
   */
  addArticleData(article: {
    title: string;
    description: string;
    author: string;
    publishedDate: string;
    modifiedDate?: string;
    image?: string;
    url: string;
  }): void {
    const articleData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title,
      'description': article.description,
      'author': {
        '@type': 'Person',
        'name': article.author
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Mahlatji Mmetji Group',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://mahlatjimmetji.co.za/assets/images/logo.png'
        }
      },
      'datePublished': article.publishedDate,
      'dateModified': article.modifiedDate || article.publishedDate,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': article.url
      }
    };

    if (article.image) {
      articleData['image'] = {
        '@type': 'ImageObject',
        'url': article.image
      };
    }

    this.addStructuredData(articleData);
  }

  /**
   * Generate service structured data
   */
  addServiceData(service: {
    name: string;
    description: string;
    provider: string;
    areaServed: string;
    serviceType: string;
  }): void {
    const serviceData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': service.name,
      'description': service.description,
      'provider': {
        '@type': 'Organization',
        'name': service.provider
      },
      'areaServed': service.areaServed,
      'serviceType': service.serviceType
    };

    this.addStructuredData(serviceData);
  }

  /**
   * Update basic meta tags
   */
  private updateMetaTags(data: SEOData): void {
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
    }
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }
    if (data.author) {
      this.meta.updateTag({ name: 'author', content: data.author });
    }
    
    // Robots meta tag
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    
    // Viewport (if not already set)
    if (!this.meta.getTag('name="viewport"')) {
      this.meta.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    }
  }

  /**
   * Update Open Graph meta tags
   */
  private updateOpenGraphTags(data: SEOData): void {
    this.meta.updateTag({ property: 'og:title', content: data.title || '' });
    this.meta.updateTag({ property: 'og:description', content: data.description || '' });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: data.url || '' });
    this.meta.updateTag({ property: 'og:site_name', content: data.siteName || '' });
    this.meta.updateTag({ property: 'og:locale', content: data.locale || 'en_ZA' });
    
    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    }

    if (data.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: data.publishedTime });
    }
    if (data.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedTime });
    }
  }

  /**
   * Update Twitter Card meta tags
   */
  private updateTwitterCardTags(data: SEOData): void {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title || '' });
    this.meta.updateTag({ name: 'twitter:description', content: data.description || '' });
    this.meta.updateTag({ name: 'twitter:site', content: '@mahlatjimmetji' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@mahlatjimmetji' });
    
    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * Get default SEO data
   */
  getDefaultSEO(): SEOData {
    return { ...this.defaultSEO };
  }

  /**
   * Generate and inject structured data (JSON-LD)
   */
  generateStructuredData(type: 'Organization' | 'LocalBusiness' | 'Article' | 'Website', data: Record<string, unknown>): void {
    const structuredData = this.createStructuredData(type, data);
    
    // Remove existing structured data
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  /**
   * Create structured data object based on type
   */
  private createStructuredData(type: string, data: Record<string, unknown>): StructuredData {
    const baseData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': type
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseData,
          name: 'Mahlatji Mmetji Group',
          url: 'https://mahlatjimmetji.co.za',
          logo: 'https://mahlatjimmetji.co.za/assets/images/logo.png',
          description: 'Premier construction and property development company in South Africa'
        };

      case 'Article':
        return {
          ...baseData,
          headline: data['title'],
          description: data['description'],
          image: data['image'],
          author: {
            '@type': 'Organization',
            name: 'Mahlatji Mmetji Group'
          },
          datePublished: data['publishDate']
        };

      default:
        return { ...baseData, ...data };
    }
  }

  /**
   * Remove all SEO meta tags
   */
  clearSEO(): void {
    // Remove OG tags
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:type"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('property="og:image"');

    // Remove Twitter tags
    this.meta.removeTag('name="twitter:card"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');

    // Remove structured data
    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }
}
