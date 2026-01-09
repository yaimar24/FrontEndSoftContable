import type { LoginData, LoginRequest } from "../models/Auth";
import type { ApiResponse } from "../models/types/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async (payload: LoginRequest): Promise<ApiResponse<LoginData>> => {
  try {
    const res = await fetch(`${BASE_URL}/Colegio/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<LoginData> = await res.json();

    return data;

  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "Error de conexión al servidor",
    };
  }
};
