import { currentUser } from '@/shared/api';
import { AuthContext } from '@/shared/lib';
import { tokenStorage } from '@/shared/lib/token-storage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, type ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => currentUser(),
  });

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and user
          tokenStorage.remove();
          refetch();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [refetch]);

  return <AuthContext.Provider value={{ user: user ?? null, isLoading, refetch }}>{children}</AuthContext.Provider>;
};
