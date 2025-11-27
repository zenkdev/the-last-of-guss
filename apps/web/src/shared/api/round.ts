import axios from 'axios';
import type { Round } from '../model';

export const getRounds = async (): Promise<Round[]> => {
  const response = await axios.get<Round[]>('/api/rounds');
  return response.data;
};

export const getRound = async (id: string): Promise<Round> => {
  const response = await axios.get<Round>(`/api/rounds/${id}`);
  return response.data;
};

export const createRound = async (): Promise<Round> => {
  const response = await axios.post<Round>('/api/rounds');
  return response.data;
};

export const tapGoose = async (roundId: string): Promise<{ score: number }> => {
  const response = await axios.post<{ score: number }>(`/api/rounds/${roundId}/tap`);
  return response.data;
};
