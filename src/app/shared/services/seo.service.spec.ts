import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SEOService, SEOData } from './seo.service';

describe('SEOService', () => {
  let service: SEOService;
  let metaService: jasmine.SpyObj<Meta>;
  let titleService: jasmine.SpyObj<Title>;
  let document: Document;

  beforeEach(() => {
    const metaSpy = jasmine.createSpyObj('Meta', ['updateTag', 'removeTag']);
    const titleSpy = jasmine.createSpyObj('Title', ['setTitle']);
    const mockDocument = {
      head: {
        appendChild: jasmine.createSpy('appendChild'),
        querySelector: jasmine.createSpy('querySelector').and.returnValue(null)
      },
      createElement: jasmine.createSpy('createElement').and.returnValue({
        type: '',
        text: '',
        remove: jasmine.createSpy('remove')
      }),
      querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([])
    };

    TestBed.configureTestingModule({
      providers: [
        SEOService,
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });

    service = TestBed.inject(SEOService);
    metaService = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    document = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateSEO', () => {
    it('should update title when provided', () => {
      const seoData: SEOData = {
        title: 'Test Page'
      };

      service.updateSEO(seoData);

      expect(titleService.setTitle).toHaveBeenCalledWith('Test Page | Mahlatji Mmetji Group');
    });

    it('should update meta description when provided', () => {
      const seoData: SEOData = {
        description: 'Test description'
      };

      service.updateSEO(seoData);

      expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Test description' });
    });

    it('should update Open Graph meta tags', () => {
      const seoData: SEOData = {
        title: 'Test Page',
        description: 'Test description',
        image: 'test-image.jpg',
        url: 'https://example.com/test'
      };

      service.updateSEO(seoData);

      expect(metaService.updateTag).toHaveBeenCalledWith({ property: 'og:title', content: 'Test Page' });
      expect(metaService.updateTag).toHaveBeenCalledWith({ property: 'og:description', content: 'Test description' });
      expect(metaService.updateTag).toHaveBeenCalledWith({ property: 'og:image', content: 'test-image.jpg' });
      expect(metaService.updateTag).toHaveBeenCalledWith({ property: 'og:url', content: 'https://example.com/test' });
    });

    it('should update Twitter Card meta tags', () => {
      const seoData: SEOData = {
        title: 'Test Page',
        description: 'Test description'
      };

      service.updateSEO(seoData);

      expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'twitter:card', content: 'summary_large_image' });
      expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'twitter:title', content: 'Test Page' });
      expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'twitter:description', content: 'Test description' });
    });
  });

  describe('generateStructuredData', () => {
    it('should generate Organization structured data', () => {
      const data = { name: 'Test Organization' };
      
      service.generateStructuredData('Organization', data);

      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(document.head.appendChild).toHaveBeenCalled();
    });

    it('should generate Article structured data', () => {
      const data = {
        title: 'Test Article',
        description: 'Test description',
        publishDate: '2025-01-01'
      };
      
      service.generateStructuredData('Article', data);

      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(document.head.appendChild).toHaveBeenCalled();
    });

    it('should remove existing structured data before adding new', () => {
      const existingScript = { remove: jasmine.createSpy('remove') };
      document.head.querySelector = jasmine.createSpy('querySelector').and.returnValue(existingScript);
      
      service.generateStructuredData('Organization', {});

      expect(existingScript.remove).toHaveBeenCalled();
    });
  });

  describe('clearSEO', () => {
    it('should remove all SEO meta tags', () => {
      service.clearSEO();

      expect(metaService.removeTag).toHaveBeenCalledWith('property="og:title"');
      expect(metaService.removeTag).toHaveBeenCalledWith('property="og:description"');
      expect(metaService.removeTag).toHaveBeenCalledWith('name="twitter:card"');
      expect(metaService.removeTag).toHaveBeenCalledWith('name="twitter:title"');
    });

    it('should remove structured data scripts', () => {
      const mockScript = { remove: jasmine.createSpy('remove') };
      document.querySelectorAll = jasmine.createSpy('querySelectorAll').and.returnValue([mockScript]);
      
      service.clearSEO();

      expect(mockScript.remove).toHaveBeenCalled();
    });
  });
});
