import type { Round } from '@/shared/model';

export interface RoundWithDates extends Omit<Round, 'startAt' | 'endAt'> {
  startAt: Date;
  endAt: Date;
}

export function adaptRound(round: Round): RoundWithDates {
  return {
    ...round,
    startAt: new Date(round.startAt),
    endAt: new Date(round.endAt),
  };
}
