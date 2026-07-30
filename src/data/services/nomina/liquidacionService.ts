import { apiClient } from '../../api/apiClient';

export interface GenerarNominaCommand {
  anio: number;
  mes: number;
}

export const liquidacionService = {
  generarNomina: async (data: GenerarNominaCommand) => {
    const response = await apiClient.post('/api/Nomina', data);
    return response.data;
  },

  getNominas: async () => {
    const response = await apiClient.get('/api/Nomina');
    return response.data;
  },

  getNominaById: async (id: string) => {
    const response = await apiClient.get(`/api/Nomina/${id}`);
    return response.data;
  },

  getNominaDetalles: async (id: string) => {
    const response = await apiClient.get(`/api/Nomina/${id}/detalles`);
    return response.data;
  },

  cerrarNomina: async (id: string) => {
    const response = await apiClient.put(`/api/Nomina/${id}/cerrar`);
    return response.data;
  }
};
