import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MockAuthProvider } from './contexts/MockAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/router';
import ExamplePage from './pages/ExamplePage';

{/*For development */}
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

// 🔧 EASY TOGGLE: Set to true for production routes, false for demo mode
const USE_PRODUCTION_ROUTES = true;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
    //for testing only  
    // localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1NDEyMzQzNiwianRpIjoiY2U1Njk3MWEtODI2NC00ZjQwLWEyODAtN2IwMTNlYzQ3ZjA5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IkFDQzAxIiwibmJmIjoxNzU0MTIzNDM2LCJjc3JmIjoiMTU5NGU2MDQtNDk4OC00NDNjLTliMmUtMGUwZGNjNDBhOGVlIiwiZXhwIjoxNzU0MjA5ODM2fQ.Q54lQSTV8_CBqu9FUcnMf_w1Hm8D_qMXCKtJlcsmaCk');
    // // Set mock user in localStorage for testing
    // localStorage.setItem('user', JSON.stringify({
    //   id: '1',
    //   role: 'Teacher',
    //   email: 'teacher@test.com',
    //   name: 'Test Teacher',
    // }));

  // 🚀 PRODUCTION MODE: Full routing setup with MockAuthProvider (bypasses real auth)
  if (USE_PRODUCTION_ROUTES) {
    return (
      <QueryClientProvider client={queryClient}>
        {/* <StagewiseToolbar config={{ plugins: [ReactPlugin] }} /> */}
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  // 🎨 DEMO MODE: Individual page testing without routes
  return (
    <QueryClientProvider client={queryClient}>
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      <AuthProvider>
        <div>
          <ExamplePage />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
/*
🔧 HOW TO USE THIS TOGGLE SYSTEM:

1. DEMO MODE (USE_PRODUCTION_ROUTES = false):
   - Shows ExamplePage with all demo components
   - No routing needed
   - Perfect for development and testing individual components
   - Can uncomment individual pages for focused testing

2. PRODUCTION MODE (USE_PRODUCTION_ROUTES = true):
   - Full RouterProvider with AuthProvider
   - Production-ready routing setup with authentication
   - Uses the new organized routing structure:
     - contexts/AuthContext.tsx - Global auth state management
     - routes/router.tsx - Main routing logic with role-based protection
     - routes/ProtectedRoute.tsx - Role-based route protection
   - Includes automatic token refresh and auth guards

3. EASY SWITCHING:
   - Just change the boolean flag at the top
   - No need to comment/uncomment large blocks of code
   - Clean and maintainable

4. NEW AUTHENTICATION STRUCTURE:
   - AuthProvider wraps the entire app for global state
   - useAuth hook for accessing auth state and actions
   - Role-based routing with ProtectedRoute component
   - Organized routing with clear separation of concerns

5. ROLE-BASED ROUTING:
   - Teacher routes: /attendance, /class/:id, /class-report/:id
   - Staff routes: /timekeeping/checkin, /timekeeping/entries, /absent-request
   - Admin routes: /colleagues, /materials/add
   - Shared routes: /home, /profile (accessible by all roles)
   - Automatic role-based redirects after login
*/

