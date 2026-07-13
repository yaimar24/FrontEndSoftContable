export interface ContratoCreateDTO {
colegioId: string;
empleadoId: string;
cargoId: number;
centroCostoId: number;
tipoContrato: string;
salarioBase: number;
fechaInicio: string;
fechaFin?: string;
auxilioTransporte: boolean;
aplicaHorasExtra: boolean;
}

export interface ContratoUpdateDTO extends ContratoCreateDTO {
id: string;
}

// Tipo de Contrato
export const TipoContrato = {
Indefinido: "Indefinido",
Fijo: "Fijo",
ObraLabor: "Obra o labor",
Aprendizaje: "Aprendizaje",
} as const;
export type TipoContrato = (typeof TipoContrato)[keyof typeof TipoContrato];

// Tipo de Cotizante
export const TipoCotizante = {
NoAplica: 0,
} as const;
export type TipoCotizante = (typeof TipoCotizante)[keyof typeof TipoCotizante];

export const SubtipoCotizante = {
NoAplica: '0',
} as const;
export type SubtipoCotizante = (typeof SubtipoCotizante)[keyof typeof SubtipoCotizante];

export const EpsColombia = {
NoAplica: 0,
} as const;
export type EpsColombia = (typeof EpsColombia)[keyof typeof EpsColombia];

// Fondos de Pensiones
export const FondoPension = {
NoAplica: 0,
} as const;
export type FondoPension = (typeof FondoPension)[keyof typeof FondoPension];

// ARL
export const ArlColombia = {
NoAplica: 0,
} as const;
export type ArlColombia = (typeof ArlColombia)[keyof typeof ArlColombia];


export const ClaseRiesgo = {
ClaseI: 1,
} as const;
export type ClaseRiesgo = (typeof ClaseRiesgo)[keyof typeof ClaseRiesgo];

// Cajas de Compensación (Incluye No Aplica)
export const CajaCompensacion = {
NoAplica: 0,
} as const;
export type CajaCompensacion = (typeof CajaCompensacion)[keyof typeof CajaCompensacion];

// Fondos de Cesantías (Incluye No Aplica)
export const FondoCesantias = {
NoAplica: 0,
} as const;
export type FondoCesantias = (typeof FondoCesantias)[keyof typeof FondoCesantias];


export const getTipoContratoOptions = () => [
{ id: TipoContrato.Indefinido, nombre: "Indefinido" },
{ id: TipoContrato.Fijo, nombre: "Fijo" },
{ id: TipoContrato.ObraLabor, nombre: "Obra o labor" },
{ id: TipoContrato.Aprendizaje, nombre: "Aprendizaje" },
]

export const getTipoCotizanteOptions = () => [
{ id: TipoCotizante.NoAplica, nombre: "No aplica (N/A)" }
];

export const getSubtipoCotizanteOptions = () => [
{ id: SubtipoCotizante.NoAplica, nombre: "No aplica (N/A)" },
];

export const getEpsOptions = () => [
{ id: EpsColombia.NoAplica, nombre: "No aplica (N/A)" },
];

export const getFondoPensionOptions = () => [
{ id: FondoPension.NoAplica, nombre: "No aplica (N/A)" }
];

export const getArlOptions = () => [
{ id: ArlColombia.NoAplica, nombre: "No aplica (N/A)" },
];

export const getClaseRiesgoOptions = () => [
{ id: ClaseRiesgo.ClaseI, nombre: "Clase I - Riesgo mínimo" },
];

export const getCajaCompensacionOptions = () => [
{ id: CajaCompensacion.NoAplica, nombre: "No aplica (N/A)" },
];

export const getFondoCesantiasOptions = () => [
{ id: FondoCesantias.NoAplica, nombre: "No aplica (N/A)" },
];

