# Frontend Routing and API Calling Documentation

## Table of Contents
1. [Overview](#overview)
2. [API Client & Service Layer](#api-client--service-layer)
3. [Routing System](#routing-system)
4. [Reusable Functions Catalog](#reusable-functions-catalog)
5. [Local Storage Reference](#local-storage-reference)
6. [Data Fetching Patterns](#data-fetching-patterns)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)

## Overview

### System Architecture
The frontend uses a centralized API client with axios interceptors, role-based route protection, and React Query for data management. The system implements token-based authentication with JWT and local storage persistence.

### Key Components
- **apiClient.ts**: Centralized API client with interceptors
- **apiService.ts**: Base service class for HTTP operations
- **ProtectedRoutes.tsx**: Role-based route protection
- **router.tsx**: Main routing configuration
- **useDataFetching.ts**: Custom hooks for data fetching
- **utils.ts**: Utility functions for authentication and token management

### Authentication Flow
1. User logs in → JWT tokens stored in localStorage
2. API requests include Authorization header with Bearer token
3. Route protection checks authentication and role
4. Token refresh handled automatically
5. Unauthorized access redirected to login/unauthorized pages

## API Client & Service Layer

### apiClient.ts Configuration

**Base Configuration:**
```typescript
const API_BASE_URL = 'http://localhost:5000';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
```

**Request Interceptor:**
- Automatically adds Authorization header with Bearer token
- Handles token retrieval from localStorage

**Response Interceptor:**
- Returns data directly (not wrapped in response object)
- Handles error responses with detailed error messages
- Logs errors for debugging

**Available Methods:**
```typescript
// GET request
api.get<T>(url, config?)

// POST request
api.post<T>(url, data, config?)

// PUT request
api.put<T>(url, data, config?)

// PATCH request
api.patch<T>(url, data, config?)

// DELETE request
api.delete<T>(url, config?)
```

### apiService.ts Base Class

**Protected Methods:**
```typescript
protected async get<T>(endpoint: string): Promise<T>
protected async post<T>(endpoint: string, data: any): Promise<T>
protected async put<T>(endpoint: string, data: any): Promise<T>
protected async patch<T>(endpoint: string, data: any): Promise<T>
protected async delete<T>(endpoint: string): Promise<T>
```

**Features:**
- Extends apiClient functionality
- Includes logging for debugging
- Provides consistent error handling
- Type-safe HTTP operations

## Routing System

### Router Configuration (router.tsx)

**Route Structure:**
```typescript
// Main layout route
{
  path: '/',
  element: <AppLayout />,
  children: [
    // Shared routes (all roles)
    {
      element: <ProtectedRoute allowedRoles={['Teacher', 'Manager', 'Learning Advisor']} />,
      children: [
        { path: 'home', element: <Homescreen /> },
        { path: 'colleagues', element: <ColleaguesPage /> },
      ]
    },
    
    // Teacher routes
    {
      element: <ProtectedRoute allowedRoles={['Teacher', 'Manager', 'Learning Advisor']} />,
      children: [
        { path: 'checkin', element: <CheckInPage /> },
        { path: 'attendance', element: <AttendancePage /> },
        // ... more routes
      ]
    },
    
    // Manager routes
    {
      element: <ProtectedRoute allowedRoles={['Manager']} />,
      children: [
        // Manager-specific routes
      ]
    }
  ]
}
```

### Protected Routes (ProtectedRoutes.tsx)

**Features:**
- Role-based access control
- Loading states during authentication check
- Automatic redirects for unauthorized access
- Uses Outlet pattern for nested routing

**Protection Logic:**
```typescript
// Check authentication
if (!isAuthenticated) {
  return <Navigate to="/auth/login" replace />;
}

// Check role authorization
if (!user || !allowedRoles.includes(user.role)) {
  return <Navigate to="/unauthorized" replace />;
}
```

### Role-Based Access Control

**Available Roles:**
- `Teacher`: Basic access to teaching features
- `Learning Advisor`: Extended access including scheduling
- `Manager`: Full administrative access

**Route Groups:**
1. **Shared Routes**: Accessible by all authenticated users
2. **Teacher Routes**: Teacher, Learning Advisor, Manager access
3. **Learning Advisor Routes**: Learning Advisor and Manager access
4. **Manager Routes**: Manager-only access

## Reusable Functions Catalog

### Token Management Functions

**getAccessToken()**
```typescript
// Returns access token from localStorage
const token = getAccessToken();
```

**setAccessToken(token: string)**
```typescript
// Stores access token in localStorage
setAccessToken('jwt_token_here');
```

**removeAccessToken()**
```typescript
// Removes access token from localStorage
removeAccessToken();
```

**getRefreshToken()**
```typescript
// Returns refresh token from localStorage
const refreshToken = getRefreshToken();
```

**setRefreshToken(token: string)**
```typescript
// Stores refresh token in localStorage
setRefreshToken('refresh_token_here');
```

**removeRefreshToken()**
```typescript
// Removes refresh token from localStorage
removeRefreshToken();
```

### User Management Functions

**getUser()**
```typescript
// Returns user data from localStorage
const user = getUser();
```

**setUser(user: any)**
```typescript
// Stores user data in localStorage
setUser({ id: 1, name: 'John', role: 'Teacher' });
```

**getUserRole()**
```typescript
// Returns user role from localStorage
const role = getUserRole();
```

**setUserRole(role: string)**
```typescript
// Stores user role in localStorage
setUserRole('Teacher');
```

**clearUserRole()**
```typescript
// Removes user role from localStorage
clearUserRole();
```

### Authentication Functions

**isTokenValid(token: string | null)**
```typescript
// Checks if JWT token is valid and not expired
const isValid = isTokenValid(token);
```

**isAuthenticated()**
```typescript
// Checks if user is authenticated (has valid access token)
const authenticated = isAuthenticated();
```

**clearAuthData()**
```typescript
// Clears all authentication data from localStorage
clearAuthData();
```

### JWT Utility Functions

**decodeJWT(token: string)**
```typescript
// Decodes JWT token and returns payload
const payload = decodeJWT(token);
```

**getUserIdFromToken()**
```typescript
// Extracts user ID from JWT token
const userId = getUserIdFromToken();
```

## Local Storage Reference

### Variable Names and Purposes

| Variable Name | Purpose | Usage |
|---------------|---------|-------|
| `access_token` | JWT access token | Authentication for API requests |
| `refresh_token` | JWT refresh token | Token refresh when access token expires |
| `user` | User data object | User information and preferences |
| `user_role` | User role string | Role-based access control |
| `auth_state` | Authentication state | Current authentication status |

### Usage Patterns

**Setting Authentication Data:**
```typescript
// After successful login
setAccessToken(accessToken);
setRefreshToken(refreshToken);
setUser(userData);
setUserRole(userRole);
```

**Clearing Authentication Data:**
```typescript
// On logout or token expiration
clearAuthData(); // Clears all auth-related data
```

**Checking Authentication:**
```typescript
// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
} else {
  // Redirect to login
}
```

### Lifecycle Management

1. **Login**: Store tokens and user data
2. **API Requests**: Use access token for authorization
3. **Token Refresh**: Use refresh token when access token expires
4. **Logout**: Clear all authentication data
5. **Route Protection**: Check authentication before rendering protected routes

## Data Fetching Patterns

### useDataFetching Hook

**Basic Usage:**
```typescript
const { data, isLoading, error } = useDataFetching(
  ['students'],
  () => api.get('/students')
);
```

**Features:**
- Automatic caching with React Query
- 5-minute stale time
- Error handling
- Loading states

### useRoleBasedData Hook

**Usage:**
```typescript
const { data, isLoading, error } = useRoleBasedData(
  ['classes'],
  () => api.get('/classes'),
  { enabled: userRole === 'Teacher' }
);
```

**Features:**
- Role-based query keys
- Conditional fetching based on user role
- Same caching and error handling as useDataFetching

### React Query Integration

**Configuration:**
- Stale time: 5 minutes
- Automatic background refetching
- Error retry logic
- Cache invalidation

**Query Keys:**
```typescript
// Basic query key
['students']

// Role-based query key
['classes', 'Teacher']

// Parameter-based query key
['student', studentId]
```

### Caching Strategies

1. **Time-based caching**: 5-minute stale time
2. **Role-based caching**: Separate cache per user role
3. **Parameter-based caching**: Separate cache per query parameters
4. **Background updates**: Automatic refetching in background

## Best Practices

### API Calling Patterns

**Service Class Pattern:**
```typescript
class StudentService extends ApiService {
  async getStudents() {
    return this.get<Student[]>('/students');
  }
  
  async createStudent(student: CreateStudentDto) {
    return this.post<Student>('/students', student);
  }
}
```

**Error Handling:**
```typescript
try {
  const data = await api.get('/endpoint');
  // Handle success
} catch (error) {
  // Handle error (already logged by interceptor)
  console.error('API call failed:', error);
}
```

### Authentication Best Practices

1. **Token Management**: Always use utility functions for token operations
2. **Route Protection**: Wrap all protected routes with ProtectedRoute component
3. **Role Checking**: Use role-based hooks for conditional data fetching
4. **Logout**: Always clear all authentication data on logout

### Route Protection Best Practices

1. **Loading States**: Always show loading during authentication checks
2. **Role Validation**: Check both authentication and role before rendering
3. **Redirects**: Use replace prop to prevent back navigation to protected routes
4. **Error Boundaries**: Handle authentication errors gracefully

### Data Fetching Best Practices

1. **Query Keys**: Use descriptive, hierarchical query keys
2. **Role-based Queries**: Include user role in query keys when appropriate
3. **Error Handling**: Always handle loading and error states
4. **Caching**: Leverage React Query caching for better performance

## Code Examples

### Service Implementation

```typescript
// studentService.ts
import { ApiService } from './base/apiService';

export class StudentService extends ApiService {
  async getStudents(): Promise<Student[]> {
    return this.get<Student[]>('/students');
  }
  
  async getStudent(id: string): Promise<Student> {
    return this.get<Student>(`/students/${id}`);
  }
  
  async createStudent(student: CreateStudentDto): Promise<Student> {
    return this.post<Student>('/students', student);
  }
  
  async updateStudent(id: string, student: UpdateStudentDto): Promise<Student> {
    return this.put<Student>(`/students/${id}`, student);
  }
  
  async deleteStudent(id: string): Promise<void> {
    return this.delete(`/students/${id}`);
  }
}
```

### Route Protection Usage

```typescript
// In router.tsx
{
  element: <ProtectedRoute allowedRoles={['Teacher', 'Manager']} />,
  children: [
    { path: 'attendance', element: <AttendancePage /> },
    { path: 'classes', element: <ClassesPage /> }
  ]
}
```

### Data Fetching Examples

```typescript
// Using useDataFetching
const { data: students, isLoading, error } = useDataFetching(
  ['students'],
  () => studentService.getStudents()
);

// Using useRoleBasedData
const { data: classes, isLoading } = useRoleBasedData(
  ['classes'],
  () => classService.getClasses(),
  { enabled: userRole === 'Teacher' }
);

// Conditional rendering
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <NoDataMessage />;

return <StudentList students={data} />;
```

### Utility Function Usage

```typescript
// Authentication check
if (!isAuthenticated()) {
  navigate('/auth/login');
  return;
}

// Token management
const token = getAccessToken();
if (!isTokenValid(token)) {
  clearAuthData();
  navigate('/auth/login');
  return;
}

// User data management
const user = getUser();
const userRole = getUserRole();

if (userRole === 'Manager') {
  // Show manager-specific features
}

// JWT utilities
const userId = getUserIdFromToken();
const tokenPayload = decodeJWT(token);
```

### Complete Authentication Flow Example

```typescript
// Login component
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await authService.login(credentials);
    
    // Store authentication data
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setUser(response.user);
    setUserRole(response.user.role);
    
    // Navigate to home
    navigate('/home');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Logout component
const handleLogout = () => {
  clearAuthData();
  navigate('/auth/login');
};
```

---

## Summary

This documentation provides a comprehensive guide to the frontend routing and API calling system. Key takeaways:

1. **Centralized API Client**: Uses axios interceptors for consistent authentication and error handling
2. **Role-Based Protection**: Implements comprehensive route protection with role validation
3. **Reusable Functions**: Extensive utility functions for token and user management
4. **Data Fetching**: Custom hooks with React Query for efficient data management
5. **Local Storage**: Consistent patterns for authentication data persistence
6. **Best Practices**: Established patterns for API calls, route protection, and error handling

The system is designed for scalability, maintainability, and security, with clear separation of concerns and reusable components throughout the codebase. 