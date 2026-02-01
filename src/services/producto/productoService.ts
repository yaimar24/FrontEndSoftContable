import { apiClient } from '../../api/apiClient';
import type { ProductoReadDTO, ProductoCreateDTO } from '../../models/Producto';
import type { ApiResponse } from '../../models/types/ApiResponse';

/**
 * Obtiene la lista de todos los productos del colegio actual
 */
export const getProductosByColegio = async (): Promise<ApiResponse<ProductoReadDTO[]>> => {
  return apiClient('/api/Producto');
};

/**
 * Crea un nuevo producto con su configuración de precios e impuestos
 */
export const crearProducto = async (data: ProductoCreateDTO): Promise<ApiResponse<string>> => {
  return apiClient('/api/Producto', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Actualiza la información de un producto existente
 */
export const updateProducto = async (id: string, data: Partial<ProductoCreateDTO>): Promise<ApiResponse<string>> => {
  return apiClient(`/api/Producto/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Obtiene los parámetros maestros necesarios para el formulario de productos
 * (Categorías, Impuestos, Unidades de Medida DIAN)
 */
export const getProductoParametros = async (): Promise<ApiResponse<any>> => {
  return apiClient('/api/Parametros/productos');
};

/**
 * Cambia la visibilidad o estado del producto
 */
export const toggleProductoStatus = async (id: string): Promise<ApiResponse<string>> => {
  return apiClient(`/api/Producto/status/${id}`, {
    method: 'PATCH',
  });
};