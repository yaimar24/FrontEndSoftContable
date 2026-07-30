import { useState, useCallback } from 'react';
import { empleadoService } from '../../../data/services/nomina/empleadoService';
import type { Empleado } from '../../../domain/models/nomina/Empleado';
import { useGlobalLoading as useLoading } from '../../context/LoadingContext';

export const useEmpleadosNomina = () => {
  const { show: showLoading, hide: hideLoading } = useLoading();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [currentEmpleado, setCurrentEmpleado] = useState<Empleado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpleados = useCallback(async () => {
    try {
      showLoading();
      const res = await empleadoService.getEmpleados();
      setEmpleados(res.data || res);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const fetchEmpleadoById = useCallback(async (id: string) => {
    try {
      showLoading();
      const res = await empleadoService.getEmpleadoById(id);
      setCurrentEmpleado(res.data || res);
      return res.data || res;
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const saveEmpleado = async (data: Empleado, id?: string) => {
    try {
      showLoading();
      let res;
      if (id) {
        res = await empleadoService.updateEmpleado(id, data);
      } else {
        res = await empleadoService.createEmpleado(data);
      }
      
      // apiClient no hace throw en errores, retorna { success: false, message: ... }
      // Hay que validar de que si no retorna la data directamente (success falso) lance un throw para atraparlo
      if (res?.success === false) {
        throw new Error(res.message || "Ocurrió un error guardando el empleado");
      }
      
      await fetchEmpleados();
      return res; // Retornamos la respuesta para poder acceder al res.data.id recién generado si aplica.
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      hideLoading();
    }
  };

  return {
    empleados,
    currentEmpleado,
    fetchEmpleados,
    fetchEmpleadoById,
    saveEmpleado,
    error,
    setError
  };
};
