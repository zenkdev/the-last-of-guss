import axios from 'axios';
import { tokenStorage } from '../lib/token-storage';
import type { User } from '../model';

export interface LoginResponse {
  token: string;
  expiresAt: Date;
}

export const currentUser = async (): Promise<User | null> => {
  const token = tokenStorage.get();

  if (!token) {
    return null;
  }

  try {
    const response = await axios.get<User>('/api/user/current');

    return response.data;
  } catch {
    // Токен недействителен или истек, удаляем его
    tokenStorage.remove();
    return null;
  }
};
