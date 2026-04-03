import { apiClient } from '../../api/apiClient';
import type { Parametros } from '../../models/Parametros';
import type { ApiResponse } from '../../models/types/ApiResponse';

export const getParametros = async (): Promise<ApiResponse<Parametros>> => {
  try {
    const response = await apiClient('/api/Parametros/parametros', {
      useAuth: false
    });
    return response as ApiResponse<Parametros>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al cargar parámetros',
    };
  }
};