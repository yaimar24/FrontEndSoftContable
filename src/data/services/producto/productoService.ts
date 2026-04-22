import { apiClient } from "../../api/apiClient";
import type { ProductoReadDTO, ProductoCreateDTO } from "../../../domain/models/Producto";
import type { ApiResponse, PaginatedResponse } from "../../../domain/models/types/ApiResponse";
import { buildQueryParams } from "../../../utils/queryBuilder";

export const getProductosByColegio = async (page: number = 1, pageSize: number = 10, searchTerm: string = ""): Promise<ApiResponse<PaginatedResponse<ProductoReadDTO>>> => {
  const query = buildQueryParams({ page, pageSize, searchTerm: searchTerm || undefined });
  return await apiClient(`/api/Producto?${query}`);
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

export const getProductoParametros = async (): Promise<ApiResponse<Record<string, unknown>>> => {
  return await apiClient("/api/Parametros/productos");
};

export const toggleProductoStatus = async (id: string): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/Producto/status/${id}`, {
    method: "PATCH",
  });
};

export const searchProductos = async (termino: string, tipoUso?: number, skipGlobalLoader: boolean = false): Promise<ApiResponse<ProductoReadDTO[]>> => {
  let url = `/api/Producto/buscar?termino=${encodeURIComponent(termino)}`;
  if (tipoUso !== undefined) {
    url += `&tipoUso=${tipoUso}`;
  }
  return await apiClient(url, { skipGlobalLoader });
};
