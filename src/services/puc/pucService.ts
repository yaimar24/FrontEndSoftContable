import { apiClient } from "../../api/apiClient";
import type { PucNodo, PucCreateDTO, PucUpdateDTO } from "../../models/Puc";
import type { ApiResponse } from "../../models/types/ApiResponse";

export const getPucTree = async (): Promise<ApiResponse<PucNodo[]>> => {
  return await apiClient("/api/Puc/tree");
};

export const getHiddenPuc = async (): Promise<ApiResponse<PucNodo[]>> => {
  return await apiClient("/api/Puc/hidden");
};

export const createCuentaContable = async (data: PucCreateDTO): Promise<ApiResponse<any>> => {
  return await apiClient("/api/Puc", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateCuentaContable = async (codigo: string, data: PucUpdateDTO): Promise<ApiResponse<any>> => {
  return await apiClient(`/api/Puc/${codigo}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const hideCuentaContable = async (codigo: string): Promise<ApiResponse<any>> => {
  return await apiClient(`/api/Puc/${codigo}`, {
    method: "DELETE"
  });
};

export const restoreCuentaContable = async (codigo: string): Promise<ApiResponse<any>> => {
  return await apiClient(`/api/Puc/${codigo}/restore`, {
    method: "PATCH"
  });
};

