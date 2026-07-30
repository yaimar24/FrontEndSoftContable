import { apiClient } from '../../api/apiClient';
import type { Cargo, CentroCosto, Banco, ConceptoNomina } from '../../../domain/models/nomina/CatalogosParams';

export const catalogosNominaService = {
  // Cargos
  getCargos: async () => {
    const response = await apiClient.get('/api/catalogos-nomina/cargos');
    return response.data;
  },
  createCargo: async (data: Cargo) => {
    const response = await apiClient.post('/api/catalogos-nomina/cargos', data);
    return response.data;
  },
  updateCargo: async (id: string | number, data: Cargo) => {
    const response = await apiClient.put(`/api/catalogos-nomina/cargos/${id}`, data);
    return response.data;
  },
  deleteCargo: async (id: string | number) => {
    const response = await apiClient.delete(`/api/catalogos-nomina/cargos/${id}`);
    return response.data;
  },

  // Centros de Costo
  getCentrosCosto: async () => {
    const response = await apiClient.get('/api/catalogos-nomina/centros-costo');
    return response.data;
  },
  createCentroCosto: async (data: CentroCosto) => {
    const response = await apiClient.post('/api/catalogos-nomina/centros-costo', data);
    return response.data;
  },
  updateCentroCosto: async (id: string | number, data: CentroCosto) => {
    const response = await apiClient.put(`/api/catalogos-nomina/centros-costo/${id}`, data);
    return response.data;
  },
  deleteCentroCosto: async (id: string | number) => {
    const response = await apiClient.delete(`/api/catalogos-nomina/centros-costo/${id}`);
    return response.data;
  },

  // Bancos
  getBancos: async () => {
    const response = await apiClient.get('/api/catalogos-nomina/bancos');
    return response.data;
  },
  createBanco: async (data: Banco) => {
    const response = await apiClient.post('/api/catalogos-nomina/bancos', data);
    return response.data;
  },
  updateBanco: async (id: string | number, data: Banco) => {
    const response = await apiClient.put(`/api/catalogos-nomina/bancos/${id}`, data);
    return response.data;
  },
  deleteBanco: async (id: string | number) => {
    const response = await apiClient.delete(`/api/catalogos-nomina/bancos/${id}`);
    return response.data;
  },

  // Conceptos de Nómina
  getConceptosNomina: async () => {
    const response = await apiClient.get('/api/catalogos-nomina/conceptos-nomina');
    return response.data;
  },
  createConceptoNomina: async (data: ConceptoNomina) => {
    const response = await apiClient.post('/api/catalogos-nomina/conceptos-nomina', data);
    return response.data;
  },
  updateConceptoNomina: async (id: string | number, data: ConceptoNomina) => {
    const response = await apiClient.put(`/api/catalogos-nomina/conceptos-nomina/${id}`, data);
    return response.data;
  },
  deleteConceptoNomina: async (id: string | number) => {
    const response = await apiClient.delete(`/api/catalogos-nomina/conceptos-nomina/${id}`);
    return response.data;
  }
};
