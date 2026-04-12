import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { FacturaVentaCreateDTO, FacturaVentaReadDTO, ReciboCajaCreate, ReciboCajaRead } from "../../../domain/models/Venta";
import type { PucNodo } from "../../../domain/models/Puc";

export const getMediosPago = async (): Promise<ApiResponse<PucNodo[]>> => {
  return await apiClient("/api/puc/medios-pago?codigoRaiz=11");
};

export const registrarPago = async (
  id: number, 
  pago: ReciboCajaCreate,
  idempotencyKey: string
): Promise<ApiResponse<ReciboCajaRead>> => {
  return await apiClient(`/api/recibocaja/${id}`, {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(pago),
  });
};

export const getVentaById = async (id: number): Promise<ApiResponse<FacturaVentaReadDTO>> => {
  return await apiClient(`/api/FacturaVenta/${id}`);
};

export const getVentasByColegio = async (): Promise<ApiResponse<FacturaVentaReadDTO[]>> => {
  return await apiClient("/api/FacturaVenta");
};

export const createVenta = async (venta: FacturaVentaCreateDTO, idempotencyKey?: string): Promise<ApiResponse<FacturaVentaReadDTO>> => {
  const headers: Record<string, string> = {};
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  
  return await apiClient("/api/FacturaVenta", {
    method: "POST",
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    body: JSON.stringify(venta),
  });
};

export const updateVenta = async (id: number, venta: FacturaVentaCreateDTO, idempotencyKey?: string): Promise<ApiResponse<FacturaVentaReadDTO>> => {
  const headers: Record<string, string> = {};
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  return await apiClient(`/api/FacturaVenta/${id}`, {
    method: "PUT",
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    body: JSON.stringify(venta),
  });
};


export const getRecibosCaja = async (): Promise<ApiResponse<ReciboCajaRead[]>> => {
  return await apiClient("/api/recibocaja");
};

export const getReciboCajaById = async (id: number): Promise<ApiResponse<ReciboCajaRead>> => {
  return await apiClient(`/api/recibocaja/${id}`);
};
