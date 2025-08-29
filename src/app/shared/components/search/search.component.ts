import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UXEnhancementService } from '../../services/ux-enhancement.service';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'service' | 'project' | 'page' | 'company';
  url: string;
  category?: string;
  image?: string;
  relevanceScore?: number;
}

export interface SearchFilters {
  type: string;
  category: string;
  sortBy: 'relevance' | 'title' | 'date';
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="search-container" [class.expanded]="isExpanded()">
      <!-- Search Input -->
      <div class="search-input-container">
        <div class="search-input-wrapper">
          <i class="fa fa-search search-icon" aria-hidden="true"></i>
          <input 
            type="text"
            class="search-input"
            placeholder="Search services, projects, or information..."
            [(ngModel)]="searchQuery"
            (input)="onSearchInput($event)"
            (focus)="onFocus()"
            (blur)="onBlur()"
            (keydown)="onKeyDown($event)"
            [attr.aria-label]="'Search ' + placeholder"
            [attr.aria-expanded]="isExpanded()"
            aria-autocomplete="list"
            role="combobox"
            aria-controls="search-listbox">
          
          <button 
            *ngIf="searchQuery" 
            class="clear-btn"
            (click)="clearSearch()"
            aria-label="Clear search"
            type="button">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
          
          <button 
            *ngIf="showFilters" 
            class="filter-btn"
            [class.active]="showFilterPanel()"
            (click)="toggleFilters()"
            aria-label="Toggle search filters"
            type="button">
            <i class="fa fa-filter" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Search Suggestions -->
        <div 
          *ngIf="isExpanded() && suggestions().length > 0" 
          class="search-suggestions"
          role="listbox"
          [attr.aria-label]="'Search suggestions'">
          <div 
            *ngFor="let suggestion of suggestions(); let i = index; trackBy: trackBySuggestion"
            class="suggestion-item"
            [class.highlighted]="selectedSuggestionIndex() === i"
            (click)="selectSuggestion(suggestion)"
            (keyup.enter)="selectSuggestion(suggestion)"
            (mouseenter)="setSelectedSuggestion(i)"
            role="option"
            [attr.aria-selected]="selectedSuggestionIndex() === i"
            tabindex="0">
            <i [class]="getSuggestionIcon(suggestion.type)" aria-hidden="true"></i>
            <span class="suggestion-text">{{ suggestion.title }}</span>
            <span class="suggestion-type">{{ suggestion.type }}</span>
          </div>
        </div>
      </div>

      <!-- Filter Panel -->
      <div 
        *ngIf="showFilters && showFilterPanel()" 
        class="filter-panel"
        [@slideDown]="showFilterPanel()">
        
        <h4>Filter Results</h4>
        
        <div class="filter-group">
          <label for="type-filter">Content Type</label>
          <select 
            id="type-filter" 
            [(ngModel)]="filters.type"
            (change)="applyFilters()"
            class="filter-select">
            <option value="">All Types</option>
            <option value="service">Services</option>
            <option value="project">Projects</option>
            <option value="company">Companies</option>
            <option value="page">Pages</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="category-filter">Category</label>
          <select 
            id="category-filter" 
            [(ngModel)]="filters.category"
            (change)="applyFilters()"
            class="filter-select">
            <option value="">All Categories</option>
            <option value="construction">Construction</option>
            <option value="electrical">Electrical</option>
            <option value="security">Security</option>
            <option value="cleaning">Cleaning</option>
            <option value="accounting">Accounting</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sort-filter">Sort By</label>
          <select 
            id="sort-filter" 
            [(ngModel)]="filters.sortBy"
            (change)="applyFilters()"
            class="filter-select">
            <option value="relevance">Relevance</option>
            <option value="title">Title</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div class="filter-actions">
          <button class="btn-reset" (click)="resetFilters()">Reset</button>
          <button class="btn-apply" (click)="applyFilters()">Apply</button>
        </div>
      </div>

      <!-- Search Results -->
      <div 
        *ngIf="isExpanded() && searchQuery && results().length > 0" 
        class="search-results"
        role="region"
        aria-label="Search results">
        
        <div class="results-header">
          <h4>{{ results().length }} result(s) for "{{ searchQuery }}"</h4>
        </div>

