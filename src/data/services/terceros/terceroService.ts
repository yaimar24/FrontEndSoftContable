import { apiClient } from "../../api/apiClient";
import type { TerceroCreateDTO, TerceroupdateDTO } from "../../../domain/models/Tercero";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

export const vincularTercero = async (data: TerceroCreateDTO): Promise<ApiResponse<TerceroupdateDTO[]>> => {
  return await apiClient("/api/Tercero/vincular", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getTercerosByColegio = async (): Promise<ApiResponse<TerceroupdateDTO[]>> => {
  return await apiClient("/api/Tercero");
};

export const updateTercero = async (id: string | number, data: TerceroupdateDTO): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/Tercero/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const desvincularTercero = async (terceroId: string): Promise<ApiResponse<string>> => {
  return await apiClient(`/api/Tercero/status/${terceroId}`, {
    method: "PATCH",
  });
};

export const buscarTerceros = async (tipo: string, nombre?: string, skipGlobalLoader: boolean = false): Promise<ApiResponse<TerceroupdateDTO[]>> => {
  const url = nombre 
    ? `/api/Tercero/buscar?tipo=${encodeURIComponent(tipo)}&nombre=${encodeURIComponent(nombre)}`
    : `/api/Tercero/buscar?tipo=${encodeURIComponent(tipo)}`;
  return await apiClient(url, { skipGlobalLoader });
};
