import { apiClient } from '../../api/apiClient';
import type { ProductoReadDTO, ProductoCreateDTO } from '../../models/Producto';
import type { ApiResponse } from '../../models/types/ApiResponse';

/**
 * Obtiene la lista de productos del colegio actual
 * @returns ApiResponse<ProductoReadDTO[]> Lista de productos
 */
export const getProductosByColegio = async (): Promise<ApiResponse<ProductoReadDTO[]>> => {
  try {
    const response = await apiClient('/api/Producto');
    return response as ApiResponse<ProductoReadDTO[]>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al obtener productos',
    };
  }
};

/**
 * Crea un nuevo producto
 * @returns ApiResponse<string> Mensaje de éxito
 */
export const crearProducto = async (data: ProductoCreateDTO): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient('/api/Producto', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as ApiResponse<string>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al crear producto',
    };
  }
};

/**
 * Actualiza un producto existente
 * @returns ApiResponse<string> Mensaje de éxito
 */
export const updateProducto = async (id: string, data: Partial<ProductoCreateDTO>): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient(`/api/Producto/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response as ApiResponse<string>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al actualizar producto',
    };
  }
};

/**
 * Obtiene los parámetros maestros para el formulario de productos
 * @returns ApiResponse<any> Parámetros (categorías, impuestos, unidades)
 */
export const getProductoParametros = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient('/api/Parametros/productos');
    return response as ApiResponse<any>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al obtener parámetros de productos',
    };
  }
};

/**
 * Cambia el estado del producto
 * @returns ApiResponse<string> Mensaje de éxito
 */
export const toggleProductoStatus = async (id: string): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient(`/api/Producto/status/${id}`, {
      method: 'PATCH',
    });
    return response as ApiResponse<string>;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Error al cambiar estado del producto',
    };
  }
};