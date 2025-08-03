---
type: "always_apply"
---

# Frontend Code Structure Guidelines
## Hammer Grammar English Centre Management System

### Project Directory Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, SVG icons
│   │   ├── HeaderIcons/     # Header component SVG icons
│   │   ├── sidebar/         # Sidebar component SVG icons
│   │   └── logo.svg         # Company logo
│   ├── components/          # Reusable components
│   │   ├── ui/              # Base UI components (ShadCN)
│   │   └── layout/          # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   ├── services/            # API service layer
│   ├── pages/               # Page components
│   │   └── auth/            # Authentication pages
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

### Mandatory Data Flow Architecture

**ALWAYS follow this pattern - NO EXCEPTIONS:**

```
Component ➡️ Custom Hook ➡️ Service ➡️ Backend API
```

#### Layer Responsibilities

1. **Component Layer**:
   - Render UI and handle user interactions
   - Use custom hooks for data and functionality
   - NO direct API calls
   - NO complex business logic

2. **Custom Hook Layer**:
   - Encapsulate complex logic and state management
   - Provide clean API for components
   - Call service functions for backend interaction
   - Handle loading states and error management

3. **Service Layer**:
   - Handle API communication and data transformation
   - Abstract API endpoints and request/response handling
   - Return promises for async operations

### Component Structure Standards

#### File Naming Conventions
- **Components**: PascalCase (e.g., `LoginForm.tsx`, `HeaderExample.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`, `useAuthFlow.ts`)
- **Services**: camelCase with "Service" suffix (e.g., `authService.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)

#### Component Template
```tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  // Required props first
  requiredProp: string;
  // Optional props with default values
  optionalProp?: boolean;
  // Event handlers
  onAction?: () => void;
  // Styling
  className?: string;
}

export default function ComponentName({
  requiredProp,
  optionalProp = false,
  onAction,
  className
}: ComponentNameProps) {
  // State declarations
  const [localState, setLocalState] = useState<string>('');
  
  // Custom hooks
  const { data, loading, error } = useCustomHook();
  
  // Event handlers
  const handleAction = () => {
    // Handle logic
    onAction?.();
  };
  
  // Early returns for loading/error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className={cn('default-classes', className)}>
      {/* Component JSX */}
    </div>
  );
}
```

#### Custom Hook Template
```tsx
import { useState, useEffect } from 'react';
import { serviceFunction } from '@/services/serviceName';

interface UseHookNameReturn {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  // Action functions
  actionFunction: (params: ParamType) => Promise<void>;
}

export function useHookName(): UseHookNameReturn {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const actionFunction = async (params: ParamType) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceFunction(params);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    data,
    loading,
    error,
    actionFunction
  };
}
```

#### Service Template
```tsx
import { api } from './api';

interface ServiceResponse {
  // Define response structure
}

interface ServiceRequest {
  // Define request structure
}

export const serviceName = {
  actionName: async (params: ServiceRequest): Promise<ServiceResponse> => {
    try {
      const response = await api.post('/endpoint', params);
      return response.data;
    } catch (error) {
      throw new Error(`Service action failed: ${error.message}`);
    }
  }
};
```

### Styling Guidelines

#### Tailwind CSS Usage
- **ALWAYS use Tailwind utility classes**
- **NEVER use inline styles**
- **Use `cn()` utility for combining classes**

```tsx
import { cn } from '@/lib/utils';

// Correct usage
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' ? 'primary-classes' : 'secondary-classes',
  className
)}>
```

#### Component Styling Patterns
- **Card Components**: `bg-[#B7D5F4] border-[5px] border-black rounded-[30px]`
- **Buttons**: Custom variants using ShadCN button component
- **Inputs**: Pill-shaped with `rounded-full` and black borders
- **Typography**: Rhodium Libre font for branding elements

### State Management Patterns

#### Local State
```tsx
// Simple state
const [value, setValue] = useState<string>('');

// Object state
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

// Update object state
const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
```

#### Form Handling Pattern
```tsx
const [formData, setFormData] = useState({
  username: '',
  password: ''
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Use custom hook for submission
  await submitAction(formData);
};

const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Import Organization

```tsx
// React imports first
import React, { useState, useEffect } from 'react';

// Third-party libraries
import { clsx } from 'clsx';

// Internal components (UI first, then custom)
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';

// Hooks
import { useAuth } from '@/hooks/useAuth';

// Services
import { authService } from '@/services/authService';

// Utils
import { cn } from '@/lib/utils';

// Types (if separate file)
import type { ComponentProps } from './types';
```

### Error Handling Standards

#### Component Level
```tsx
if (error) {
  return (
    <div className="error-container">
      <p>Something went wrong: {error.message}</p>
      <Button onClick={retry}>Try Again</Button>
    </div>
  );
}
```

#### Hook Level
```tsx
try {
  const result = await serviceCall();
  setData(result);
} catch (err) {
  setError(err as Error);
  console.error('Hook error:', err);
}
```

### TypeScript Standards

#### Interface Definitions
```tsx
// Component props
interface ComponentProps {
  required: string;
  optional?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// API responses
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Form data
interface FormData {
  [key: string]: string | number | boolean;
}
```

### Testing Patterns

#### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName requiredProp="test" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    const mockHandler = jest.fn();
    render(<ComponentName onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Performance Optimization

#### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

#### Memoization
```tsx
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Memoize event handlers
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);

// Memoize components
export default memo(ComponentName);
```
