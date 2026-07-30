import { apiClient } from '../../api/apiClient';

export interface NovedadNomina {
  id?: string;
  empleadoId: string;
  tipoNovedad: string;
  valor: number;
  fecha: string;
  observacion?: string;
}

export const novedadesService = {
  createNovedad: async (data: NovedadNomina) => {
    const response = await apiClient.post('/api/NovedadNomina', data);
    return response.data;
  },

  getNovedadesByEmpleado: async (empleadoId: string) => {
    const response = await apiClient.get(`/api/NovedadNomina/empleado/${empleadoId}`);
    return response.data;
  },

  deleteNovedad: async (id: string) => {
    const response = await apiClient.delete(`/api/NovedadNomina/${id}`);
    return response.data;
  }
};
