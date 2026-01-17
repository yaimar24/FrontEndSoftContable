import { apiClient } from '../../api/apiClient';
import type { PucNodo } from '../../models/puc';


export const getPucTree = async (): Promise<PucNodo[]> => {
  return apiClient('/api/Puc/tree');
};

export const createCuentaContable = async (data: { codigo: string; nombre: string; codigoPadre?: string }) => {
  return apiClient('/api/CuentasContables', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const buscarEnPucMaestro = async (codigo: string) => {
  return apiClient(`/api/Puc/buscar/${codigo}`);
};