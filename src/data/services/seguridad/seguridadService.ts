import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";
import type {
  Rol,
  ModuloPlan,
  UsuarioReadDTO,
  UsuarioCreateDTO,
  UsuarioUpdateDTO,
} from "../../../domain/models/Seguridad";

export const getUsuarios = async (): Promise<ApiResponse<UsuarioReadDTO[]>> => {
  return apiClient("/api/Usuario");
};

export const crearUsuario = async (
  payload: UsuarioCreateDTO
): Promise<ApiResponse<UsuarioReadDTO>> => {
  return apiClient("/api/Usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const getRoles = async (): Promise<ApiResponse<Rol[]>> => {
  return apiClient("/api/Usuario/roles");
};

export const getModulosDisponibles = async (): Promise<ApiResponse<ModuloPlan[]>> => {
  return apiClient("/api/Usuario/modulos-disponibles");
};

export const getMiPerfil = async (): Promise<ApiResponse<UsuarioReadDTO>> => {
  return apiClient("/api/Usuario/mi-perfil", { skipGlobalLoader: true });
};

export const editarUsuario = async (
  id: string,
  payload: UsuarioUpdateDTO
): Promise<ApiResponse<UsuarioReadDTO>> => {
  return apiClient(`/api/Usuario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const toggleActivoUsuario = async (
  id: string
): Promise<ApiResponse<unknown>> => {
  return apiClient(`/api/Usuario/${id}/toggle-activo`, {
    method: "PATCH",
  });
};
