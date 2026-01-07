export interface Colegio {
  id?: string;
  nombreColegio: string;
  nit: string;
  direccion: string;
  resDian: string;
  fechaCertificado: string;
  representanteLegal: string;
  cedula: string;
  email: string;
  password: string;
  confirmPassword: string;
  planSeleccionado: string;
  logo?: File | string;
  archivoDian?: File | string;
}