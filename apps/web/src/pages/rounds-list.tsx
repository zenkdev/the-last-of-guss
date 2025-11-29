import { createRound, getRounds } from '@/shared/api';
import { useAuth } from '@/shared/lib';
import { RoundItem } from '@/shared/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export default function RoundsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: rounds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rounds'],
    queryFn: getRounds,
    refetchInterval: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createRound,
    onSuccess: newRound => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      navigate(`/rounds/${newRound.id}`);
    },
  });

  const handleCreateRound = () => {
    createMutation.mutateAsync();
  };

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="p-8 text-center console-text">
        <div className="animate-pulse">Загрузка раундов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center console-text">
        <div className="text-red-500 mb-4 console-glow">Ошибка при загрузке раундов</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-console-bg border border-console-green text-console-green rounded cursor-pointer hover:bg-console-green hover:text-console-bg transition-all console-border"
        >
          Обновить
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-console relative z-10">
      <div className="flex items-center mb-8 border-2 border-console-green p-4 bg-console-bg rounded-lg console-border">
        <h1 className="flex-1 m-0 text-2xl text-center font-bold console-text console-glow">Список РАУНДОВ</h1>
        <div className="text-base console-text">{user?.username}</div>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <button
            onClick={handleCreateRound}
            disabled={createMutation.isPending}
            className={`px-6 py-3 bg-console-bg border-2 border-console-green text-console-green rounded-lg cursor-pointer text-base font-bold console-border transition-all ${
              createMutation.isPending ? 'opacity-60 cursor-not-allowed' : 'hover:bg-console-green hover:text-console-bg console-glow'
            }`}
          >
            {createMutation.isPending ? 'Создание...' : 'Создать раунд'}
          </button>
        </div>
      )}

      {!rounds || rounds.length === 0 ? (
        <div className="text-center py-12 text-console-green border-2 border-console-green bg-console-bg rounded-lg console-border">
          Раунды не найдены
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rounds.map(round => (
            <RoundItem key={round.id} data={round} />
          ))}
        </div>
      )}
    </div>
  );
}
