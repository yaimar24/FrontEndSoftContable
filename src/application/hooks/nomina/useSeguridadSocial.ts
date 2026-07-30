import { useState, useCallback } from 'react';
import { empleadoService } from '../../../data/services/nomina/empleadoService';
import type { SeguridadSocialEmpleado } from '../../../domain/models/nomina/Contrato';
import { useGlobalLoading as useLoading } from '../../context/LoadingContext';

export const useSeguridadSocial = (empleadoId?: string) => {
  const { show: showLoading, hide: hideLoading } = useLoading();
  const [seguridadSocial, setSeguridadSocial] = useState<SeguridadSocialEmpleado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSeguridadSocial = useCallback(async () => {
    if (!empleadoId) return;
    try {
      showLoading();
      const res = await empleadoService.getSeguridadSocial(empleadoId);
      setSeguridadSocial(res?.data || res || null);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [empleadoId, showLoading, hideLoading]);

  const saveSeguridadSocial = async (data: SeguridadSocialEmpleado) => {
    if (!empleadoId) return;
    try {
      showLoading();
      if (seguridadSocial && seguridadSocial.empleadoId) {
        await empleadoService.updateSeguridadSocial(empleadoId, data);
      } else {
        await empleadoService.createSeguridadSocial(data);
      }
      await fetchSeguridadSocial();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  return {
    seguridadSocial,
    fetchSeguridadSocial,
    saveSeguridadSocial,
    error
  };
};