        <div class="results-list">
          <div 
            *ngFor="let result of results(); trackBy: trackByResult"
            class="result-item"
            (click)="selectResult(result)"
            (keydown.enter)="selectResult(result)"
            (keydown.space)="selectResult(result)"
            tabindex="0"
            role="button">
            
            <div class="result-icon">
              <i [class]="getResultIcon(result.type)" aria-hidden="true"></i>
            </div>
            
            <div class="result-content">
              <h5 class="result-title">{{ result.title }}</h5>
              <p class="result-description">{{ result.description }}</p>
              <div class="result-meta">
                <span class="result-type">{{ result.type | titlecase }}</span>
                <span *ngIf="result.category" class="result-category">{{ result.category | titlecase }}</span>
              </div>
            </div>
            
            <div class="result-arrow">
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div 
        *ngIf="isExpanded() && searchQuery && results().length === 0 && !isSearching()" 
        class="no-results">
        <i class="fa fa-search" aria-hidden="true"></i>
        <h4>No results found</h4>
        <p>Try different keywords or check your spelling</p>
        <button class="btn-suggestion" (click)="showSearchTips()">Search Tips</button>
      </div>

      <!-- Loading State -->
      <div 
        *ngIf="isSearching()" 
        class="search-loading">
        <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
        <span>Searching...</span>
      </div>
    </div>

