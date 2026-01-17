import { apiClient } from '../../api/apiClient';
import type { TerceroCreateDTO } from '../../models/Tercero';

/**
 * Registra un tercero globalmente y lo vincula al colegio actual
 */
export const vincularTercero = async (data: TerceroCreateDTO): Promise<any> => {
  return apiClient('/api/Tercero/vincular', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Obtiene la lista de terceros vinculados a un colegio específico
 */


/**
 * Busca si un tercero ya existe en la base de datos global por su identificación
 * Útil para autocompletar datos si ya existe en otro colegio
 */
export const buscarTerceroGlobal = async (identificacion: string): Promise<any> => {
  return apiClient(`/api/Tercero/buscar/${identificacion}`);
};