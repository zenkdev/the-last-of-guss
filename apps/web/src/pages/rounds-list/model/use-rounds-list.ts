import { createRound, getRounds } from '@/shared/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export function useRoundsList() {
  const navigate = useNavigate();
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

  return {
    rounds,
    isLoading,
    error,
    createMutation,
    handleCreateRound,
  };
}
