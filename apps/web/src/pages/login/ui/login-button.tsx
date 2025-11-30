interface LoginButtonProps {
  isLoading: boolean;
}

export function LoginButton({ isLoading }: LoginButtonProps) {
  return (
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
  );
}
