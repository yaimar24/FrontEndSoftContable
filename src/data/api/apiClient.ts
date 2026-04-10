import { loadingController } from "../services/loading/loadingController";
import type { ApiResponse } from "../../domain/models/types/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  useAuth?: boolean;
  skipGlobalLoader?: boolean;
}

/**
 * Cliente API que devuelve siempre la estructura ApiResponse del backend
 * @returns ApiResponse<T> Estructura con success, message y data
 */
export const apiClient = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<any>> => {
  const {
    useAuth = true,
    skipGlobalLoader = false,
    ...customOptions
  } = options;

  const headers: HeadersInit = {
    ...customOptions.headers,
  };

  if (!skipGlobalLoader) {
    loadingController.show();
  }

  try {
    // 🔐 Token automático
    if (useAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
      }
    }

    if (!(customOptions.body instanceof FormData)) {
      (headers as any)["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...customOptions,
      headers,
    });

    // 🚫 401 global - redirigir al login
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return {
        success: false,
        message: "Sesión expirada. Redirigiendo al login...",
      };
    }

    // Parsear respuesta
    const data: ApiResponse<any> = await response.json().catch(() => ({
      success: false,
      message: `Error HTTP ${response.status}: ${response.statusText}`,
    }));

    // Si la respuesta ya tiene estructura ApiResponse, devolverla
    if (data?.success !== undefined) {
      return data;
    }

    // Si no es exitosa pero hay estructura, devolver como está
    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `Error ${response.status}: ${response.statusText}`,
        data: data,
      };
    }

    // Si es exitosa y no tiene estructura, asumir que es data
    return {
      success: true,
      message: "",
      data,
    };
  } catch (error) {
    const message = (error as Error)?.message || "Error desconocido";
    console.error("API Error:", error);
    return {
      success: false,
      message,
    };
  } finally {
    if (!skipGlobalLoader) {
      loadingController.hide();
    }
  }
};
