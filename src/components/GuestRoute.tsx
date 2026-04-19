import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  
  if (isAuthenticated) {
    return user?.is_staff ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
