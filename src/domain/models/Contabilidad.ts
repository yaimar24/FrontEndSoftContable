export interface MovimientoContableRead {
  id: number;
  cuentaCodigo: string;
  cuentaNombre: string;
  naturalezaCuenta: 'D' | 'C';
  debito: number;
  credito: number;
  terceroId: string | null;
  terceroNombre: string | null;
  descripcion: string | null;
}

export interface ComprobanteContableRead {
  id: number;
  numero: string;
  tipoComprobante: string;
  tipoComprobanteId: number; // 1=FV,2=FC,3=RC,7=Ajuste
  estado: string;
  estadoId: number; // 1=Borrador,2=Aprobado,3=Anulado
  fecha: string;
  descripcion: string | null;
  documentoOrigenId: number | null;
  documentoOrigenTipo: string | null;
  totalDebito: number;
  totalCredito: number;
  estaCuadrado: boolean;
  movimientos: MovimientoContableRead[];
}

export interface MovimientoContableCreate {
  cuentaCodigo: string;
  debito: number;
  credito: number;
  terceroId?: string;
  descripcion?: string;
}

export interface ComprobanteContableCreate {
  fecha: string;
  descripcion?: string;
  movimientos: MovimientoContableCreate[];
}

export interface ConfiguracionContableRead {
  id: number;
  cuentaCxCClientesCodigo: string;
  cuentaProveedoresCodigo: string;
  cuentaIvaPorPagarCodigo: string;
  cuentaIvaDescontableCodigo: string;
  cuentaRetencionAFavorCodigo: string;
  cuentaRetencionPorPagarCodigo: string;
}

export interface ConfiguracionContableUpdate {
  cuentaCxCClientesCodigo: string;
  cuentaProveedoresCodigo: string;
  cuentaIvaPorPagarCodigo: string;
  cuentaIvaDescontableCodigo: string;
  cuentaRetencionAFavorCodigo: string;
  cuentaRetencionPorPagarCodigo: string;
}

export interface MovimientoLibroAuxiliar {
  id: number;
  cuentaCodigo: string;
  cuentaNombre: string;
  naturalezaCuenta: 'D' | 'C';
  terceroId: string | null;
  terceroNombre: string | null;
  descripcion: string | null;
  debito: number;
  credito: number;
}
