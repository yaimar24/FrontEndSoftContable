import { useState, useCallback } from "react";
import * as contabilidadService from "../../data/services/contabilidad/contabilidadService";
import type { 
  ComprobanteContableRead, 
  ComprobanteContableCreate, 
  ConfiguracionContableRead, 
  ConfiguracionContableUpdate,
  MovimientoLibroAuxiliar
} from "../../domain/models/Contabilidad";

import type { PaginatedResponse } from "../../domain/models/types/ApiResponse";

export const useContabilidad = () => {
  const [comprobantes, setComprobantes] = useState<ComprobanteContableRead[]>([]);
  const [comprobanteDetail, setComprobanteDetail] = useState<ComprobanteContableRead | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionContableRead | null>(null);
  const [libroAuxiliar, setLibroAuxiliar] = useState<MovimientoLibroAuxiliar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<any>, 'items'> | null>(null);

  const fetchComprobantes = useCallback(async (page: number = 1, pageSize: number = 10, searchTerm: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.getComprobantes(page, pageSize, searchTerm);
      if (resp.success && resp.data) {
        if (resp.data.items) {
          setComprobantes(resp.data.items);
          const { items, ...rest } = resp.data;
          setPagination(rest);
        } else {
          setComprobantes(Array.isArray(resp.data) ? resp.data : []);
          setPagination(null);
        }
      } else {
        setError(resp.message);
        setComprobantes([]);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar comprobantes");
      setComprobantes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComprobanteById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.getComprobanteById(id);
      if (resp.success && resp.data) {
        setComprobanteDetail(resp.data);
      } else {
        setError(resp.message);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar detalle del comprobante");
    } finally {
      setLoading(false);
    }
  }, []);

  const anular = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.anularComprobante(id);
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp;
    } catch (err: any) {
      setError(err.message || "Error al anular comprobante");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAjusteManual = useCallback(async (data: ComprobanteContableCreate) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.createAsientoManual(data);
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp;
    } catch (err: any) {
      setError(err.message || "Error al crear ajuste manual");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConfiguracion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.getConfiguracionContable();
      if (resp.success && resp.data) {
        setConfiguracion(resp.data);
      } else {
        setError(resp.message);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar configuracion contable");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfiguracion = useCallback(async (data: ConfiguracionContableUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.updateConfiguracionContable(data);
      if (!resp.success) {
        throw new Error(resp.message);
      }
      setConfiguracion(resp.data as ConfiguracionContableRead);
      return resp;
    } catch (err: any) {
      setError(err.message || "Error al actualizar configuracion");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLibroAuxiliar = useCallback(async (cuentaCodigo?: string | null, desde?: string | null, hasta?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await contabilidadService.getLibroAuxiliar(cuentaCodigo, desde, hasta);
      if (resp.success && resp.data) {
        setLibroAuxiliar(resp.data);
      } else {
        setError(resp.message);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar auxiliar contable");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comprobantes,
    comprobanteDetail,
    configuracion,
    libroAuxiliar,
    loading,
    error,
    pagination,
    fetchComprobantes,
    fetchComprobanteById,
    anular,
    createAjusteManual,
    fetchConfiguracion,
    updateConfiguracion,
    fetchLibroAuxiliar
  };
};


