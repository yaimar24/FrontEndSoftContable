import type { User } from "./User";

export interface Ciudad {
  id: number;
  nombre: string;
  codigo: string;
}

export interface RegimenIva {
  id: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
}

export interface TipoIdentificacion {
  id: number;
  nombre: string;
  codigoDian: string;
}

export interface Tributo {
  id: number;
  nombre: string;
}

export interface ResponsabilidadFiscal {
  id: number;
  nombre: string;
}

export interface RegistroParametrosDTO {
  ciudades: Ciudad[];
  regimenesIva: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: ResponsabilidadFiscal[];
  tiposIdentificacion: TipoIdentificacion[];
  actividadesEconomicas: ActividadEconomica[];
}
export interface ActividadEconomica {
  id: number;
  codigo: string;
  descripcion: string;
}
export interface Colegio {
  id?: number; // Id del backend
  identificacion: string;
  nombreColegio: string;
  nit: string;
  direccion: string;
  fechaCertificado: string; // ISO string
  representanteLegal: string;
  cedula: string;
  ciudadId: number;
  ciudad?: Ciudad;
  regimenIvaId: number;
  regimenIva?: RegimenIva;
  tipoIdentificacionId: number;
  tipoIdentificacion?: TipoIdentificacion;
  responsabilidadFiscalId: number;
  responsabilidadFiscal?: ResponsabilidadFiscal;
  tributoId: number;
  tributo?: Tributo;
  planSeleccionado: string;
  logoPath?: string;
  archivoDianPath?: string;
  telefono?: string;
  codigoActividadEconomica?: string;
  tarifaIca?: string;
  manejaAiu?: boolean;
  ivaRetencion?: boolean;
  usaDobleImpuesto?: boolean;
  usaImpuestoAdValorem?: boolean;
  usuarios?: User[];
  actividadEconomicaId?: string;
  representantesLegales: RepresentanteLegal[];
}
export interface RepresentanteLegal {
  id: number;
  nombre: string;
  numeroIdentificacion: string;
  tipoIdentificacionId: number;
}