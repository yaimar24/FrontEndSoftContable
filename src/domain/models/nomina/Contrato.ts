export interface ContratoLaboral {
  id?: string;
  empleadoId: string;
  cargoId: number;
  centroCostoId: number;
  tipoContratoId: number;
  salarioBase: number;
  fechaInicio?: string;
  fechaFin?: string | null;
  auxilioTransporte: boolean;
  aplicaHorasExtra: boolean;
  cotizaSalud: boolean;
  cotizaPension: boolean;
  porcentajeSaludEmpleado?: number;
  porcentajePensionEmpleado?: number;
  seguridadSocialEmpleadoId?: string | null;
  activo?: boolean;
}

export interface SeguridadSocialEmpleado {
  id?: string;
  empleadoId: string;
  tipoCotizanteId: number;
  subtipoCotizanteId: number;
  epsId?: number;
  fondoPensionId?: number;
  arlId: number;
  claseRiesgo: number;
  actividadEconomicaId?: number;
  codigoActividad?: string;
  cajaCompensacionId: number;
  fondoCesantiasId: number;
}
