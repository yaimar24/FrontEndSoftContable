import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { CuentaPorCobrar, AgingData, FacturaPorVencer, ReporteCartera, IndicadoresCartera, ResumenCliente, HistoricoCartera } from "../../../domain/models/Cartera";
import { buildQueryParams } from "../../../utils/queryBuilder";

export const getCuentasPorCobrar = async (
  clienteId?: string,
  desde?: string,
  hasta?: string,
  estado?: number
): Promise<ApiResponse<CuentaPorCobrar[]>> => {
  const query = buildQueryParams({ clienteId, desde, hasta, estado });
  return await apiClient(`/api/Cartera/cuentas-por-cobrar${query ? `?${query}` : ""}`);
};

export const getAging = async (): Promise<ApiResponse<AgingData>> => {
  return await apiClient("/api/Cartera/aging");
};

export const getPorVencer = async (dias: number = 30): Promise<ApiResponse<FacturaPorVencer[]>> => {
  return await apiClient(`/api/Cartera/por-vencer?dias=${dias}`);
};

export interface ReporteCarteraParams {
  clienteId?: string;
  desde?: string;
  hasta?: string;
  estado?: number;
  fechaVencimientoDesde?: string;
  fechaVencimientoHasta?: string;
  rangoDiasVencidosMin?: number;
  rangoMontoMin?: number;
  rangoMontoMax?: number;
}

export const getReporteCartera = async (params?: ReporteCarteraParams): Promise<ApiResponse<ReporteCartera>> => {
  const query = params ? buildQueryParams(params as Record<string, string | number | undefined>) : '';
  return await apiClient(`/api/Cartera/reporte${query ? `?${query}` : ""}`);
};

export const getIndicadores = async (): Promise<ApiResponse<IndicadoresCartera>> => {
  return await apiClient("/api/Cartera/indicadores");
};

export const getResumenPorCliente = async (): Promise<ApiResponse<ResumenCliente[]>> => {
  return await apiClient("/api/Cartera/resumen-por-cliente");
};

export const getHistorico = async (fecha: string): Promise<ApiResponse<HistoricoCartera>> => {
  return await apiClient(`/api/Cartera/historico?fecha=${fecha}`);
};
