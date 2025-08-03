---
type: "always_apply"
---

# Frontend UI/UX Components Reference
## Hammer Grammar English Centre Management System

### Overview
This document catalogs ALL existing UI components, hooks, and patterns. **ALWAYS use existing components instead of creating new ones.** Only create new components if explicitly required and no suitable alternative exists.

## Base UI Components (ShadCN)
**Location**: `/src/components/ui/`

### Button Component
**File**: `button.tsx`
**Usage**: Primary interactive element for user actions

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="secondary">Alternative</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="link">Link Style</Button>

// Sizes
<Button size="default">Standard</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

**Props Interface**:
```tsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
}
```

### Card Components
**File**: `card.tsx`
**Usage**: Container for related content with structured sections

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";

<Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px]">
  <CardHeader className="text-center pb-2">
    <CardTitle className="text-[57px] font-normal text-[#121212]">
      HAMMER & GRAMMAR
    </CardTitle>
    <CardDescription>Subtitle or description</CardDescription>
  </CardHeader>
  <CardContent className="pt-4 px-8 pb-8">
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions or additional info */}
  </CardFooter>
</Card>
```

### Input Component
**File**: `input.tsx`
**Usage**: Form input fields with consistent styling

```tsx
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter value"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="rounded-full border-2 border-black"
  required
/>
```

### SearchInput Component
**File**: `SearchInput.tsx`
**Usage**: Search input field with integrated search icon and enhanced styling

```tsx
import { SearchInput } from "@/components/ui/SearchInput";

// Basic usage
<SearchInput onSearch={(value) => handleSearch(value)} />

// Without search icon
<SearchInput showIcon={false} onSearch={(value) => handleSearch(value)} />

// With custom styling
<SearchInput
  onSearch={(value) => handleSearch(value)}
  className="w-96"
  placeholder="Search for anything..."
/>
```

**Props Interface**:
```tsx
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;  // Callback when search is triggered
  showIcon?: boolean;                  // Show/hide search icon (default: true)
}
```

**Features**:
- **Figma Design Compliant**: Matches exact specifications from design system
- **Search Icon Integration**: Uses existing `/src/assets/HeaderIcons/search.svg`
- **Enhanced Styling**: 50px border radius, 4px black border, custom shadow
- **Rhodium Libre Font**: Consistent with brand typography (30px size)
- **Interactive States**: Hover effects on search icon with scale animation
- **Form Integration**: Supports form submission and search callbacks
- **Accessibility**: Proper ARIA labels and keyboard navigation

**Styling Pattern**: Pill-shaped design with black borders

### UserProfile Component
**File**: `UserProfile.tsx`
**Usage**: Dropdown menu for user profile actions

```tsx
import UserProfile from "@/components/ui/UserProfile";

<UserProfile
  onProfileClick={() => console.log("Profile clicked")}
  onSettingClick={() => console.log("Setting clicked")}
  onLogoutClick={() => console.log("Logout clicked")}
/>
```

**Props Interface**:
```tsx
interface UserProfileProps {
  className?: string;
  onProfileClick?: () => void;
  onSettingClick?: () => void;
  onLogoutClick?: () => void;
}
```

**Features**:
- **Dropdown Menu**: Three options (Profile, Setting, Log out)
- **Hover Effects**: Menu items darken with #D9D9D9 background
- **Smooth Animations**: 200ms transitions for dropdown and hover
- **Click Outside to Close**: Auto-closes when clicking outside
- **Accessibility**: ARIA labels and keyboard support
- **Integration**: Used in Header component for registered users

### Label Component
**File**: `label.tsx`
**Usage**: Accessible form labels

```tsx
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="field-id">Field Label</Label>
  <Input id="field-id" type="text" />
</div>
```

## Layout Components
**Location**: `/src/components/layout/`

### Header Component
**File**: `Header.tsx`
**Usage**: Application header with dual variants

```tsx
import Header from "@/components/layout/Header";

// Default header (non-authenticated users)
<Header />

