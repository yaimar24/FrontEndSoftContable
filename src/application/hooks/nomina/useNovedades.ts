import { useState, useCallback } from 'react';
import { novedadesService } from '../../../data/services/nomina/novedadesService';
import type { NovedadNomina } from '../../../data/services/nomina/novedadesService';
import { useGlobalLoading as useLoading } from '../../context/LoadingContext';

export const useNovedades = (empleadoId?: string) => {
  const { show: showLoading, hide: hideLoading } = useLoading();
  const [novedades, setNovedades] = useState<NovedadNomina[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNovedades = useCallback(async () => {
    if (!empleadoId) return;
    try {
      showLoading();
      const res = await novedadesService.getNovedadesByEmpleado(empleadoId);
      setNovedades(res?.data || res || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [empleadoId, showLoading, hideLoading]);

  const removeNovedad = async (id: string) => {
    try {
      showLoading();
      await novedadesService.deleteNovedad(id);
      await fetchNovedades();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const addNovedad = async (data: NovedadNomina) => {
    try {
      showLoading();
      await novedadesService.createNovedad(data);
      await fetchNovedades();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  return {
    novedades,
    fetchNovedades,
    addNovedad,
    removeNovedad,
    error
  };
};
