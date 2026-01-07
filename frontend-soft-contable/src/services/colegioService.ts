import type { Colegio } from '../models/Colegio';
import type { ApiResponse } from '../models/types/ApiResponse';

const BASE_URL = 'https://localhost:7260';

export const registerColegio = async (
  data: Colegio
): Promise<ApiResponse<Colegio>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const res = await fetch(`${BASE_URL}/api/Colegio/register`, {
    method: 'POST',
    body: formData,
  });

  const result: ApiResponse<Colegio> = await res.json();

  return result;
};
