import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../models/types/ApiResponse";
import type { FacturaVentaCreateDTO, FacturaVentaReadDTO } from "../../models/Venta";

export const getVentasByColegio = async (): Promise<ApiResponse<FacturaVentaReadDTO[]>> => {
  return await apiClient("/api/FacturaVenta");
};

export const createVenta = async (venta: FacturaVentaCreateDTO): Promise<ApiResponse<FacturaVentaReadDTO>> => {
  return await apiClient("/api/FacturaVenta", {
    method: "POST",
    body: JSON.stringify(venta),
  });
};

export const updateVenta = async (id: number, venta: FacturaVentaCreateDTO): Promise<ApiResponse<FacturaVentaReadDTO>> => {
  return await apiClient(`/api/FacturaVenta/${id}`, {
    method: "PUT",
    body: JSON.stringify(venta),
  });
};

export const getProximoNumeroFactura = async (tipoFacturaId: number): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/FacturaVenta/proximo-numero?tipoFacturaId=${tipoFacturaId}`);
};
