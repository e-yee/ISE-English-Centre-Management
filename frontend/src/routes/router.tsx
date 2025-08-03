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
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    // This is the main application layout route
    path: '/',
    element: <AppLayout />, // AppLayout provides Header, Sidebar, and Outlet for child routes
    children: [

         // --- Teacher Routes (accessible by Teacher, Learning Advisor, Manager) ---
      {
        element: <ProtectedRoute allowedRoles={['Teacher', 'Manager', 'Learning Advisor']} />,
        children: [
          {path: 'home', element: <Homescreen />},
          {path: 'colleagues', element: <ColleaguesPage />},
          { path: 'example', element: <ExamplePage /> },
          { path: 'absent-request', element: <AbsentRequestPage /> },
          { path: 'checkin', element: <CheckInPage /> },
          { path: 'timekeeping', element: <TimeKeepingPage /> },
          { path: 'time-entries', element: <TimeEntriesPage /> },
          { path: 'profile', element: <ProfileSettingPage /> },
          { path: 'class/:classId', element: <ClassScreen /> },
          { path: 'class-info/:classId', element: <ClassInformationPage /> },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'materials', element: <AddMaterialsPage /> },
          { path: 'report', element: <ClassReportPage /> },
        ],
      },
      
      // --- Learning Advisor Routes (accessible by Learning Advisor and Manager) ---
      {
        element: <ProtectedRoute allowedRoles={['Manager', 'Learning Advisor']} />,
        children: [
          // Add Learning Advisor specific routes here
          // { path: 'adviser/schedule', element: <AdviserSchedule /> },
        ],
      },
      
      // --- Manager Routes (accessible only by Manager) ---
      {
        element: <ProtectedRoute allowedRoles={['Manager']} />,
        children: [
          // Add Manager specific routes here
        ],
      },
      
      // Fallback redirect for authenticated users at the root
      {
        element: (
          <ProtectedRoute
            allowedRoles={['Teacher', 'Manager', 'Learning Advisor']}
          />
        ),
        children: [{ path: '/', element: <Navigate to="/home" replace /> }],
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