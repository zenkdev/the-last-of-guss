import type { User } from '@/shared/model';
import { createContext, useContext } from 'react';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  refetch: () => void;
}

export const AuthContext = createContext<AuthContextValue>({ user: null, isLoading: true, refetch: () => {} });

export const useAuth = () => useContext(AuthContext);
