import { apiClient } from '../../api/apiClient';
import type { Colegio } from '../../models/Colegio';
import type { ApiResponse } from '../../models/types/ApiResponse';
import { toFormData } from '../../utils/toFormData';

export const registerColegio = async (data: Colegio): Promise<ApiResponse<Colegio>> => {
  // El registro no necesita Token (useAuth: false)
  return apiClient('/api/Colegio/register', {
    method: 'POST',
    body: toFormData(data),
    useAuth: false
  });
};

export const getColegioById = async (id: string): Promise<Colegio> => {
  return apiClient(`/api/Colegio/${id}/detalle`);
};

export const updateColegio = async (id: string, data: Partial<Colegio>): Promise<ApiResponse<Colegio>> => {
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

  return apiClient(`/api/Colegio/${id}`, {
    method: 'PUT',
    body
  });
};