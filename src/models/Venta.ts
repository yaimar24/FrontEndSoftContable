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
  detalles: FacturaDetalleCreateDTO[];
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
  vendedorId?: string;
  fechaElaboracion: string;
  estado: string;
  totalBruto: number;
  descuentoTotal: number;
  subtotal: number;
  totalImpuestos: number;
  totalNeto: number;
  detalles: FacturaDetalleReadDTO[];
  clienteTelefono?: string;
  clienteDireccion?: string;
}
