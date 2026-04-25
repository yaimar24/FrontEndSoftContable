import type { ApiResponse } from "./types/ApiResponse";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  expiration: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  codigo: string;
  nuevaPassword: string;
}
