# Frontend Codebase Documentation
## Hammer Grammar English Centre Management System

### Overview
This document provides comprehensive documentation of the frontend codebase for LLM-assisted code refactoring. It catalogs all components, hooks, utilities, and their relationships to enable efficient refactoring while maintaining architectural consistency.

## Architecture Overview

### Tech Stack
- **React 19**: Latest version with improved performance
- **TypeScript**: Mandatory for type safety
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: Component library (New York style)
- **Lucide React**: Icon library

### Data Flow Pattern (MANDATORY)
```
Component ➡️ Custom Hook ➡️ Service ➡️ Backend API
```

### Folder Structure
```
frontend/
├── src/
│   ├── assets/              # SVG icons and images
│   │   ├── HeaderIcons/     # Header component icons
│   │   ├── sidebar/         # Sidebar navigation icons
│   │   ├── status/          # Class status icons
│   │   └── class/           # Class-specific icons
│   ├── components/          # Reusable components
│   │   ├── ui/              # Base ShadCN UI components
│   │   ├── layout/          # Layout components
│   │   ├── auth/            # Authentication forms
│   │   └── class/           # Class-related components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── services/            # API service layer
│   ├── pages/               # Page components
│   ├── mockData/            # Mock data for development
│   └── routes/              # Routing configuration
```

## Component Catalog

### Base UI Components (ShadCN)
**Location**: `/src/components/ui/`

#### Button (`button.tsx`)
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default (h-9), sm (h-8), lg (h-10), icon (size-9)
- **Usage**: Primary interactive elements
- **Styling**: CVA-based variants with Tailwind classes

#### Card Components (`card.tsx`)
- **Components**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Usage**: Container for related content with structured sections
- **Styling**: Rounded borders, shadow effects, flexible layout

#### Input (`input.tsx`)
- **Features**: Pill-shaped design, black borders, white background
- **Styling**: `rounded-full border-2 border-black bg-white`
- **Focus**: Custom focus states without default browser outline

#### Label (`label.tsx`)
- **Usage**: Accessible form labels using Radix UI primitives
- **Features**: Peer-disabled states, proper accessibility

#### SearchInput (`SearchInput.tsx`)
- **Features**: Integrated search icon, Figma-compliant design
- **Styling**: 50px border radius, 4px black border, custom shadow
- **Props**: `onSearch`, `showIcon`, extends HTMLInputElement
- **Font**: Rhodium Libre (30px)

### Layout Components
**Location**: `/src/components/layout/`

#### Header (`Header.tsx`)
- **Variants**: Default (logo + company name) and Registered (full features)
- **Props**: `isRegistered?: boolean`
- **Features**: Custom theme toggle, notifications, user avatar, search
- **Design**: White background, Figma compliant, scale hover effects
- **Assets**: Uses header/ folder assets and name.svg

#### Sidebar (`Sidebar.tsx`)
- **States**: Expanded (295px) / Compressed (80px)
- **Items**: 6 navigation items with colored icons
- **Features**: Smooth animations (300ms), hover effects
- **Context**: Uses useSidebar hook for state management

#### ClassList (`ClassList.tsx`)
- **Features**: Scrollable list with custom scrollbar
- **Styling**: White background, inset shadow, responsive padding
- **Integration**: Syncs with sidebar state for responsive layout

#### StudentList (`StudentList.tsx`)
- **Features**: Similar to ClassList but for student tabs
- **Styling**: Matches ClassList design patterns
- **Components**: Uses StudentTab components

#### FeatureBar (`FeatureBar.tsx`)
- **Features**: 5 feature icons, responsive sizing
- **Layout**: Expands like ClassList, aligns with sidebar
- **Styling**: White background, black borders, no shadows

### Class Components
**Location**: `/src/components/class/`

