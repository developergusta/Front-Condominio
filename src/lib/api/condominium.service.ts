import { fetchApi } from './client';
import { CondominiumResponse, CreateCondominiumRequest } from '@/types';

export const condominiumService = {
  create: (data: CreateCondominiumRequest) => 
    fetchApi<CondominiumResponse>('/condominiums', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => 
    fetchApi<CondominiumResponse[]>('/condominiums'),
};
