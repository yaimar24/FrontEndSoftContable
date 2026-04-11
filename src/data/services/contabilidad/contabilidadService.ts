import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type { 
  ComprobanteContableRead, 
  ComprobanteContableCreate, 
  ConfiguracionContableRead, 
  ConfiguracionContableUpdate 
} from "../../../domain/models/Contabilidad";

// Listar comprobantes
export const getComprobantes = async (): Promise<ApiResponse<ComprobanteContableRead[]>> => {
  return await apiClient("/api/AsientoContable");
};

// Detalle con movimientos
export const getComprobanteById = async (id: number): Promise<ApiResponse<ComprobanteContableRead>> => {
  return await apiClient(`/api/AsientoContable/${id}`);
};

// Asientos por documento
export const getAsientosPorDocumento = async (tipo: string, documentoId: number): Promise<ApiResponse<ComprobanteContableRead[]>> => {
  return await apiClient(`/api/AsientoContable/por-documento?tipo=${tipo}&documentoId=${documentoId}`);
};

// Crear asiento manual
export const createAsientoManual = async (data: ComprobanteContableCreate): Promise<ApiResponse<ComprobanteContableRead>> => {
  return await apiClient("/api/AsientoContable", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Anular comprobante
export const anularComprobante = async (id: number): Promise<ApiResponse<null>> => {
  return await apiClient(`/api/AsientoContable/${id}/anular`, {
    method: "PATCH",
  });
};

// Obtener configuracion
export const getConfiguracionContable = async (): Promise<ApiResponse<ConfiguracionContableRead>> => {
  return await apiClient("/api/AsientoContable/configuracion");
};

// Actualizar configuracion
export const updateConfiguracionContable = async (data: ConfiguracionContableUpdate): Promise<ApiResponse<ConfiguracionContableRead>> => {
  return await apiClient("/api/AsientoContable/configuracion", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Auxiliar accounting book
export const getLibroAuxiliar = async (cuentaCodigo?: string | null, desde?: string | null, hasta?: string | null): Promise<ApiResponse<any>> => { // Update return type if we have read interface for Auxiliary book
  const params = new URLSearchParams();
  if (cuentaCodigo) params.append("cuentaCodigo", cuentaCodigo);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  return await apiClient(`/api/AsientoContable/libro-auxiliar?${params.toString()}`);
};

