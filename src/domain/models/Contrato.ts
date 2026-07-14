
export interface ContratoCreateDTO {
colegioId: string;
empleadoId: string;
cargoId: number;
centroCostoId: number;
tipoContrato: TipoContrato;
salarioBase: number;
fechaInicio: string;
fechaFin?: string;
auxilioTransporte: boolean;
aplicaHorasExtra: boolean;
}

export interface ContratoUpdateDTO extends ContratoCreateDTO {
id: string;
}

// Enums
// Tipo de Contrato 
export const TipoContrato = {
Indefinido: "Indefinido",
Fijo: "Fijo",
ObraLabor: "Obra o labor",
Aprendizaje: "Aprendizaje",
} as const;
export type TipoContrato = (typeof TipoContrato)[keyof typeof TipoContrato];

export const TipoCotizante = {
NoAplica: 0,
} as const;
export type TipoCotizante = (typeof TipoCotizante)[keyof typeof TipoCotizante];

export const SubtipoCotizante = {
NoAplica: 0,
} as const;
export type SubtipoCotizante = (typeof SubtipoCotizante)[keyof typeof SubtipoCotizante];

export const EpsColombia = {
NoAplica: 0,
} as const;
export type EpsColombia = (typeof EpsColombia)[keyof typeof EpsColombia];

export const FondoPension = {
NoAplica: 0,
} as const;
export type FondoPension = (typeof FondoPension)[keyof typeof FondoPension];

export const ArlColombia = {
NoAplica: 0,
} as const;
export type ArlColombia = (typeof ArlColombia)[keyof typeof ArlColombia];

export const ClaseRiesgo = {
ClaseI: 1,
} as const;
export type ClaseRiesgo = (typeof ClaseRiesgo)[keyof typeof ClaseRiesgo];

export const CajaCompensacion = {
NoAplica: 0,
} as const;
export type CajaCompensacion = (typeof CajaCompensacion)[keyof typeof CajaCompensacion];

export const FondoCesantias = {
NoAplica: 0,
} as const;
export type FondoCesantias = (typeof FondoCesantias)[keyof typeof FondoCesantias];

// Labels
export const TipoContratoLabels: Record<string, string> = {
Indefinido: "Indefinido",
Fijo: "Fijo",
"Obra o labor": "Obra o labor",
Aprendizaje: "Aprendizaje",
};

export const TipoCotizanteLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const SubtipoCotizanteLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const EpsLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const FondoPensionLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const ArlLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const ClaseRiesgoLabels: Record<number, string> = {
1: "Clase I - Riesgo mínimo",
};

export const CajaCompensacionLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const FondoCesantiasLabels: Record<number, string> = {
0: "No aplica (N/A)",
};

export const TipoContratoOptions = [
{ id: TipoContrato.Indefinido, nombre: "Indefinido" },
{ id: TipoContrato.Fijo, nombre: "Fijo" },
{ id: TipoContrato.ObraLabor, nombre: "Obra o labor" },
{ id: TipoContrato.Aprendizaje, nombre: "Aprendizaje" },
];

export const TipoCotizanteOptions = [
{ id: TipoCotizante.NoAplica, nombre: "No aplica (N/A)" },
];

export const SubtipoCotizanteOptions = [
{ id: SubtipoCotizante.NoAplica, nombre: "No aplica (N/A)" },
];

export const EpsOptions = [
{ id: EpsColombia.NoAplica, nombre: "No aplica (N/A)" },
];

export const FondoPensionOptions = [
{ id: FondoPension.NoAplica, nombre: "No aplica (N/A)" },
];

export const ArlOptions = [
{ id: ArlColombia.NoAplica, nombre: "No aplica (N/A)" },
];

export const ClaseRiesgoOptions = [
{ id: ClaseRiesgo.ClaseI, nombre: "Clase I - Riesgo mínimo" },
];

export const CajaCompensacionOptions = [
{ id: CajaCompensacion.NoAplica, nombre: "No aplica (N/A)" },
];

export const FondoCesantiasOptions = [
{ id: FondoCesantias.NoAplica, nombre: "No aplica (N/A)" },
];