export const EstadoFacturaCompra = {
  Borrador: 0,
  Registrada: 1,
  Anulada: 2,
} as const;

export type EstadoFacturaCompra = typeof EstadoFacturaCompra[keyof typeof EstadoFacturaCompra];

export type TipoItemCompraEnum = 1 | 2 | 3; // 1 = Producto, 2 = ActivoFijo, 3 = Gasto

export interface FacturaCompraDetalleCreateDTO {
  tipoItem: TipoItemCompraEnum;
  productoId?: string | null; // Requerido si tipoItem = 1
  codigo?: string | null;     // Opcional, auto-generado si tipoItem 2 o 3, auto del producto si 1
  descripcion?: string | null; // Obligatorio si 2 o 3, auto si 1
  cantidad: number;           // Requerido, > 0
  valorUnitario?: number;     // Obligatorio si 2 o 3, auto si 1
  porcentajeDescuento: number; // 0-100, default 0
  impuestoCargoId?: number | null; 
  retencionId?: number | null;
  cuentaContableCodigo?: string | null;
  // Campos extra para la UI
  impuestoCargoNombre?: string;
  tarifaCargo?: number;
  retencionNombre?: string;
  tarifaRetencion?: number;
}

export interface FacturaCompraCreateDTO {
  tipoFacturaId: number;
  proveedorId: string;
  fechaElaboracion: string;
  esCredito: boolean;
  frecuenciaPagoId?: number | null;
  numeroCuotas?: number | null;
  medioPagoId?: number | null;
  detalles: FacturaCompraDetalleCreateDTO[];
}

export interface FacturaCompraUpdateDTO {
  tipoFacturaId: number;
  proveedorId: string;
  fechaElaboracion: string;
  esCredito?: boolean;
  frecuenciaPagoId?: number | null;
  numeroCuotas?: number | null;
  medioPagoId?: number | null;
  detalles: FacturaCompraDetalleCreateDTO[];
}

export interface FacturaCompraDetalleReadDTO {
  id: number;
  tipoItem: TipoItemCompraEnum;
  tipoItemNombre: 'Producto' | 'ActivoFijo' | 'Gasto';
  productoId: string | null;
  productoNombre: string | null;
  codigo: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  porcentajeDescuento: number;
  impuestoCargoId: number | null;
  impuestoCargoNombre: string | null;
  tarifaCargo: number;
  impuestoCargo: number;
  retencionId: number | null;
  retencionNombre: string | null;
  tarifaRetencion: number;
  impuestoRetencion: number;
  valorTotal: number;
  cuentaContableCodigo?: string | null;
  cuentaContableNombre?: string | null;
}

export interface FacturaCompraReadDTO {
  id: number;
  tipoFacturaNombre: string;
  numero: string;
  proveedorId: string;
  proveedorNombre: string;
  proveedorTelefono?: string;
  proveedorDireccion?: string;
  colegioId: string;
  colegioNombre: string;
  colegioNit: string;
  fechaElaboracion: string;
  estadoId: number;
  estadoNombre: string;
  esCredito: boolean;
  medioPagoId?: number | null;
  medioPagoNombre?: string | null;
  frecuenciaPagoId?: number | null;
  frecuenciaPagoNombre?: string | null;
  numeroCuotas?: number | null;
  totalBruto: number;
  descuentoTotal: number;
  subtotal: number;
  totalImpuestoCargo: number;
  totalRetencion: number;
  totalImpuestos: number;
  totalNeto: number;
  detalles: FacturaCompraDetalleReadDTO[];
}
