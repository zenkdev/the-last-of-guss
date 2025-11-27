import { login } from '@/shared/api';
import { useAuth } from '@/shared/lib';
import { useState } from 'react';

export default function Login() {
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

  return (
    <div className="flex justify-center items-center min-h-screen font-console relative z-10">
      <form
        onSubmit={handleSubmit}
        className="bg-console-bg border-2 border-console-green p-8 rounded-lg w-full max-w-md console-border console-text"
      >
        <h1 className="mt-0 mb-6 text-center uppercase console-glow">Войти</h1>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 font-medium text-sm console-text"
          >
            Имя пользователя:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-3 border-2 border-console-green rounded text-base box-border bg-console-bg text-console-green focus:outline-none focus:border-console-green-light focus:ring-2 focus:ring-console-green console-border disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 font-medium text-sm console-text"
          >
            Пароль:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-3 border-2 border-console-green rounded text-base box-border bg-console-bg text-console-green focus:outline-none focus:border-console-green-light focus:ring-2 focus:ring-console-green console-border disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 border-2 border-console-green rounded text-base font-medium console-border ${
            isLoading
              ? 'bg-console-bg text-console-green cursor-not-allowed opacity-60'
              : 'bg-console-bg text-console-green cursor-pointer hover:bg-console-green hover:text-console-bg console-glow'
          } transition-all`}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        {error && (
          <div className="p-3 mb-4 bg-red-900/30 border border-red-500 text-red-400 rounded text-sm console-border mt-4">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