// Registered user header with full features
<Header isRegistered={true} />
```

**Props Interface**:
```tsx
interface HeaderProps {
  isRegistered?: boolean; // Default: false
}
```

**Features**:
- **Figma Design Compliant**: White background with black borders and text
- **Default Variant**: Logo with company name from name.svg and divider
- **Registered Variant**: Logo, company name, "How to use?" link, search, theme toggle, notifications, avatar
- **Theme Toggle**: Custom switch with rounded design and smooth animation
- **Interactive Elements**: Scale hover effects (105%) with smooth transitions
- **Typography**: Rhodium Libre font (28px) for "How to use?" text

**Assets Used**:
- `/src/assets/logo.svg` - Company logo
- `/src/assets/name.svg` - "HAMMER & GRAMMAR" company name
- `/src/assets/header/search.svg` - Search icon
- `/src/assets/header/bell.svg` - Notification bell
- `/src/assets/header/avatar.svg` - User avatar

### Sidebar Component
**File**: `Sidebar.tsx`
**Usage**: Collapsible navigation menu for registered users

```tsx
import Sidebar from "@/components/layout/Sidebar";

// Conditional rendering based on user status
{isRegistered && <Sidebar />}
```

**Props Interface**:
```tsx
interface SidebarProps {
  className?: string;
}
```

**Features**:
- **Collapsible**: 295px expanded, 80px compressed
- **Six Navigation Items**: Dashboard, Absence Request, Timekeeping, Colleagues, Daily Report, Materials
- **Smooth Animations**: 300ms transitions
- **Hover Effects**: Scale (105%) and enhanced shadows

**Assets Used** (in `/src/assets/sidebar/`):
- `dashboard.svg` - Teal background
- `absent-request.svg` - Orange background
- `timekeeping.svg` - Green background
- `collegues.svg` - Cyan background
- `daily-report.svg` - Yellow background
- `material.svg` - Pink background
- `back-button.svg` - Toggle button
- `expand-arrow.svg` - Arrow icon

### HeaderExample Component
**File**: `HeaderExample.tsx`
**Usage**: Demo component for development mode

```tsx
import HeaderExample from "@/components/layout/HeaderExample";

// Shows header variants and sidebar integration
<HeaderExample />
```

**Features**:
- Toggle between default and registered states
- Demonstrates header and sidebar integration
- Used in development/demo mode

## Page Components
**Location**: `/src/pages/`

### AuthPage
**File**: `/src/pages/auth/AuthPage.tsx`
**Usage**: Container for authentication flows

```tsx
import AuthPage from "@/pages/auth/AuthPage";

// Handles login and forgot password views
<AuthPage />
```

**State Management**:
```tsx
const [currentView, setCurrentView] = useState<"login" | "forgot">("login");
```

### LoginForm
**File**: `/src/pages/auth/LoginForm.tsx`
**Usage**: User login with username and password

```tsx
import LoginForm from "@/pages/auth/LoginForm";

<LoginForm onForgotPassword={() => setCurrentView("forgot")} />
```

**Props Interface**:
```tsx
interface LoginFormProps {
  onForgotPassword: () => void;
}
```

### ForgotPasswordForm
**File**: `/src/pages/auth/ForgotPasswordForm.tsx`
**Usage**: Password recovery via email

```tsx
import ForgotPasswordForm from "@/pages/auth/ForgotPasswordForm";

<ForgotPasswordForm onBackToLogin={() => setCurrentView("login")} />
```

**Props Interface**:
```tsx
interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}
```

### ClassScreen
**File**: `/src/pages/ClassScreen.tsx`
**Usage**: Individual class view with student list

```tsx
import ClassScreen from "@/pages/ClassScreen";

// Class screen for specific class
<ClassScreen classId="CL001" />
```

**Features**:
- Header with registered user variant
- Collapsible sidebar navigation
- Feature bar for class-specific actions
- Class information display (name, dates, student count)
- Scrollable student list with student tabs
- Responsive layout matching homescreen patterns

**Props Interface**:
```tsx
interface ClassScreenProps {
  classId?: string; // Optional prop to specify which class to display
  className?: string;
}
```

## Custom Hooks
**Location**: `/src/hooks/`

### useAuth Hook
**File**: `useAuth.ts`
**Usage**: Authentication state and actions

```tsx
import { useAuth } from "@/hooks/useAuth";

