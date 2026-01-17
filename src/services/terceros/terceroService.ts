import { apiClient } from '../../api/apiClient';
import type { TerceroCreateDTO } from '../../models/Tercero';
import type { ApiResponse } from '../../models/types/ApiResponse';

export const vincularTercero = async (data: TerceroCreateDTO): Promise<any> => {
  return apiClient('/api/Tercero/vincular', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getTercerosByColegio = async (): Promise<ApiResponse<any[]>> => {
  return apiClient('/api/Tercero');
};

export const updateTercero = async (id: string | number, data: any): Promise<ApiResponse<string>> => {
  return apiClient(`/api/Tercero/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};