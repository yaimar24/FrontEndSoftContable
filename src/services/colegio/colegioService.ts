import { apiClient } from '../../api/apiClient';
import type { Colegio } from '../../models/Colegio';
import type { ApiResponse } from '../../models/types/ApiResponse';
import { toFormData } from '../../utils/toFormData';

/**
 * Registra un nuevo colegio
 * @returns ApiResponse<Colegio> con success, message y data (colegio creado)
 */
export const registerColegio = async (data: Colegio): Promise<ApiResponse<Colegio>> => {
  try {
    const response = await apiClient('/api/Colegio/register', {
      method: 'POST',
      body: toFormData(data),
      useAuth: false
    });
    return response as ApiResponse<Colegio>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al registrar colegio',
    };
  }
};

export const getColegioById = async (): Promise<Colegio> => {
  try {
    const response = await apiClient(`/api/Colegio/detalle`);
    return (response as ApiResponse<Colegio>).data || {} as Colegio;
  } catch (error) {
    console.error('Error al obtener colegio:', error);
    return {} as Colegio;
  }
};

/**
 * Actualiza los datos del colegio
 * @returns ApiResponse<Colegio> Datos actualizados del colegio
 */
export const updateColegio = async (id: string, data: Partial<Colegio>): Promise<ApiResponse<Colegio>> => {
  try {
    const body = new FormData();

    // Lógica de mapeo recursivo escalable
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.entries(item).forEach(([subKey, subValue]) => {
            if (subValue != null) {
              const k = key.charAt(0).toUpperCase() + key.slice(1);
              const sk = subKey.charAt(0).toUpperCase() + subKey.slice(1);
              body.append(`${k}[${index}].${sk}`, subValue.toString());
            }
          });
        });
      } else if (key === 'logo' && value instanceof File) {
        body.append(key, value);
      } else {
        body.append(key, value.toString());
      }
    });

    const response = await apiClient(`/api/Colegio/${id}`, {
      method: 'PUT',
      body
    });
    return response as ApiResponse<Colegio>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al actualizar colegio',
    };
  }
};