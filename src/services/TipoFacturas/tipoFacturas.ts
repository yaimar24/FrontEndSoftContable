import { apiClient } from '../../api/apiClient';
import type { TipoFactura } from '../../models/TipoFactura';
import type { ApiResponse } from '../../models/types/ApiResponse';

/**
 * Obtiene los tipos de factura disponibles
 * @returns ApiResponse<TipoFactura[]> Lista de tipos de factura
 */
export const getTipoFactura = async (): Promise<ApiResponse<TipoFactura[]>> => {
  try {
    const response = await apiClient('/api/TipoFactura');
    return response as ApiResponse<TipoFactura[]>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al obtener tipos de factura',
    };
  }
};
