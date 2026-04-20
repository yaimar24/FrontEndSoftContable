import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { CuentaPorCobrar, AgingData, FacturaPorVencer, ReporteCartera, IndicadoresCartera, ResumenCliente, HistoricoCartera } from "../../../domain/models/Cartera";

export const getCuentasPorCobrar = async (
  clienteId?: string,
  desde?: string,
  hasta?: string,
  estado?: number
): Promise<ApiResponse<CuentaPorCobrar[]>> => {
  const params = new URLSearchParams();
  if (clienteId) params.append("clienteId", clienteId);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  if (estado !== undefined && estado !== null) params.append("estado", estado.toString());
  const query = params.toString();
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
  const searchParams = new URLSearchParams();
  if (params) {
    if (params.clienteId) searchParams.append("clienteId", params.clienteId);
    if (params.desde) searchParams.append("desde", params.desde);
    if (params.hasta) searchParams.append("hasta", params.hasta);
    if (params.estado !== undefined && params.estado !== null) searchParams.append("estado", params.estado.toString());
    if (params.fechaVencimientoDesde) searchParams.append("fechaVencimientoDesde", params.fechaVencimientoDesde);
    if (params.fechaVencimientoHasta) searchParams.append("fechaVencimientoHasta", params.fechaVencimientoHasta);
    if (params.rangoDiasVencidosMin !== undefined) searchParams.append("rangoDiasVencidosMin", params.rangoDiasVencidosMin.toString());
    if (params.rangoMontoMin !== undefined) searchParams.append("rangoMontoMin", params.rangoMontoMin.toString());
    if (params.rangoMontoMax !== undefined) searchParams.append("rangoMontoMax", params.rangoMontoMax.toString());
  }
  const query = searchParams.toString();
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