const { user, login, logout, isLoading, error } = useAuth();

// Usage in component
const handleLogin = async (credentials) => {
  await login(credentials);
};
```

**Return Interface**:
```tsx
interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
```

## Utility Functions
**Location**: `/src/lib/utils.ts`

### cn Function
**Usage**: Combine class names with Tailwind merge

```tsx
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" ? "primary-class" : "secondary-class",
  props.className
);
```

## Services
**Location**: `/src/services/`

### authService
**File**: `authService.ts`
**Usage**: Authentication API calls

```tsx
import { authService } from "@/services/authService";

// Login user
const user = await authService.login({ username, password });

// Logout user
await authService.logout();
```

## Common Patterns & Compositions

### Form Pattern
**Standard form structure used throughout the application**:

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-4">
    <Input 
      id="fieldName" 
      type="text" 
      placeholder="Placeholder"
      value={formData.fieldName}
      onChange={(e) => handleInputChange("fieldName", e.target.value)}
      className="rounded-full border-2 border-black bg-white px-4 py-3"
      required
    />
  </div>
  <div className="flex items-center justify-between pt-4">
    <Button variant="link" type="button" onClick={onSecondaryAction}>
      Secondary Action
    </Button>
    <Button type="submit" className="bg-[#7181DD] hover:bg-[#5A6BC7]">
      Primary Action
    </Button>
  </div>
</form>
```

### Card Pattern
**Standard card layout for forms and content**:

```tsx
<Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px] shadow-lg font-['Rhodium_Libre']">
  <CardHeader className="text-center pb-2">
    <CardTitle className="text-[57px] font-normal text-[#121212] leading-tight">
      HAMMER & GRAMMAR
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-4 px-8 pb-8">
    {/* Form or content */}
  </CardContent>
</Card>
```

### Layout Pattern
**Standard application layout**:

```tsx
<div className="min-h-screen">
  <Header isRegistered={isRegistered} />
  {isRegistered && <Sidebar />}
  <main className="flex flex-grow items-center justify-center p-4">
    {/* Page content */}
  </main>
  <Footer />
</div>
```

## Styling Standards

### Brand Colors
- **Primary Blue**: `#4A5B8C` (header default)
- **Enhanced Blue**: `#4F5F9C` (header registered)
- **Light Blue**: `#B7D5F4` (card backgrounds)
- **Accent Blue**: `#7181DD` (buttons)
- **Hover Blue**: `#5A6BC7` (button hover)

### Typography
- **Brand Font**: `font-['Rhodium_Libre']` for titles and branding
- **Body Text**: Default system fonts

### Common Classes
- **Borders**: `border-[5px] border-black` or `border-2 border-black`
- **Rounded Corners**: `rounded-[30px]` for cards, `rounded-full` for inputs
- **Shadows**: `shadow-lg` for depth
- **Spacing**: `space-y-4`, `space-y-6` for consistent vertical spacing

### Hover Effects
- **Scale Animation**: `hover:scale-105` with `transition-transform duration-300`
- **Shadow Enhancement**: Enhanced shadows on hover
- **Color Transitions**: Smooth color changes for interactive elements

## Asset Organization

### Header Icons
**Location**: `/src/assets/HeaderIcons/`
- `bell.svg` - Notification bell
- `frame.svg` - Theme toggle frame
- `search.svg` - Search icon
- `themeSwitch.svg` - Theme toggle switch

### Sidebar Icons
**Location**: `/src/assets/sidebar/`
- Navigation icons with colored backgrounds
- Toggle and arrow icons
- Consistent naming convention

### Logo
**Location**: `/src/assets/logo.svg`
- Company branding element
- Used in header component

## Advanced Patterns & State Management

### Authentication Flow Pattern
**Multi-step authentication with state management**:

```tsx
// Hook for managing auth flow state
const useAuthFlow = () => {
  const [currentStep, setCurrentStep] = useState<'email' | 'verification' | 'final'>('email');
  const [authData, setAuthData] = useState({
    email: '',
    verificationCode: '',
    password: ''
  });

  const nextStep = () => {
    if (currentStep === 'email') setCurrentStep('verification');
    else if (currentStep === 'verification') setCurrentStep('final');
  };

  const prevStep = () => {
    if (currentStep === 'final') setCurrentStep('verification');
    else if (currentStep === 'verification') setCurrentStep('email');
  };

  return { currentStep, authData, setAuthData, nextStep, prevStep };
};
```

