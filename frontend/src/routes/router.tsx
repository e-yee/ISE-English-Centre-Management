import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthPage from '../pages/auth/AuthPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
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
  {
    path: '*',
    element: <NotFoundPage />,
  },
]); 