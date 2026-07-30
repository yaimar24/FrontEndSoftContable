import { apiClient } from '../../api/apiClient';
import type { Empleado } from '../../../domain/models/nomina/Empleado';
import type { ContratoLaboral, SeguridadSocialEmpleado } from '../../../domain/models/nomina/Contrato';

export const empleadoService = {
  getEmpleados: async () => {
    const response = await apiClient.get('/api/empleados');
    return response.data;
  },

  getEmpleadoById: async (id: string) => {
    const response = await apiClient.get(`/api/empleados/${id}`);
    return response.data;
  },

  createEmpleado: async (data: Empleado) => {
    const response = await apiClient.post('/api/empleados', data);
    return response.data;
  },

  updateEmpleado: async (id: string, data: Empleado) => {
    const response = await apiClient.put(`/api/empleados/${id}`, data);
    return response.data;
  },

  // Contratos
  getContratos: async () => {
    const response = await apiClient.get('/api/ContratoLaboral');
    return response.data;
  },

  getContratoById: async (id: string) => {
    const response = await apiClient.get(`/api/ContratoLaboral/empleado/${id}`);
    return response.data;
  },

  createContrato: async (data: ContratoLaboral) => {
    const response = await apiClient.post('/api/ContratoLaboral', data);
    return response.data;
  },

  updateContrato: async (id: string, data: ContratoLaboral) => {
    const response = await apiClient.put(`/api/ContratoLaboral/${id}`, data);
    return response.data;
  },

  getCatalogosContrato: async () => {
    const response = await apiClient.get('/api/ContratoLaboral/catalogos');
    return response.data;
  },
  
  // Seguridad Social
  getSeguridadSocial: async (empleadoId: string) => {
    const response = await apiClient.get(`/api/SeguridadSocialEmpleado/${empleadoId}`);
    return response.data;
  },

  createSeguridadSocial: async (data: SeguridadSocialEmpleado) => {
    const response = await apiClient.post('/api/SeguridadSocialEmpleado', data);
    return response.data;
  },

  updateSeguridadSocial: async (empleadoId: string, data: SeguridadSocialEmpleado) => {
    const response = await apiClient.put(`/api/SeguridadSocialEmpleado/${empleadoId}`, data);
    return response.data;
  }
};
