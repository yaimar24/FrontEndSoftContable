import { useState, useCallback } from "react";
import * as carteraService from "../../data/services/cartera/carteraService";
import type { CuentaPorCobrar, AgingData, FacturaPorVencer, ReporteCartera, IndicadoresCartera, ResumenCliente, HistoricoCartera } from "../../domain/models/Cartera";
import type { ReporteCarteraParams } from "../../data/services/cartera/carteraService";

export const useCartera = () => {
  const [cuentas, setCuentas] = useState<CuentaPorCobrar[]>([]);
  const [aging, setAging] = useState<AgingData | null>(null);
  const [porVencer, setPorVencer] = useState<FacturaPorVencer[]>([]);
  const [reporte, setReporte] = useState<ReporteCartera | null>(null);
  const [indicadores, setIndicadores] = useState<IndicadoresCartera | null>(null);
  const [resumenClientes, setResumenClientes] = useState<ResumenCliente[]>([]);
  const [historico, setHistorico] = useState<HistoricoCartera | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCuentasPorCobrar = useCallback(async (
    clienteId?: string,
    desde?: string,
    hasta?: string,
    estado?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await carteraService.getCuentasPorCobrar(clienteId, desde, hasta, estado);
      if (resp.success && resp.data) {
        const items = Array.isArray(resp.data) ? resp.data : (resp.data as any).items || [];
        setCuentas(items);
      } else {
        setError(resp.message || "Error al obtener cuentas por cobrar");
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
      const resp = await carteraService.getAging();
      if (resp.success && resp.data) {
        setAging(resp.data);
      } else {
        setError(resp.message || "Error al obtener aging de cartera");
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
      const resp = await carteraService.getPorVencer(dias);
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

  const fetchReporte = useCallback(async (params?: ReporteCarteraParams) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await carteraService.getReporteCartera(params);
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
      const resp = await carteraService.getIndicadores();
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

  const fetchResumenClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await carteraService.getResumenPorCliente();
      if (resp.success && resp.data) {
        const items = Array.isArray(resp.data) ? resp.data : (resp.data as any).items || [];
        setResumenClientes(items);
      } else {
        setError(resp.message || "Error al obtener resumen por cliente");
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
      const resp = await carteraService.getHistorico(fecha);
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
    resumenClientes,
    historico,
    loading,
    error,
    fetchCuentasPorCobrar,
    fetchAging,
    fetchPorVencer,
    fetchReporte,
    fetchIndicadores,
    fetchResumenClientes,
    fetchHistorico,
  };
};
