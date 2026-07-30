import { useState, useCallback } from 'react';
import { empleadoService } from '../../../data/services/nomina/empleadoService';
import { catalogosNominaService } from '../../../data/services/nomina/catalogosNominaService';
import type { ContratoLaboral } from '../../../domain/models/nomina/Contrato';
import { useGlobalLoading as useLoading } from '../../context/LoadingContext';

export const useContrato = (empleadoId?: string) => {
  const { show: showLoading, hide: hideLoading } = useLoading();
  const [contrato, setContrato] = useState<ContratoLaboral | null>(null);
  const [catalogos, setCatalogos] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchContrato = useCallback(async () => {
    if (!empleadoId) return;
    try {
      showLoading();
      // Since it's 1:1, usually the backend would give us the contract given an employee id. 
      // The prompt says `GET /ContratoLaboral/{id}` where {id} might refer to the contract ID, 
      // or possibly employeeId. We'll search for it logic. If we know the endpoint we call `empleadoService.getContratoById(empleadoId)`
      const res = await empleadoService.getContratoById(empleadoId); 
      setContrato(res?.data || res || null);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [empleadoId, showLoading, hideLoading]);

  const fetchCatalogos = useCallback(async () => {
    try {
      showLoading();
      const res = await empleadoService.getCatalogosContrato();
      const cargosRes = await catalogosNominaService.getCargos();
      const centrosCostoRes = await catalogosNominaService.getCentrosCosto();
      setCatalogos({ 
        ...(res?.data || res || {}), 
        cargos: cargosRes?.data || cargosRes || [], 
        centrosCosto: centrosCostoRes?.data || centrosCostoRes || [] 
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const saveContrato = async (data: ContratoLaboral) => {
    try {
      showLoading();
      let res;
      if (data.id) {
        res = await empleadoService.updateContrato(data.id, data);
      } else {
        res = await empleadoService.createContrato(data);
      }
      
      if (res?.success === false) {
        throw new Error(res.message || "Ocurrió un error guardando el contrato");
      }
      
      await fetchContrato();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  return {
    contrato,
    catalogos,
    fetchContrato,
    fetchCatalogos,
    saveContrato,
    error
  };
};
