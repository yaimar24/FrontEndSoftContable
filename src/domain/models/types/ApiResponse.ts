/**
 * Estructura base de respuestas del backend
 * Basada en ApiResponseDTO<T> de C#
 * 
 * @template T - Tipo de datos en la respuesta
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Utilities para trabajar con ApiResponse
 */
export const ApiResponseUtils = {
  /**
   * Verifica si una respuesta fue exitosa
   */
  isSuccess: <T>(response: ApiResponse<T>): boolean => {
    return response?.success === true;
  },

  /**
   * Obtiene los datos seguros de una respuesta
   */
  getData: <T>(response: ApiResponse<T>): T | null => {
    return ApiResponseUtils.isSuccess(response) ? response.data ?? null : null;
  },

  /**
   * Obtiene el mensaje de error o éxito
   */
  getMessage: <T>(response: ApiResponse<T>): string => {
    return response?.message ?? 'Error desconocido';
  },
};