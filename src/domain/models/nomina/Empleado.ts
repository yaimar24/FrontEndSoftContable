export interface Empleado {
  id?: string;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
  tipoIdentificacionId: number;
  tipoIdentificacion?: string;
  numeroDocumento: string;
  correoElectronico: string;
  numeroCelular: string;
  municipioResidenciaId?: number;
  direccionResidencia?: string;
  medioPagoId?: number;
  bancoId?: number;
  bancoNombre?: string;
  tipoCuenta?: number; // 1 = Ahorros, 2 = Corriente
  numeroCuenta?: string;
  municipioOficinaId?: number;
  direccionOficina?: string;
  activo: boolean;
}
