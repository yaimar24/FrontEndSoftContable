import { apiClient } from "../../api/apiClient";
import type { TipoFactura } from "../../../domain/models/TipoFactura";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

export const getTipoFactura = async (): Promise<ApiResponse<TipoFactura[]>> => {
  return await apiClient("/api/TipoFactura");
};

