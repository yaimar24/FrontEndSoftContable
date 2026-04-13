import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { FacturaCompraCreateDTO, FacturaCompraReadDTO } from "../../../domain/models/FacturaCompra";

export const getCompraById = async (id: number): Promise<ApiResponse<FacturaCompraReadDTO>> => {
  return await apiClient(`/api/FacturaCompra/${id}`);
};

export const getComprasByColegio = async (): Promise<ApiResponse<FacturaCompraReadDTO[]>> => {
  return await apiClient("/api/FacturaCompra");
};

export const createCompra = async (compra: FacturaCompraCreateDTO): Promise<ApiResponse<FacturaCompraReadDTO>> => {
  return await apiClient("/api/FacturaCompra", {
    method: "POST",
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
