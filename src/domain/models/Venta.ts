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
  diasCredito?: number | null;
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
  diasCredito?: number | null;
  fechaVencimiento: string | null;
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
  comprobantes?: any[];
}
