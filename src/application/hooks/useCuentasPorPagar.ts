import { useState, useCallback } from "react";
import * as cuentasPorPagarService from "../../data/services/cuentasPorPagar/cuentasPorPagarService";
import type { 
  CuentaPorPagar, 
  AgingCuentasPorPagarData, 
  FacturaPorVencerPagar, 
  ReporteCuentasPorPagar, 
  IndicadoresCuentasPorPagar, 
  ResumenProveedor, 
  HistoricoCuentasPorPagar 
} from "../../domain/models/CuentasPorPagar";
import type { ReporteCuentasPorPagarParams } from "../../data/services/cuentasPorPagar/cuentasPorPagarService";

export const useCuentasPorPagar = () => {
  const [cuentas, setCuentas] = useState<CuentaPorPagar[]>([]);
  const [aging, setAging] = useState<AgingCuentasPorPagarData | null>(null);
  const [porVencer, setPorVencer] = useState<FacturaPorVencerPagar[]>([]);
  const [reporte, setReporte] = useState<ReporteCuentasPorPagar | null>(null);
  const [indicadores, setIndicadores] = useState<IndicadoresCuentasPorPagar | null>(null);
  const [resumenProveedores, setResumenProveedores] = useState<ResumenProveedor[]>([]);
  const [historico, setHistorico] = useState<HistoricoCuentasPorPagar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCuentasPorPagar = useCallback(async (
    proveedorId?: string,
    desde?: string,
    hasta?: string,
    estado?: number,
    page?: number,
    pageSize?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getCuentasPorPagar(proveedorId, desde, hasta, estado, page, pageSize);
      if (resp.success && resp.data) {
        const items = Array.isArray(resp.data) ? resp.data : ((resp.data as { items?: CuentaPorPagar[] }).items || []);
        setCuentas(items);
      } else {
        setError(resp.message || "Error al obtener cuentas por pagar");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAging = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getAging();
      if (resp.success && resp.data) {
        setAging(resp.data);
      } else {
        setError(resp.message || "Error al obtener aging de cuentas por pagar");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPorVencer = useCallback(async (dias: number = 30) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getPorVencer(dias);
      if (resp.success && resp.data) {
        setPorVencer(resp.data);
      } else {
        setError(resp.message || "Error al obtener facturas por vencer");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReporte = useCallback(async (params?: ReporteCuentasPorPagarParams) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getReporteCuentasPorPagar(params);
      if (resp.success && resp.data) {
        setReporte(resp.data);
      } else {
        setError(resp.message || "Error al obtener reporte");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIndicadores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getIndicadores();
      if (resp.success && resp.data) {
        setIndicadores(resp.data);
      } else {
        setError(resp.message || "Error al obtener indicadores");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResumenProveedores = useCallback(async (page?: number, pageSize?: number) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getResumenPorProveedor(page, pageSize);
      if (resp.success && resp.data) {
        const items = Array.isArray(resp.data) ? resp.data : ((resp.data as { items?: ResumenProveedor[] }).items || []);
        setResumenProveedores(items);
      } else {
        setError(resp.message || "Error al obtener resumen por proveedor");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorico = useCallback(async (fecha: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await cuentasPorPagarService.getHistorico(fecha);
      if (resp.success && resp.data) {
        setHistorico(resp.data);
      } else {
        setError(resp.message || "Error al obtener histórico");
      }
    } catch (err) {
      setError((err as Error).message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cuentas,
    aging,
    porVencer,
    reporte,
    indicadores,
    resumenProveedores,
    historico,
    loading,
    error,
    fetchCuentasPorPagar,
    fetchAging,
    fetchPorVencer,
    fetchReporte,
    fetchIndicadores,
    fetchResumenProveedores,
    fetchHistorico
  };
};