### Route Protection Pattern
**Protecting routes based on authentication status**:

```tsx
// AuthGuard component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  return <>{children}</>;
};

// Usage in routing
<Route path="/home" element={
  <AuthGuard>
    <HomePage />
  </AuthGuard>
} />
```

### Theme Management Pattern
**Dark/light mode toggle functionality**:

```tsx
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return { isDarkMode, toggleTheme };
};
```

### Form Validation Pattern
**Comprehensive form validation with error handling**:

```tsx
const useFormValidation = (initialData: any, validationRules: any) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (field: string, value: any) => {
    const rule = validationRules[field];
    if (!rule) return '';

    if (rule.required && !value) return `${field} is required`;
    if (rule.minLength && value.length < rule.minLength) {
      return `${field} must be at least ${rule.minLength} characters`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${field} format is invalid`;
    }

    return '';
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  return { formData, errors, isValid, updateField };
};
```

## Component Interaction Patterns

### Header-Sidebar Integration
**How header and sidebar work together**:

```tsx
// In main layout component
const [isRegistered, setIsRegistered] = useState(false);

return (
  <div className="min-h-screen">
    <Header isRegistered={isRegistered} />
    {isRegistered && <Sidebar />}
    <main className={cn(
      "transition-all duration-300",
      isRegistered ? "ml-[295px]" : "ml-0" // Adjust for sidebar
    )}>
      {children}
    </main>
  </div>
);
```

### Modal/Dialog Pattern
**For future modal implementations**:

```tsx
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

