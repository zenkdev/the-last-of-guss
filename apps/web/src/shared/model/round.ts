export interface Round {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cooldown';
  createdAt: string;
  updatedAt: string;
  participants?: number;
  winner?: string;
  myScore?: number;
  startDate?: string;
  endDate?: string;
}
