import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RootRedirector = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        let path = '/home';
        if (user.role === 'Manager' || user.role === 'Learning Advisor') {
          path = '/dashboard';
        }
        navigate(path, { replace: true });
      } else {
        navigate('/auth/login', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null; 
};

export default RootRedirector;