// Modal component structure
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};
```

### Loading States Pattern
**Consistent loading indicators**:

```tsx
const LoadingSpinner = ({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) => (
  <div className={cn(
    "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
    size === 'sm' && "h-4 w-4",
    size === 'default' && "h-8 w-8",
    size === 'lg' && "h-12 w-12"
  )} />
);

// Usage in components
{isLoading ? <LoadingSpinner /> : <ComponentContent />}
```

### Error Boundary Pattern
**Error handling at component level**:

```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2>Something went wrong.</h2>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance Optimization Patterns

### Lazy Loading Components
**For large components or routes**:

```tsx
import { lazy, Suspense } from 'react';

const LazyDashboard = lazy(() => import('./Dashboard'));
const LazyReports = lazy(() => import('./Reports'));

// Usage with loading fallback
<Suspense fallback={<LoadingSpinner size="lg" />}>
  <LazyDashboard />
</Suspense>
```

### Memoization Patterns
**Optimizing re-renders**:

```tsx
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return processLargeDataSet(data);
}, [data]);

// Memoize event handlers
const handleItemClick = useCallback((id: string) => {
  onItemSelect(id);
}, [onItemSelect]);

// Memoize child components
const MemoizedListItem = memo(({ item, onClick }) => (
  <div onClick={() => onClick(item.id)}>
    {item.name}
  </div>
));
```

## Accessibility Patterns

### Keyboard Navigation
**Ensuring keyboard accessibility**:

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
  aria-label="Action button"
>
  Content
</div>
```

### Screen Reader Support
**ARIA labels and semantic HTML**:

```tsx
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/dashboard" aria-current={isActive ? "page" : undefined}>
        Dashboard
      </a>
    </li>
  </ul>
</nav>

<form aria-labelledby="login-title">
  <h2 id="login-title">Login Form</h2>
  <div>
    <Label htmlFor="username">Username</Label>
    <Input
      id="username"
      aria-describedby="username-error"
      aria-invalid={!!errors.username}
    />
    {errors.username && (
      <div id="username-error" role="alert">
        {errors.username}
      </div>
    )}
  </div>
</form>
```

## Testing Patterns

### Component Testing
**Standard testing approach**:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });
  });
});
```

### Hook Testing
**Testing custom hooks**:

```tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('handles login correctly', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ username: 'test', password: 'pass' });
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
});
```

## Layout Positioning & Alignment Reference

### Overview
This section documents the precise positioning, dimensions, and alignment relationships between the main layout components: Header, Sidebar, ClassList, and FeatureBar. Use this reference when adjusting component positions or implementing responsive behavior.

### Component Hierarchy & Z-Index
```
Header (z-10) - Always on top
├── Sidebar (z-50) - Above main content
├── FeatureBar (z-auto) - Normal stacking
└── ClassList (z-auto) - Normal stacking
```

### Header Component Layout
**File**: `Header.tsx`
**Position**: Fixed at top of viewport
**Dimensions**: Full width × 96px height (h-24)

```css
/* Header positioning */
position: fixed (implied by layout)
top: 0
left: 0
right: 0
height: 96px (h-24)
z-index: 10
```

**Internal Layout**:
- **Default Variant**: Logo (left) + Divider
- **Registered Variant**: Logo (left) + "How to use?" (center-left) + Icons (right)

**Key Classes**:
- `bg-[#4A5B8C]` - Background color
- `h-24` - Fixed height (96px)
- `border-b-[1px] border-black` - Bottom border
- `shadow-md` or `shadow-lg` - Drop shadow

### Sidebar Component Layout
**File**: `Sidebar.tsx`
**Position**: Fixed at left edge, below header
**Dimensions**: 295px (expanded) / 80px (compressed) × Variable height

```css
/* Sidebar positioning */
position: fixed
top: 140px (top-35 = 8.75rem = 140px)
left: 0
width: 295px (expanded) / 80px (compressed)
height: 710px (expanded) / 430px (compressed)
z-index: 50
```

**State-Based Dimensions**:
```tsx
// Expanded state
className="w-[295px] h-[710px]"

// Compressed state
className="w-20 h-[430px]"
```

**Key Positioning Classes**:
- `fixed left-0 top-35 z-50` - Fixed positioning
- `transition-all duration-300 ease-in-out` - Smooth animations
- `rounded-[0px_30px_30px_0px]` - Right-side rounded corners (expanded)

**Internal Layout**:
- **Toggle Button**: Positioned at top-right of sidebar
- **Menu Items**: Vertically stacked with spacing
- **Expanded**: `space-y-4 pt-6 pb-4` with `px-4`
- **Compressed**: `space-y-3 pt-2 pb-2` with `px-2`

### Main Content Area Layout
**Container**: Positioned to accommodate header and sidebar
**Responsive Margin**: Adjusts based on sidebar state

```tsx
// Main content positioning
className={cn(
  "transition-all duration-300 ease-in-out",
  isExpanded ? "ml-[295px]" : "ml-20"  // Left margin matches sidebar width
)}
```

**Vertical Positioning**:
- **Top Margin**: Accounts for header height (96px + spacing)
- **Content Flow**: FeatureBar → ClassList (vertical stack)

### FeatureBar Component Layout
**File**: `FeatureBar.tsx`
**Position**: Below header, above ClassList, aligned with ClassList left edge
**Dimensions**: Matches ClassList width × Variable height

```css
/* FeatureBar positioning relative to main content */
margin-top: 24px (pt-6)
margin-bottom: 16px (pb-4)
width: 100% (matches ClassList)
max-width: 1536px (max-w-6xl)
```

**Alignment with ClassList**:
```tsx
// Container alignment
<div className={cn(
  "flex justify-center transition-all duration-300 ease-in-out",
  isExpanded ? "pl-8" : "pl-4"  // Matches ClassList padding
)}>
  <div className="max-w-6xl w-full flex justify-start">
    <FeatureBar />
  </div>
</div>
```

**Internal Layout**:
- **Container**: `bg-white rounded-[30px] border-2 border-black`
- **Content Padding**: Matches ClassList padding logic
  - Expanded: `p-6` (24px all sides)
  - Compressed: `p-4` (16px all sides)
- **Icon Distribution**: `justify-between` across full width
- **Icon Dimensions**: `w-[120px] h-[120px]` per icon

### ClassList Component Layout
**File**: `ClassList.tsx`
**Position**: Below FeatureBar, main content area
**Dimensions**: Full available width × Variable height (scrollable)

```css
/* ClassList positioning */
width: 100%
max-width: 1536px (max-w-6xl)
margin: 0 auto (mx-auto)
```

**Responsive Padding**:
```tsx
// Padding adjusts with sidebar state
className={cn(
  isExpanded ? 'p-6' : 'p-4',  // 24px vs 16px padding
)}
```

**Container Styling**:
- `bg-white` - White background
- `shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]` - Inset shadow
- `transition-all duration-300 ease-in-out` - Smooth transitions

**Scrolling Behavior**:
- **Custom Scrollbar**: `.custom-scrollbar` class applied
- **Scroll Track**: `border: 3px solid #C2E8FA`
- **Scroll Thumb**: Custom styling for visual consistency

### Class Component Layout (Redesigned with shadcn/ui Card)
**File**: `Class.tsx`
**Position**: Individual class cards within ClassList
**Design**: Card-based layout with new icon integration

```tsx
// New Card-based structure
<Card className="class-card-container bg-white border border-gray-200 shadow-sm hover:shadow-md">
  <CardContent className="p-4">
    {/* Top Row: Class Name (left), Status (center), Room/Time (right) */}
    {/* Dates Row: Start/End dates with calendar icons */}
    {/* Progress Row: Progress bar with chevron right navigation */}
  </CardContent>
</Card>
```

**Layout Structure**:
```
┌─────────────────────────────────────────────────┐
│ 1. Class 1A    [Today Status]    Room: I72      │
│ Start: 20/06/25                   Time: 17:00   │
│ End: 20/08/25                                >> │
│ ████████████████░░░░░░░░ Progress 60%           │
└─────────────────────────────────────────────────┘
```

**Key Features**:
- **shadcn/ui Card**: White background, 15px border radius, subtle shadows
- **New Icons**: Calendar, map pin, clock, chevron right from `/assets/class/`
- **Responsive Padding**: Adjusts based on sidebar state (p-4 expanded, p-3 compressed)
- **Hover Effects**: Enhanced shadow on hover with smooth transitions
- **Status Integration**: Maintains existing status icon system
- **Progress Bar**: White background with gray border (hard-coded for now)

**Icon Assets Used**:
- `calendar.svg` - For start/end dates
- `map-pin.svg` - For room location
- `clock.svg` - For time display
- `chevron-right.svg` - For navigation indicator

**Styling Classes**:
- `class-card-container` - Main card wrapper
- `text-3xl font-bold` - Class name typography
- `w-32 h-10` - Status icon dimensions
- `w-4 h-4` - Small icon dimensions (calendar, map pin, clock)
- `w-5 h-5` - Chevron right icon

### SearchInput Component (Updated Styling)
**File**: `SearchInput.tsx`
**Updates**: Border radius and placeholder text changes for Figma compliance

**Key Changes**:
```tsx
// Updated border radius from 50px to 10px
className="rounded-[10px]"  // Changed from rounded-[50px]

// Updated placeholder text
placeholder="Search classes"  // Changed from "Search..."
```

**Maintained Features**:
- 4px black border
- Rhodium Libre font (30px)
- Shadow effects
- Search icon integration
- Responsive behavior with sidebar

### Status Filter Buttons (Redesigned)
**File**: `Homescreen.tsx`
**Updates**: Removed container styling, added hover effects

**New Hover Behavior**:
```css
/* Default State */
background: transparent;
color: black;

/* Hover State */
background: black;
color: white;
transition: all 0.2s ease-in-out;
```

**Key Changes**:
- Removed border and background containers
- Show only button content (icons + dropdown arrow)
- Black background with white text on hover
- Smooth transition animations
- Applied to both main button and dropdown items

### Separator Components Integration
**File**: `separator.tsx` (shadcn/ui)
**Usage**: Visual hierarchy between layout sections

**Implementation Locations**:
```tsx
// Header-to-Content separation
<Header />
<Separator className="bg-gray-200" />

// Filter-to-ClassList separation
<div className="filter-controls">...</div>
<Separator className="my-4 bg-gray-100" />
<ClassList />
```

**Benefits**:
- Consistent visual hierarchy
- Radix UI accessibility features
- Customizable styling with className
- Horizontal/vertical orientations

### Responsive Alignment System

#### Sidebar State Synchronization
All components respond to sidebar expansion/compression:

```tsx
// Shared responsive pattern
const { isExpanded } = useSidebar();

// Main content margin
isExpanded ? "ml-[295px]" : "ml-20"

// Component padding
isExpanded ? "p-6" : "p-4"

// Container spacing
isExpanded ? "pl-8" : "pl-4"
```

#### Vertical Alignment Chain
```
Header (fixed top)
├── 44px gap (top-35 - h-24 = 140px - 96px)
├── Sidebar (starts at 140px from top)
├── Main Content Area (margin-left: sidebar width)
    ├── 24px gap (pt-6)
    ├── FeatureBar (aligned with ClassList left edge)
    ├── 16px gap (pb-4)
    └── ClassList (full width, scrollable)
```

#### Horizontal Alignment Rules
1. **Header**: Full viewport width, no offset
2. **Sidebar**: Fixed left edge, no horizontal offset
3. **Main Content**: Left margin = sidebar width
4. **FeatureBar**: Aligned with ClassList left edge via shared container
5. **ClassList**: Centered with max-width constraint

### Animation & Transition Specifications

#### Sidebar Expansion Animation
```css
transition: all 300ms ease-in-out
```

**Properties that animate**:
- Width: `295px ↔ 80px`
- Height: `710px ↔ 430px`
- Border radius: `rounded-[0px_30px_30px_0px] ↔ none`
- Background: `bg-white border-[5px] ↔ transparent`

#### Content Area Response
```css
transition: all 300ms ease-in-out
```

**Properties that animate**:
- Margin-left: `295px ↔ 80px`
- Padding: `24px ↔ 16px`
- Container spacing adjustments

#### Hover Effects
**Sidebar Items**:
- Scale: `hover:scale-105`
- Shadow: Enhanced shadow on hover
- Duration: `300ms ease-out`

**FeatureBar Icons**:
- Scale: `hover:scale-110`
- Duration: `300ms ease-out`

### Breakpoint Considerations

#### Mobile Responsiveness
While not explicitly implemented, the layout structure supports:
- Sidebar collapse on mobile
- Content reflow without sidebar margin
- Responsive padding adjustments

#### Container Constraints
- **Max Width**: `max-w-6xl` (1536px) for content containers
- **Centering**: `mx-auto` for horizontal centering
- **Full Width**: Components expand to container limits

### Implementation Guidelines

#### When Adjusting Positions
1. **Maintain Alignment**: Ensure FeatureBar and ClassList left edges align
2. **Preserve Transitions**: Keep 300ms duration for consistency
3. **Respect Z-Index**: Header (10) > Sidebar (50) > Content (auto)
4. **Synchronize Padding**: Match responsive padding patterns

#### When Adding New Layout Components
1. **Follow Margin Pattern**: Use sidebar-aware left margins
2. **Implement Transitions**: Add 300ms ease-in-out animations
3. **Align with Existing**: Use shared container patterns
4. **Test Responsiveness**: Verify behavior in both sidebar states

#### Common Positioning Utilities
```tsx
// Sidebar-aware margin
const sidebarMargin = isExpanded ? "ml-[295px]" : "ml-20";

// Content padding
const contentPadding = isExpanded ? "p-6" : "p-4";

// Container spacing
const containerSpacing = isExpanded ? "pl-8" : "pl-4";

// Standard transition
const transition = "transition-all duration-300 ease-in-out";
```

## Migration Guidelines

### When Adding New Components
1. **Check existing components first** - Always verify if a similar component exists
2. **Follow naming conventions** - Use PascalCase for components, camelCase for hooks
3. **Implement proper TypeScript interfaces** - Define all props and return types
4. **Add to this documentation** - Update this file with new component details
5. **Write tests** - Include unit tests for new components
6. **Follow accessibility guidelines** - Ensure ARIA labels and keyboard navigation

### When Modifying Existing Components
1. **Maintain backward compatibility** - Don't break existing usage
2. **Update documentation** - Reflect changes in this file
3. **Test thoroughly** - Ensure all existing functionality still works
4. **Consider performance impact** - Profile changes for performance regressions
