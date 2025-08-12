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
      title: 'Sandton City Corporate Complex',
      category: 'Construction & Electrical',
      description: 'Complete construction management and high-voltage electrical installation for a 12-story premium office complex with smart building automation systems.',
      image: '/assets/images/property-01.jpg',
      year: '2024',
      status: 'Completed',
      value: 'R45M',
      duration: '18 months',
      features: ['Smart Building Systems', 'High-Voltage Installation', 'HVAC Integration']
    },
    {
      id: 2,
      title: 'Steyn City Premium Security',
      category: 'Cleaning & Security',
      description: 'Advanced integrated security system with 24/7 monitoring, biometric access control, and comprehensive facility management for luxury residential estate.',
      image: '/assets/images/property-02.jpg',
      year: '2024',
      status: 'Completed',
      value: 'R12M',
      duration: '8 months',
      features: ['Biometric Access', '24/7 Monitoring', 'Drone Surveillance']
    },
    {
      id: 3,
      title: 'Vodacom Campus Facility Management',
      category: 'Cleaning & Security',
      description: 'Comprehensive facility management services including cleaning, landscaping, security, and maintenance for multinational telecommunications headquarters.',
      image: '/assets/images/property-03.jpg',
      year: '2023',
      status: 'Ongoing',
      value: 'R8M/year',
      duration: '5-year contract',
      features: ['Full Facility Management', 'Green Cleaning', 'Integrated Services']
    },
    {
      id: 4,
      title: 'FirstRand Banking Group Audit',
      category: 'Accounting Services',
      description: 'Complete financial audit, risk assessment, and regulatory compliance services for major banking institution with multi-subsidiary structure.',
      image: '/assets/images/property-04.jpg',
      year: '2024',
      status: 'Completed',
      value: 'R6.5M',
      duration: '12 months',
      features: ['Regulatory Compliance', 'Risk Assessment', 'Multi-Entity Audit']
    },
    {
      id: 5,
      title: 'Sasol Industrial Electrical Upgrade',
      category: 'Construction & Electrical',
      description: 'Major electrical infrastructure modernization for petrochemical facility including substation upgrades and industrial automation systems.',
      image: '/assets/images/property-05.jpg',
      year: '2023',
      status: 'Completed',
      value: 'R32M',
      duration: '14 months',
      features: ['Industrial Automation', 'Substation Upgrade', 'Safety Systems']
    },
    {
      id: 6,
      title: 'Shoprite Holdings Financial Services',
      category: 'Accounting Services',
      description: 'Ongoing financial advisory, tax planning, and bookkeeping services for retail giant with 500+ locations across Southern Africa.',
      image: '/assets/images/property-06.jpg',
      year: '2023',
      status: 'Ongoing',
      value: 'R4.2M/year',
      duration: '3-year contract',
      features: ['Multi-Location Accounting', 'Tax Optimization', 'Financial Advisory']
    },
    {
      id: 7,
      title: 'OR Tambo Airport Terminal Security',
      category: 'Cleaning & Security',
      description: 'Advanced security system installation and maintenance for international airport terminal including baggage screening integration.',
      image: '/assets/images/deal-01.jpg',
      year: '2024',
      status: 'Completed',
      value: 'R28M',
      duration: '16 months',
      features: ['Airport Security', 'Baggage Integration', 'Biometric Systems']
    },
    {
      id: 8,
      title: 'Eskom Power Station Maintenance',
      category: 'Construction & Electrical',
      description: 'Specialized electrical maintenance and upgrade services for coal-fired power generation facility including turbine electrical systems.',
      image: '/assets/images/deal-02.jpg',
      year: '2023',
      status: 'Ongoing',
      value: 'R15M/year',
      duration: '10-year contract',
      features: ['Power Generation', 'Turbine Systems', 'Critical Infrastructure']
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
