import type { Round } from './round.entity';

export type RoundDto = Round & {
  myScore: number;
  winner?: string;
  winnerScore?: number;
};

export type ScoreDto = { score: number };
