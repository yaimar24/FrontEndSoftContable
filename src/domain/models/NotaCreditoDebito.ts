import type { ComprobanteContableRead } from './Contabilidad';

// Enums
export const TipoNotaCredDeb = {
  NotaCredito: 1,
  NotaDebito: 2,
} as const;
export type TipoNotaCredDeb = (typeof TipoNotaCredDeb)[keyof typeof TipoNotaCredDeb];

export const OrigenFacturaNota = {
  Venta: 1,
  Compra: 2,
} as const;
export type OrigenFacturaNota = (typeof OrigenFacturaNota)[keyof typeof OrigenFacturaNota];

export const MotivoNota = {
  Devolucion: 1,
  Anulacion: 2,
  Descuento: 3,
  AjustePrecio: 4,
  Correccion: 5,
  Intereses: 6,
  Otro: 99,
} as const;
export type MotivoNota = (typeof MotivoNota)[keyof typeof MotivoNota];

export const EstadoNota = {
  Borrador: 0,
  Aplicada: 1,
  Anulada: 2,
} as const;
export type EstadoNota = (typeof EstadoNota)[keyof typeof EstadoNota];

// Labels
export const TipoNotaLabels: Record<number, string> = {
  1: 'Nota Crédito',
  2: 'Nota Débito',
};

export const OrigenFacturaLabels: Record<number, string> = {
  1: 'Venta',
  2: 'Compra',
};

export const MotivoNotaLabels: Record<number, string> = {
  1: 'Devolución',
  2: 'Anulación',
  3: 'Descuento',
  4: 'Ajuste de Precio',
  5: 'Corrección',
  6: 'Intereses',
  99: 'Otro',
};

export const EstadoNotaLabels: Record<number, string> = {
  0: 'Borrador',
  1: 'Aplicada',
  2: 'Anulada',
};

// Options for select fields
export const TipoNotaOptions = [
  { id: 1, nombre: 'Nota Crédito' },
  { id: 2, nombre: 'Nota Débito' },
];

export const OrigenFacturaOptions = [
  { id: 1, nombre: 'Venta' },
  { id: 2, nombre: 'Compra' },
];

export const MotivoNotaOptions = [
  { id: 1, nombre: 'Devolución' },
  { id: 2, nombre: 'Anulación' },
  { id: 3, nombre: 'Descuento' },
  { id: 4, nombre: 'Ajuste de Precio' },
  { id: 5, nombre: 'Corrección' },
  { id: 6, nombre: 'Intereses' },
  { id: 99, nombre: 'Otro' },
];

// DTOs
export interface NotaDetalleCreateDTO {
  productoId?: string | null;
  descripcion?: string | null;
  cantidad: number;
  valorUnitario: number;
  porcentajeDescuento: number;
  impuestoCargoId?: number | null;
  retencionId?: number | null;
  // Campos extra para la UI
  impuestoCargoNombre?: string;
  tarifaCargo?: number;
  retencionNombre?: string;
  tarifaRetencion?: number;
}

export interface NotaCreditoDebitoCreateDTO {
  tipo: TipoNotaCredDeb;
  origenFactura: OrigenFacturaNota;
  facturaId: number;
  motivo: MotivoNota | number;
  motivoDescripcion?: string | null;
  fechaElaboracion: string;
  observaciones?: string | null;
  detalles: NotaDetalleCreateDTO[];
}

export interface NotaDetalleReadDTO {
  id: number;
  productoId: string | null;
  productoNombre: string | null;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  porcentajeDescuento: number;
  impuestoCargoNombre: string | null;
  tarifaCargo: number;
  impuestoCargo: number;
  retencionNombre: string | null;
  tarifaRetencion: number;
  impuestoRetencion: number;
  valorTotal: number;
}

export interface NotaCreditoDebitoReadDTO {
  id: number;
  numero: string;
  tipoId: number;
  tipoNombre: string;
  origenFacturaNombre: string;
  facturaVentaId: number | null;
  facturaCompraId: number | null;
  facturaNumero: string;
  motivoId: number;
  motivoNombre: string;
  motivoDescripcion: string | null;
  terceroId: string;
  terceroNombre: string;
  colegioId: string;
  fechaElaboracion: string;
  fechaRegistro: string;
  estadoId: number;
  estadoNombre: string;
  totalBruto: number;
  descuentoTotal: number;
  subtotal: number;
  totalImpuestoCargo: number;
  totalRetencion: number;
  totalImpuestos: number;
  totalNeto: number;
  observaciones: string | null;
  detalles: NotaDetalleReadDTO[];
  comprobantes: ComprobanteContableRead[];
}
