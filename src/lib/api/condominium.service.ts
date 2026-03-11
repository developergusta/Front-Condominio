import { fetchApi } from './client';
import { CondominiumResponse, CreateCondominiumRequest, CondominiumDashboardResponse } from '@/types';

export const condominiumService = {
  create: (data: CreateCondominiumRequest) => 
    fetchApi<CondominiumResponse>('/condominiums', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => 
    fetchApi<CondominiumResponse[]>('/condominiums'),

  getDashboard: (id: string) =>
    fetchApi<CondominiumDashboardResponse>(`/condominiums/${id}/dashboard`),

  update: (id: string, data: { contactEmail: string; rulesText: string }) =>
    fetchApi<CondominiumResponse>(`/condominiums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
