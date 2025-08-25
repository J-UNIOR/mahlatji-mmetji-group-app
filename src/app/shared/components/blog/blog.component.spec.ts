import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with blog posts', () => {
    expect(component.blogPosts).toBeDefined();
    expect(component.blogPosts.length).toBeGreaterThan(0);
  });

  it('should have proper blog post structure', () => {
    const firstPost = component.blogPosts[0];
    
    expect(firstPost).toEqual(jasmine.objectContaining({
      id: jasmine.any(Number),
      title: jasmine.any(String),
      excerpt: jasmine.any(String),
      content: jasmine.any(String),
      author: jasmine.any(String),
      date: jasmine.any(Date),
      category: jasmine.any(String),
      image: jasmine.any(String),
      tags: jasmine.any(Array)
    }));
  });

  it('should have unique blog post IDs', () => {
    const ids = component.blogPosts.map(post => post.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  it('should have valid dates', () => {
    component.blogPosts.forEach(post => {
      expect(post.date).toBeInstanceOf(Date);
      expect(post.date.getTime()).not.toBeNaN();
    });
  });

  it('should have required properties for each post', () => {
    component.blogPosts.forEach(post => {
      expect(post.title).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.author).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.image).toBeTruthy();
      expect(post.tags.length).toBeGreaterThan(0);
    });
  });

  it('should render blog posts in template', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const blogCards = compiled.querySelectorAll('.blog-card');
    
    expect(blogCards.length).toBe(component.blogPosts.length);
  });

  it('should display post titles in template', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const firstTitle = compiled.querySelector('.blog-card h3');
    
    expect(firstTitle.textContent).toBe(component.blogPosts[0].title);
  });

  it('should display post categories', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const firstCategory = compiled.querySelector('.blog-category');
    
    expect(firstCategory.textContent).toBe(component.blogPosts[0].category);
  });

  it('should display post tags', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const tags = compiled.querySelectorAll('.tag');
    
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should have proper image attributes', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const firstImage = compiled.querySelector('.blog-image img');
    
    expect(firstImage.getAttribute('src')).toBe(component.blogPosts[0].image);
    expect(firstImage.getAttribute('alt')).toBe(component.blogPosts[0].title);
    expect(firstImage.getAttribute('loading')).toBe('lazy');
  });

  it('should display read more links', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const readMoreLinks = compiled.querySelectorAll('.read-more');
    
    expect(readMoreLinks.length).toBe(component.blogPosts.length);
  });
});
