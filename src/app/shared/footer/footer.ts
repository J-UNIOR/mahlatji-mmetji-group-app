import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  imports: [CommonModule]
})
export class FooterComponent {
  email = 'info@mahlatjimmetji.co.za';
  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/MahlatjiMmetjiGroup',
      icon: 'fab fa-facebook',
      ariaLabel: 'Visit our Facebook page',
      target: '_blank',
      rel: 'noopener noreferrer'
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
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  ];
}
