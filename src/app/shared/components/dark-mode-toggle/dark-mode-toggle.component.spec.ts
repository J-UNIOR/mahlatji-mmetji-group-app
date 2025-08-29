import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DarkModeToggleComponent } from './dark-mode-toggle.component';
import { DarkModeService } from '../../services/dark-mode.service';
import { of } from 'rxjs';

describe('DarkModeToggleComponent', () => {
  let component: DarkModeToggleComponent;
  let fixture: ComponentFixture<DarkModeToggleComponent>;
  let mockDarkModeService: jasmine.SpyObj<DarkModeService>;

  beforeEach(async () => {
    const darkModeServiceSpy = jasmine.createSpyObj('DarkModeService', 
      ['toggleTheme'], 
      {
        isDarkMode$: of(false),
        currentThemeMode$: of('light')
      }
    );

    await TestBed.configureTestingModule({
      imports: [DarkModeToggleComponent],
      providers: [
        { provide: DarkModeService, useValue: darkModeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DarkModeToggleComponent);
    component = fixture.componentInstance;
    mockDarkModeService = TestBed.inject(DarkModeService) as jasmine.SpyObj<DarkModeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dark mode state', () => {
    fixture.detectChanges();
    expect(component.isDarkMode).toBe(false);
  });

  it('should toggle theme when clicked', () => {
    component.toggleTheme();
    expect(mockDarkModeService.toggleTheme).toHaveBeenCalled();
  });

  it('should display correct icon for light mode', () => {
    component.isDarkMode = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const moonIcon = compiled.querySelector('.fa-moon');
    const sunIcon = compiled.querySelector('.fa-sun');
    
    expect(moonIcon).toBeTruthy();
    expect(sunIcon).toBeFalsy();
  });

  it('should display correct icon for dark mode', () => {
    component.isDarkMode = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const moonIcon = compiled.querySelector('.fa-moon');
    const sunIcon = compiled.querySelector('.fa-sun');
    
    expect(moonIcon).toBeFalsy();
    expect(sunIcon).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button');
    
    expect(button.getAttribute('aria-label')).toBeTruthy();
    expect(button.getAttribute('title')).toBeTruthy();
  });

  it('should update ARIA label based on mode', () => {
    component.isDarkMode = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button');
    
    expect(button.getAttribute('aria-label')).toContain('dark');
    
    component.isDarkMode = true;
    fixture.detectChanges();
    
    expect(button.getAttribute('aria-label')).toContain('light');
  });

  it('should handle compact mode', () => {
    component.isCompact = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const toggleContainer = compiled.querySelector('.dark-mode-toggle');
    
    expect(toggleContainer.classList.contains('compact')).toBe(true);
  });

  it('should subscribe to dark mode changes', () => {
    const newIsDarkMode$ = of(true);
    Object.defineProperty(mockDarkModeService, 'isDarkMode$', {
      get: () => newIsDarkMode$
    });
    
    component.ngOnInit();
    
    expect(component.isDarkMode).toBe(true);
  });

  it('should unsubscribe on destroy', () => {
    // Call ngOnDestroy and ensure no errors (Subject cleanup)
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should have keyboard support', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button');
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    
    spyOn(component, 'toggleTheme');
    
    button.dispatchEvent(enterEvent);
    button.dispatchEvent(spaceEvent);
    
    expect(component.toggleTheme).toHaveBeenCalledTimes(2);
  });
});
