import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.is_staff) return <Navigate to="/admin" replace />;
  
  return <>{children}</>;
}
