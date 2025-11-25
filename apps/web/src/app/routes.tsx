import { useAuth } from '@/shared/lib';
import Login from './login';

export default function Routes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return <div>User: {user.username}</div>;
}
