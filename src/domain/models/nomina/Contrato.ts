export interface ContratoLaboral {
  id?: string;
  empleadoId: string;
  cargoId: number;
  centroCostoId: number;
  tipoContrato: string;
  salarioBase: number;
  fechaInicio?: string;
  fechaFin?: string | null;
  tipoCotizante: number;
  subtipoCotizante: number;
  eps?: number | null;
  fondoPension?: number | null;
  arl: number;
  claseRiesgo: number;
  cajaCompensacion: number;
  fondoCesantias: number;
  auxilioTransporte: boolean;
  aplicaHorasExtra: boolean;
  cotizaSalud: boolean;
  cotizaPension: boolean;
  activo?: boolean;
}

export interface SeguridadSocialEmpleado {
  empleadoId: string;
  tipoCotizanteId: number;
  subtipoCotizanteId: number;
  epsId: number;
  porcentajeSalud: number;
  fondoPensionId: number;
  porcentajePension: number;
  arlId: number;
  claseRiesgo: number;
  actividadEconomicaId: number;
  codigoActividad: string;
  cajaCompensacionId: number;
  fondoCesantiasId: number;
}
