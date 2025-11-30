import { Loading } from '@/shared/ui';
import { useRoundsList } from '../model';
import { CreateRoundButton } from './create-round-button';
import { RoundsListEmpty } from './rounds-list-empty';
import { RoundsListError } from './rounds-list-error';
import { RoundsListHeader } from './rounds-list-header';
import { RoundsListItem } from './rounds-list-item';

export function RoundsListPage() {
  const { rounds, isLoading, error, createMutation, handleCreateRound } = useRoundsList();

  if (isLoading) {
    return <Loading text="Загрузка раундов..." />;
  }

  if (error) {
    return <RoundsListError />;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-console relative z-10">
      <RoundsListHeader />

      <CreateRoundButton isPending={createMutation.isPending} onCreateRound={handleCreateRound} />

      {!rounds || rounds.length === 0 ? (
        <RoundsListEmpty />
      ) : (
        <div className="flex flex-col gap-4">
          {rounds.map(round => (
            <RoundsListItem key={round.id} data={round} />
          ))}
        </div>
      )}
    </div>
  );
}
