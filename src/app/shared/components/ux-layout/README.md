# UX Layout Component

The `UxLayoutComponent` is a shared component that manages all global UX enhancement features across the application.

## Features

- **Accessibility Panel**: Global accessibility controls (theme, font size, motion preferences)
- **Scroll-to-Top Button**: Smooth scrolling with haptic feedback
- **Breadcrumb Navigation**: Automatic breadcrumb generation with smart route detection

## Usage

```html
<!-- Basic usage (in app.html) -->
<app-ux-layout></app-ux-layout>

<!-- Custom configuration -->
<app-ux-layout 
  [showBreadcrumb]="true"
  [hideBreadcrumbOnRoutes]="['/', '/home', '/landing']">
</app-ux-layout>
```

## Configuration Options

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showBreadcrumb` | `boolean` | `true` | Controls whether breadcrumbs should be displayed |
| `hideBreadcrumbOnRoutes` | `string[]` | `['/', '/home']` | Array of routes where breadcrumbs should be hidden |

## Smart Route Detection

The component automatically:
- Hides breadcrumbs on the home page (`/` or `/home`)
- Handles query parameters correctly
- Updates breadcrumb visibility on route changes
- Provides flexible configuration for custom routes

## Components Included

### 1. Accessibility Panel
- **Position**: Fixed at top 30% right side
- **Features**: Theme control, font sizing, motion preferences, high contrast
- **Mobile**: Responsive positioning

### 2. Scroll-to-Top Button
- **Position**: Fixed at bottom-right corner
- **Behavior**: Appears after scrolling 300px
- **Features**: Smooth scroll, haptic feedback, accessibility

### 3. Breadcrumb Navigation
- **Position**: Top of page (below header)
- **Behavior**: Auto-generates from URL structure
- **Features**: SEO-friendly, keyboard navigation

## File Structure

```
src/app/shared/components/ux-layout/
└── ux-layout.component.ts
```

## Dependencies

- `AccessibilityPanelComponent`
- `ScrollToTopComponent`
- `BreadcrumbComponent`
- Angular Router

## Example Implementation

The component is designed to be used once in the main app layout:

```typescript
// app.ts
import { UxLayoutComponent } from './shared/components/ux-layout/ux-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, UxLayoutComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-ux-layout></app-ux-layout>
  `
})
export class App { }
```

## Benefits

✅ **Centralized UX Management**: All UX components in one place  
✅ **Clean Architecture**: Separation of concerns  
✅ **Reusable**: Can be used in different layouts if needed  
✅ **Configurable**: Flexible options for different use cases  
✅ **Performance**: Lazy loading and efficient rendering  
