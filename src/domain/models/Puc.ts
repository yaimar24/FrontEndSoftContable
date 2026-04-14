export interface PucNodo {
  codigo: string;
  nombre: string;
  nivel: number;
  esDetalle: boolean;
  naturaleza: string;
  hijos: PucNodo[];
  colegioId: string;
  esGlobal: boolean;
  activo: boolean;
}

export interface CuentaPuc {
  codigo: string;
  nombre: string;
  nivel: number;
  esDetalle: boolean;
  naturaleza: string;    // "D" o "C"
  colegioId: string;
  esGlobal: boolean;
  activo: boolean;
  hijos: CuentaPuc[];
}

export interface PucCreateDTO {
  codigo: string;
  nombre: string;
  esDetalle: boolean;
}

export interface PucUpdateDTO {
  nombre: string;
  naturaleza?: string;
  esDetalle?: boolean;
}
