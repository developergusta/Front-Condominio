import { fetchApi } from './client';
import { AdminResidentResponse, UpdateResidentRequest } from '@/types';

export const adminService = {
  getResidents: (condominiumId: string) =>
    fetchApi<AdminResidentResponse[]>(`/condominiums/${condominiumId}/admin/residents`),

  updateResident: (condominiumId: string, residentId: string, data: UpdateResidentRequest) =>
    fetchApi<void>(`/condominiums/${condominiumId}/admin/residents/${residentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  banResident: (condominiumId: string, residentId: string) =>
    fetchApi<void>(`/condominiums/${condominiumId}/admin/residents/${residentId}/ban`, {
      method: 'PUT',
    }),

  unbanResident: (condominiumId: string, residentId: string) =>
    fetchApi<void>(`/condominiums/${condominiumId}/admin/residents/${residentId}/unban`, {
      method: 'PUT',
    }),
};
