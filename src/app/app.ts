import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';
import { UxLayoutComponent } from './shared/components/ux-layout/ux-layout.component';
import { PWAInstallComponent } from './shared/components/pwa-install/pwa-install.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent,
    UxLayoutComponent,
    PWAInstallComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mahlatji-mmetji-group');
}
