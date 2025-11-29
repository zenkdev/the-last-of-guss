import { formatDateTime, getStatusText } from '@/shared/lib';
import type { Round } from '@/shared/model/round';
import { Link } from 'react-router';

interface RoundItemProps {
  data: Round;
}

export function RoundItem({ data }: RoundItemProps) {
  return (
    <Link
      key={data.id}
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
        <div>Статус: {getStatusText(data.startAt, data.endAt)}</div>
      </div>
    </Link>
  );
}
