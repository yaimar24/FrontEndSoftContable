import type { Categorias } from "./Categoria";
import type { ActividadEconomica, Departamento, Municipio, RegimenIva, ResponsabilidadFiscal, TipoIdentificacion, Tributo } from "./Colegio";
import type { TiposPersona } from "./TipoPersona";


export interface Parametros {
  departamentos: Departamento[];
  municipios: Municipio[];
  actividadesEconomicas: ActividadEconomica[];
  tiposIdentificacion: TipoIdentificacion[];
  regimenesIva: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: ResponsabilidadFiscal[];
  tiposPersona: TiposPersona[];
  categorias: Categorias[];
}
