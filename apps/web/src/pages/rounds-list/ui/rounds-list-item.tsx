import { formatDateTime } from '@/shared/lib';
import type { Round } from '@/shared/model/round';
import { Link } from 'react-router';

interface RoundsListItemProps {
  data: Round;
}

export function RoundsListItem({ data }: RoundsListItemProps) {
  const statusText = {
    completed: 'Завершен',
    active: 'Активен',
    cooldown: 'Cooldown',
  }[data.status];

  return (
    <Link
      to={`/rounds/${data.id}`}
      className="border-2 border-console-green bg-console-bg p-6 rounded-lg cursor-pointer transition-all hover:bg-console-green/10 hover:border-console-green-light console-border console-text"
    >
      <div className="mb-4">
        <div className="text-base font-bold mb-2 console-glow">● Round ID: {data.id}</div>
      </div>

      <div className="mb-4 leading-relaxed grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <div>Start:</div>
        <div>{formatDateTime(data.startAt)}</div>
        <div>End:</div>
        <div>{formatDateTime(data.endAt)}</div>
      </div>

      <div className="border-t border-console-green mt-4 pt-4">
        <div>Статус: {statusText}</div>
      </div>
    </Link>
  );
}
