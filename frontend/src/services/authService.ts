// src/services/authService.ts
import api from '../utils/api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  const response = await api.post('/users/register', data);
  return response.data;
}

export async function login(data: LoginData) {
  const response = await api.post('/users/login', data);
  return response.data; // expect { token, user }
}
