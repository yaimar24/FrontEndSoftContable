import { apiClient } from '../../api/apiClient';
import type { TipoFactura } from '../../models/TipoFactura';
import type { ApiResponse } from '../../models/types/ApiResponse';


export const getTipoFactura = async (): Promise<ApiResponse<TipoFactura[]>> => {
  return apiClient('/api/TipoFactura');
};
