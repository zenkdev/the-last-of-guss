import { useLogin } from '../model';
import { LoginButton } from './login-button';
import { LoginError } from './login-error';
import { LoginInput } from './login-input';

export function LoginPage() {
  const { username, setUsername, password, setPassword, error, isLoading, handleSubmit } = useLogin();

  return (
    <div className="flex justify-center items-center min-h-screen font-console relative z-10">
      <form
        onSubmit={handleSubmit}
        className="bg-console-bg border-2 border-console-green p-8 rounded-lg w-full max-w-md console-border console-text"
      >
        <h1 className="mt-0 mb-6 text-center uppercase console-glow">Войти</h1>

        <LoginInput
          id="username"
          label="Имя пользователя:"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        <LoginInput
          id="password"
          label="Пароль:"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <LoginButton isLoading={isLoading} />

        <LoginError error={error} />
      </form>
    </div>
  );
}
