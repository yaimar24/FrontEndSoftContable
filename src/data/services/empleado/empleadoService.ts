import { apiClient } from "../../api/apiClient";

import type {
  EmpleadoCreateDTO,
  EmpleadoUpdateDTO
} from "../../../domain/models/Empleado";

import type {
  ApiResponse,
  PaginatedResponse
} from "../../../domain/models/types/ApiResponse";

import { buildQueryParams } from "../../../utils/queryBuilder";

export const crearEmpleado = async (
  data: EmpleadoCreateDTO
): Promise<ApiResponse<EmpleadoUpdateDTO[]>> => {

  return await apiClient("/api/empleados", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getEmpleados = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = ""
): Promise<ApiResponse<PaginatedResponse<EmpleadoUpdateDTO>>> => {

  const query = buildQueryParams({
    page,
    pageSize,
    searchTerm: searchTerm || undefined,
  });

  return await apiClient(`/api/empleados?${query}`);
};

export const updateEmpleado = async (
  id: string,
  data: EmpleadoUpdateDTO
): Promise<ApiResponse<string>> => {

  return await apiClient(`/api/empleados/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const cambiarEstadoEmpleado = async (
  empleadoId: string
): Promise<ApiResponse<string>> => {

  return await apiClient(`/api/empleados/status/${empleadoId}`, {
    method: "PATCH",
  });
};

export const buscarEmpleados = async (
  nombre?: string,
  skipGlobalLoader: boolean = false
): Promise<ApiResponse<EmpleadoUpdateDTO[]>> => {

  const url = nombre
    ? `/api/empleados/buscar?nombre=${encodeURIComponent(nombre)}`
    : `/api/empleados/buscar`;

  return await apiClient(url, { skipGlobalLoader });
};