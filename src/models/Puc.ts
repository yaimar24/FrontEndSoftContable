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

export interface PucCreateDTO {
  codigo: string;
  nombre: string;
  codigoPadre?: string;
  naturaleza: string;
  esDetalle: boolean;
}

export interface PucUpdateDTO {
  nombre: string;
  naturaleza?: string;
  esDetalle?: boolean;
}
