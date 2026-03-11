import { fetchApi } from './client';
import { CreateResidentRequest, LoginRequest, AuthResponse } from '@/types';

export const authService = {
  register: (data: CreateResidentRequest) => 
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) => 
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
