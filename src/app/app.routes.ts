import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/mahlatji-home/home').then(m => m.HomeComponent) },
  { 
    path: 'services', 
    loadComponent: () => import('./pages/mahlatji-services/services').then(m => m.ServicesComponent)
  },
  { 
    path: 'cleaning-security', 
    redirectTo: 'services'
  },
  { 
    path: 'construction-electrical', 
    redirectTo: 'services'
  },
  { 
    path: 'accounting', 
    redirectTo: 'services'
  },
  { path: 'about', loadComponent: () => import('./pages/mahlatji-about/about').then(m => m.AboutComponent) },
  { path: 'projects', loadComponent: () => import('./pages/mahlatji-portfolio/projects').then(m => m.ProjectsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/mahlatji-contact/contact').then(m => m.ContactComponent) },
  
  // Error pages
  { path: 'error/404', loadComponent: () => import('./pages/error-404/error-404.component').then(m => m.Error404Component) },
  { path: 'error/500', loadComponent: () => import('./pages/error-500/error-500.component').then(m => m.Error500Component) },
  
  // Legacy property routes (can be removed if not needed)
  { path: 'properties', redirectTo: 'services' },
  { path: 'property-details/:id', redirectTo: 'services' },
  
  { path: '**', loadComponent: () => import('./pages/error-404/error-404.component').then(m => m.Error404Component) } // Wildcard route for 404s
];
