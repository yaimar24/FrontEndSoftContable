export interface TerceroCreateDTO {
  id?: string; 
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
  activo?: boolean;
}
export interface TerceroupdateDTO {
  id: string; 
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
  activo?: boolean;
}
