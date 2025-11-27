import { getRound } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';

export default function RoundDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    data: round,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['round', id],
    queryFn: () => getRound(id!),
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="p-8 text-center console-text relative z-10">
        <div className="text-red-500 mb-4 console-glow">Неверный ID раунда</div>
        <Link
          to="/"
          className="px-4 py-2 bg-console-bg border-2 border-console-green text-console-green no-underline rounded inline-block hover:bg-console-green hover:text-console-bg transition-all console-border"
        >
          Вернуться к списку
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center console-text animate-pulse relative z-10">
        <div>Загрузка деталей раунда...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center console-text relative z-10">
        <div className="text-red-500 mb-4 console-glow">Ошибка при загрузке раунда</div>
        <Link
          to="/"
          className="px-4 py-2 bg-console-bg border-2 border-console-green text-console-green no-underline rounded inline-block hover:bg-console-green hover:text-console-bg transition-all console-border"
        >
          Вернуться к списку
        </Link>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="p-8 text-center console-text relative z-10">
        <div>Раунд не найден</div>
        <Link
          to="/"
          className="px-4 py-2 mt-4 bg-console-bg border-2 border-console-green text-console-green no-underline rounded inline-block hover:bg-console-green hover:text-console-bg transition-all console-border"
        >
          Вернуться к списку
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 border-green-600';
      case 'completed':
        return 'bg-gray-600 border-gray-600';
      case 'pending':
        return 'bg-yellow-500 border-yellow-500';
      default:
        return 'bg-gray-600 border-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'completed':
        return 'Завершен';
      case 'pending':
        return 'Ожидает';
      default:
        return status;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-console relative z-10">
      <div className="mb-8">
        <Link
          to="/"
          className="px-4 py-2 mb-4 bg-console-bg border-2 border-console-green text-console-green no-underline rounded inline-block hover:bg-console-green hover:text-console-bg transition-all console-border"
        >
          ← Назад к списку
        </Link>
      </div>

      <div className="bg-console-bg border-2 border-console-green rounded-lg p-8 console-border console-text">
        <div className="flex justify-between items-start mb-6">
          <h1 className="m-0 text-3xl console-glow">{round.id}</h1>
          <span className={`px-4 py-2 rounded-xl text-sm font-medium text-white border-2 ${getStatusColor(round.status)}`}>
            {getStatusText(round.status)}
          </span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-8">
          <div>
            <h3 className="text-sm text-console-green-dark mb-2 uppercase">ID раунда</h3>
            <p className="text-lg m-0 console-glow">#{round.id}</p>
          </div>

          {round.participants !== undefined && (
            <div>
              <h3 className="text-sm text-console-green-dark mb-2 uppercase">Участников</h3>
              <p className="text-lg m-0">{round.participants}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm text-console-green-dark mb-2 uppercase">Создан</h3>
            <p className="text-lg m-0">{new Date(round.createdAt).toLocaleString('ru-RU')}</p>
          </div>

          <div>
            <h3 className="text-sm text-console-green-dark mb-2 uppercase">Обновлен</h3>
            <p className="text-lg m-0">{new Date(round.updatedAt).toLocaleString('ru-RU')}</p>
          </div>
        </div>

        {round.winner && (
          <div className="p-6 bg-console-bg border-2 border-green-600 rounded-lg console-border">
            <h2 className="text-xl mb-2 console-glow">🏆 Победитель</h2>
            <p className="text-2xl text-green-600 font-bold m-0 console-glow">{round.winner}</p>
          </div>
        )}
      </div>
    </div>
  );
}
