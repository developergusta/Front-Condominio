import { fetchApi } from './client';
import { CreateResidentRequest, LoginRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest } from '@/types';

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

  forgotPassword: (data: ForgotPasswordRequest) =>
    fetchApi<{ token: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordRequest) =>
    fetchApi<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordRequest) =>
    fetchApi<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
