export interface Cargo {
  id?: string | number;
  nombre: string;
  descripcion: string;
}

export interface CentroCosto {
  id?: string | number;
  codigo: string;
  nombre: string;
}

export interface Banco {
  id?: string | number;
  codigo: string;
  nombre: string;
}

export interface ConceptoNomina {
  id?: string | number;
  nombre: string;
  descripcion: string;
  tipoConcepto: number; // 1 = Devengo, 2 = Deducción, 3 = Provisión
}
