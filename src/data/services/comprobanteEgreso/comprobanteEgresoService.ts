import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { ComprobanteEgresoCreate, ComprobanteEgresoRead } from "../../../domain/models/ComprobanteEgreso";

export const getComprobantesEgreso = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = ""
): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(searchTerm && { searchTerm }),
  });
  return await apiClient(`/api/ComprobanteEgreso?${queryParams}`);
};

export const getComprobanteEgresoById = async (id: number): Promise<ApiResponse<ComprobanteEgresoRead>> => {
  return await apiClient(`/api/ComprobanteEgreso/${id}`);
};

export const registrarComprobanteEgreso = async (
  facturaCompraId: number,
  comprobante: ComprobanteEgresoCreate,
  idempotencyKey: string
): Promise<ApiResponse<ComprobanteEgresoRead>> => {
  return await apiClient(`/api/ComprobanteEgreso/${facturaCompraId}`, {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(comprobante),
  });
};

export const anularComprobanteEgreso = async (id: number): Promise<ApiResponse<void>> => {
  return await apiClient(`/api/ComprobanteEgreso/${id}/anular`, {
    method: "PATCH",
  });
};
