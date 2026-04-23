import { apiClient } from "../../api/apiClient";
import type { ApiResponse, PaginatedResponse } from "../../../domain/models/types/ApiResponse";
import type { NotaCreditoDebitoCreateDTO, NotaCreditoDebitoReadDTO } from "../../../domain/models/NotaCreditoDebito";
import { buildQueryParams } from "../../../utils/queryBuilder";

const BASE = "/api/NotaCreditoDebito";

export const createNotaCreditoDebito = async (
  nota: NotaCreditoDebitoCreateDTO
): Promise<ApiResponse<NotaCreditoDebitoReadDTO>> => {
  return await apiClient(BASE, {
    method: "POST",
    body: JSON.stringify(nota),
  });
};

export const getNotasByColegio = async (
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<PaginatedResponse<NotaCreditoDebitoReadDTO>>> => {
  const query = buildQueryParams({ page, pageSize });
  return await apiClient(`${BASE}?${query}`);
};

export const getNotaById = async (
  id: number
): Promise<ApiResponse<NotaCreditoDebitoReadDTO>> => {
  return await apiClient(`${BASE}/${id}`);
};

export const getNotasByFacturaVenta = async (
  facturaId: number,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<PaginatedResponse<NotaCreditoDebitoReadDTO>>> => {
  const query = buildQueryParams({ page, pageSize });
  return await apiClient(`${BASE}/factura-venta/${facturaId}?${query}`);
};

export const getNotasByFacturaCompra = async (
  facturaId: number,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<PaginatedResponse<NotaCreditoDebitoReadDTO>>> => {
  const query = buildQueryParams({ page, pageSize });
  return await apiClient(`${BASE}/factura-compra/${facturaId}?${query}`);
};
