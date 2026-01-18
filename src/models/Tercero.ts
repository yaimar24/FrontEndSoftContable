
// Para mostrar en tablas y listados por colegio
export interface TerceroDetalleDTO {
  id: string; // Es el ID de la vinculación (TerceroCategoriaId)
  identificacion: string;
  dv?: string;
  razonSocial: string; // El backend concatena Nombres + Apellidos o NombreComercial
  email: string;
  categoriaNombre: string; // Ej: "CLIENTE"
  regimenIvaNombre: string; // Ej: "Responsable de IVA"
  telefono?: string;
  ciudad?: string;
  activo: boolean;
}

// Para los Selects de los formularios (Tablas Maestras)
export interface CatalogoBase {
  id: number;
  nombre: string;
}

export interface TipoIdentificacion extends CatalogoBase {
  codigoDian: string;
}

export interface RegimenIva extends CatalogoBase {
  codigo?: string;
  descripcion?: string;
}
export interface TerceroCreateDTO {
  id?: number; 
  tipoPersonaId: number;
  tipoIdentificacionId: number;
  identificacion: string;
  dv?: string;
  nombres?: string;
  apellidos?: string;
  nombreComercial?: string;
  email: string;
  colegioId: string;
  categoriaId: number;
  regimenIvaId: number;
  ciudadId: number;
  direccion?: string;
  telefono?: string;
  indicativo?: string;
  codigoPostal?: string; 
  contactoNombres?: string; 
  contactoApellidos?: string; 
  correoFacturacion?: string; 
  responsabilidadesFiscalesIds: number[];
}
