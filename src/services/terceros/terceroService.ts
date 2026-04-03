import { apiClient } from '../../api/apiClient';
import type { TerceroCreateDTO, TerceroupdateDTO } from '../../models/Tercero';
import type { ApiResponse } from '../../models/types/ApiResponse';

/**
 * Vincula un nuevo tercero al colegio actual
 * @returns ApiResponse<TerceroupdateDTO[]> Lista actualizada de terceros
 */
export const vincularTercero = async (data: TerceroCreateDTO): Promise<ApiResponse<TerceroupdateDTO[]>> => {
  try {
    const response = await apiClient('/api/Tercero/vincular', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as ApiResponse<TerceroupdateDTO[]>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al vincular tercero',
    };
  }
};

/**
 * Obtiene la lista de terceros del colegio actual
 * @returns ApiResponse<TerceroupdateDTO[]> Lista de terceros vinculados
 */
export const getTercerosByColegio = async (): Promise<ApiResponse<TerceroupdateDTO[]>> => {
  try {
    const response = await apiClient('/api/Tercero');
    return response as ApiResponse<TerceroupdateDTO[]>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al obtener terceros',
    };
  }
};

/**
 * Actualiza la información de un tercero
 * @returns ApiResponse<string> Mensaje de éxito
 */
export const updateTercero = async (id: string | number, data: TerceroupdateDTO): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient(`/api/Tercero/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response as ApiResponse<string>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al actualizar tercero',
    };
  }
};

/**
 * Desvincula un tercero del colegio
 * @returns ApiResponse<string> Mensaje de éxito
 */
export const desvincularTercero = async (terceroId: string): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient(`/api/Tercero/status/${terceroId}`, {
      method: 'PATCH',
    });
    return response as ApiResponse<string>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al desvincular tercero',
    };
  }
};
