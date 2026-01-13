import { apiClient } from '../../api/apiClient';

export const getParametros = async () => {
  return apiClient('/Parametros/parametros');
};