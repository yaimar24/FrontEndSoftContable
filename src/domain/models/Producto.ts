// models/Producto.ts

export interface ProductoPrecioDTO {
  id?: string;
  nombreLista: string;
  valor: number;
  incluyeIva: boolean;
}

export interface ProductoReadDTO {
  id: string;
  nombre: string;
  sku: string | null;
  esServicio: boolean;
  esInventariable: boolean;
  categoriaId: number; 
  categoriaNombre: string;
  unidadMedidaNombre: string;
  impuestoCargoNombre: string;
  tarifaIva: number;
  tipoUso: number; // 1 = Venta, 2 = Compra
  cuentaIngresoCodigo?: string | null;
  cuentaIngresoNombre?: string | null;
  cuentaCostoCodigo?: string | null;
  cuentaCostoNombre?: string | null;
  cuentaInventarioCodigo?: string | null;
  cuentaInventarioNombre?: string | null;
  precios: {
    id?: string;
    nombreLista: string;
    valor: number;
    incluyeIva: boolean;
  }[];
}
// También te incluyo el DTO de creación por si lo necesitas para el formulario
export interface ProductoCreateDTO {
  nombre: string;
  sku?: string;
  codigoBarras?: string;
  esServicio: boolean;
  esInventariable: boolean;
  visibleEnFacturas: boolean;
  categoriaId: number;
  unidadMedidaDianId: number;
  impuestoCargoId: number;
  retencionId?: number | null;
  tipoUso: number; // 1 = Venta, 2 = Compra
  
  cuentaIngresoCodigo?: string | null;
  cuentaCostoCodigo?: string | null;
  cuentaInventarioCodigo?: string | null;

  // Datos que el Service inyecta pero que el DTO puede requerir
  colegioId?: string; 
  usuarioId?: string;
  
  precios: ProductoPrecioDTO[];
}