#### Class (`Class.tsx`)
- **Features**: Class card with status icons, progress bar
- **Layout**: Number bullet, name, dates, status, room/time
- **Styling**: Light blue background (#C2E8FA), rounded corners
- **Status**: Uses assets/status/ icons

#### StudentTab (`StudentTab.tsx`)
- **Features**: Expandable student information
- **Layout**: Index, name, ID with vertical alignment
- **Animation**: Top-to-bottom slide for StudentInfo

#### StudentInfo (`StudentInfo.tsx`)
- **Features**: 5 attributes in 2-column layout
- **Fields**: Email, phone, DOB (left), presence, note (right)
- **Components**: Uses existing Input components, copy icons

### Authentication Components
**Location**: `/src/components/auth/`

#### LoginForm (`LoginForm.tsx`)
- **Features**: Username/password login
- **Styling**: Consistent with brand design
- **Integration**: Uses useAuthFlow hook

#### ForgotPasswordEmailForm (`ForgotPasswordEmailForm.tsx`)
- **Features**: Email input for password reset
- **Flow**: Step 1 of 3-step forgot password process

#### ForgotPasswordVerifyForm (`ForgotPasswordVerifyForm.tsx`)
- **Features**: Verification code input
- **Flow**: Step 2 of 3-step process

#### ForgotPasswordNewPasswordForm (`ForgotPasswordNewPasswordForm.tsx`)
- **Features**: New password and confirmation
- **Flow**: Step 3 of 3-step process

### Specialized UI Components

#### UserProfile (`UserProfile.tsx`)
- **Features**: Dropdown menu (Profile, Settings, Logout)
- **Styling**: Hover effects with #D9D9D9 background
- **Animation**: 200ms transitions

#### ClassInfo (`ClassInfo.tsx`)
- **Features**: Class name display with student count
- **Layout**: Left-aligned class info, responsive design
- **Styling**: Light blue background, black borders

## Custom Hooks
**Location**: `/src/hooks/`

### useSidebar (from shadcn/ui)
- **Type**: Context-based hook from `@/components/ui/sidebar`
- **State**: `state: "expanded" | "collapsed"`
- **Methods**: `toggleSidebar`, `setOpen`, `setOpenMobile`
- **Provider**: SidebarProvider wraps components

### useAuthFlow (`useAuthFlow.tsx`)
- **Features**: Complete authentication state management
- **State**: AuthState, ForgotPasswordState
- **Methods**: login, logout, forgotPassword flow
- **Integration**: Uses authService, localStorage utilities

## Services
**Location**: `/src/services/`

### authService (`authService.ts`)
- **Methods**: login, logout, refreshToken, forgotPassword flow
- **Integration**: Uses apiClient, localStorage utilities
- **Types**: LoginResponse, RefreshTokenResponse, ApiResponse

## Utilities
**Location**: `/src/lib/`

### utils.ts
- **cn()**: Tailwind class merging with clsx and twMerge
- **Token Management**: getAccessToken, setAccessToken, clearAuthData
- **Authentication**: isAuthenticated, isTokenValid, getUser

### apiClient.ts
- **Features**: Centralized API request handling
- **Integration**: Used by all services

## Mock Data
**Location**: `/src/mockData/`

### classListMock.tsx
- **Interface**: ClassData with status, dates, room info
- **Data**: Sample class data for development

### studentListMock.tsx
- **Interface**: StudentData with ID, name, class association
- **Helpers**: getStudentsByClassId, getFormattedStudentCount

## Styling System

### Global Styles (`index.css`)
- **Theme**: CSS variables for light/dark mode
- **Fonts**: Roboto utility class, Rhodium Libre for branding
- **Scrollbars**: Custom webkit scrollbar styling
- **Colors**: Brand colors (#B7D5F4, #C2E8FA, etc.)

### Design Patterns
- **Cards**: `bg-[#B7D5F4] border-[5px] border-black rounded-[30px]`
- **Inputs**: `rounded-full border-2 border-black`
- **Shadows**: `shadow-[4px_6px_4px_0px_rgba(0,0,0,0.25)]`
- **Animations**: 300ms transitions, hover scale effects

### Responsive Design
- **Sidebar Integration**: Components adjust padding based on sidebar state
- **Breakpoints**: Uses Tailwind responsive utilities
- **Layout**: Flexbox-based responsive layouts

## Asset Organization

### Icons by Category
- **header/**: bell.svg, search.svg, themeSwitch.svg, avatar.svg
- **sidebar/**: dashboard.svg, absent-request.svg, timekeeping.svg, etc.
- **status/**: today.svg, tomorrow.svg, coming_soon.svg, expired.svg
- **class/**: copy.svg, expanded.svg
- **Root assets/**: logo.svg, name.svg (company branding)

### Naming Conventions
- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`)
- **Services**: camelCase with "Service" suffix (e.g., `authService.ts`)
- **Assets**: kebab-case (e.g., `absent-request.svg`)

## Application Modes

### Current Implementation (Demo Mode)
- Uses individual page testing in App.tsx
- HeaderExample component for development
- Commented out production routing

### Production Mode (Commented)
- BrowserRouter with AuthRoutes
- Route protection with authentication guards
- Home page routing after login

## Refactoring Guidelines

### Component Reuse Priority
1. **Always check existing components** before creating new ones
2. **Extend existing components** with props rather than duplicating
3. **Use composition patterns** for complex UI elements
4. **Maintain styling consistency** with established patterns

### State Management
- **Use custom hooks** for business logic
- **Follow data flow pattern** strictly
- **Leverage context** for shared state (sidebar, auth)
- **Keep components pure** and focused on rendering

### Styling Consistency
- **Use cn() utility** for class merging
- **Follow established color palette** and spacing
- **Maintain responsive patterns** across components
- **Use existing animation patterns** (300ms transitions)

### Dependencies
- **Component relationships** are well-defined through props
- **Hook dependencies** follow service layer pattern
- **Asset dependencies** are organized by component usage
- **Breaking changes** require updating dependent components

This documentation serves as the definitive reference for maintaining architectural consistency during refactoring work.

## Page Components
**Location**: `/src/pages/`

### AuthPage (`auth/AuthPage.tsx`)
- **Purpose**: Container for authentication flows
- **Features**: Route-based form rendering, multi-step flows
- **Integration**: Uses useAuthFlow hook, location-based routing

### ExamplePage (`ExamplePage.tsx`)
- **Purpose**: Demo page showing header/sidebar integration
- **Features**: SidebarProvider context, responsive layout
- **Components**: Header, Sidebar, ClassList, FeatureBar

### ClassScreen (`ClassScreen.tsx`)
- **Purpose**: Individual class view with student management
- **Features**: Class info display, student list, feature bar
- **Props**: `classId?: string` for specific class display

### HomescreenPage (`homescreen/Homescreen.tsx`)
- **Purpose**: Main dashboard with class list and filters
- **Features**: Status filtering, search functionality
- **Components**: Header, Sidebar, ClassList, SearchInput

## Routing Structure
**Location**: `/src/routes/`

### AuthRoutes (`AuthRoutes.tsx`)
- **Routes**: /login, /forget-password/* (3 steps)
- **Features**: Multi-step forgot password flow
- **Redirects**: Default to login, catch-all handling

### Current App Structure (`App.tsx`)
- **Mode**: Individual page testing (development)
- **Production**: Commented BrowserRouter implementation
- **Testing**: Direct component rendering for development

## Component Interaction Patterns

### Header-Sidebar Integration
```tsx
const [isRegistered, setIsRegistered] = useState(false);
return (
  <div className="min-h-screen">
    <Header isRegistered={isRegistered} />
    {isRegistered && <Sidebar />}
    <main className={cn(
      "transition-all duration-300",
      isRegistered ? "ml-[295px]" : "ml-0"
    )}>
      {children}
    </main>
  </div>
);
```

### Sidebar State Synchronization
- **Components affected**: ClassList, FeatureBar, StudentList
- **Pattern**: Responsive padding based on `isExpanded` state
- **Animation**: 300ms synchronized transitions

### Form Patterns
```tsx
// Standard form structure
<Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px]">
  <CardHeader>
    <CardTitle className="text-[57px] font-normal text-[#121212]">
      HAMMER & GRAMMAR
    </CardTitle>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input type="text" placeholder="Username" />
        <Input type="password" placeholder="Password" />
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </CardContent>
</Card>
```

## Configuration Files

### ShadCN Configuration (`components.json`)
- **Style**: "new-york"
- **Base Color**: "neutral"
- **CSS Variables**: Enabled
- **Icon Library**: "lucide"
- **Aliases**: Configured for @/components, @/utils, etc.

### TypeScript Configuration
- **Strict Mode**: Enabled
- **Path Mapping**: @ alias for src/
- **JSX**: React JSX transform

### Vite Configuration
- **Plugins**: React, TypeScript
- **Aliases**: @ pointing to src/
- **Build**: Optimized for production

## Development Patterns

### Error Handling
- **Form Validation**: Real-time validation with error states
- **API Errors**: Centralized error handling in services
- **User Feedback**: Loading states and error messages

### Performance Optimizations
- **React.memo**: Used for expensive components
- **useCallback**: For event handlers in hooks
- **Lazy Loading**: Prepared for route-based code splitting

### Accessibility
- **ARIA Labels**: Proper labeling for interactive elements
- **Keyboard Navigation**: Focus management in dropdowns
- **Screen Readers**: Semantic HTML structure

## Testing Considerations

### Component Testing
- **Props Testing**: All component interfaces documented
- **State Testing**: Hook return values and state changes
- **Integration Testing**: Component interaction patterns

### Mock Data Usage
- **Development**: Uses mockData/ for consistent testing
- **API Simulation**: Mock services for offline development
- **Data Validation**: TypeScript interfaces ensure data consistency

## Migration and Refactoring Notes

### Safe Refactoring Practices
1. **Component Dependencies**: Check all imports before modifying
2. **Hook Usage**: Verify all components using custom hooks
3. **Style Changes**: Test responsive behavior across screen sizes
4. **Asset Updates**: Verify all SVG imports and paths

### Breaking Change Indicators
- **Props Interface Changes**: Update all component usages
- **Hook Return Value Changes**: Update all hook consumers
- **Service Method Changes**: Update all service consumers
- **Route Changes**: Update all navigation references

### Recommended Refactoring Order
1. **Utilities and Services**: Foundation layer changes first
2. **Custom Hooks**: Business logic layer updates
3. **Base UI Components**: Design system updates
4. **Layout Components**: Structural changes
5. **Page Components**: Feature-level changes

This comprehensive documentation enables efficient LLM-assisted refactoring while maintaining the established architecture and design patterns.
