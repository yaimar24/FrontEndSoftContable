export type EstadoFactura = 
  | 'Borrador'
  | 'Aprobada'
  | 'Enviada'
  | 'Pagada'
  | 'Anulada'
  | 'Pendiente';

export interface ReciboCajaCreate {
  medioPagoId: number;
  monto: number;
  fechaRecibo: string;
  referencia?: string;
  observacion?: string;
}

export interface ReciboCajaRead {
  id: number;
  numero: string;
  facturaVentaId: number;
  facturaVentaNumero: string;
  terceroNombre: string;
  medioPagoId: number;
  medioPagoNombre: string;
  monto: number;
  esAbono: boolean;
  fechaRecibo: string;
  referencia?: string;
  observacion?: string;
}

export interface FacturaDetalleCreateDTO {
  productoId: string;
  descripcion?: string;
  cantidad: number;
  valorUnitario: number;
  porcentajeDescuento: number;
  // Campos extra para la UI
  impuestoCargoNombre?: string;
  tarifaCargo?: number;
  retencionNombre?: string;
  tarifaRetencion?: number;
}

export interface FacturaVentaCreateDTO {
  tipoFacturaId: number;
  clienteId: string;
  vendedorId?: string;
  fechaElaboracion: string;
  esCredito: boolean;
  frecuenciaPago?: number | null;
  numeroCuotas?: number | null;
  medioPagoId?: number | null;
  detalles: FacturaDetalleCreateDTO[];
  pagos?: ReciboCajaCreate[] | null;
  colegioId?: string;
  usuarioId?: string;
}

export interface FacturaDetalleReadDTO {
  id: number;
  productoId: string;
  productoNombre: string;
  descripcion?: string;
  cantidad: number;
  valorUnitario: number;
  porcentajeDescuento: number;
  impuestoCargo: number;
  impuestoCargoNombre?: string;
  tarifaCargo?: number;
  impuestoRetencion: number;
  retencionNombre?: string;
  tarifaRetencion?: number;
  valorTotal: number;
}

export const ESTADO_CUOTA = {
  Pendiente: 0,
  Parcial: 1,
  Pagada: 2,
  Vencida: 3,
  Anulada: 4,
} as const;

export const ESTADO_CUOTA_BADGE: Record<number, { label: string; color: string }> = {
  0: { label: 'Pendiente', color: 'gray' },
  1: { label: 'Parcial',   color: 'orange' },
  2: { label: 'Pagada',    color: 'green' },
  3: { label: 'Vencida',   color: 'red' },
  4: { label: 'Anulada',   color: 'darkred' },
};

export interface PagoCuotaRead {
  reciboCajaId: number;
  reciboNumero: string;
  montoAplicado: number;
  fechaAplicacion: string;
}

export interface CuotaCreditoRead {
  id: number;
  numeroCuota: number;
  valorOriginal: number;
  valorPagado: number;
  saldo: number;
  valorMora: number;
  fechaVencimiento: string;
  estadoId: number;          // 0=Pendiente, 1=Parcial, 2=Pagada, 3=Vencida, 4=Anulada
  estadoNombre: string;
  estaVencida: boolean;
  diasVencida: number;       // 0 si no vencida, N días si vencida
  fechaPago: string | null;  // fecha en que se completó el pago
  pagos: PagoCuotaRead[];    // historial de pagos aplicados a esta cuota
}

export interface FacturaVentaReadDTO {
  id: number;
  tipoFacturaNombre: string;
  numero: string;
  clienteId: string;
  clienteNombre: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  colegioId: string;
  colegioNombre: string;
  colegioNit: string;
  vendedorId?: string;
  fechaElaboracion: string;
  estadoId: number;
  estadoNombre: string;
  esCredito: boolean;
  frecuenciaPagoNombre: string | null;
  numeroCuotas: number | null;
  medioPagoId: number | null;
  medioPagoNombre: string | null;
  totalBruto: number;
  descuentoTotal: number;
  subtotal: number;
  totalImpuestoCargo: number;
  totalRetencion: number;
  totalImpuestos: number;
  totalNeto: number;
  totalPagado: number;
  saldo: number;
  recibos: ReciboCajaRead[];
  detalles: FacturaDetalleReadDTO[];
  
  cuotas?: CuotaCreditoRead[] | null;
  cuotasPendientes?: number | null;
  cuotasVencidas?: number | null;
  proximaCuotaValor?: number | null;
  proximaCuotaVencimiento?: string | null;
}
