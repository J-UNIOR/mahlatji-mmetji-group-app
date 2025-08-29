import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent {
  projects = [
    {
      id: 1,
      title: 'Building and Painting of House – Thorbrook Estate',
      category: 'Construction & Electrical',
      description: 'Construction and painting of a residential house in Thorbrook Estate, delivering high-quality finishes and estate-compliant standards.',
      image: '/assets/images/9.png',
      year: '2024',
      status: 'Ongoing',
      duration: 'N/A',
      features: ['Residential Construction', 'Painting & Finishes', 'Estate Housing Project'],
      client: 'Private Client – Thorbrook Estate',
      contactPerson: 'N/A',
      contactNumber: 'N/A'
    },
    {
      id: 2,
      title: 'Rudev Management Consultants (Pty) Ltd',
      category: 'Accounting Services',
      description: 'Provision of accounting services contract over 3 years.',
      image: '/assets/images/5.png',
      year: '2024',
      status: 'Ongoing',
      duration: '36 months',
      features: ['Accounting Services', 'Financial Reporting', 'Tax Compliance'],
      client: 'Rudev Management Consultants',
      contactPerson: 'Aaron Mangoato',
      contactNumber: '013 658 60296'
    },
    {
      id: 3,
      title: 'ABM College SA',
      category: 'Accounting Services',
      description: 'Provision of accounting service contract over 3 years.',
      image: '/assets/images/6.png',
      year: '2024',
      status: 'Ongoing',
      duration: '36 months',
      features: ['Accounting Services', 'Financial Reporting', 'Tax Compliance'],
      client: 'ABM College SA',
      contactPerson: 'Donald Mohlamonyane',
      contactNumber: '013 301 0925'
    },
    {
      id: 4,
      title: 'Public Protector South Africa (PPSA)',
      category: 'Cleaning & Security',
      description: 'Provision of cleaning services, including deep cleaning, hygiene and pest control in Limpopo over 36 months.',
      image: '/assets/images/Public-Protector.jpeg',
      year: '2024',
      status: 'Ongoing',
      duration: '36 months',
      features: ['Deep Cleaning', 'Hygiene Services', 'Pest Control'],
      client: 'Public Protector South Africa (PPSA)',
      contactPerson: 'Mr. Karabo Masilo',
      contactNumber: '012 366 7079'
    },
    {
      id: 5,
      title: 'Construction of Various Roads & Stormwater in Impumelelo Ext 02 (Phase 2), Devon',
      category: 'Construction & Electrical',
      description: 'Roads and stormwater infrastructure construction project in Impumelelo Ext 02 (Phase 2), Devon.',
      image: '/assets/images/8.png',
      year: '2024',
      status: 'Completed',
      duration: 'N/A',
      features: ['Road Construction', 'Stormwater Infrastructure'],
      client: 'Lesedi Local Municipality',
      contactPerson: "Mr. S'busiso Ndlamini",
      contactNumber: 'N/A'
    },
    {
      id: 6,
      title: 'Eskom Sol Power Station',
      category: 'Cleaning & Security',
      description: 'Provision of armed and unarmed guarding services for Eskom Sol Power Station over 36 months.',
      image: '/assets/images/Sol-Sec.jpeg',
      year: '2024',
      status: 'Ongoing',
      duration: '36 months',
      features: ['Armed Guarding', 'Unarmed Guarding', 'Power Station Security'],
      client: 'Eskom Sol Power Station',
      contactPerson: 'Sbusiso Manqele',
      contactNumber: '063 622 4945'
    }
  ];

  categories = ['All', 'Construction & Electrical', 'Cleaning & Security', 'Accounting Services'];
  selectedCategory = 'All';

  get filteredProjects() {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }
    return this.projects.filter(project => project.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getCompletedCount() {
    return this.projects.filter(project => project.status === 'Completed').length;
  }

  getOngoingCount() {
    return this.projects.filter(project => project.status === 'Ongoing').length;
  }
}
