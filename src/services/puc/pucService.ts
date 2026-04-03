import { apiClient } from '../../api/apiClient';
import type { PucNodo } from '../../models/Puc';
import type { ApiResponse } from '../../models/types/ApiResponse';

/**
 * Obtiene el árbol completo de cuentas PUC del colegio
 * @returns ApiResponse<PucNodo[]> Árbol jerárquico de cuentas
 */
export const getPucTree = async (): Promise<ApiResponse<PucNodo[]>> => {
  try {
    const response = await apiClient('/api/Puc/tree');
    return response as ApiResponse<PucNodo[]>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al obtener árbol PUC',
    };
  }
};

/**
 * Crea una nueva cuenta contable
 * @returns ApiResponse<any> Respuesta del servidor
 */
export const createCuentaContable = async (data: { 
  codigo: string; 
  nombre: string; 
  codigoPadre?: string;
  naturaleza: string;
  esDetalle: boolean;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient('/api/Puc', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response as ApiResponse<any>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al crear cuenta contable',
    };
  }
};