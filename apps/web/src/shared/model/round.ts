export interface Round {
  id: string;
  startAt: string;
  endAt: string;
  totalScore: number;
  myScore?: number;
  winner?: string;
  winnerScore?: number;
}
