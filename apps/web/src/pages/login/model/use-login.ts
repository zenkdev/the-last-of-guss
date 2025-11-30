import { login } from '@/shared/api';
import { useAuth } from '@/shared/lib';
import { useState } from 'react';

export function useLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Вход не выполнен. Пожалуйста, попробуйте снова.');
      } else {
        setError('Вход не выполнен. Пожалуйста, попробуйте снова.');
      }
    } finally {
      setUsername('');
      setPassword('');
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
}
