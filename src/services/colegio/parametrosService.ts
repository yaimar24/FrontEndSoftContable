import { apiClient } from "../../api/apiClient";
import type { Parametros } from "../../models/Parametros";
import type { ApiResponse } from "../../models/types/ApiResponse";

export const getParametros = async (): Promise<ApiResponse<Parametros>> => {
  return await apiClient("/api/Parametros/parametros", {
    useAuth: false
  });
};

