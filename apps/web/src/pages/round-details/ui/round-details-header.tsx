import { useAuth } from '@/shared/lib';
import { Link } from 'react-router';

interface RoundDetailsHeaderProps {
  status: 'completed' | 'active' | 'cooldown' | null;
}

export function RoundDetailsHeader({ status }: RoundDetailsHeaderProps) {
  const { user } = useAuth();

  const getHeaderText = () => {
    if (status === 'active') return 'Раунды';
    if (status === 'completed') return 'Раунд завершен';
    if (status === 'cooldown') return 'Cooldown';
    return 'Раунды';
  };

  return (
    <div className="relative flex items-center p-4 border-b border-console-green">
      <Link to="/" className="text-lg font-bold console-glow absolute left-1/2 transform -translate-x-1/2">
        {getHeaderText()}
      </Link>
      <div className="text-lg ml-auto">{user?.username}</div>
    </div>
  );
}
