import type { Colegio } from '../models/Colegio';
import type { ApiResponse } from '../models/types/ApiResponse';

const BASE_URL = import.meta.env.VITE_API_URL;

// --- POST: Registro ---
export const registerColegio = async (
  data: Colegio
): Promise<ApiResponse<Colegio>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const res = await fetch(`${BASE_URL}/Colegio/register`, {
    method: 'POST',
    body: formData,
  });

  return await res.json();
};

// --- GET: Obtener por ID ---
export const getColegioById = async (id: string): Promise<Colegio> => {
  const res = await fetch(`${BASE_URL}/Colegio/${id}/detalle`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Si usas autenticación, descomenta la siguiente línea:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
    },
  });

  if (!res.ok) throw new Error('Error al obtener los datos del colegio');
  
  const result: Colegio = await res.json();
  // Asumiendo que el objeto Colegio viene dentro de result.data o result directamente
  return result as Colegio; 
};

// --- PUT: Actualizar ---
export const updateColegio = async (
  id: string,
  data: Partial<Colegio>
): Promise<ApiResponse<Colegio>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Manejo especial para arrays (como representantesLegales)
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const res = await fetch(`${BASE_URL}/Colegio/${id}`, {
    method: 'PUT',
    body: formData,
    // Nota: No se pone 'Content-Type' manualmente cuando se envía FormData, 
    // el navegador lo hace automáticamente incluyendo el boundary.
  });

  const result: ApiResponse<Colegio> = await res.json();
  return result;
};