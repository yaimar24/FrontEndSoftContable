import { apiClient } from "../../api/apiClient";
import type { TerceroCreateDTO, TerceroUpdateDTO } from "../../../domain/models/Tercero";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

export const vincularTercero = async (data: TerceroCreateDTO): Promise<ApiResponse<TerceroUpdateDTO[]>> => {
  return await apiClient("/api/Tercero/vincular", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getTercerosByColegio = async (page: number = 1, pageSize: number = 10, searchTerm: string = ""): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(searchTerm && { searchTerm }),
  });
  return await apiClient(`/api/Tercero?${queryParams}`);
};

export const updateTercero = async (id: string | number, data: TerceroUpdateDTO): Promise<ApiResponse<string>> => {
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

export const buscarTerceros = async (tipo: string, nombre?: string, skipGlobalLoader: boolean = false): Promise<ApiResponse<TerceroUpdateDTO[]>> => {
  const url = nombre 
    ? `/api/Tercero/buscar?tipo=${encodeURIComponent(tipo)}&nombre=${encodeURIComponent(nombre)}`
    : `/api/Tercero/buscar?tipo=${encodeURIComponent(tipo)}`;
  return await apiClient(url, { skipGlobalLoader });
};
