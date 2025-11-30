import { useAuth } from '@/shared/lib';

interface CreateRoundButtonProps {
  isPending: boolean;
  onCreateRound: () => void;
}

export function CreateRoundButton({ isPending, onCreateRound }: CreateRoundButtonProps) {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  return (
    isAdmin && (
      <div className="mb-6">
        <button
          onClick={onCreateRound}
          disabled={isPending}
          className={`px-6 py-3 bg-console-bg border-2 border-console-green text-console-green rounded-lg cursor-pointer text-base font-bold console-border transition-all ${
            isPending ? 'opacity-60 cursor-not-allowed' : 'hover:bg-console-green hover:text-console-bg console-glow'
          }`}
        >
          {isPending ? 'Создание...' : 'Создать раунд'}
        </button>
      </div>
    )
  );
}
