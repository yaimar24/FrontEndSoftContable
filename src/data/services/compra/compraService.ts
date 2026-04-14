import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { FacturaCompraCreateDTO, FacturaCompraReadDTO } from "../../../domain/models/FacturaCompra";

export const getCompraById = async (id: number): Promise<ApiResponse<FacturaCompraReadDTO>> => {
  return await apiClient(`/api/FacturaCompra/${id}`);
};

export const getComprasByColegio = async (page: number = 1, pageSize: number = 10, searchTerm: string = ""): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(searchTerm && { searchTerm }),
  });
  return await apiClient(`/api/FacturaCompra?${queryParams}`);
};

export const createCompra = async (compra: FacturaCompraCreateDTO): Promise<ApiResponse<FacturaCompraReadDTO>> => {
  return await apiClient("/api/FacturaCompra", {
    method: "POST",
    body: JSON.stringify(compra),
  });
};

export const updateFacturaCompra = async (id: number, compra: FacturaCompraCreateDTO): Promise<ApiResponse<FacturaCompraReadDTO>> => {
  return await apiClient(`/api/FacturaCompra/${id}`, {
    method: "PUT",
    body: JSON.stringify(compra),
  });
};


export const registrarFacturaCompra = async (id: number): Promise<ApiResponse<void>> => {
  return await apiClient(`/api/FacturaCompra/${id}/registrar`, {
    method: "PATCH",
  });
};

export const anularFacturaCompra = async (id: number): Promise<ApiResponse<void>> => {
  return await apiClient(`/api/FacturaCompra/${id}/anular`, {
    method: "PATCH",
  });
};
