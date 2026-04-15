import { apiClient } from "../../api/apiClient";
import type { ProductoReadDTO, ProductoCreateDTO } from "../../../domain/models/Producto";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

export const getProductosByColegio = async (page: number = 1, pageSize: number = 10, searchTerm: string = ""): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(searchTerm && { searchTerm }),
  });
  return await apiClient(`/api/Producto?${queryParams}`);
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

export const searchProductos = async (termino: string, tipoUso?: number, skipGlobalLoader: boolean = false): Promise<ApiResponse<ProductoReadDTO[]>> => {
  let url = `/api/Producto/buscar?termino=${encodeURIComponent(termino)}`;
  if (tipoUso !== undefined) {
    url += `&tipoUso=${tipoUso}`;
  }
  return await apiClient(url, { skipGlobalLoader });
};
