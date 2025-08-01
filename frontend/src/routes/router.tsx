import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import AuthPage from '../pages/auth/AuthPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import Homescreen from '../pages/homescreen/Homescreen';
import AppLayout from '../components/layout/AppLayout';
import ExamplePage from '../pages/ExamplePage';

// Import pages
import AbsentRequestPage from '../pages/absent-request/AbsentRequestPage';
import CheckInPage from '../pages/timekeeping/CheckInPage';
import TimeKeepingPage from '../pages/timekeeping/TimeKeeping';
import TimeEntriesPage from '../pages/timekeeping/TimeEntriesPage';
import ColleaguesPage from '../pages/colleagues/ColleaguesPage';
import ProfileSettingPage from '../pages/profile/ProfileSettingPage';
import ClassScreen from '../pages/class/ClassScreen';
import ClassInformationPage from '../pages/class/ClassInformationPage';
import AttendancePage from '../pages/attendance/AttendancePage';
import AddMaterialsPage from '../pages/materials/AddMaterialsPage';
import ClassReportPage from '../pages/class-report/ClassReportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to= '/auth/login' replace />,
  },

  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    // This is the main application layout route
    path: '/',
    element: <AppLayout />, // AppLayout provides Header, Sidebar, and Outlet for child routes
    children: [
      // --- Teacher Routes ---
      {
        element: <ProtectedRoute allowedRoles={['teacher']} />,
        children: [
          { path: 'home', element: <Homescreen /> },
          { path: 'example', element: <ExamplePage /> }, // Test route for AppLayout
          { path: 'absent-request', element: <AbsentRequestPage /> },
          { path: 'checkin', element: <CheckInPage /> },
          { path: 'timekeeping', element: <TimeKeepingPage /> },
          { path: 'time-entries', element: <TimeEntriesPage /> },
          { path: 'colleagues', element: <ColleaguesPage /> },
          { path: 'profile', element: <ProfileSettingPage /> },
          { path: 'class/:classId', element: <ClassScreen /> },
          { path: 'class-info/:classId', element: <ClassInformationPage /> },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'materials', element: <AddMaterialsPage /> },
          { path: 'report', element: <ClassReportPage /> },
        ],
      },
      // --- Manager Routes ---
      {
        element: <ProtectedRoute allowedRoles={['manager']} />,
        children: [
          // { path: 'manager/reports', element: <ManagerReports /> },
          // Add other manager-specific routes here
        ],
      },
      // --- Learning Adviser Routes ---
      {
        element: <ProtectedRoute allowedRoles={['learning adviser']} />,
        children: [
          // { path: 'adviser/schedule', element: <AdviserSchedule /> },
        ],
      },
      // --- Shared Routes (accessible by multiple roles) ---
      {
        element: <ProtectedRoute allowedRoles={['teacher', 'manager', 'learning adviser']} />,
        children: [
          { path: '/', element: <Navigate to="/auth/login" replace /> }, // Default redirect
          // { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    children: [
      { path: 'login', element: <AuthPage /> },
      { path: 'forget-password/email', element: <AuthPage /> },
      { path: 'forget-password/verify', element: <AuthPage /> },
      { path: 'forget-password/new-password', element: <AuthPage /> },
    ],
  },
  // Catch-all for 404 Not Found pages
  {
    path: '*',
    element: <NotFoundPage />,
  },
]); 