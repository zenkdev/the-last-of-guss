import { useAuth } from '@/shared/lib';

export function RoundsListHeader() {
  const { user } = useAuth();

  return (
    <div className="relative flex items-center mb-8 border-2 border-console-green p-4 bg-console-bg rounded-lg console-border">
      <h1 className="text-2xl font-bold console-text console-glow absolute left-1/2 transform -translate-x-1/2 m-0">Список РАУНДОВ</h1>
      <div className="text-base console-text ml-auto">{user?.username}</div>
    </div>
  );
}
