import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

export interface DashboardDTO {
  ventas: ResumenFacturacionDTO;
  compras: ResumenFacturacionDTO;
  cartera: CarteraDTO;
  contadores: ContadoresDTO;
  ultimosMovimientos: MovimientoRecienteDTO[];
  resumenMensual: ResumenMensualDTO[];
}

export interface ResumenFacturacionDTO {
  totalMesActual: number;
  totalMesAnterior: number;
  porcentajeCambio: number;
  cantidadMesActual: number;
}

export interface CarteraDTO {
  totalPorCobrar: number;
  facturasPendientes: number;
  facturasConAbono: number;
  totalRecaudadoMes: number;
}

export interface ContadoresDTO {
  totalClientes: number;
  totalProveedores: number;
  totalProductos: number;
}

export interface MovimientoRecienteDTO {
  tipo: 'VENTA' | 'COMPRA' | 'RECIBO';
  numero: string;
  terceroNombre: string;
  monto: number;
  fecha: string;
  estado: string;
}

export interface ResumenMensualDTO {
  anio: number;
  mes: number;
  mesNombre: string;
  totalVentas: number;
  totalCompras: number;
}

export const getDashboardDatos = async (): Promise<ApiResponse<DashboardDTO>> => {
  return await apiClient("/api/Dashboard");
};