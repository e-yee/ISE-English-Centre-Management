---
type: "manual"
description: "Example description"
---
# Hammer Grammar Frontend Documentation

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Application Flow](#application-flow)
- [Component Library](#component-library)
  - [UI Components](#ui-components)
    - [Button](#button)
    - [Card](#card)
    - [Input](#input)
    - [SearchInput](#searchinput)
    - [Label](#label)
  - [Component Hierarchy](#component-hierarchy)
- [Pages](#pages)
  - [AuthPage](#authpage)
    - [LoginForm](#loginform)
    - [ForgotPasswordForm](#forgotpasswordform)
- [Utilities and Hooks](#utilities-and-hooks)
- [Styling Patterns](#styling-patterns)
- [Common Patterns and Compositions](#common-patterns-and-compositions)
- [Development Guidelines](#development-guidelines)

## Introduction

This documentation serves as a comprehensive reference guide for the Hammer Grammar English Centre Management frontend codebase. It aims to document all components, pages, utilities, and patterns used throughout the application to ensure consistency and promote reuse of existing code when implementing new features.

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   │   ├── HeaderIcons/     # Header component SVG icons
│   │   │   ├── bell.svg     # Notification bell icon
│   │   │   ├── frame.svg    # Theme toggle frame
│   │   │   ├── search.svg   # Search icon
│   │   │   └── themeSwitch.svg # Theme toggle switch
│   │   ├── sidebar/         # Sidebar component SVG icons
│   │   │   ├── absent-request.svg # Absence request icon
│   │   │   ├── back-button.svg    # Sidebar toggle button
│   │   │   ├── collegues.svg      # Colleagues icon
│   │   │   ├── daily-report.svg   # Daily report icon
│   │   │   ├── dashboard.svg      # Dashboard icon
│   │   │   ├── expand-arrow.svg   # Expand arrow icon
│   │   │   ├── material.svg       # Materials icon
│   │   │   └── timekeeping.svg    # Timekeeping icon
│   │   └── logo.svg         # Hammer Grammar logo
│   ├── components/          # Reusable components
│   │   ├── ui/              # Base UI components (ShadCN)
│   │   │   ├── button.tsx   # Button component
│   │   │   ├── card.tsx     # Card component
│   │   │   ├── input.tsx    # Input component
│   │   │   ├── label.tsx    # Label component
│   │   │   └── ...          # Other UI components
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx   # Application header with variants
│   │       ├── HeaderExample.tsx # Header demo component
│   │       ├── Sidebar.tsx  # Collapsible navigation sidebar
│   │       ├── Footer.tsx   # Application footer
│   │       └── ...          # Other layout components
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   └── ...              # Other custom hooks
│   ├── lib/                 # Utility functions and helpers
│   │   └── utils.ts         # Utility functions
│   ├── services/            # API service layer
│   │   ├── api.ts           # Base API configuration
│   │   ├── authService.ts   # Authentication service
│   │   └── ...              # Other service modules
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── AuthPage.tsx # Authentication page container
│   │   │   ├── LoginForm.tsx # Login form component
│   │   │   ├── ForgotPasswordForm.tsx # Password recovery form
│   │   │   └── ...          # Other auth-related components
│   │   └── ...              # Other page components
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript configuration
├── tsconfig.node.json       # Node-specific TypeScript configuration
└── package.json             # Project dependencies
```

## Tech Stack

- **React 19**: Latest version of React with improved performance and features
- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: Component library built on Radix UI primitives
- **Lucide React**: Icon library

## Application Flow

The application follows a structured flow for data and user interactions:

### Component ➡️ Custom Hook ➡️ Service ➡️ Backend API

### Current Application Structure

The application currently has two main modes:

1. **Development/Demo Mode** (Current):
   - Uses `HeaderExample` component to demonstrate header and sidebar functionality
   - Allows toggling between default and registered user states
   - Shows both header variants and sidebar integration

2. **Production Mode** (Commented out):
   - Full routing with authentication flows
   - Protected routes and navigation
   - Integration with backend services

**Current App.tsx Structure**:
```tsx
function App() {
  return (
    <div>
      <HeaderExample />
    </div>
  );
}
```

**Production App.tsx Structure** (commented):
```tsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/home" element={<HomePageExample />} />
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

1. **Component Layer**:
   - UI components render the interface and handle user interactions
   - Components use custom hooks to access data and functionality
   - Example: `<LoginForm />` uses `useAuth()` hook to handle authentication

2. **Custom Hook Layer**:
   - Encapsulates complex logic and state management
   - Provides a clean API for components to use
   - Calls service functions to interact with backend
   - Example: `useAuth()` manages authentication state and calls `authService.login()`

3. **Service Layer**:
   - Handles API communication and data transformation
   - Abstracts API endpoints and request/response handling
   - Example: `authService.login()` makes API request to `/api/auth/login`

4. **Backend API**:
   - RESTful or GraphQL endpoints that process requests
   - Returns data that flows back through the service and hook layers to components

**Example Flow**:
```tsx
// Component Layer
function LoginForm() {
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (credentials) => {
    await login(credentials);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}

// Custom Hook Layer
function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      // Handle successful login
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { login, isLoading, error };
}

// Service Layer
const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  }
};
```

This flow ensures:
- Separation of concerns
- Reusable business logic
- Testable code
- Consistent data flow throughout the application

## Component Library

### UI Components

This section documents all UI components in the `/components/ui` directory. Each component includes props, usage examples, and design patterns.

#### Button

Located in `frontend/src/components/ui/button.tsx`

The Button component is a versatile interactive element that supports various styles and sizes.

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `asChild`: boolean - When true, the component will render its children as the root element
- `className`: string - Additional CSS classes
- All standard button HTML attributes

**Variants:**
- `default`: Primary action button with background color
- `destructive`: For destructive actions like delete
- `outline`: Button with border and transparent background
- `secondary`: Less prominent alternative to the default button
- `ghost`: Button without background or border
- `link`: Appears as a link but maintains button functionality

**Sizes:**
- `default`: Standard size (h-9 px-4 py-2)
- `sm`: Small size (h-8 rounded-md gap-1.5 px-3)
- `lg`: Large size (h-10 rounded-md px-6)
- `icon`: Square button for icons (size-9)

**Usage Example:**
```tsx
import { Button } from "@/components/ui/button";

// Default button
<Button>Click me</Button>

// Variant and size
<Button variant="destructive" size="lg">Delete</Button>

// With icon
<Button>
  <PlusIcon />
  Add new
</Button>

// As link
<Button variant="link">Learn more</Button>
```

#### Card

Located in `frontend/src/components/ui/card.tsx`

The Card component provides a container for related content with optional header, footer, and content sections.

**Components:**
- `Card`: The main container
- `CardHeader`: Container for card title and description
- `CardTitle`: Card title element (h3)
- `CardDescription`: Secondary text below the title
- `CardContent`: Main content area
- `CardFooter`: Container for actions at the bottom of the card

**Props:**
- `className`: string - Additional CSS classes
- All standard HTML div attributes

**Usage Example:**
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content of the card</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Input

Located in `frontend/src/components/ui/input.tsx`

The Input component is a customized form input element with consistent styling.

**Props:**
- `type`: string - HTML input type (text, password, email, etc.)
- `className`: string - Additional CSS classes
- All standard HTML input attributes

**Styling:**
- Pill-shaped design with rounded corners
- Black border with white background
- Custom focus states without default browser outline

**Usage Example:**
```tsx
import { Input } from "@/components/ui/input";

// Basic usage
<Input type="text" placeholder="Enter your name" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// Required field
<Input type="text" required />

// Disabled state
<Input type="text" disabled />
```

#### Label

Located in `frontend/src/components/ui/label.tsx`

The Label component is used to create accessible form labels.

**Props:**
- `htmlFor`: string - Associates the label with a form control
- `className`: string - Additional CSS classes
- All standard HTML label attributes

**Usage Example:**
```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input id="username" type="text" />
</div>
```

#### SearchInput

Located in `frontend/src/components/ui/SearchInput.tsx`

The SearchInput component is a specialized input field designed for search functionality with integrated search icon and enhanced styling based on Figma design specifications.

**Props:**
- `onSearch`: function - Callback function triggered when search is performed
- `showIcon`: boolean - Controls visibility of search icon (default: true)
- All standard HTML input attributes

**Styling:**
- Figma-compliant design with 50px border radius
- 4px black border with white background
- Custom shadow effect: `4px 6px 4px 0px rgba(0, 0, 0, 0.25)`
- Rhodium Libre font at 30px size
- Integrated search icon with hover effects

**Usage Example:**
```tsx
import { SearchInput } from "@/components/ui/SearchInput";

// Basic search functionality
<SearchInput onSearch={(value) => performSearch(value)} />

// Without search icon
<SearchInput showIcon={false} onSearch={handleSearch} />

// With custom placeholder and styling
<SearchInput
  placeholder="Search courses..."
  onSearch={handleCourseSearch}
  className="w-96"
/>
```

### Layout Components

This section documents layout components that provide the structural foundation of the application.

#### Header

Located in `frontend/src/components/layout/Header.tsx`

The Header component provides the top navigation bar with support for both default and registered user variants.

**Props:**
- `isRegistered`: boolean (optional, default: false) - Controls whether to show the registered user header variant

**Variants:**

**Default Header:**
- Simple layout with logo and divider
- Used for non-authenticated users
- Minimal design with blue background (#4A5B8C)

**Registered Header:**
- Full-featured header for authenticated users
- Includes interactive elements and navigation tools
- Enhanced blue background (#4F5F9C) matching Figma design

**Features (Registered Variant):**
- **Logo**: Company branding on the left side
- **"How to use?" Link**: Interactive text with hover underline effect, positioned at bottom-left of middle section
- **Search**: Search functionality using custom SVG icon
- **Theme Toggle**: Animated light/dark mode switch with custom SVG assets
- **Notifications**: Bell icon for user notifications
- **User Profile**: Profile access button

**Usage Example:**
```tsx
import Header from "@/components/layout/Header";

// Default header (non-registered users)
<Header />

// Registered user header
<Header isRegistered={true} />
```

**Assets Used:**
- `/src/assets/logo.svg` - Company logo
- `/src/assets/name.svg` - "HAMMER & GRAMMAR" company name
- `/src/assets/header/search.svg` - Search icon
- `/src/assets/header/bell.svg` - Notification bell
- `/src/assets/header/avatar.svg` - User avatar

**Styling:**
- White background with black borders (Figma design compliant)
- Uses Rhodium Libre font (28px) for "How to use?" text
- Scale hover effects (105%) with smooth transitions
- Custom theme toggle switch design
- Responsive layout with flexbox

**Interactive Elements:**
```tsx
// Theme toggle functionality
const [isDarkMode, setIsDarkMode] = useState(false);
const toggleTheme = () => setIsDarkMode(!isDarkMode);

// How to use click handler
const handleHowToUseClick = () => {
  // Add your "How to use?" functionality here
  console.log("How to use clicked");
};
```

**Layout Structure:**
- **Left Section**: Logo only
- **Middle Section**: "How to use?" text positioned at bottom with flex-1 for spacing
- **Right Section**: All interactive icons (search, theme toggle, notifications, profile)

## Sidebar

The Sidebar component provides a collapsible navigation menu for registered users. It features a modern design with smooth animations and hover effects.

### Features

- **Collapsible Design**: Can be expanded or compressed with a toggle button
- **Smooth Animations**: 300ms transitions for all state changes
- **Hover Effects**: Scale animations and enhanced shadows on interactive elements
- **Fixed Positioning**: Positioned to align with the header layout
- **Responsive Icons**: Different icon sizes for expanded/compressed states

### Component Structure

**File Location**: `/src/components/layout/Sidebar.tsx`

**Props Interface**:
```tsx
interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  url: string;
}
```

**State Management**:
```tsx
const [isExpanded, setIsExpanded] = useState(true);
const [activeItem, setActiveItem] = useState("dashboard");
```

### Menu Items

The sidebar includes six main navigation items:

1. **Dashboard** - Main overview page
2. **Absence Request** - Employee absence management
3. **Timekeeping** - Time tracking and attendance
4. **Colleagues** - Staff directory and management
5. **Daily Report** - Daily activity reports
6. **Materials** - Educational materials and resources

### Assets Used

All sidebar icons are located in `/src/assets/sidebar/`:
- `dashboard.svg` - Dashboard icon (teal background)
- `absent-request.svg` - Absence request icon (orange background)
- `timekeeping.svg` - Timekeeping icon (green background)
- `collegues.svg` - Colleagues icon (cyan background)
- `daily-report.svg` - Daily report icon (yellow background)
- `material.svg` - Materials icon (pink background)
- `back-button.svg` - Toggle button with arrow
- `expand-arrow.svg` - Additional arrow icon

### Styling and Layout

**Expanded State** (295px width, 700px height):
- Shows "FEATURES" title at the top
- Back button positioned at top-right
- Full menu items with icons and labels
- Proper spacing between items

**Compressed State** (80px width, 430px height):
- Hides "FEATURES" title
- Back button centered at top
- Icons only, no labels
- Compact vertical layout

**Visual Design**:
- White background with black borders
- Rounded corners (30px radius on right side)
- Drop shadows for depth
- Rhodium Libre font for text
- Hover effects with scale and shadow enhancement

### Integration

The sidebar is conditionally rendered based on user registration status:

```tsx
// In HeaderExample.tsx
{isRegistered && <Sidebar />}
```

**Positioning**:
- Fixed positioning at `left-0 top-35`
- Z-index of 50 to appear above other content
- Aligns with header layout

### Interactive Behavior

**Toggle Functionality**:
- Click back button to expand/collapse
- Smooth 300ms transition animations
- Button rotates 180° when compressed

**Menu Item Interactions**:
- Hover effects with scale (105%) and enhanced shadows
- Active state indicated by stronger shadow
- Click handlers for navigation (currently console.log)

**Accessibility**:
- Proper ARIA labels for toggle button
- Alt text for all images
- Keyboard navigation support

### Component Hierarchy

This section outlines the relationships between components and how they are composed to create more complex UI elements.

**Layout Components**:
- **Header**: Main application header with two variants (default/registered)
- **Sidebar**: Collapsible navigation menu (only for registered users)
- **Footer**: Application footer
- **HeaderExample**: Demo component showcasing header and sidebar integration

**Layout Composition**:
```tsx
// Main layout structure
<div className="min-h-screen">
  <Header isRegistered={isRegistered} />
  {isRegistered && <Sidebar />}
  <main>{/* Page content */}</main>
  <Footer />
</div>
```

**Form Components**:
  - `Input`: Text input field
  - `SearchInput`: Specialized search input with integrated icon
  - `Label`: Form label
  - Form compositions: Label + Input combinations

- **Container Components**: 
  - `Card`: Container for related content
  - Card compositions: CardHeader + CardContent + CardFooter

- **Interactive Components**:
  - `Button`: Interactive element for user actions

- **Layout Components**:
  - `Header`: Application header with variant support (default/registered)
  - Header compositions: Logo + Navigation + Interactive elements

## Pages

This section lists all implemented pages with their routes and main functionality.

### AuthPage

Located in `frontend/src/pages/auth/AuthPage.tsx`

**Route**: `/auth` (assumed)
**Functionality**: Handles user authentication including login and forgot password functionality.
**Key Components**:
- `Header`: Application header component (uses default variant for non-authenticated users)
- `Footer`: Page footer with links
- State management for toggling between login and forgot password views

**State Management**:
```tsx
const [currentView, setCurrentView] = useState<"login" | "forgot">("login");
```

**Component Structure**:
```tsx
<div className="flex flex-col min-h-screen bg-gray-100">
  <Header />
  <main className="flex flex-grow items-center justify-center p-4">
    {currentView === "login" ? (
      <LoginForm onForgotPassword={() => setCurrentView("forgot")} />
    ) : (
      <ForgotPasswordForm onBackToLogin={() => setCurrentView("login")} />
    )}
  </main>
  <Footer />
</div>
```

#### LoginForm

Located in `frontend/src/pages/auth/LoginForm.tsx`

**Functionality**: Handles user login with username and password.

**Props**:
- `onForgotPassword`: () => void - Function to switch to forgot password view

**State Management**:
```tsx
const [formData, setFormData] = useState({
  username: "",
  password: "",
});
```

**Key Features**:
- Form validation
- Input handling
- Login submission
- Link to forgot password

**UI Components Used**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Input`
- `Button`

**Styling**:
- Custom blue background (`bg-[#B7D5F4]`)
- Black border with rounded corners
- Custom font (`font-['Rhodium_Libre']`)

#### ForgotPasswordForm

Located in `frontend/src/pages/auth/ForgotPasswordForm.tsx`

**Functionality**: Handles password recovery via email.

**Props**:
- `onBackToLogin`: () => void - Function to switch back to login view

**State Management**:
```tsx
const [formData, setFormData] = useState({
  email: "",
});
```

**Key Features**:
- Email input
- Form submission for password recovery
- Back to login link

**UI Components Used**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Input`
- `Button`

**Styling**:
- Matches LoginForm styling for consistency
- Instructional text for user guidance

## Utilities and Hooks

This section catalogs all reusable utility functions, hooks, and helpers.

### Utility Functions

#### `cn` (from `frontend/src/lib/utils.ts`)

A utility function that combines class names using `clsx` and `tailwind-merge` to handle Tailwind class conflicts.

**Usage Example:**
```tsx
import { cn } from "@/lib/utils";

// Combine static and conditional classes
const className = cn(
  "base-class", 
  isActive && "active-class",
  variant === "primary" ? "primary-class" : "secondary-class"
);

// Used in components
<div className={cn("default-class", className)}>Content</div>
```

## Styling Patterns

This section documents how styling is implemented throughout the application using Tailwind CSS.

### Tailwind Configuration

The project uses Tailwind CSS with the New York style preset from ShadCN UI. CSS variables are used for theming with light and dark mode support.

### Theme Variables

The application uses CSS variables for consistent theming:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  /* ... other variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode variables */
}
```

### Common Style Patterns

- **Custom UI Components**: The application uses customized ShadCN UI components with specific styling for the Hammer Grammar brand
- **Rounded Corners**: Pill-shaped inputs with `rounded-full` and buttons with custom rounded corners
- **Border Styling**: Heavy use of black borders (border-2 border-black) for a distinctive look
- **Brand Colors**: Custom color palette including `#B7D5F4` (light blue) and `#7181DD` (accent blue)

### ShadCN UI Customization

ShadCN UI components are customized using:
- Tailwind CSS classes
- CSS variables for theming
- Class Variance Authority (CVA) for component variants

## Common Patterns and Compositions

This section identifies common patterns and component compositions used throughout the codebase.

### Form Patterns

The application uses a consistent pattern for forms:

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-4">
    <Input 
      id="fieldName" 
      type="text" 
      placeholder="Placeholder"
      value={formData.fieldName}
      onChange={(e) => handleInputChange("fieldName", e.target.value)}
      className="..." // Custom styling
      required
    />
    {/* Additional form fields */}
  </div>
  <div className="flex items-center justify-between pt-4">
    <Button variant="link" type="button" onClick={onSecondaryAction}>
      Secondary Action
    </Button>
    <Button type="submit" className="...">
      Primary Action
    </Button>
  </div>
</form>
```

### Card Patterns

Cards are used for containing form elements and other content:

```tsx
<Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px] shadow-lg font-['Rhodium_Libre']">
  <CardHeader className="text-center pb-2">
    <CardTitle className="text-[57px] font-normal text-[#121212] leading-tight">
      HAMMER & GRAMMAR
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-4 px-8 pb-8">
    {/* Card content */}
  </CardContent>
</Card>
```

## Development Guidelines

### Adding New Components

1. Check if a similar component already exists before creating a new one
2. Follow the established naming conventions and file structure
3. Document the component in this guide, including props and usage examples
4. Add appropriate TypeScript types for all props

### Styling Guidelines

1. Use Tailwind utility classes for styling
2. Avoid inline styles
3. Use the `cn` utility function to combine class names
4. Follow the established color scheme and design system
5. Maintain consistency with existing UI components

### Best Practices

1. Use TypeScript for type safety
2. Follow React best practices (hooks, functional components)
3. Keep components small and focused on a single responsibility
4. Use composition over inheritance
5. Implement proper error handling and loading states

