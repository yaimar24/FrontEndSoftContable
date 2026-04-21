import { loadingController } from "../services/loading/loadingController";
import type { ApiResponse } from "../../domain/models/types/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  useAuth?: boolean;
  skipGlobalLoader?: boolean;
}

/**
 * Cliente API genérico con tipado fuerte.
 * @returns ApiResponse<T> Estructura con success, message y data
 */
export const apiClient = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    useAuth = true,
    skipGlobalLoader = false,
    ...customOptions
  } = options;

  const headers: Record<string, string> = {
    ...(customOptions.headers as Record<string, string>),
  };

  if (!skipGlobalLoader) {
    loadingController.show();
  }

  try {
    if (useAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (!(customOptions.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...customOptions,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return {
        success: false,
        message: "Sesión expirada. Redirigiendo al login...",
      } as ApiResponse<T>;
    }

    const data = await response.json().catch(() => ({
      success: false,
      message: `Error HTTP ${response.status}: ${response.statusText}`,
    }));

    if (data?.success !== undefined) {
      return data as ApiResponse<T>;
    }

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `Error ${response.status}: ${response.statusText}`,
        data: data,
      } as ApiResponse<T>;
    }

    return {
      success: true,
      message: "",
      data,
    } as ApiResponse<T>;
  } catch (error) {
    const message = (error as Error)?.message || "Error de conexión";
    return {
      success: false,
      message,
    } as ApiResponse<T>;
  } finally {
    if (!skipGlobalLoader) {
      loadingController.hide();
    }
  }
};
