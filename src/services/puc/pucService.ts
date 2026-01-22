import { apiClient } from '../../api/apiClient';
import type { PucNodo } from '../../models/puc';
import type { ApiResponse } from '../../models/types/ApiResponse';


export const getPucTree = async (): Promise<ApiResponse<PucNodo[]>> => {
  return apiClient('/api/Puc/tree');
};


export const createCuentaContable = async (data: { 
  codigo: string; 
  nombre: string; 
  codigoPadre?: string;
  naturaleza: string;
  esDetalle: boolean;
}) => {
  return apiClient('/api/Puc', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};