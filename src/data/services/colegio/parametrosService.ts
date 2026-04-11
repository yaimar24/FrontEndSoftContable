import { apiClient } from "../../api/apiClient";
import type { Parametros } from "../../../domain/models/Parametros";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

export const getParametros = async (): Promise<ApiResponse<Parametros>> => {
  return await apiClient("/api/Parametros/parametros", {
    useAuth: false
  });
};

export interface ParametrosFacturacionDTO {
  mediosPago: { id: number; nombre: string }[];
  frecuenciasPago: { id: number; nombre: string }[];
}

export const getParametrosFacturacion = async (): Promise<ApiResponse<ParametrosFacturacionDTO>> => {
  return await apiClient("/api/Parametros/facturacion");
};

