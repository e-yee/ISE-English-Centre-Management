import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ExamplePage from './pages/ExamplePage';
import ClassScreen from './pages/class/ClassScreen';
import HomescreenPage from './pages/homescreen/Homescreen';
// import HomescreenDemo from './components/demo/HomescreenDemo'; // Uncomment if needed for testing

{/*For development */}
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

// 🔧 EASY TOGGLE: Set to true for production routes, false for demo mode
const USE_PRODUCTION_ROUTES = false;

function App() {
  // 🚀 PRODUCTION MODE: Full routing setup
  if (USE_PRODUCTION_ROUTES) {
    return (
      <>
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/*" element={<AuthRoutes />} />

            {/* Protected routes - add your production routes here */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomescreenPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/class/:id"
              element={
                <ProtectedRoute>
                  <ClassScreen />
                </ProtectedRoute>
              }
            />

            {/* Default route redirects to auth */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Catch all routes - redirect to auth for now */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }

  // 🎨 DEMO MODE: Individual page testing without routes
  return (
    <>
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      <div>
        <ExamplePage />
      </div>
    </>
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
   - Full BrowserRouter with all routes
   - Production-ready routing setup
   - Add your routes in the Routes section above
   - Includes auth routes and protected routes

3. EASY SWITCHING:
   - Just change the boolean flag at the top
   - No need to comment/uncomment large blocks of code
   - Clean and maintainable

4. ADDING NEW ROUTES:
   - Add them in the production mode Routes section
   - Demo components remain unaffected
   - Test in demo mode, deploy in production mode
*/
