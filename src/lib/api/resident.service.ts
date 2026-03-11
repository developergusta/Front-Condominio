import { fetchApi } from './client';
import { CreateResidentRequest, ResidentResponse } from '@/types';

export const residentService = {
  create: (data: CreateResidentRequest) => 
    fetchApi<ResidentResponse>('/residents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
