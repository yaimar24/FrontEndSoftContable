import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { FacturaVentaCreateDTO, FacturaVentaReadDTO, ReciboCajaCreate, ReciboCajaRead } from "../../../domain/models/Venta";
import type { PucNodo } from "../../../domain/models/Puc";

export const getMediosPago = async (): Promise<ApiResponse<PucNodo[]>> => {
  return await apiClient("/api/puc/medios-pago?codigoRaiz=11");
};

export const registrarPago = async (id: number, pago: ReciboCajaCreate): Promise<ApiResponse<ReciboCajaRead>> => {
  return await apiClient(`/api/recibocaja/${id}`, {
    method: "POST",
    body: JSON.stringify(pago),
  });
};

export const getVentaById = async (id: number): Promise<ApiResponse<FacturaVentaReadDTO>> => {
  return await apiClient(`/api/FacturaVenta/${id}`);
};

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

export const getRecibosCaja = async (): Promise<ApiResponse<ReciboCajaRead[]>> => {
  return await apiClient("/api/recibocaja");
};

export const getReciboCajaById = async (id: number): Promise<ApiResponse<ReciboCajaRead>> => {
  return await apiClient(`/api/recibocaja/${id}`);
};
