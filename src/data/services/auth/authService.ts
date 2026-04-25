import type { LoginData, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from "../../../domain/models/Auth";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async (payload: LoginRequest): Promise<ApiResponse<LoginData>> => {
  try {
    const res = await fetch(`${BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "Error de conexión al servidor",
    };
  }
};

export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
  try {
    const res = await fetch(`${BASE_URL}/api/Auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "Error de conexión al servidor",
    };
  }
};

export const resetPassword = async (payload: ResetPasswordRequest): Promise<ApiResponse<null>> => {
  try {
    const res = await fetch(`${BASE_URL}/api/Auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "Error de conexión al servidor",
    };
  }
};

