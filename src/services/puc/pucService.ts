import { apiClient } from '../../api/apiClient';

export interface PucNodo {
  codigo: string;
  nombre: string;
  nivel: number;
  esDetalle: boolean;
  naturaleza: string;
  hijos: PucNodo[];
}

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