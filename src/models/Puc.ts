export interface PucNodo {
  codigo: string;
  nombre: string;
  nivel: number;
  esDetalle: boolean;
  naturaleza: string;
  hijos: PucNodo[];
  colegioId: string;
}
