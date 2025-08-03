# Frontend Quick Reference Guide
## Hammer Grammar English Centre Management System

### Most Commonly Used Components

#### Essential Imports
```tsx
// Base UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/SearchInput";

// Layout Components
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClassList from "@/components/layout/ClassList";

// Hooks
import { useSidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthFlow } from "@/hooks/useAuthFlow";

// Utilities
import { cn } from "@/lib/utils";
```

#### Standard Page Layout
```tsx
function PageComponent() {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Header isRegistered={true} />
        <Sidebar />
        <main className="ml-[295px] transition-all duration-300">
          {/* Page content */}
        </main>
      </div>
    </SidebarProvider>
  );
}
```

#### Form Pattern
```tsx
<Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px]">
  <CardHeader className="text-center pb-2">
    <CardTitle className="text-[57px] font-normal text-[#121212] font-['Rhodium_Libre']">
      HAMMER & GRAMMAR
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-4 px-8 pb-8">
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="text"
        placeholder="Username"
        className="rounded-full border-2 border-black"
        required
      />
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  </CardContent>
</Card>
```

#### Responsive Component with Sidebar
```tsx
function ResponsiveComponent() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn(
      "transition-all duration-300",
      isExpanded ? "p-6" : "p-4"
    )}>
      {/* Content adjusts to sidebar state */}
    </div>
  );
}
```

### Common Styling Patterns

#### Brand Colors
```tsx
// Primary brand blue
"bg-[#B7D5F4]"  // Light blue for cards
"bg-[#C2E8FA]"  // Lighter blue for class components
"bg-[rgba(112,169,255,0.8)]"  // Student tab blue

// Borders and shadows
"border-[5px] border-black"  // Heavy black borders
"shadow-[4px_6px_4px_0px_rgba(0,0,0,0.25)]"  // Standard shadow
"rounded-[30px]"  // Standard border radius
```

#### Typography
```tsx
// Brand font
"font-['Rhodium_Libre']"  // For headings and branding
"font-roboto"  // For body text

// Common sizes
"text-[57px]"  // Large headings
"text-[40px]"  // Component titles
"text-[30px]"  // Search input
"text-[25px]"  // Labels
```

#### Interactive States
```tsx
// Hover effects
"hover:scale-105 transition-transform duration-300"
"hover:opacity-80 transition-opacity"
"hover:bg-[#D9D9D9]"  // Menu item hover

// Focus states
"focus:outline-none focus:border-black focus:ring-0"
```

### Data Flow Examples

#### Authentication Flow
```tsx
function LoginComponent() {
  const { login, isLoading, error } = useAuthFlow();
  
  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      // Navigation handled by hook
    } catch (error) {
      // Error handled by hook
    }
  };
}
```

#### Service Usage
```tsx
// In custom hook
import { authService } from "@/services/authService";

const useAuth = () => {
  const [state, setState] = useState();
  
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setState(response);
  };
  
  return { login, state };
};
```

### Asset Usage

#### Icons
```tsx
// Header icons
import BellIcon from "@/assets/HeaderIcons/bell.svg";
import SearchIcon from "@/assets/HeaderIcons/search.svg";

// Status icons
import TodayIcon from "@/assets/status/today.svg";
import TomorrowIcon from "@/assets/status/tomorrow.svg";

// Usage
<img src={BellIcon} alt="Notifications" className="w-12 h-12" />
```

#### Logo
```tsx
<img src="/src/assets/logo.svg" alt="Hammer & Grammar Logo" className="w-20 h-20" />
```

### Mock Data Usage

#### Class Data
```tsx
import { classListMockData, type ClassData } from "@/mockData/classListMock";

function ClassComponent({ classData }: { classData: ClassData }) {
  return (
    <div className="bg-[#C2E8FA] rounded-[30px] p-4">
      <h3>{classData.className}</h3>
      <p>{classData.room} - {classData.time}</p>
    </div>
  );
}
```

#### Student Data
```tsx
import { 
  getStudentsByClassId, 
  getFormattedStudentCount 
} from "@/mockData/studentListMock";

const students = getStudentsByClassId("CL001");
const studentCount = getFormattedStudentCount("CL001"); // "5/50"
```

### Common Utilities

#### Class Name Merging
```tsx
import { cn } from "@/lib/utils";

const className = cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" ? "primary-classes" : "secondary-classes",
  props.className
);
```

#### Authentication Utilities
```tsx
import { 
  isAuthenticated, 
  getAccessToken, 
  clearAuthData 
} from "@/lib/utils";

// Check auth status
if (isAuthenticated()) {
  // User is logged in
}

// Get token for API calls
const token = getAccessToken();

// Logout
clearAuthData();
```

### Component Composition Patterns

#### List with Custom Scrollbar
```tsx
<div className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
  <div className="space-y-4">
    {items.map(item => (
      <ItemComponent key={item.id} data={item} />
    ))}
  </div>
</div>
```

#### Expandable Content
```tsx
function ExpandableComponent() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "cursor-pointer transition-all duration-300",
          isExpanded ? "rounded-t-[20px]" : "rounded-[20px]"
        )}
      >
        {/* Header content */}
      </div>
      {isExpanded && (
        <div className="rounded-b-[20px] bg-white p-6">
          {/* Expanded content */}
        </div>
      )}
    </div>
  );
}
```

### Performance Tips

#### Memoization
```tsx
import React, { memo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onAction }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// In parent component
const handleAction = useCallback((id) => {
  // Handle action
}, [dependency]);
```

#### Context Usage
```tsx
// Provider at app level
<SidebarProvider>
  <App />
</SidebarProvider>

// Consumer in any child
const { state, toggleSidebar } = useSidebar();
const isExpanded = state === "expanded";
```

This quick reference provides the most commonly used patterns and components for efficient development and refactoring.
