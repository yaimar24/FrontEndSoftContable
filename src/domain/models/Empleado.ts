import type {
  Municipio,
  TipoIdentificacion
} from "./Colegio";

export interface Banco {
  id: number;
  nombre: string;
}

export interface MedioPago {
  id: number;
  nombre: string;
}

export type EmpleadoCreateDTO = {

  nombres: string;
  apellidos: string;

  tipoIdentificacionId: number;
  numeroDocumento: string;

  correoElectronico: string;
  numeroCelular: string;

  municipioResidenciaId: number;
  direccionResidencia: string;

  medioPagoId: number;

  bancoId: number;
  tipoCuenta: number;
  numeroCuenta: string;

  municipioOficinaId: number;
  direccionOficina: string;
}


export type EmpleadoUpdateDTO = EmpleadoCreateDTO & {
  id: string;
  activo: boolean;

  municipioResidencia?: Municipio;
  municipioOficina?: Municipio;

  tipoIdentificacion?: TipoIdentificacion;

  banco?: Banco;
  medioPago?: MedioPago;
}

export type RegistroEmpleadoParametrosDTO = {
  municipios: Municipio[];
  tiposIdentificacion: TipoIdentificacion[];
  bancos: Banco[];
  mediosPago: MedioPago[];
};