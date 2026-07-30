import { useState, useCallback } from 'react';
import { catalogosNominaService } from '../../../data/services/nomina/catalogosNominaService';
import type { Cargo, CentroCosto, Banco, ConceptoNomina } from '../../../domain/models/nomina/CatalogosParams';
import { useGlobalLoading as useLoading } from '../../context/LoadingContext';

export const useCatalogosNomina = () => {
  const { show: showLoading, hide: hideLoading } = useLoading();
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [conceptos, setConceptos] = useState<ConceptoNomina[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleError = (e: any) => {
    setError(e?.response?.data?.message || e.message || 'Error occurred');
    console.error(e);
  };

  const fetchCargos = useCallback(async () => {
    try {
      showLoading();
      const res = await catalogosNominaService.getCargos();
      setCargos(res.data || res); // Adapt based on actual response wrapper
    } catch (e) {
      handleError(e);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const saveCargo = async (data: Cargo, id?: string | number) => {
    try {
      showLoading();
      if (id) {
        await catalogosNominaService.updateCargo(id, data);
      } else {
        await catalogosNominaService.createCargo(data);
      }
      await fetchCargos();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const removeCargo = async (id: string | number) => {
    try {
      showLoading();
      await catalogosNominaService.deleteCargo(id);
      await fetchCargos();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const fetchCentrosCosto = useCallback(async () => {
    try {
      showLoading();
      const res = await catalogosNominaService.getCentrosCosto();
      setCentrosCosto(res.data || res);
    } catch (e) {
      handleError(e);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const saveCentroCosto = async (data: CentroCosto, id?: string | number) => {
    try {
      showLoading();
      if (id) {
        await catalogosNominaService.updateCentroCosto(id, data);
      } else {
        await catalogosNominaService.createCentroCosto(data);
      }
      await fetchCentrosCosto();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const removeCentroCosto = async (id: string | number) => {
    try {
      showLoading();
      await catalogosNominaService.deleteCentroCosto(id);
      await fetchCentrosCosto();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const fetchBancos = useCallback(async () => {
    try {
      showLoading();
      const res = await catalogosNominaService.getBancos();
      setBancos(res.data || res);
    } catch (e) {
      handleError(e);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const saveBanco = async (data: Banco, id?: string | number) => {
    try {
      showLoading();
      if (id) {
        await catalogosNominaService.updateBanco(id, data);
      } else {
        await catalogosNominaService.createBanco(data);
      }
      await fetchBancos();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const removeBanco = async (id: string | number) => {
    try {
      showLoading();
      await catalogosNominaService.deleteBanco(id);
      await fetchBancos();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const fetchConceptos = useCallback(async () => {
    try {
      showLoading();
      const res = await catalogosNominaService.getConceptosNomina();
      setConceptos(res.data || res);
    } catch (e) {
      handleError(e);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const saveConcepto = async (data: ConceptoNomina, id?: string | number) => {
    try {
      showLoading();
      if (id) {
        await catalogosNominaService.updateConceptoNomina(id, data);
      } else {
        await catalogosNominaService.createConceptoNomina(data);
      }
      await fetchConceptos();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  const removeConcepto = async (id: string | number) => {
    try {
      showLoading();
      await catalogosNominaService.deleteConceptoNomina(id);
      await fetchConceptos();
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      hideLoading();
    }
  };

  return {
    cargos, fetchCargos, saveCargo, removeCargo,
    centrosCosto, fetchCentrosCosto, saveCentroCosto, removeCentroCosto,
    bancos, fetchBancos, saveBanco, removeBanco,
    conceptos, fetchConceptos, saveConcepto, removeConcepto,
    error, setError
  };
};
