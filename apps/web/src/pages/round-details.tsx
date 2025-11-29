import { getRound, tapGoose } from '@/shared/api';
import { getStatusText, useAuth } from '@/shared/lib';
import { Goose } from '@/shared/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';

export default function RoundDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const {
    data: round,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['round', id],
    queryFn: () => getRound(id!),
    enabled: !!id,
  });

  // Refetch data when round ends
  const hasRefetchedRef = useRef(false);
  useEffect(() => {
    if (!round) return;

    const endDate = new Date(round.endAt);
    const isEnded = endDate.getTime() <= now.getTime();

    // Refetch once when round ends (transitions to completed)
    if (isEnded && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;
      // Small delay to ensure server has updated
      const timeout = setTimeout(() => {
        refetch();
      }, 500);

      return () => clearTimeout(timeout);
    }

    // Reset refetch flag if round is not ended (for new rounds)
    if (!isEnded) {
      hasRefetchedRef.current = false;
    }
  }, [round, now, refetch]);

  const queryClient = useQueryClient();
  const { mutateAsync: tapAsync } = useMutation({
    mutationFn: () => tapGoose(id!),
    onSuccess: data => {
      // Update the round data with the new score, but only if the new value is greater
      queryClient.setQueryData(['round', id], (oldData: typeof round) => {
        if (oldData && data.score > (oldData.myScore ?? 0)) {
          return {
            ...oldData,
            myScore: data.score,
          };
        }

        return oldData;
      });
    },
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

  const startDate = new Date(round.startAt);
  const endDate = new Date(round.endAt);

  let timeRemaining = 0;
  if (startDate > now) {
    // Cooldown - time until start
    timeRemaining = Math.max(0, startDate.getTime() - now.getTime());
  } else if (endDate > now) {
    // Active - time until end
    timeRemaining = Math.max(0, endDate.getTime() - now.getTime());
  }

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const statusText = getStatusText(round.startAt, round.endAt);

  return (
    <div className="p-8 max-w-2xl mx-auto font-console relative z-10">
      <div className="bg-console-bg border-2 border-console-green rounded-lg console-border console-text">
        <div className="flex justify-between items-center p-4 border-b border-console-green">
          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-lg font-bold console-glow">
              {statusText === 'Активен' && 'Раунды'}
              {statusText === 'Завершен' && 'Раунд завершен'}
              {statusText === 'Cooldown' && 'Cooldown'}
            </Link>
          </div>
          <div className="text-lg">{user?.username}</div>
        </div>

        <Goose onClick={() => tapAsync()} />

        {statusText === 'Активен' && (
          <div className="p-4 text-center space-y-4">
            <div className="text-lg font-bold console-glow">Раунд активен!</div>
            <div className="text-lg font-bold console-glow">До конца осталось: {timeString}</div>
            <div className="text-lg font-bold console-glow">Мои очки - {round.myScore ?? 0}</div>
          </div>
        )}
        {statusText === 'Завершен' && (
          <div className="p-4 flex justify-center border-t border-console-green">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4">
              <div className="text-lg font-bold console-glow">Всего</div>
              <div className="text-lg font-bold console-glow">{round.totalScore ?? 0}</div>
              {round.winner ? (
                <>
                  <div className="text-lg font-bold console-glow">Победитель - {round.winner}</div>
                  <div className="text-lg font-bold console-glow">{round.winnerScore ?? 0}</div>
                </>
              ) : null}
              <div className="text-lg font-bold console-glow">Мои очки</div>
              <div className="text-lg font-bold console-glow">{round.myScore ?? 0}</div>
            </div>
          </div>
        )}
        {statusText === 'Cooldown' && (
          <div className="p-6 text-center">
            <div className="text-lg font-bold console-glow">Cooldown</div>
            <div className="text-lg font-bold console-glow">до начала раунда {timeString}</div>
          </div>
        )}
      </div>
    </div>
  );
}
