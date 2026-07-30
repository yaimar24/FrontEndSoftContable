import { useState, useCallback } from 'react';
import { liquidacionService } from '../../../data/services/nomina/liquidacionService';
import type { GenerarNominaCommand } from '../../../data/services/nomina/liquidacionService';
import { useGlobalLoading as useLoading } from '../../context/LoadingContext';

export const useLiquidacion = () => {
  const { show: showLoading, hide: hideLoading } = useLoading();
  const [nominas, setNominas] = useState<any[]>([]);
  const [currentNomina, setCurrentNomina] = useState<any | null>(null);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNominas = useCallback(async () => {
    try {
      showLoading();
      const res = await liquidacionService.getNominas();
      setNominas(res?.data || res || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const fetchNominaById = useCallback(async (id: string) => {
    try {
      showLoading();
      const res = await liquidacionService.getNominaById(id);
      setCurrentNomina(res?.data || res);
      
      const resDetalle = await liquidacionService.getNominaDetalles(id);
      setDetalles(resDetalle?.data || resDetalle || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const generarNomina = async (data: GenerarNominaCommand) => {
    try {
      showLoading();
      const res = await liquidacionService.generarNomina(data);
      await fetchNominas();
      return res?.data || res;
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const cerrarNomina = async (id: string) => {
    try {
      showLoading();
      await liquidacionService.cerrarNomina(id);
      await fetchNominaById(id);
      await fetchNominas();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  return {
    nominas,
    currentNomina,
    detalles,
    fetchNominas,
    fetchNominaById,
    generarNomina,
    cerrarNomina,
    error,
    setError
  };
};