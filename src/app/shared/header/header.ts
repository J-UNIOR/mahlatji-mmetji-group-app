import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css', './mobile.css'],
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  menuOpen = false;
  dropdownOpen = false;
  private dropdownTimeout: any;
  email = 'info@mahlatjimmetji.co.za';
  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/MahlatjiMmetjiGroup',
      icon: 'fab fa-facebook',
      ariaLabel: 'Visit our Facebook page',
      target: null,
      rel: null
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/MahlatjiMmetji',
      icon: 'fab fa-twitter',
      ariaLabel: 'Visit our Twitter profile',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/mahlatji-mmetji-group',
      icon: 'fab fa-linkedin',
      ariaLabel: 'Visit our LinkedIn page',
      target: null,
      rel: null
    }
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
  }

  openDropdown() {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    this.dropdownOpen = true;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  closeDropdownWithDelay() {
    this.dropdownTimeout = setTimeout(() => {
      this.dropdownOpen = false;
    }, 300);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    if (!dropdown && this.dropdownOpen) {
      this.closeDropdown();
    }
  }
}
