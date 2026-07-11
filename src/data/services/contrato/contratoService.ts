import { apiClient } from "../../api/apiClient";

import type 
{
ContratoCreateDTO,
ContratoUpdateDTO
} from "../../../domain/models/Contrato";

import type 
{
ApiResponse
} from "../../../domain/models/types/ApiResponse";

export const crearContrato = async (
data: ContratoCreateDTO
): Promise<ApiResponse<string>> => 
    {

return await apiClient("/api/ContratoLaboral", {
    method: "POST",
    body: JSON.stringify(data),
});
    };

export const updateContrato = async (
id: string,
data: ContratoUpdateDTO
): Promise<ApiResponse<string>> => 
    {

return await apiClient(`/api/ContratoLaboral/${id}`,
    {
    method: "PUT",
    body: JSON.stringify(data),
    });
    
    };