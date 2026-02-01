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
  // Añadimos este para que el filtro lo encuentre:
  categoriaProductoId: number; 
  categoriaNombre: string;
  unidadMedidaNombre: string;
  impuestoCargoNombre: string;
  tarifaIva: number;
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
  
  // Datos que el Service inyecta pero que el DTO puede requerir
  colegioId?: string; 
  usuarioId?: string;
  
  precios: ProductoPrecioDTO[];
}