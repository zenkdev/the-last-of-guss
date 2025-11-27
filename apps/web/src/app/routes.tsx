import Login from '@/pages/login';
import RoundDetails from '@/pages/round-details';
import RoundsList from '@/pages/rounds-list';
import { useAuth } from '@/shared/lib';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router';

export default function Routes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-console console-text">
        <div className="animate-pulse console-glow">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <RouterRoutes>
        <Route path="*" element={<Login />} />
      </RouterRoutes>
    );
  }

  return (
    <RouterRoutes>
      <Route path="/" element={<RoundsList />} />
      <Route path="/rounds/:id" element={<RoundDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}
