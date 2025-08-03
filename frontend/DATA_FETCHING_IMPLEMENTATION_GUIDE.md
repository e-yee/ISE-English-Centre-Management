# Data Fetching Implementation Guide

## Overview

This guide covers implementing modern data fetching in React applications using React Router v7 and TanStack Query, with a focus on role-based data access and reusable architecture.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [File Structure](#file-structure)
3. [Implementation Steps](#implementation-steps)
4. [Examples](#examples)
5. [Best Practices](#best-practices)

## Core Concepts

### React Router v7 Client Loaders
- **Purpose**: Fetch data on client-side before component renders
- **Benefits**: No loading flicker, better UX, automatic error handling
- **Usage**: Export `clientLoader` function in route files

### TanStack Query
- **Purpose**: Data fetching library with caching, loading states, background updates
- **Benefits**: Automatic caching, optimistic updates, loading/error states
- **Usage**: `useQuery` hook for data fetching

### File Hierarchy (Abstract → Specific)
```
lib/ (Infrastructure) → services/ (Business Logic) → hooks/ (React Logic) → components/ (UI) → pages/ (Pages)
```

## File Structure

```
frontend/src/
├── 📁 lib/ (Infrastructure - Lowest Level)
│   ├── apiClient.ts          # Base HTTP client
│   └── utils.ts             # Utility functions
│
├── 📁 services/ (Business Logic - Middle Level)
│   ├── 📁 base/
│   │   └── apiService.ts    # Base service class (abstract)
│   ├── 📁 entities/
│   │   ├── employeeService.ts    # Employee API calls
│   │   ├── classService.ts       # Class API calls
│   │   ├── studentService.ts     # Student API calls
│   │   └── attendanceService.ts  # Attendance API calls
│   └── 📁 auth/
│       └── authService.ts        # Authentication API calls
│
├── 📁 hooks/ (React Logic - Higher Level)
│   ├── 📁 base/
│   │   ├── useDataFetching.ts   # Generic data fetching (abstract)
│   │   └── useAuth.ts           # Generic auth logic
│   ├── 📁 entities/
│   │   ├── useEmployees.ts      # Employee-specific hooks
│   │   ├── useClasses.ts        # Class-specific hooks
│   │   ├── useStudents.ts       # Student-specific hooks
│   │   └── useAttendance.ts     # Attendance-specific hooks
│   └── 📁 ui/
│       ├── useMobile.ts         # UI-specific hooks
│       └── useFileManagement.ts # File-specific hooks
│
├── 📁 components/ (UI - Highest Level)
│   ├── 📁 ui/ (Reusable UI components)
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── DataWrapper.tsx
│   ├── 📁 entities/
│   │   ├── EmployeeList.tsx
│   │   ├── ClassList.tsx
│   │   └── StudentList.tsx
│   └── 📁 layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
│
└── 📁 pages/ (Pages - Highest Level)
    ├── ColleaguesPage.tsx
    ├── ClassesPage.tsx
    └── StudentsPage.tsx
```

## Implementation Steps

### Step 1: Setup Base Infrastructure

**1.1. Create Base API Client (`lib/apiClient.ts`)**
```typescript
import axios from 'axios';
import { getAccessToken } from './utils';

const API_BASE_URL = 'http://localhost:5000';

function createApiClient() {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });

  // Request interceptor for auth
  client.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  );

  return client;
}

export const apiClient = createApiClient();
export const api = {
  get: <T>(url: string) => apiClient.get<T>(url),
  post: <T>(url: string, data: any) => apiClient.post<T>(url, data),
  put: <T>(url: string, data: any) => apiClient.put<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
};
```

**1.2. Create Base Service (`services/base/apiService.ts`)**
```typescript
import { api } from '@/lib/apiClient';

export class ApiService {
  protected async get<T>(endpoint: string): Promise<T> {
    return api.get<T>(endpoint);
  }
  
  protected async post<T>(endpoint: string, data: any): Promise<T> {
    return api.post<T>(endpoint, data);
  }
  
  protected async put<T>(endpoint: string, data: any): Promise<T> {
    return api.put<T>(endpoint, data);
  }
  
  protected async delete<T>(endpoint: string): Promise<T> {
    return api.delete<T>(endpoint);
  }
}
```

### Step 2: Create Entity-Specific Services

**2.1. Employee Service (`services/entities/employeeService.ts`)**
```typescript
import { ApiService } from '../base/apiService';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone_number: string;
  teacher_status: string;
}

class EmployeeService extends ApiService {
  async getAvailableTeachers(): Promise<Employee[]> {
    return this.get<Employee[]>('/employee/');
  }
  
  async getAllEmployees(): Promise<Employee[]> {
    return this.get<Employee[]>('/employee/');
  }
  
  async getEmployeesByRole(): Promise<Employee[]> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    switch (user.role) {
      case 'teacher':
        return this.getAvailableTeachers();
      case 'manager':
        return this.getAllEmployees();
      default:
        return [];
    }
  }
}

export default new EmployeeService();
```

**2.2. Class Service (`services/entities/classService.ts`)**
```typescript
import { ApiService } from '../base/apiService';

export interface Class {
  id: string;
  name: string;
  teacher: string;
  students: string[];
  schedule: string;
}

class ClassService extends ApiService {
  async getClasses(): Promise<Class[]> {
    return this.get<Class[]>('/classes');
  }
  
  async getClassById(id: string): Promise<Class> {
    return this.get<Class>(`/classes/${id}`);
  }
  
  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    return this.get<Class[]>(`/classes/teacher/${teacherId}`);
  }
}

export default new ClassService();
```

### Step 3: Create Base Hooks

**3.1. Generic Data Fetching Hook (`hooks/base/useDataFetching.ts`)**
```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Generic hook for role-based data fetching
export function useRoleBasedData<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [...queryKey, user?.role],
    queryFn: fetchFn,
    enabled: !!user?.role,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Generic hook for any data fetching
export function useDataFetching<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
```

### Step 4: Create Entity-Specific Hooks

**4.1. Employee Hook (`hooks/entities/useEmployees.ts`)**
```typescript
import { useRoleBasedData } from '../base/useDataFetching';
import employeeService from '@/services/entities/employeeService';

export function useEmployees() {
  return useRoleBasedData(
    ['employees'],
    () => employeeService.getEmployeesByRole()
  );
}

export function useAvailableTeachers() {
  return useDataFetching(
    ['employees', 'available'],
    () => employeeService.getAvailableTeachers()
  );
}
```

**4.2. Class Hook (`hooks/entities/useClasses.ts`)**
```typescript
import { useDataFetching } from '../base/useDataFetching';
import classService from '@/services/entities/classService';

export function useClasses() {
  return useDataFetching(['classes'], () => classService.getClasses());
}

export function useClass(id: string) {
  return useDataFetching(
    ['class', id], 
    () => classService.getClassById(id),
    { enabled: !!id }
  );
}

export function useClassesByTeacher(teacherId: string) {
  return useDataFetching(
    ['classes', 'teacher', teacherId],
    () => classService.getClassesByTeacher(teacherId),
    { enabled: !!teacherId }
  );
}
```

### Step 5: Create Reusable UI Components

**5.1. Loading Spinner (`components/ui/LoadingSpinner.tsx`)**
```typescript
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading...</span>
    </div>
  );
}
```

**5.2. Error Message (`components/ui/ErrorMessage.tsx`)**
```typescript
interface ErrorMessageProps {
  error: Error;
  retry?: () => void;
}

export function ErrorMessage({ error, retry }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-800">Error: {error.message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
```

**5.3. Data Wrapper (`components/ui/DataWrapper.tsx`)**
```typescript
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface DataWrapperProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  children: (data: T) => React.ReactNode;
  retry?: () => void;
}

export function DataWrapper<T>({ 
  data, 
  isLoading, 
  error, 
  children, 
  retry 
}: DataWrapperProps<T>) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} retry={retry} />;
  if (!data) return null;
  
  return <>{children(data)}</>;
}
```

### Step 6: Create Pages with React Router v7

**6.1. Colleagues Page (`pages/colleagues/ColleaguesPage.tsx`)**
```typescript
import { useEmployees } from '@/hooks/entities/useEmployees';
import { DataWrapper } from '@/components/ui/DataWrapper';
import ColleagueList from '@/components/entities/ColleagueList';

// React Router v7 clientLoader
export async function clientLoader() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.role === 'teacher') {
    const response = await fetch('/api/employee/');
    return response.json();
  } else if (user.role === 'manager') {
    const response = await fetch('/api/employee/');
    return response.json();
  }
  
  return [];
}

// Hydrate fallback for SSR
export function HydrateFallback() {
  return <LoadingSpinner />;
}

export default function ColleaguesPage() {
  const { data: employees, isLoading, error, refetch } = useEmployees();
  
  return (
    <DataWrapper
      data={employees}
      isLoading={isLoading}
      error={error}
      retry={refetch}
    >
      {(employees) => (
        <div className="colleagues-page">
          <ColleagueList employees={employees} />
        </div>
      )}
    </DataWrapper>
  );
}
```

**6.2. Classes Page (`pages/classes/ClassesPage.tsx`)**
```typescript
import { useClasses } from '@/hooks/entities/useClasses';
import { DataWrapper } from '@/components/ui/DataWrapper';
import ClassList from '@/components/entities/ClassList';

export async function clientLoader() {
  const response = await fetch('/api/classes');
  return response.json();
}

export function HydrateFallback() {
  return <LoadingSpinner />;
}

export default function ClassesPage() {
  const { data: classes, isLoading, error, refetch } = useClasses();
  
  return (
    <DataWrapper
      data={classes}
      isLoading={isLoading}
      error={error}
      retry={refetch}
    >
      {(classes) => (
        <div className="classes-page">
          <ClassList classes={classes} />
        </div>
      )}
    </DataWrapper>
  );
}
```

### Step 7: Update Router Configuration

**7.1. Router Setup (`routes/router.tsx`)**
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

export const router = createBrowserRouter([
  {
    path: '/colleagues',
    lazy: () => import('../pages/colleagues/ColleaguesPage'),
  },
  {
    path: '/classes',
    lazy: () => import('../pages/classes/ClassesPage'),
  },
  // Add more routes as needed
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

## Examples

### Adding a New Entity (Students)

**1. Create Service (`services/entities/studentService.ts`)**
```typescript
import { ApiService } from '../base/apiService';

export interface Student {
  id: string;
  name: string;
  email: string;
  class_id: string;
}

class StudentService extends ApiService {
  async getStudents(): Promise<Student[]> {
    return this.get<Student[]>('/students');
  }
  
  async getStudentsByClass(classId: string): Promise<Student[]> {
    return this.get<Student[]>(`/students/class/${classId}`);
  }
}

export default new StudentService();
```

**2. Create Hook (`hooks/entities/useStudents.ts`)**
```typescript
import { useDataFetching } from '../base/useDataFetching';
import studentService from '@/services/entities/studentService';

export function useStudents() {
  return useDataFetching(['students'], () => studentService.getStudents());
}

export function useStudentsByClass(classId: string) {
  return useDataFetching(
    ['students', 'class', classId],
    () => studentService.getStudentsByClass(classId),
    { enabled: !!classId }
  );
}
```

**3. Create Page (`pages/students/StudentsPage.tsx`)**
```typescript
import { useStudents } from '@/hooks/entities/useStudents';
import { DataWrapper } from '@/components/ui/DataWrapper';
import StudentList from '@/components/entities/StudentList';

export async function clientLoader() {
  const response = await fetch('/api/students');
  return response.json();
}

export default function StudentsPage() {
  const { data: students, isLoading, error, refetch } = useStudents();
  
  return (
    <DataWrapper
      data={students}
      isLoading={isLoading}
      error={error}
      retry={refetch}
    >
      {(students) => <StudentList students={students} />}
    </DataWrapper>
  );
}
```

## Best Practices

### 1. File Organization
- **Abstract → Specific**: Base classes first, specific implementations last
- **Consistent Naming**: Use entity names in file names
- **Clear Hierarchy**: Group by purpose (base, entities, ui)

### 2. Data Fetching
- **Role-Based Logic**: Handle different data based on user role
- **Error Handling**: Always provide retry functionality
- **Loading States**: Show loading indicators for better UX
- **Caching**: Use TanStack Query's built-in caching

### 3. Component Structure
- **Reusable Components**: Create generic UI components
- **Data Wrapper**: Use DataWrapper for consistent loading/error states
- **Separation of Concerns**: Keep data logic in hooks, UI in components

### 4. Performance
- **Lazy Loading**: Use React Router's lazy loading for routes
- **Background Updates**: Enable background refetching for fresh data
- **Stale Time**: Set appropriate stale times to balance freshness and performance

### 5. Type Safety
- **Interface Definitions**: Define interfaces for all data structures
- **TypeScript**: Use TypeScript for better development experience
- **Generic Types**: Use generics for reusable components

## Quick Reference

| When You Need | Use This | Example |
|---------------|----------|---------|
| **Base HTTP calls** | `apiClient.ts` | `api.get('/users')` |
| **Entity-specific API** | `employeeService.ts` | `employeeService.getAvailableTeachers()` |
| **Generic data fetching** | `useDataFetching.ts` | `useDataFetching(['users'], fetchUsers)` |
| **Entity-specific React logic** | `useEmployees.ts` | `useEmployees()` |
| **Reusable UI components** | `LoadingSpinner.tsx` | `<LoadingSpinner />` |
| **Page with data** | `ColleaguesPage.tsx` | Uses hooks + components |

This structure provides a scalable, maintainable, and reusable foundation for data fetching in React applications. 