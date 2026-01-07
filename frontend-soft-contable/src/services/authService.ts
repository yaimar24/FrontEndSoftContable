import type { LoginData, LoginRequest } from "../models/Auth";
import type { ApiResponse } from "../models/types/ApiResponse";


const API_URL = 'https://localhost:7260/api/Colegio/login';

export const login = async (payload: LoginRequest): Promise<ApiResponse<LoginData>> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Error en la petición de login');

  const data: ApiResponse<LoginData> = await res.json();
  return data;
};
