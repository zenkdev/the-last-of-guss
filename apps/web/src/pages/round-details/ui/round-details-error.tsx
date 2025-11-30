import { Link } from 'react-router';

interface RoundDetailsErrorProps {
  message: string;
}

export function RoundDetailsError({ message }: RoundDetailsErrorProps) {
  return (
    <div className="p-8 text-center console-text relative z-10">
      <div className="text-red-500 mb-4 console-glow">{message}</div>
      <Link
        to="/"
        className="px-4 py-2 bg-console-bg border-2 border-console-green text-console-green no-underline rounded inline-block hover:bg-console-green hover:text-console-bg transition-all console-border"
      >
        Вернуться к списку
      </Link>
    </div>
  );
}