    <!-- Search Overlay -->
    <div 
      *ngIf="isExpanded() && overlay" 
      class="search-overlay"
      (click)="closeSearch()"
      aria-hidden="true">
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
    }

    .search-input-container {
      position: relative;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 25px;
      padding: 0;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .search-input-wrapper:focus-within {
      border-color: #f35525;
      box-shadow: 0 4px 20px rgba(243, 85, 37, 0.2);
    }

    .search-icon {
      position: absolute;
      left: 15px;
      color: #666;
      font-size: 1rem;
      z-index: 2;
    }

    .search-input {
      width: 100%;
      border: none;
      outline: none;
      padding: 15px 50px 15px 45px;
      font-size: 1rem;
      background: transparent;
      border-radius: 25px;
    }

    .clear-btn,
    .filter-btn {
      position: absolute;
      right: 15px;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 5px;
      border-radius: 50%;
      transition: all 0.2s ease;
      z-index: 2;
    }

    .filter-btn {
      right: 45px;
    }

    .clear-btn:hover,
    .filter-btn:hover {
      background: rgba(243, 85, 37, 0.1);
      color: #f35525;
    }

    .filter-btn.active {
      background: #f35525;
      color: white;
    }

    /* Search Suggestions */
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 15px 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      cursor: pointer;
      transition: background 0.2s ease;
      gap: 10px;
    }

    .suggestion-item:hover,
    .suggestion-item.highlighted {
      background: rgba(243, 85, 37, 0.1);
    }

    .suggestion-text {
      flex: 1;
      font-weight: 500;
    }

    .suggestion-type {
      font-size: 0.8rem;
      color: #666;
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 10px;
    }

    /* Filter Panel */
    .filter-panel {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 15px 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 20px;
      z-index: 999;
    }

    .filter-panel h4 {
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      color: #333;
    }

    .filter-group {
      margin-bottom: 15px;
    }

    .filter-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }

    .filter-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .filter-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 15px;
    }

    .btn-reset,
    .btn-apply {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-reset {
      background: #f0f0f0;
      color: #666;
    }

    .btn-apply {
      background: #f35525;
      color: white;
    }

    .btn-reset:hover {
      background: #e0e0e0;
    }

    .btn-apply:hover {
      background: #e64515;
    }

    /* Search Results */
    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 15px 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
    }

    .results-header {
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
      background: #f8f9fa;
    }

    .results-header h4 {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }

    .result-item {
      display: flex;
      align-items: center;
      padding: 15px;
      cursor: pointer;
      transition: background 0.2s ease;
      gap: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .result-item:hover {
      background: rgba(243, 85, 37, 0.05);
    }

    .result-item:last-child {
      border-bottom: none;
    }

    .result-icon {
      width: 40px;
      height: 40px;
      background: rgba(243, 85, 37, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f35525;
      flex-shrink: 0;
    }

    .result-content {
      flex: 1;
    }

    .result-title {
      margin: 0 0 5px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .result-description {
      margin: 0 0 5px 0;
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }

    .result-meta {
      display: flex;
      gap: 10px;
    }

    .result-type,
    .result-category {
      font-size: 0.8rem;
      padding: 2px 6px;
      border-radius: 10px;
      background: #f0f0f0;
      color: #666;
    }

    .result-arrow {
      color: #ccc;
      flex-shrink: 0;
    }

    /* No Results */
    .no-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 15px 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 40px 20px;
      text-align: center;
      z-index: 1000;
    }

    .no-results i {
      font-size: 3rem;
      color: #ddd;
      margin-bottom: 15px;
    }

    .no-results h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .no-results p {
      margin: 0 0 20px 0;
      color: #666;
    }

    .btn-suggestion {
      background: #f35525;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .btn-suggestion:hover {
      background: #e64515;
    }

    /* Loading State */
    .search-loading {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 15px 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 20px;
      text-align: center;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #666;
    }

    /* Search Overlay */
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 998;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .search-container.expanded {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1001;
        background: white;
        padding: 20px;
        max-width: none;
      }

      .search-suggestions,
      .search-results,
      .filter-panel,
      .no-results,
      .search-loading {
        position: static;
        border: none;
        border-radius: 10px;
        margin-top: 10px;
      }

      .filter-actions {
        justify-content: stretch;
      }

      .btn-reset,
      .btn-apply {
        flex: 1;
      }
    }

    /* Dark Theme */
    :host-context(.dark-theme) .search-input-wrapper {
      background: #2d2d2d;
      border-color: #555;
    }

    :host-context(.dark-theme) .search-input {
      color: #fff;
    }

    :host-context(.dark-theme) .search-suggestions,
    :host-context(.dark-theme) .search-results,
    :host-context(.dark-theme) .filter-panel,
    :host-context(.dark-theme) .no-results,
    :host-context(.dark-theme) .search-loading {
      background: #2d2d2d;
      border-color: #555;
    }

    :host-context(.dark-theme) .result-item:hover,
    :host-context(.dark-theme) .suggestion-item:hover {
      background: rgba(102, 187, 106, 0.1);
    }

    /* High Contrast */
    :host-context(.high-contrast) .search-input-wrapper {
      border: 3px solid #000;
    }

    :host-context(.high-contrast) .search-input-wrapper:focus-within {
      border-color: #0066cc;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .search-input-wrapper,
      .suggestion-item,
      .result-item,
      .btn-reset,
      .btn-apply {
        transition: none;
      }
    }
  `]
})
export class SearchComponent {
  @Input() placeholder = 'Search...';
  @Input() showFilters = true;
  @Input() overlay = true;
  @Input() maxResults = 10;

  searchQuery = '';
  private searchData: SearchResult[] = [];
  isExpanded = signal(false);
  isSearching = signal(false);
  showFilterPanel = signal(false);
  selectedSuggestionIndex = signal(-1);
  
  suggestions = signal<SearchResult[]>([]);
  results = signal<SearchResult[]>([]);

  filters: SearchFilters = {
    type: '',
    category: '',
    sortBy: 'relevance'
  };

  uxService = inject(UXEnhancementService);

  constructor() {
    this.initializeSearchData();
  }

  private initializeSearchData(): void {
    // Sample search data - in a real app, this would come from a service
    this.searchData = [
      {
        id: 'construction',
        title: 'Construction Services',
        description: 'Professional construction and building services',
        type: 'service',
        url: '/services/construction',
        category: 'construction'
      },
      {
        id: 'electrical',
        title: 'Electrical Services',
        description: 'Licensed electrical installation and maintenance',
        type: 'service',
        url: '/services/electrical',
        category: 'electrical'
      },
      {
        id: 'security',
        title: 'Security Services',
        description: 'Comprehensive security solutions',
        type: 'service',
        url: '/services/security',
        category: 'security'
      },
      {
        id: 'cleaning',
        title: 'Cleaning Services',
        description: 'Professional cleaning and maintenance',
        type: 'service',
        url: '/services/cleaning',
        category: 'cleaning'
      },
      {
        id: 'accounting',
        title: 'Accounting Services',
        description: 'Financial management and consulting',
        type: 'service',
        url: '/services/accounting',
        category: 'accounting'
      },
      {
        id: 'about',
        title: 'About Us',
        description: 'Learn about Mahlatji Mmetji Group',
        type: 'page',
        url: '/about'
      },
      {
        id: 'contact',
        title: 'Contact Us',
        description: 'Get in touch with our team',
        type: 'page',
        url: '/contact'
      },
      {
        id: 'portfolio',
        title: 'Our Portfolio',
        description: 'View our completed projects',
        type: 'page',
        url: '/projects'
      }
    ];
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    
    if (this.searchQuery.length > 0) {
      this.performSearch();
    } else {
      this.suggestions.set([]);
      this.results.set([]);
    }
  }

  onFocus(): void {
    this.isExpanded.set(true);
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  onBlur(): void {
    // Delay hiding to allow for clicks on suggestions
    setTimeout(() => {
      this.isExpanded.set(false);
      this.showFilterPanel.set(false);
    }, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    const currentSuggestions = this.suggestions();
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentSuggestions.length > 0) {
          const nextIndex = Math.min(this.selectedSuggestionIndex() + 1, currentSuggestions.length - 1);
          this.selectedSuggestionIndex.set(nextIndex);
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (currentSuggestions.length > 0) {
          const prevIndex = Math.max(this.selectedSuggestionIndex() - 1, -1);
          this.selectedSuggestionIndex.set(prevIndex);
        }
        break;
        
      case 'Enter': {
        event.preventDefault();
        const selectedIndex = this.selectedSuggestionIndex();
        if (selectedIndex >= 0 && currentSuggestions[selectedIndex]) {
          this.selectSuggestion(currentSuggestions[selectedIndex]);
        }
        break;
      }
        
      case 'Escape':
        this.closeSearch();
        break;
    }
  }

  private performSearch(): void {
    this.isSearching.set(true);
    this.selectedSuggestionIndex.set(-1);
    
    // Simulate API delay
    setTimeout(() => {
      const query = this.searchQuery.toLowerCase();
      const filtered = this.searchData.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
      
      // Apply filters
      let results = this.applyCurrentFilters(filtered);
      
      // Limit results
      results = results.slice(0, this.maxResults);
      
      // Set suggestions (first 5 results)
      this.suggestions.set(results.slice(0, 5));
      this.results.set(results);
      
      this.isSearching.set(false);
    }, 300);
  }

  private applyCurrentFilters(results: SearchResult[]): SearchResult[] {
    let filtered = [...results];
    
    if (this.filters.type) {
      filtered = filtered.filter(item => item.type === this.filters.type);
    }
    
    if (this.filters.category) {
      filtered = filtered.filter(item => item.category === this.filters.category);
    }
    
    // Sort results
    filtered.sort((a, b) => {
      switch (this.filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          // In a real app, you'd have date fields
          return 0;
        default: // relevance
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      }
    });
    
    return filtered;
  }

  selectSuggestion(suggestion: SearchResult): void {
    this.searchQuery = suggestion.title;
    this.navigateToResult(suggestion);
  }

  selectResult(result: SearchResult): void {
    this.navigateToResult(result);
  }

  private navigateToResult(result: SearchResult): void {
    this.uxService.measureUserInteraction('search-result-selected');
    window.location.href = result.url;
    this.closeSearch();
  }

  setSelectedSuggestion(index: number): void {
    this.selectedSuggestionIndex.set(index);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.suggestions.set([]);
    this.results.set([]);
    this.selectedSuggestionIndex.set(-1);
  }

  closeSearch(): void {
    this.isExpanded.set(false);
    this.showFilterPanel.set(false);
  }

  toggleFilters(): void {
    this.showFilterPanel.update(show => !show);
  }

  applyFilters(): void {
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  resetFilters(): void {
    this.filters = {
      type: '',
      category: '',
      sortBy: 'relevance'
    };
    this.applyFilters();
  }

  showSearchTips(): void {
    this.uxService.showToast(
      'Try using keywords like "construction", "security", "electrical", or "cleaning"',
      'info',
      5000
    );
  }

  getSuggestionIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'service': 'fa fa-cogs',
      'project': 'fa fa-briefcase',
      'page': 'fa fa-file-alt',
      'company': 'fa fa-building'
    };
    return iconMap[type] || 'fa fa-search';
  }

  getResultIcon(type: string): string {
    return this.getSuggestionIcon(type);
  }

  trackBySuggestion(index: number, item: SearchResult): string {
    return item.id;
  }

  trackByResult(index: number, item: SearchResult): string {
    return item.id;
  }
}
