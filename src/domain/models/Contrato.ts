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
activo?: boolean;
}

export const defaultContratoValues: ContratoCreateDTO = {
colegioId: "",
empleadoId: "",
cargoId: 0,
centroCostoId: 0,
tipoContrato: "Indefinido",
salarioBase: 0,
fechaInicio: "",
fechaFin: "",
auxilioTransporte: false,
aplicaHorasExtra: false,
};