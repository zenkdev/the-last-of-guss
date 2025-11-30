export interface Round {
  id: string;
  startAt: string;
  endAt: string;
  status: 'completed' | 'active' | 'cooldown';
  totalScore: number;
  myScore?: number;
  winner?: string;
  winnerScore?: number;
}
