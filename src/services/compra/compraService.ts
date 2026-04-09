import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../models/types/ApiResponse";
import type { FacturaCompraCreateDTO, FacturaCompraUpdateDTO, FacturaCompraReadDTO } from "../../models/FacturaCompra";

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

export const getProximoNumeroFacturaCompra = async (tipoFacturaId: number): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/FacturaCompra/proximo-numero?tipoFacturaId=${tipoFacturaId}`);
};

export const updateFacturaCompra = async (id: number, compra: FacturaCompraUpdateDTO): Promise<ApiResponse<FacturaCompraReadDTO>> => {
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
