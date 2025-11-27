import { createRound, getRounds } from '@/shared/api';
import { useAuth } from '@/shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'completed':
        return 'Cooldown';
      case 'pending':
        return 'Ожидает';
      case 'cooldown':
        return 'Cooldown';
      default:
        return status;
    }
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
      <div className="flex justify-between items-center mb-8 border-2 border-console-green p-4 bg-console-bg rounded-lg console-border">
        <h1 className="m-0 text-2xl font-bold console-text console-glow">Список РАУНДОВ</h1>
        <div className="text-base console-text">{user?.username || 'Игрок'}</div>
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
          {rounds.map(round => {
            const startDate = round.startDate || round.createdAt;
            const endDate = round.endDate || round.updatedAt;
            const displayStatus = round.status === 'completed' ? 'cooldown' : round.status;

            return (
              <Link
                key={round.id}
                to={`/rounds/${round.id}`}
                className="border-2 border-console-green bg-console-bg p-6 rounded-lg cursor-pointer transition-all hover:bg-console-green/10 hover:border-console-green-light console-border console-text"
              >
                <div className="mb-4">
                  <div className="text-base font-bold mb-2 console-glow">● Round ID: {round.id}</div>
                </div>

                <div className="mb-4 leading-relaxed">
                  <div>Start: {formatDateTime(startDate)}</div>
                  <div>End: {formatDateTime(endDate)}</div>
                </div>

                <div className="border-t border-console-green mt-4 pt-4">
                  <div>Статус: {getStatusText(displayStatus)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
