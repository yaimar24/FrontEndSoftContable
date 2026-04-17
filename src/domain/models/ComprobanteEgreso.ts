export interface ComprobanteEgresoCreate {
  medioPagoId: number;
  monto: number;
  fechaEgreso: string;
  esAbono: boolean;
  referencia?: string;
  observacion?: string;
}

export interface ComprobanteEgresoRead {
  id: number;
  numero: string;
  facturaCompraId: number;
  facturaCompraNumero?: string;
  proveedorNombre?: string;
  medioPagoId: number;
  medioPagoNombre?: string;
  monto: number;
  esAbono: boolean;
  fechaEgreso: string;
  referencia?: string;
  observacion?: string;
  estadoId?: number;
  estadoNombre?: string;
}
