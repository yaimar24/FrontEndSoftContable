import { apiClient } from "../../api/apiClient";
import type { PucNodo, PucCreateDTO, PucUpdateDTO, CuentaPuc } from "../../../domain/models/Puc";
import type { ApiResponse } from "../../../domain/models/types/ApiResponse";

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

export const getCuentasPuc = async (
  codigoRaiz: string = '',
  soloDetalle: boolean = true,
  buscar?: string,
  skipGlobalLoader: boolean = false
): Promise<ApiResponse<CuentaPuc[]>> => {
  const params: string[] = [`soloDetalle=${soloDetalle}`];
  if (codigoRaiz) {
    params.push(`codigoRaiz=${codigoRaiz}`);
  }
  if (buscar) {
    params.push(`buscar=${encodeURIComponent(buscar)}`);
  }
  return await apiClient(`/api/Puc/cuentas?${params.join("&")}`, { skipGlobalLoader });
};

export const getCuentasIngreso = (b?: string) => getCuentasPuc('41', true, b);
export const getCuentasCosto = (b?: string) => getCuentasPuc('6', true, b);
export const getCuentasInventario = (b?: string) => getCuentasPuc('14', true, b);
export const getCuentasActivoFijo = (b?: string) => getCuentasPuc('15', true, b);
export const getCuentasGasto = (b?: string) => getCuentasPuc('5', true, b);
// export const getMediosPago = (b?: string) => getCuentasPuc('11', true, b); // The user says the old ones might continue working, but mentions it as an option. Since ventas uses getMediosPago from ventaService or pucService maybe?, I'll let it be exported just in case.


