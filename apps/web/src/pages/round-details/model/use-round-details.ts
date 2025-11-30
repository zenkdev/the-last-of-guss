import { getRound, tapGoose } from '@/shared/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { adaptRound, type RoundWithDates } from './round-adapter';

export function useRoundDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    data: round,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['round', id],
    queryFn: async () => {
      const data = await getRound(id!);
      return adaptRound(data);
    },
    enabled: !!id,
  });

  const startAt = round?.startAt;
  const endAt = round?.endAt;

  const [timeRemaining, setTimeRemaining] = useState(0);
  useEffect(() => {
    // Если нет раунда, не обновляем время
    if (!startAt || !endAt) return;

    const updateTimeAndStatus = () => {
      const now = new Date();

      // Вычисляем статус
      let newStatus: 'completed' | 'active' | 'cooldown';
      if (endAt.getTime() <= now.getTime()) {
        newStatus = 'completed';
      } else if (startAt.getTime() <= now.getTime()) {
        newStatus = 'active';
      } else {
        newStatus = 'cooldown';
      }

      // Обновляем статус раунда в кэше
      queryClient.setQueryData(['round', id], (oldData: RoundWithDates | undefined) => {
        if (oldData && oldData.status != newStatus) {
          // Обновление данных при завершении раунда
          if (newStatus === 'completed') {
            // Небольшая задержка, чтобы сервер успел обновиться
            setTimeout(() => refetch(), 300);
          } else {
            return {
              ...oldData,
              status: newStatus,
            };
          }
        }

        return oldData;
      });

      // Вычисляем оставшееся время
      if (newStatus === 'cooldown') {
        // cooldown - время до начала
        setTimeRemaining(Math.max(0, startAt.getTime() - now.getTime()));
      } else if (newStatus === 'active') {
        // active - время до конца
        setTimeRemaining(Math.max(0, endAt.getTime() - now.getTime()));
      } else {
        setTimeRemaining(0);
      }
    };

    // Обновляем сразу
    updateTimeAndStatus();

    // Обновляем каждую секунду
    const interval = setInterval(updateTimeAndStatus, 1000);

    return () => clearInterval(interval);
  }, [startAt, endAt, refetch]);

  const queryClient = useQueryClient();
  const { mutateAsync: tapAsync } = useMutation({
    mutationFn: () => tapGoose(id!),
    onSuccess: data => {
      // Обновляем данные раунда с новым счетом, но только если новое значение больше
      queryClient.setQueryData(['round', id], (oldData: RoundWithDates | undefined) => {
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

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    id,
    round,
    isLoading,
    error,
    timeString,
    tapAsync,
  };
}
