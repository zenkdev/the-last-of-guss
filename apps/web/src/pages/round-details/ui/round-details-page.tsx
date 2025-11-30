import { Loading } from '@/shared/ui';
import { useRoundDetails } from '../model';
import { RoundDetailsActive } from './round-details-active';
import { RoundDetailsBoard } from './round-details-board';
import { RoundDetailsCompleted } from './round-details-completed';
import { RoundDetailsCooldown } from './round-details-cooldown';
import { RoundDetailsError } from './round-details-error';
import { RoundDetailsHeader } from './round-details-header';

export function RoundDetailsPage() {
  const { id, round, isLoading, error, timeString, tapAsync } = useRoundDetails();

  if (!id) {
    return <RoundDetailsError message="Неверный ID раунда" />;
  }

  if (isLoading) {
    return <Loading text="Загрузка деталей раунда..." />;
  }

  if (error) {
    return <RoundDetailsError message="Ошибка при загрузке раунда" />;
  }

  if (!round) {
    return <RoundDetailsError message="Раунд не найден" />;
  }

  const { status } = round;

  return (
    <div className="p-8 max-w-2xl mx-auto font-console relative z-10">
      <div className="bg-console-bg border-2 border-console-green rounded-lg console-border console-text">
        <RoundDetailsHeader status={status} />

        <RoundDetailsBoard onClick={() => tapAsync()} />

        {status === 'active' && <RoundDetailsActive timeString={timeString} myScore={round.myScore ?? 0} />}
        {status === 'completed' && (
          <RoundDetailsCompleted
            totalScore={round.totalScore ?? 0}
            myScore={round.myScore ?? 0}
            winner={round.winner}
            winnerScore={round.winnerScore}
          />
        )}
        {status === 'cooldown' && <RoundDetailsCooldown timeString={timeString} />}
      </div>
    </div>
  );
}
