export interface CuentaPorCobrar {
  clienteId: string;
  clienteNombre: string;
  facturaId: number;
  numeroFactura: string;
  fecha: string;
  fechaVencimiento: string;
  diasVencidos: number;
  saldo: number;
  estado: string;
}

export interface AgingData {
  totalDeuda: number;
  totalPagado: number;
  facturasPendientes: number;
  rango0a30: number;
  rango31a60: number;
  rango61a90: number;
  rangoMas90: number;
  facturas: CuentaPorCobrar[];
}

export interface FacturaPorVencer {
  clienteId: string;
  clienteNombre: string;
  facturaId: number;
  numeroFactura: string;
  fecha: string;
  fechaVencimiento: string;
  diasParaVencer: number;
  saldo: number;
  estado: string;
}

// --- Reporte ---
export interface ReporteCarteraLinea {
  clienteId: string;
  clienteNombre: string;
  facturaId: number;
  numeroFactura: string;
  fecha: string;
  fechaVencimiento: string;
  diasVencidos: number;
  totalNeto: number;
  totalPagado: number;
  saldo: number;
  estado: string;
  rangoAging: string;
}

export interface ReporteCartera {
  totalDeuda: number;
  totalVencido: number;
  totalPorVencer: number;
  lineas: ReporteCarteraLinea[];
}

// --- Indicadores / KPIs ---
export interface IndicadoresCartera {
  totalCartera: number;
  totalVencido: number;
  totalPorVencer: number;
  porcentajeCarteraVencida: number;
  diasPromedioRecaudo: number;
  rotacionCartera: number;
}

// --- Resumen por Cliente ---
export interface ResumenCliente {
  clienteId: string;
  clienteNombre: string;
  totalDeuda: number;
  totalVencido: number;
  totalPorVencer: number;
  numeroFacturasPendientes: number;
}

// --- Histórico ---
export interface HistoricoCartera {
  fechaCorte: string;
  carteraTotal: number;
  carteraVencida: number;
  rango0a30: number;
  rango31a60: number;
  rango61a90: number;
  rangoMas90: number;
}
