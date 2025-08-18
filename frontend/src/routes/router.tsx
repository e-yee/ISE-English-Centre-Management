import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import AuthPage from '../pages/auth/AuthPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import Homescreen from '../pages/homescreen/Homescreen';
import AppLayout from '../components/layout/AppLayout';

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
import ScoringPage from '../pages/scoring/ScoringPage';
import CoursePage from '../pages/course/CoursePage';
import CourseClassesPage from '../pages/course/CourseClassesPage';
import ContractPage from '../pages/contract/ContractPage';
import IssuesPage from '../pages/issues/IssuesPage';
import Dashboard from '../pages/dashboard/Dashboard';
import StudentsPage from '../pages/dashboard/student/StudentsPage';
import StaffPage from '../pages/dashboard/staff/StaffPage';
import StatisticsPage from '../pages/dashboard/StatisticsPage';
import MakeupClassesPage from '../pages/makeup/MakeupClassesPage';
import RoomPage from '../pages/room/RoomPage';

export const router = createBrowserRouter([
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/auth',
    children: [
      { path: 'login', element: <AuthPage key="login" /> },
      { path: 'forget-password/email', element: <AuthPage key="forgot-email" /> },
      { path: 'reset', element: <ResetPasswordPage /> },
    ],
  },
  {
    // Protected routes - wrap AppLayout with ProtectedRoute
    element: <ProtectedRoute allowedRoles={['Teacher', 'Manager', 'Learning Advisor']} />,
    children: [
      {
        path: '/',
        element: <AppLayout />, // AppLayout provides Header, Sidebar, and Outlet for child routes
        children: [
          // --- Teacher Routes (accessible by Teacher, Learning Advisor, Manager) ---
          {path: 'home', element: <Homescreen />},
          {path: 'colleagues', element: <ColleaguesPage />},
          { path: 'absent-request', element: <AbsentRequestPage /> },
          { path: 'checkin', element: <CheckInPage /> },
          { path: 'timekeeping', element: <TimeKeepingPage /> },
          { path: 'time-entries', element: <TimeEntriesPage /> },
          { path: 'profile', element: <ProfileSettingPage /> },
          { path: 'class/:classId', element: <ClassScreen /> },
          { path: 'class-info/:classId', element: <ClassInformationPage /> },
          { path: 'attendance/:classId/:courseId/:courseDate/:term', element: <AttendancePage /> },
          { path: 'scoring/:classId/:courseId/:courseDate/:term', element: <ScoringPage /> },
          { path: 'materials', element: <AddMaterialsPage /> },
          { path: 'report/:classId/:courseId/:courseDate/:term', element: <ClassReportPage /> },
          { path: 'issues', element: <IssuesPage /> },
          // --- Manager/Learning Advisor Routes ---
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'dashboard/courses', element: <CoursePage /> },
          { path: 'dashboard/students', element: <StudentsPage /> },
          { path: 'dashboard/staff', element: <StaffPage /> },
          { path: 'dashboard/statistics', element: <StatisticsPage /> },
          { path: 'course-classes/:courseId/:courseDate', element: <CourseClassesPage /> },
          { path: 'contracts/:courseId', element: <ContractPage /> },
          { path: 'makeup-classes', element: <MakeupClassesPage /> },
          { path: 'room', element: <RoomPage /> },
        ],
      },
    ],
  },
  // Catch-all for 404 Not Found pages
  {
    path: '*',
    element: <NotFoundPage />,
  },
]); 