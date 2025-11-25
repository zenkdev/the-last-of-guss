import axios from 'axios';
import { tokenStorage } from '../lib/token-storage';

axios.interceptors.request.use(config => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginResponse {
  access_token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/login', {
    username,
    password,
  });

  if (response.data.access_token) {
    tokenStorage.set(response.data.access_token);
  }

  return response.data;
};
