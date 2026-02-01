import type { Categorias } from "./Categoria";
import type { ActividadEconomica, Ciudad, RegimenIva, ResponsabilidadFiscal, TipoIdentificacion, Tributo } from "./Colegio";
import type { TiposPersona } from "./TipoPersona";


export interface Parametros {
  ciudades: Ciudad[];
  actividadesEconomicas: ActividadEconomica[];
  tiposIdentificacion: TipoIdentificacion[];
  regimenesIva: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: ResponsabilidadFiscal[];
  tiposPersona: TiposPersona[];
  categorias: Categorias[];
}
