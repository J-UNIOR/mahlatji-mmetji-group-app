import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-clean.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent {
  constructor() {}
}
