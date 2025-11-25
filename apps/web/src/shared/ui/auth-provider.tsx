import { currentUser } from '@/shared/api';
import { AuthContext } from '@/shared/lib';
import { useQuery } from '@tanstack/react-query';
import { type ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => currentUser(),
  });
  if (isError) {
    console.error(error);
  }

  return <AuthContext.Provider value={{ user: user ?? null, isLoading, refetch }}>{children}</AuthContext.Provider>;
};
