import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { 
  CuentaPorPagar, 
  AgingCuentasPorPagarData, 
  FacturaPorVencerPagar, 
  ReporteCuentasPorPagar, 
  IndicadoresCuentasPorPagar, 
  ResumenProveedor, 
  HistoricoCuentasPorPagar 
} from "../../../domain/models/CuentasPorPagar";
import { buildQueryParams } from "../../../utils/queryBuilder";

export const getCuentasPorPagar = async (
  proveedorId?: string,
  desde?: string,
  hasta?: string,
  estado?: number,
  page?: number,
  pageSize?: number
): Promise<ApiResponse<CuentaPorPagar[]>> => {
  const query = buildQueryParams({ proveedorId, desde, hasta, estado, page, pageSize });
  return await apiClient(`/api/CuentasPorPagar/listado${query ? `?${query}` : ""}`);
};

export const getAging = async (): Promise<ApiResponse<AgingCuentasPorPagarData>> => {
  return await apiClient("/api/CuentasPorPagar/aging");
};

export const getPorVencer = async (dias: number = 30): Promise<ApiResponse<FacturaPorVencerPagar[]>> => {
  return await apiClient(`/api/CuentasPorPagar/por-vencer?dias=${dias}`);
};

export interface ReporteCuentasPorPagarParams {
  proveedorId?: string;
  desde?: string;
  hasta?: string;
  estado?: number;
  fechaVencimientoDesde?: string;
  fechaVencimientoHasta?: string;
  rangoDiasVencidosMin?: number;
  rangoMontoMin?: number;
  rangoMontoMax?: number;
}

export const getReporteCuentasPorPagar = async (params?: ReporteCuentasPorPagarParams): Promise<ApiResponse<ReporteCuentasPorPagar>> => {
  const query = params ? buildQueryParams(params as Record<string, string | number | undefined>) : '';
  return await apiClient(`/api/CuentasPorPagar/reporte${query ? `?${query}` : ""}`);
};

export const getIndicadores = async (): Promise<ApiResponse<IndicadoresCuentasPorPagar>> => {
  return await apiClient("/api/CuentasPorPagar/indicadores");
};

export const getResumenPorProveedor = async (page?: number, pageSize?: number): Promise<ApiResponse<ResumenProveedor[]>> => {
  const query = buildQueryParams({ page, pageSize });
  return await apiClient(`/api/CuentasPorPagar/resumen-por-proveedor${query ? `?${query}` : ""}`);
};

export const getHistorico = async (fecha: string): Promise<ApiResponse<HistoricoCuentasPorPagar>> => {
  return await apiClient(`/api/CuentasPorPagar/historico?fecha=${fecha}`);
};
