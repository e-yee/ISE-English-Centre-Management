---
type: "always_apply"
description: "Example description"
---
# Frontend Product Requirements Document (PRD)
## Hammer Grammar English Centre Management System

### Project Overview

The Hammer Grammar English Centre Management System is a comprehensive web application designed to manage educational operations for an English language center. The frontend provides an intuitive interface for staff and administrators to handle various aspects of center management.

### Tech Stack Requirements

- **React 19**: Latest version with improved performance and features
- **TypeScript**: Mandatory for type safety and developer experience
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **ShadCN UI**: Component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography

### Application Architecture

#### Data Flow Pattern
The application MUST follow this strict data flow pattern:
```
Component ➡️ Custom Hook ➡️ Service ➡️ Backend API
```

#### Application Modes
1. **Development/Demo Mode** (Current Implementation):
   - Uses `HeaderExample` component for demonstration
   - Allows toggling between user states
   - Shows header variants and sidebar integration

2. **Production Mode** (Future Implementation):
   - Full routing with authentication flows
   - Protected routes and navigation
   - Backend service integration

### Core Features & Requirements

#### Authentication System
- **Multi-step Authentication Flow**: Email → Verification Code → Final Step
- **Route Protection**: Prevent unauthorized access to protected pages
- **State Management**: Maintain authentication state across application
- **Form Validation**: Comprehensive validation for all auth forms

#### Header Component Requirements
- **Dual Variants**: Default (non-authenticated) and Registered (authenticated) users
- **Interactive Elements**: Search, theme toggle, notifications, user profile
- **Responsive Design**: Must work across all device sizes
- **Brand Consistency**: Hammer Grammar branding and color scheme

#### Search Functionality Requirements
- **SearchInput Component**: Dedicated search input field with integrated search icon
- **Figma Design Compliance**: Exact implementation of design specifications
  - 50px border radius for pill-shaped design
  - 4px black border with white background
  - Custom shadow effect: `4px 6px 4px 0px rgba(0, 0, 0, 0.25)`
  - Rhodium Libre font at 30px size
- **Interactive Features**:
  - Search icon integration using existing `/src/assets/HeaderIcons/search.svg`
  - Hover effects with scale animation on search icon
  - Form submission support with Enter key
  - Real-time search callback functionality
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Customization**: Optional icon visibility, custom placeholder text, styling overrides

#### Sidebar Navigation Requirements
- **Collapsible Design**: 295px expanded, 80px compressed
- **Six Navigation Items**: Dashboard, Absence Request, Timekeeping, Colleagues, Daily Report, Materials
- **Smooth Animations**: 300ms transitions for all state changes
- **Hover Effects**: Scale animations and enhanced shadows
- **Conditional Rendering**: Only visible for registered users

#### UI/UX Requirements
- **Design System**: Consistent use of ShadCN UI components
- **Color Scheme**: Custom blue palette (#4A5B8C, #4F5F9C, #B7D5F4, #7181DD)
- **Typography**: Rhodium Libre font for branding elements
- **Interactive Feedback**: Hover effects, loading states, error handling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Page Structure Requirements

#### Authentication Pages
- **AuthPage**: Container for authentication flows
- **LoginForm**: Username/password authentication
- **ForgotPasswordForm**: Password recovery via email
- **Multi-step Forms**: Support for complex authentication workflows

#### Layout Components
- **Header**: Application header with variant support
- **Sidebar**: Collapsible navigation menu
- **Footer**: Application footer with links
- **HeaderExample**: Demo component for development

### Form Patterns & Validation
- **Consistent Form Structure**: Standardized layout and spacing
- **Input Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during form submission
- **Error Handling**: User-friendly error messages and recovery

### Asset Management
- **SVG Icons**: Organized in specific folders (HeaderIcons/, sidebar/)
- **Logo Assets**: Company branding elements
- **Consistent Naming**: Clear, descriptive file names

### Performance Requirements
- **Fast Loading**: Optimized bundle sizes and lazy loading
- **Smooth Animations**: 60fps animations and transitions
- **Responsive Design**: Mobile-first approach
- **SEO Optimization**: Proper meta tags and semantic HTML

### Development Standards
- **TypeScript**: All components must be typed
- **Component Documentation**: Props, usage examples, and patterns
- **Code Reusability**: Prefer existing components over creating new ones
- **Testing**: Unit tests for critical functionality
- **Error Boundaries**: Proper error handling and user feedback

### Security Requirements
- **Authentication Guards**: Route protection for authenticated areas
- **Token Management**: Secure storage and handling of auth tokens
- **Input Sanitization**: Prevent XSS and injection attacks
- **HTTPS**: Secure communication with backend services

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

### Accessibility Standards
- **WCAG 2.1 AA**: Compliance with accessibility guidelines
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Sufficient contrast ratios for all text

### Future Considerations
- **Internationalization**: Support for multiple languages
- **Dark Mode**: Complete dark theme implementation
- **Mobile App**: Potential React Native implementation
- **Offline Support**: Progressive Web App capabilities
