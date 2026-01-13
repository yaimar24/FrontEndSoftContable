import { apiClient } from '../../api/apiClient';

export const getParametros = async () => {
  return apiClient('/api/Parametros/parametros');
};