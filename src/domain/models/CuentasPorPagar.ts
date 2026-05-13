export interface CuentaPorPagar {
  proveedorId: string;
  proveedorNombre: string;
  facturaId: number;
  numeroFactura: string;
  fecha: string;
  fechaVencimiento: string | null;
  diasVencidos: number;
  esCredito: boolean;
  totalNeto: number;
  totalPagado: number;
  saldo: number;
  estado: string;
}

export interface AgingCuentasPorPagarData {
  totalDeuda: number;
  totalPagado: number;
  facturasPendientes: number;
  rango0a30: number;
  rango31a60: number;
  rango61a90: number;
  rangoMas90: number;
  facturas: CuentaPorPagar[];
}

export interface FacturaPorVencerPagar {
  proveedorId: string;
  proveedorNombre: string;
  facturaId: number;
  numeroFactura: string;
  fecha: string;
  fechaVencimiento: string;
  diasParaVencer: number;
  saldo: number;
  estado: string;
}

// --- Reporte ---
export interface ReporteCuentasPorPagarLinea {
  proveedorId: string;
  proveedorNombre: string;
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

export interface ReporteCuentasPorPagar {
  totalDeuda: number;
  totalVencido: number;
  totalPorVencer: number;
  lineas: ReporteCuentasPorPagarLinea[];
}

// --- Indicadores / KPIs ---
export interface IndicadoresCuentasPorPagar {
  totalPendiente: number;
  totalVencido: number;
  totalPorVencer: number;
  porcentajeVencido: number;
  diasPromedioPago: number;
  rotacion: number;
}

// --- Resumen por Proveedor ---
export interface ResumenProveedor {
  proveedorId: string;
  proveedorNombre: string;
  totalDeuda: number;
  totalVencido: number;
  totalPorVencer: number;
  numeroFacturasPendientes: number;
}

// --- Histórico ---
export interface HistoricoCuentasPorPagar {
  fechaCorte: string;
  totalPendiente: number;
  totalVencido: number;
  rango0a30: number;
  rango31a60: number;
  rango61a90: number;
  rangoMas90: number;
}
