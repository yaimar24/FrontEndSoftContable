import { apiClient } from "../../api/apiClient";
import type { ProductoReadDTO, ProductoCreateDTO } from "../../models/Producto";
import type { ApiResponse } from "../../models/types/ApiResponse";

export const getProductosByColegio = async (): Promise<ApiResponse<ProductoReadDTO[]>> => {
  return await apiClient("/api/Producto");
};

export const crearProducto = async (data: ProductoCreateDTO): Promise<ApiResponse<string>> => {
  return await apiClient("/api/Producto", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProducto = async (id: string, data: Partial<ProductoCreateDTO>): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/Producto/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getProductoParametros = async (): Promise<ApiResponse<any>> => {
  return await apiClient("/api/Parametros/productos");
};

export const toggleProductoStatus = async (id: string): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/Producto/status/${id}`, {
    method: "PATCH",
  });
};

export const searchProductos = async (termino: string, skipGlobalLoader: boolean = false): Promise<ApiResponse<ProductoReadDTO[]>> => {
  return await apiClient(`/api/Producto/search?termino=${encodeURIComponent(termino)}`, { skipGlobalLoader });
};
